#include <stdio.h>
#include <string.h>
#include <time.h>

#include "block.h"
#include "../crypto/hash.h"

static void hash_internal_node(const char *left_hash,
                               const char *right_hash,
                               char output[HASH_SIZE])
{
    char combined[HASH_SIZE * 2 + 16];
    snprintf(combined, sizeof(combined), "NODE|%s|%s", left_hash, right_hash);
    sha256(combined, output);
}

void calculate_transaction_leaf_hash(const Transaction *tx, char output[HASH_SIZE])
{
    char tx_data[1024];
    snprintf(tx_data, sizeof(tx_data),
             "LEAF|%lu|%s|%lu|%s|%lu|%s|%lu|%s|%ld",
             (unsigned long)strlen(tx->patient_id), tx->patient_id,
             (unsigned long)strlen(tx->doctor_id), tx->doctor_id,
             (unsigned long)strlen(tx->data_hash), tx->data_hash,
             (unsigned long)strlen(tx->data_pointer), tx->data_pointer,
             tx->timestamp);
    sha256(tx_data, output);
}

// initialize a new block
void init_block(Block *block, int index, const char *prev_hash)
{
    block->index = index;
    block->timestamp = time(NULL);
    strcpy(block->previous_hash, prev_hash);
    block->transaction_count = 0;

    memset(block->block_hash, 0, HASH_SIZE);
    memset(block->merkle_root, 0, HASH_SIZE);
    memset(block->validator_signature, 0, HASH_SIZE);
}

// add a transaction to the block
int add_transaction(Block *block, Transaction tx)
{
    if (block->transaction_count >= MAX_TRANSACTIONS)
        return 0;

    block->transactions[block->transaction_count++] = tx;
    return 1;
}

// calculate Merkle Root for all transactions in the block
void calculate_merkle_root(Block *block)
{
    if (block->transaction_count == 0)
    {
        memset(block->merkle_root, 0, HASH_SIZE);
        return;
    }

    char hashes[MAX_TRANSACTIONS][HASH_SIZE];
    int count = block->transaction_count;

    // Step 1: Initial hashes of individual transactions
    for (int i = 0; i < count; i++)
    {
        calculate_transaction_leaf_hash(&block->transactions[i], hashes[i]);
    }

    // Step 2: Iterative pairwise hashing until a single root is reached
    while (count > 1)
    {
        int next_count = 0;
        for (int i = 0; i < count; i += 2)
        {
            if (i + 1 < count)
            {
                hash_internal_node(hashes[i], hashes[i + 1], hashes[next_count++]);
            }
            else
            {
                // handle odd number of nodes by duplicating the last one
                hash_internal_node(hashes[i], hashes[i], hashes[next_count++]);
            }
        }
        count = next_count;
    }

    strncpy(block->merkle_root, hashes[0], HASH_SIZE - 1);
    block->merkle_root[HASH_SIZE - 1] = '\0';
}

// generate hash for the block (anchoring metadata and Merkle Root)
void calculate_block_hash(Block *block)
{
    // Ensure Merkle Root is up to date
    calculate_merkle_root(block);

    char buffer[2048];
    snprintf(buffer, sizeof(buffer),
             "HEADER|%d|%ld|%s|%s",
             block->index,
             block->timestamp,
             block->previous_hash,
             block->merkle_root);

    sha256(buffer, block->block_hash);
}

int generate_merkle_proof(const Block *block, int tx_index, MerkleProof *proof)
{
    if (!block || !proof || tx_index < 0 || tx_index >= block->transaction_count)
        return 0;

    memset(proof, 0, sizeof(MerkleProof));

    if (block->transaction_count <= 0 || block->transaction_count > MAX_TRANSACTIONS)
        return 0;

    char hashes[MAX_TRANSACTIONS][HASH_SIZE];
    int count = block->transaction_count;
    int current_index = tx_index;

    for (int i = 0; i < count; i++)
        calculate_transaction_leaf_hash(&block->transactions[i], hashes[i]);

    strncpy(proof->leaf_hash, hashes[tx_index], HASH_SIZE - 1);
    proof->leaf_hash[HASH_SIZE - 1] = '\0';

    while (count > 1)
    {
        if (proof->proof_length >= MAX_MERKLE_PROOF_ITEMS)
            return 0;

        int sibling_index;
        if (current_index % 2 == 0)
            sibling_index = (current_index + 1 < count) ? current_index + 1 : current_index;
        else
            sibling_index = current_index - 1;

        strncpy(proof->sibling_hashes[proof->proof_length],
                hashes[sibling_index],
                HASH_SIZE - 1);
        proof->sibling_hashes[proof->proof_length][HASH_SIZE - 1] = '\0';
        proof->sibling_is_left[proof->proof_length] = sibling_index < current_index;
        proof->proof_length++;

        int next_count = 0;
        for (int i = 0; i < count; i += 2)
        {
            if (i + 1 < count)
                hash_internal_node(hashes[i], hashes[i + 1], hashes[next_count++]);
            else
                hash_internal_node(hashes[i], hashes[i], hashes[next_count++]);
        }

        current_index /= 2;
        count = next_count;
    }

    return 1;
}

int verify_merkle_proof(const char leaf_hash[HASH_SIZE],
                        const MerkleProof *proof,
                        const char expected_root[HASH_SIZE],
                        char computed_root[HASH_SIZE])
{
    if (!leaf_hash || !proof || !expected_root || proof->proof_length < 0 ||
        proof->proof_length > MAX_MERKLE_PROOF_ITEMS)
        return 0;

    char current[HASH_SIZE];
    strncpy(current, leaf_hash, HASH_SIZE - 1);
    current[HASH_SIZE - 1] = '\0';

    for (int i = 0; i < proof->proof_length; i++)
    {
        char next[HASH_SIZE];
        if (proof->sibling_is_left[i])
            hash_internal_node(proof->sibling_hashes[i], current, next);
        else
            hash_internal_node(current, proof->sibling_hashes[i], next);

        strncpy(current, next, HASH_SIZE - 1);
        current[HASH_SIZE - 1] = '\0';
    }

    if (computed_root)
    {
        strncpy(computed_root, current, HASH_SIZE - 1);
        computed_root[HASH_SIZE - 1] = '\0';
    }

    return strcmp(current, expected_root) == 0;
}
