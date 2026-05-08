#include <stdio.h>
#include <string.h>
#include <time.h>

#include "block.h"
#include "../crypto/hash.h"

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
        char tx_data[1024];
        snprintf(tx_data, sizeof(tx_data), "%s%s%s%s%ld",
                 block->transactions[i].patient_id,
                 block->transactions[i].doctor_id,
                 block->transactions[i].data_hash,
                 block->transactions[i].data_pointer,
                 block->transactions[i].timestamp);
        sha256(tx_data, hashes[i]);
    }

    // Step 2: Iterative pairwise hashing until a single root is reached
    while (count > 1)
    {
        int next_count = 0;
        for (int i = 0; i < count; i += 2)
        {
            char combined[HASH_SIZE * 2 + 1];
            if (i + 1 < count)
            {
                snprintf(combined, sizeof(combined), "%s%s", hashes[i], hashes[i + 1]);
            }
            else
            {
                // handle odd number of nodes by duplicating the last one
                snprintf(combined, sizeof(combined), "%s%s", hashes[i], hashes[i]);
            }
            sha256(combined, hashes[next_count++]);
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
             "%d%ld%s%s",
             block->index,
             block->timestamp,
             block->previous_hash,
             block->merkle_root);

    sha256(buffer, block->block_hash);
}


