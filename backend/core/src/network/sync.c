#include <stdio.h>
#include <string.h>

#ifdef _WIN32
    #include <winsock2.h>
#else
    #include <sys/socket.h>
#endif

#include "node.h"
#include "../blockchain/blockchain.h"

void initiate_chain_sync() {
    printf("[SYNC] Querying network for latest chain height...\n");
    broadcast_message("GET_HEIGHT\n");
}

void force_full_resync(int client_socket) {
    printf("[SYNC] Triggering full ledger reconciliation...\n");
    int local_height = get_blockchain_height();
    for (int i = 0; i < local_height; i++) {
        char request[64];
        snprintf(request, sizeof(request), "GET_BLOCK:%d\n", i);
        send(client_socket, request, (int)strlen(request), 0);
    }
}

void handle_sync_mismatch(int client_socket) {
    printf("[SYNC] Warning: Ledger fork detected. Re-evaluating network height...\n");
    send(client_socket, "GET_HEIGHT\n", 11, 0);
}
