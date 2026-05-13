#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// Cross-platform sleep support
#ifdef _WIN32
    #include <windows.h>
    #define sleep_ms(ms) Sleep(ms)
#else
    #include <unistd.h>
    #define sleep_ms(ms) usleep((ms) * 1000)
#endif

#include "blockchain/blockchain.h"
#include "blockchain/block.h"
#include "crypto/hash.h"
#include "crypto/signature.h"

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s <port> <block_count> [delay_ms]\n", argv[0]);
        return 1;
    }

    int port = atoi(argv[1]);
    int count = atoi(argv[2]);
    int delay = (argc > 3) ? atoi(argv[3]) : 100;

    printf("--- Speed Testing Node Port %d ---\n", port);
    printf("Target: Adding %d blocks with %dms delay\n", count, delay);

    Block last_block;
    char key_path[128];
    snprintf(key_path, sizeof(key_path), "keys/%d_private.pem", port);

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    for (int i = 0; i < count; i++) {
        if (!get_last_block(&last_block)) {
            create_genesis_block(&last_block, port);
            add_block(&last_block);
            get_last_block(&last_block);
        }

        Transaction tx;
        sprintf(tx.patient_id, "BENCH-%06d", i);
        sprintf(tx.doctor_id, "BENCH-DOC");
        sprintf(tx.data_pointer, "offchain/records/record1.enc");
        hash_file_content(tx.data_pointer, tx.data_hash);
        tx.timestamp = time(NULL);

        Block block;
        init_block(&block, last_block.index + 1, last_block.block_hash);
        add_transaction(&block, tx);
        block.validator_port = port;
        calculate_block_hash(&block);

        if (sign_data(block.block_hash, key_path, block.validator_signature)) {
            add_block(&block);
            if (i % 10 == 0 || i == count - 1) {
                printf("Progress: %d/%d blocks added...\n", i + 1, count);
            }
        } else {
            printf("Failed to sign block at index %d\n", i);
            break;
        }

        if (delay > 0) {
            sleep_ms(delay);
        }
    }

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) + (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("\n--- Benchmark Complete ---\n");
    printf("Total Blocks: %d\n", count);
    printf("Total Time: %.2f seconds\n", elapsed);
    printf("Avg Time per Block: %.4f seconds\n", elapsed / count);
    printf("Throughput: %.2f blocks/sec\n", count / elapsed);

    return 0;
}
