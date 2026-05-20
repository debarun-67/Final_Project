#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "blockchain/blockchain.h"
#include "blockchain/block.h"
#include "crypto/hash.h"
#include "crypto/signature.h"
#include "crypto/encryption.h"

void print_block_details(Block *block) {
    printf("INDEX|%d\n", block->index);
    printf("TIMESTAMP|%ld\n", block->timestamp);
    printf("PREV_HASH|%s\n", block->previous_hash);
    printf("BLOCK_HASH|%s\n", block->block_hash);
    printf("MERKLE|%s\n", block->merkle_root);
    printf("VALIDATOR|%d\n", block->validator_port);
    printf("SIGNATURE|%s\n", block->validator_signature);
    printf("TX_COUNT|%d\n", block->transaction_count);
    for (int i = 0; i < block->transaction_count; i++) {
        printf("TX|%s|%s|%s|%s|%ld\n", 
            block->transactions[i].patient_id,
            block->transactions[i].doctor_id,
            block->transactions[i].data_hash,
            block->transactions[i].data_pointer,
            block->transactions[i].timestamp);
    }
    printf("---END_BLOCK---\n");
}

static void copy_field(char *dest, size_t dest_size, const char *src) {
    strncpy(dest, src, dest_size - 1);
    dest[dest_size - 1] = '\0';
}

static int add_record_from_file(const char *hash_file_path,
                                const char *data_pointer,
                                const char *patient_id,
                                const char *doctor_id,
                                int validator_port) {
    Block last_block;

    if (!get_last_block(&last_block)) {
        create_genesis_block(&last_block, validator_port);
        add_block(&last_block);
    }

    Transaction tx;
    memset(&tx, 0, sizeof(Transaction));
    copy_field(tx.patient_id, sizeof(tx.patient_id), patient_id);
    copy_field(tx.doctor_id, sizeof(tx.doctor_id), doctor_id);
    copy_field(tx.data_pointer, sizeof(tx.data_pointer), data_pointer);

    if (!hash_file_content(hash_file_path, tx.data_hash)) {
        printf("ERROR|Could not read source file\n");
        return 1;
    }

    if (transaction_hash_exists(tx.data_hash)) {
        printf("DUPLICATE|%s\n", tx.data_hash);
        return 2;
    }

    tx.timestamp = time(NULL);

    Block block;
    init_block(&block, last_block.index + 1, last_block.block_hash);
    add_transaction(&block, tx);
    block.validator_port = validator_port;
    calculate_block_hash(&block);

    char private_key_path[64];
    snprintf(private_key_path, sizeof(private_key_path), "keys/%d_private.pem", validator_port);

    if (!sign_data(block.block_hash, private_key_path, block.validator_signature)) {
        printf("ERROR|Could not sign block\n");
        return 1;
    }

    add_block(&block);
    printf("ADDED|%d|%s|%s\n", block.index, tx.data_hash, tx.data_pointer);
    return 0;
}

