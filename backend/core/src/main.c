#include <stdio.h>
#include <string.h>
#include <time.h>
#include <stdlib.h>
// OpenSSL removed for zero-dependency demo

#include "blockchain/blockchain.h"
#include "blockchain/block.h"
#include "crypto/hash.h"
#include "crypto/signature.h"

#define OFFCHAIN_DIR "offchain/records/"

#ifdef _WIN32
#include <windows.h>
#include <process.h>
#include <winsock2.h>

void start_heartbeat(void* port_ptr) {
    int port = *((int*)port_ptr);
    WSADATA wsa;
    SOCKET s, new_socket;
    struct sockaddr_in server;

    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) return;
    s = socket(AF_INET, SOCK_STREAM, 0);
    if (s == INVALID_SOCKET) return;

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(port);

    if (bind(s, (struct sockaddr *)&server, sizeof(server)) == SOCKET_ERROR) return;
    listen(s, 3);

    while(1) {
        new_socket = accept(s, NULL, NULL);
        if (new_socket != INVALID_SOCKET) closesocket(new_socket);
    }
}
#endif

// main entry point
int main(int argc, char *argv[]) {
    int node_port = 8001; // Default
    if (argc > 1) {
        node_port = atoi(argv[1]);
    }

#ifdef _WIN32
    _beginthread(start_heartbeat, 0, &node_port);
#endif

    printf("--- Medical Blockchain Node (Identity: %d) ---\n", node_port);

    while(1) {
        Block last_block;
        int has_chain = get_last_block(&last_block);

        // handle genesis block if chain is empty
        if (!has_chain) {
            printf("No blockchain found. Creating genesis block...\n");
            create_genesis_block(&last_block, node_port);
            add_block(&last_block);
            get_last_block(&last_block);
        }

        Transaction tx;
        char record_name[128];

        // setting up demo metadata
        strcpy(tx.patient_id, "HOSP-IND-2025-001124");
        strcpy(tx.doctor_id, "DR-KOL-GYN-118");

        printf("\nCommands: [record_name.enc] to Add, [exit] to Quit\n");
        printf("Enter encrypted record file name: ");
        if (scanf("%127s", record_name) != 1) break;

        if (strcmp(record_name, "exit") == 0) break;

        snprintf(tx.data_pointer,
                 sizeof(tx.data_pointer),
                 "%s%s",
                 OFFCHAIN_DIR,
                 record_name);

        // hash the file content (Full File)
        if (!hash_file_content(tx.data_pointer, tx.data_hash)) {
            printf("ERROR: File %s not found.\n", tx.data_pointer);
            continue;
        }

        // FIX: Use centralized API to avoid duplicates
        if (transaction_hash_exists(tx.data_hash)) {
            printf("ERROR: This medical record already exists in the blockchain.\n");
            continue;
        }

        tx.timestamp = time(NULL);

        // create new block
        Block block;
        init_block(&block, last_block.index + 1, last_block.block_hash);
        add_transaction(&block, tx);
        
        // Use the dynamic node_port for this instance
        block.validator_port = node_port; 

        // FIX: Use proper block hash calculation instead of manual data hash
        calculate_block_hash(&block);

        // FIX: Use standard key path naming convention
        char private_key_path[128];
        snprintf(private_key_path, sizeof(private_key_path), "keys/%d_private.pem", block.validator_port);

        if (!sign_data(block.block_hash,
                      private_key_path,
                      block.validator_signature)) {
            printf("ERROR: Failed to sign the block.\n");
            continue;
        }

        add_block(&block);
        printf("SUCCESS: Medical record block added successfully.\n");

        // integrity check
        if (verify_blockchain()) {
            printf("Integrity Check: Blockchain verified successfully.\n");
        } else {
            printf("Integrity Check: Blockchain verification FAILED!\n");
        }
    }

    return 0;
}

