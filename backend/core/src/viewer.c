#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "blockchain/blockchain.h"
#include "blockchain/block.h"
#include "crypto/hash.h"
#include "crypto/signature.h"

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

    int height = get_blockchain_height();
    for (int i = 0; i < height; i++) {
        Block block;
        if (!get_block_by_index(i, &block)) {
            continue;
        }

        for (int j = 0; j < block.transaction_count; j++) {
            if (strcmp(block.transactions[j].data_hash, file_hash) == 0) {
                printf("MATCH|%d|%d|%s|%s|%s|%s\n",
                       block.index,
                       j,
                       file_hash,
                       block.transactions[j].data_pointer,
                       block.transactions[j].patient_id,
                       block.transactions[j].doctor_id);
                return 0;
            }
        }
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
    else {
        printf("Unknown command: %s\n", cmd);
    }

    return 0;
}
