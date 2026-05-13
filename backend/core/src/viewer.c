#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "blockchain/blockchain.h"
#include "blockchain/block.h"

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
        if (verify_blockchain()) {
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
    else {
        printf("Unknown command: %s\n", cmd);
    }

    return 0;
}
