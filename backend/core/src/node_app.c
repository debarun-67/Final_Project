#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef _WIN32
    #include <windows.h>
    #include <process.h>
#else
    #include <unistd.h>
    #include <pthread.h>
#endif

#include "blockchain/blockchain.h"
#include "blockchain/block.h"
#include "crypto/hash.h"
#include "crypto/signature.h"
#include "crypto/encryption.h"
#include "network/node.h"
#include "network/sync.h"
#include "network/serializer.h"

int global_node_port = 0;
Block pending_block;
int vote_count = 0;
int is_proposing = 0;
unsigned int vote_mask = 0;

#ifdef _WIN32
void server_runner(void *arg) {
    int port = *(int *)arg;
    start_server(port);
}
#else
void *server_runner(void *arg) {
    int port = *(int *)arg;
    start_server(port);
    return NULL;
}
#endif

void print_help() {
    printf("\n--- Advanced Distributed Node Commands ---\n");
    printf("  help      - Show this help\n");
    printf("  status    - Show node identity and last block hash\n");
    printf("  height    - Show the current chain height\n");
    printf("  peers     - List all connected network nodes\n");
    printf("  sync      - Manually trigger chain synchronization\n");
    printf("  verify    - Run full cryptographic chain validation\n");
    printf("  add       - Create and broadcast a new medical record\n");
    printf("  bench <n> - Stress test the network by adding N blocks fast\n");
    printf("  exit      - Safely shut down the node\n");
    printf("> ");
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <port> [peer_port...]\n", argv[0]);
        return 1;
    }

    int port = atoi(argv[1]);
    global_node_port = port;
    printf("\n============================================\n");
    printf("   DISTRIBUTED MEDICAL BLOCKCHAIN NODE\n");
    printf("   Identity: Port %d | Network: Local Mesh\n", port);
    printf("============================================\n");

    // Initialize blockchain
    Block last_block;
    initialize_blockchain(); // Load existing data
    if (!get_last_block(&last_block)) {
        printf("[SYSTEM] No blockchain found. Generating genesis...\n");
        create_genesis_block(&last_block, port);
        add_block(&last_block);
    }

    // Initialize networking
    initialize_network(port);

#ifdef _WIN32
    _beginthread(server_runner, 0, &port);
#else
    pthread_t server_thread;
    int *port_ptr = malloc(sizeof(int));
    *port_ptr = port;
    pthread_create(&server_thread, NULL, server_runner, port_ptr);
