#ifndef BLOCK_H
#define BLOCK_H

#include <time.h>

#define HASH_SIZE 513
#define MAX_TRANSACTIONS 5
#define MAX_MERKLE_PROOF_ITEMS 32

typedef struct {
    char patient_id[32];        // privacy first
    char doctor_id[32];
    char data_hash[HASH_SIZE];  // hash for validation
    char data_pointer[128];     // location of the record
    time_t timestamp;
} Transaction;

typedef struct {
    int index;
    time_t timestamp;
    char previous_hash[HASH_SIZE];
    char block_hash[HASH_SIZE];
    char merkle_root[HASH_SIZE];
    char validator_signature[HASH_SIZE];
    int validator_port;
    Transaction transactions[MAX_TRANSACTIONS];
    int transaction_count;
} Block;

typedef struct {
    char leaf_hash[HASH_SIZE];
    char sibling_hashes[MAX_MERKLE_PROOF_ITEMS][HASH_SIZE];
    int sibling_is_left[MAX_MERKLE_PROOF_ITEMS];
    int proof_length;
} MerkleProof;

void init_block(Block *block, int index, const char *prev_hash);
int add_transaction(Block *block, Transaction tx);
void calculate_block_hash(Block *block);
void calculate_transaction_leaf_hash(const Transaction *tx, char output[HASH_SIZE]);
int generate_merkle_proof(const Block *block, int tx_index, MerkleProof *proof);
int verify_merkle_proof(const char leaf_hash[HASH_SIZE],
                        const MerkleProof *proof,
                        const char expected_root[HASH_SIZE],
                        char computed_root[HASH_SIZE]);


#endif
