#include <stdio.h>
#include <string.h>
#include <time.h>
#include <stdlib.h>
#include <openssl/evp.h>

#include "blockchain/blockchain.h"
#include "blockchain/block.h"
#include "crypto/hash.h"
#include "crypto/signature.h"

#define OFFCHAIN_DIR "offchain/records/"

// main entry point
int main() {
    printf("Blockchain starting...\n");

    Block last_block;
    int has_chain = get_last_block(&last_block);

    // handle genesis block if chain is empty
    if (!has_chain) {
        printf("No blockchain found. Creating genesis block...\n");
        // FIX: Provided default validator port 8001 for genesis
        create_genesis_block(&last_block, 8001);
        add_block(&last_block);

        // reload to ensure we have the latest state
        get_last_block(&last_block);
    }

    Transaction tx;
    char record_name[128];

    // setting up demo metadata
    strcpy(tx.patient_id, "HOSP-IND-2025-001124");
    strcpy(tx.doctor_id, "DR-KOL-GYN-118");

    printf("Enter encrypted record file name (e.g., record1.enc): ");
    if (scanf("%127s", record_name) != 1) return 1;

    snprintf(tx.data_pointer,
             sizeof(tx.data_pointer),
             "%s%s",
             OFFCHAIN_DIR,
             record_name);

    // hash the file content (Full File)
    if (!hash_file_content(tx.data_pointer, tx.data_hash)) {
        return 1;
    }

    // FIX: Use centralized API to avoid duplicates
    if (transaction_hash_exists(tx.data_hash)) {
        printf("ERROR: This medical record already exists in the blockchain.\n");
        return 0;
    }

    tx.timestamp = time(NULL);

    // create new block
    Block block;
    init_block(&block, last_block.index + 1, last_block.block_hash);
    add_transaction(&block, tx);
    
    // FIX: Set validator port for signing
    block.validator_port = 8001; 

    // FIX: Use proper block hash calculation instead of manual data hash
    calculate_block_hash(&block);

    // FIX: Use standard key path naming convention
    char private_key_path[128];
    snprintf(private_key_path, sizeof(private_key_path), "keys/%d_private.pem", block.validator_port);

    if (!sign_data(block.block_hash,
                  private_key_path,
                  block.validator_signature)) {
        printf("ERROR: Failed to sign the block.\n");
        return 1;
    }

    add_block(&block);
    printf("Medical record block added successfully.\n");

    // integrity check
    if (verify_blockchain()) {
        printf("Blockchain verified successfully.\n");
    } else {
        printf("Blockchain verification failed. Chain may be tampered!\n");
    }

    return 0;
}