static int verify_file_against_chain(const char *file_path) {
    char file_hash[HASH_SIZE];

    if (!hash_file_content(file_path, file_hash)) {
        printf("ERROR|Could not read source file\n");
        return 1;
    }

    int block_index;
    int tx_index;
    if (find_transaction_location(file_hash, &block_index, &tx_index)) {
        Block block;
        if (!get_block_by_index(block_index, &block) ||
            tx_index < 0 ||
            tx_index >= block.transaction_count ||
            strcmp(block.transactions[tx_index].data_hash, file_hash) != 0) {
            printf("ERROR|Transaction index is stale or corrupted\n");
            return 1;
        }

        MerkleProof proof;
        char computed_root[HASH_SIZE];

        calculate_block_hash(&block);
        if (!generate_merkle_proof(&block, tx_index, &proof) ||
            !verify_merkle_proof(proof.leaf_hash, &proof, block.merkle_root, computed_root)) {
            printf("ERROR|Merkle proof generation failed\n");
            return 1;
        }

        printf("MATCH|%d|%d|%s|%s|%s|%s\n",
               block.index,
               tx_index,
               file_hash,
               block.transactions[tx_index].data_pointer,
               block.transactions[tx_index].patient_id,
               block.transactions[tx_index].doctor_id);
        printf("HEADER|%d|%ld|%s|%s|%s|%d|%s\n",
               block.index,
               block.timestamp,
               block.previous_hash,
               block.merkle_root,
               block.block_hash,
               block.validator_port,
               block.validator_signature);
        printf("TX_META|%s|%s|%s|%ld\n",
               block.transactions[tx_index].patient_id,
               block.transactions[tx_index].doctor_id,
               block.transactions[tx_index].data_pointer,
               block.transactions[tx_index].timestamp);
        printf("PROOF|%s|%d|%s\n",
               proof.leaf_hash,
               proof.proof_length,
               computed_root);
        for (int k = 0; k < proof.proof_length; k++) {
            printf("PROOF_STEP|%s|%s\n",
                   proof.sibling_is_left[k] ? "left" : "right",
                   proof.sibling_hashes[k]);
        }
        printf("END_PROOF\n");
        return 0;
    }

    printf("NOT_FOUND|%s\n", file_hash);
    return 3;
}

int main(int argc, char *argv[]) {
    // We use the relative path "data/blockchain.dat" as configured in blockchain.c
    if (argc < 2) {
        // Default: Print everything
        initialize_blockchain();
        int height = get_blockchain_height();
        for (int i = 0; i < height; i++) {
            Block b;
            if (get_block_by_index(i, &b)) print_block_details(&b);
        }
        return 0;
    }

    const char *cmd = argv[1];
    initialize_blockchain();

    if (strcmp(cmd, "HEIGHT") == 0) {
        printf("Height: %d\n", get_blockchain_height());
    } 
    else if (strcmp(cmd, "LAST") == 0) {
        Block last;
        if (get_last_block(&last)) {
            print_block_details(&last);
        } else {
            printf("Blockchain empty.\n");
        }
    }
    else if (strcmp(cmd, "ALL") == 0) {
        int height = get_blockchain_height();
        for (int i = 0; i < height; i++) {
            Block b;
            if (get_block_by_index(i, &b)) print_block_details(&b);
        }
    }
    else if (strcmp(cmd, "VERIFY") == 0) {
        if (get_blockchain_height() == 0) {
            printf("EMPTY\n");
        } else if (verify_blockchain()) {
            printf("VALID\n");
        } else {
            printf("TAMPERED\n");
        }
    }
    else if (strcmp(cmd, "PRINT") == 0 && argc > 2) {
        int index = atoi(argv[2]);
        Block b;
        if (get_block_by_index(index, &b)) {
            print_block_details(&b);
        } else {
            printf("Block %d not found.\n", index);
        }
    }
    else if (strcmp(cmd, "ADD") == 0 && argc > 5) {
        int validator_port = argc > 6 ? atoi(argv[6]) : 8001;
        return add_record_from_file(argv[2], argv[3], argv[4], argv[5], validator_port);
    }
    else if (strcmp(cmd, "VERIFY_FILE") == 0 && argc > 2) {
        return verify_file_against_chain(argv[2]);
    }
    else if (strcmp(cmd, "ENCRYPT") == 0 && argc > 5) {
        if (envelope_encrypt_record(argv[2], argv[3], argv[4], argv[5])) {
            printf("ENCRYPT_SUCCESS\n");
            return 0;
        } else {
            printf("ENCRYPT_FAILED\n");
            return 1;
        }
    }
    else if (strcmp(cmd, "DECRYPT") == 0 && argc > 4) {
        if (envelope_decrypt_record(argv[2], argv[3], argv[4])) {
            printf("DECRYPT_SUCCESS\n");
            return 0;
        } else {
            printf("DECRYPT_FAILED\n");
            return 1;
        }
    }
    else {
        printf("Unknown command: %s\n", cmd);
    }

    return 0;
}