#endif

    // Connect to initial peers
    printf("[NETWORK] Connecting to mesh peers...\n");
    for (int i = 2; i < argc; i++) {
        int peer_port = atoi(argv[i]);
        if (peer_port != port) {
            connect_to_peer("127.0.0.1", peer_port);
        }
    }
    
    // Give time for outbound connections to stabilize
    #ifdef _WIN32
        Sleep(500);
    #else
        usleep(500000);
    #endif

    char line[256];
    print_help();

    while (1) {
        if (fgets(line, sizeof(line), stdin) == NULL) break;
        
        // Remove trailing newline
        line[strcspn(line, "\n")] = 0;
        if (strlen(line) == 0) {
            printf("> ");
            continue;
        }

        char *command = strtok(line, " ");
        char *arg = strtok(NULL, " ");

        if (command == NULL) continue;

        if (strcmp(command, "exit") == 0) {
            break;
        } else if (strcmp(command, "status") == 0) {
            get_last_block(&last_block);
            printf("\n[NODE STATUS]\n");
            printf("Port:      %d\n", port);
            printf("Last Hash: %s\n", last_block.block_hash);
            printf("Validator: %d\n", last_block.validator_port);
        } else if (strcmp(command, "height") == 0) {
            printf("Current Chain Height: %d blocks\n", get_blockchain_height());
        } else if (strcmp(command, "peers") == 0) {
            printf("Active Connections: %d\n", get_peer_count());
        } else if (strcmp(command, "verify") == 0) {
            printf("[CRYPTO] Running full chain validation...\n");
            if (verify_blockchain()) {
                printf("RESULT: Blockchain Integrity SECURE.\n");
            } else {
                printf("RESULT: TAMPERING DETECTED!\n");
            }
        } else if (strcmp(command, "sync") == 0) {
            printf("[NETWORK] Requesting chain sync from peers...\n");
            broadcast_message("SYNC_REQUEST");
        } else if (strcmp(command, "add") == 0) {
            get_last_block(&last_block);
            Transaction tx;
            sprintf(tx.patient_id, "PAT-%d", rand() % 9999);
            sprintf(tx.doctor_id, "DOC-%d", port);
            
            // Use the argument if provided, otherwise default
            const char *arg_file = (arg != NULL) ? arg : "record1.txt";
            char final_path[256];
            
            // Try as-is first
            FILE *f = fopen(arg_file, "rb");
            if (f) {
                fclose(f);
                strncpy(final_path, arg_file, sizeof(final_path)-1);
            } else {
                // Try prefixing
                snprintf(final_path, sizeof(final_path), "offchain/records/%s", arg_file);
            }
            
            // Parse patient and doctor IDs from the file if available
            FILE *parse_f = fopen(final_path, "r");
            if (parse_f) {
                char file_line[256];
                while(fgets(file_line, sizeof(file_line), parse_f)) {
                    if (strncmp(file_line, "Patient ID: ", 12) == 0) {
                        sscanf(file_line, "Patient ID: %31s", tx.patient_id);
                    } else if (strncmp(file_line, "Doctor ID: ", 11) == 0) {
                        sscanf(file_line, "Doctor ID: %31s", tx.doctor_id);
                    }
                }
                fclose(parse_f);
            }
            
            char enc_path[256];
            snprintf(enc_path, sizeof(enc_path), "%s.enc", final_path);
            
            // Perform Envelope Encryption (matching website behavior)
            if (!envelope_encrypt_record(final_path, enc_path, tx.patient_id, tx.doctor_id)) {
                printf("[ERROR] Failed to encrypt record via Envelope Encryption!\n");
                continue;
            }
            printf("[CRYPTO] Record securely encrypted to %s\n", enc_path);

            // Blockchain tracks the location of the ENCRYPTED file...
            strncpy(tx.data_pointer, enc_path, sizeof(tx.data_pointer) - 1);
            
            // ...but hashes the ORIGINAL PLAINTEXT file for integrity checks.
            if (hash_file_content(final_path, tx.data_hash)) {
                // PREVENT DUPLICATES
                if (transaction_hash_exists(tx.data_hash)) {
                    printf("[ERROR] Record already exists on blockchain (Duplicate Hash detected).\n");
                    continue;
                }
                
                tx.timestamp = time(NULL);

                Block block;
                init_block(&block, last_block.index + 1, last_block.block_hash);
                add_transaction(&block, tx);
                block.validator_port = port;
                calculate_block_hash(&block);

                char key_path[128];
                snprintf(key_path, sizeof(key_path), "keys/%d_private.pem", port);
                if (sign_data(block.block_hash, key_path, block.validator_signature)) {
                    pending_block = block;
                    is_proposing = 1;
                    vote_count = 0;
                    
                    char buffer[SERIALIZED_BLOCK_SIZE];
                    serialize_block(&block, buffer);
                    char msg[SERIALIZED_BLOCK_SIZE + 32];
                    snprintf(msg, sizeof(msg), "CAN_COMMIT:%s\n", buffer);
                    
                    printf("[CONSENSUS] Phase 1: Sending CAN_COMMIT for Block %d...\n", block.index);
                    broadcast_message(msg); 
                } else {
                    printf("[ERROR] Failed to sign block. Check key at %s\n", key_path);
                }
            } else {
                printf("[ERROR] Could not read/hash file: %s\n", tx.data_pointer);
            }
        } else if (strcmp(command, "bench") == 0) {
            int count = (arg != NULL) ? atoi(arg) : 10;
            printf("[BENCH] Starting stress test: Adding %d blocks...\n", count);
            
            time_t start_time = time(NULL);
            for (int i = 1; i <= count; i++) {
                get_last_block(&last_block);
                Transaction tx;
                sprintf(tx.patient_id, "BENCH-%d", i);
                sprintf(tx.doctor_id, "STRESS-TEST");
                strncpy(tx.data_pointer, "offchain/records/record1.txt", sizeof(tx.data_pointer) - 1);
                
                if (hash_file_content(tx.data_pointer, tx.data_hash)) {
                    tx.timestamp = time(NULL);
                    Block block;
                    init_block(&block, last_block.index + 1, last_block.block_hash);
                    add_transaction(&block, tx);
                    block.validator_port = port;
                    calculate_block_hash(&block);
                    char key_path[128];
                    snprintf(key_path, sizeof(key_path), "keys/%d_private.pem", port);
                    if (sign_data(block.block_hash, key_path, block.validator_signature)) {
                        add_block(&block);
                        broadcast_message("NEW_BLOCK"); 
                        printf("."); fflush(stdout);
                    }
                }
            }
            time_t end_time = time(NULL);
            double total = difftime(end_time, start_time);
            printf("\n[BENCH] Done. %d blocks added in %.2f seconds (%.2f BPS)\n", count, total, (total > 0 ? count/total : count));
        } else if (strcmp(command, "help") == 0) {
            print_help();
            continue;
        } else {
            printf("Unknown command: '%s'. Type 'help' for options.\n", command);
        }
        printf("> ");
    }

    printf("Node shutting down...\n");
    return 0;
}
