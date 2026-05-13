#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#ifdef _WIN32
    #include <winsock2.h>
#else
    #include <unistd.h>
    #include <sys/socket.h>
#endif

#include "node.h"
#include "protocol.h"
#include "proposal.h"
#include "../crypto/signature.h"
#include "serializer.h"
#include "sync.h"
#include "../blockchain/blockchain.h"

extern Peer peers[];
extern int find_peer_by_socket(int socket);
extern Block pending_block;
extern int vote_count;
extern int is_proposing;
extern int global_node_port;
extern unsigned int vote_mask;

// sync state tracking
static int sync_socket = -1;
static int sync_target_height = 0;
static int syncing = 0;

void protocol_dispatch(int client_socket, const char *message) {
    char clean_message[BUFFER_SIZE];
    memset(clean_message, 0, sizeof(clean_message));
    strncpy(clean_message, message, BUFFER_SIZE - 1);

    // sanitize message
    size_t len = strlen(clean_message);
    while (len > 0 && (clean_message[len - 1] == '\n' || clean_message[len - 1] == '\r' || clean_message[len - 1] == '~')) {
        clean_message[len - 1] = '\0';
        len--;
    }

    if (strlen(clean_message) == 0) return;

    // handle height response
    if (strncmp(clean_message, "CHAIN_HEIGHT:", 13) == 0) {
        int peer_height = atoi(clean_message + 13);
        int local_height = get_blockchain_height();

        if (peer_height > local_height && !syncing) {
            printf("[SYNC] Peer height %d > Local %d. Syncing...\n", peer_height, local_height);
            syncing = 1;
            sync_socket = client_socket;
            sync_target_height = peer_height;
            char request[64];
            snprintf(request, sizeof(request), "GET_BLOCK:%d\n", local_height);
            send(client_socket, request, (int)strlen(request), 0);
        }
        return;
    }

    if (strcmp(clean_message, "GET_HEIGHT") == 0) {
        char response[64];
        snprintf(response, sizeof(response), "CHAIN_HEIGHT:%d\n", get_blockchain_height());
        send(client_socket, response, (int)strlen(response), 0);
        return;
    }

    if (strcmp(clean_message, "SYNC_REQUEST") == 0) {
        char response[64];
        snprintf(response, sizeof(response), "CHAIN_HEIGHT:%d\n", get_blockchain_height());
        send(client_socket, response, (int)strlen(response), 0);
        return;
    }

    if (strcmp(clean_message, "NEW_BLOCK") == 0) {
        printf("[NETWORK] Peer announced new block. Checking height...\n");
        char response[64];
        snprintf(response, sizeof(response), "GET_HEIGHT\n");
        send(client_socket, response, (int)strlen(response), 0);
        return;
    }

    // handle handshake
    if (strncmp(clean_message, "MY_PORT:", 8) == 0) {
        int peer_port = atoi(clean_message + 8);
        int index = find_peer_by_socket(client_socket);
        if (index != -1) {
            peers[index].port = peer_port;
            printf("[NETWORK] Identity verified: Peer is Node %d\n", peer_port);
        }
        return;
    }

    // --- 3-PHASE COMMIT LOGIC ---

    // Phase 1: Receiving CAN_COMMIT (from Proposer)
    if (strncmp(clean_message, "CAN_COMMIT:", 11) == 0) {
        Block incoming;
        if (deserialize_block(clean_message + 11, &incoming)) {
            printf("[3PC] PHASE 1: Received CAN_COMMIT for Block %d. Validating...\n", incoming.index);
            if (verify_block(&incoming)) {
                pending_block = incoming;
                printf("[3PC] Integrity Verified. Sending VOTE_YES.\n");
                char msg[64];
                snprintf(msg, sizeof(msg), "VOTE_YES:%d\n", global_node_port);
                send(client_socket, msg, (int)strlen(msg), 0);
            } else {
                printf("[3PC] Validation Failed. Block Rejected.\n");
            }
        }
        return;
    }

    // Proposer receiving VOTE_YES
    if (strncmp(clean_message, "VOTE_YES:", 9) == 0) {
        int peer_port = atoi(clean_message + 9);
        if (is_proposing) {
            unsigned int bit = (1 << (peer_port - 8000));
            if (!(vote_mask & bit)) {
                vote_mask |= bit;
                vote_count++;
                printf("[3PC] Received UNIQUE VOTE_YES from Node %d. Total: %d\n", peer_port, vote_count + 1);
                
                if (vote_count >= 2) { // Majority of 4 (Self + 2 peers)
                    printf("[3PC] PHASE 2: Majority YES. Sending PRE_COMMIT...\n");
                    vote_count = 0;
                    vote_mask = 0;
                    broadcast_message("PRE_COMMIT\n");
                }
            }
        }
        return;
    }

    // Phase 2: Receiving PRE_COMMIT (from Proposer)
    if (strcmp(clean_message, "PRE_COMMIT") == 0) {
        printf("[3PC] PHASE 2: Received PRE_COMMIT. Entering prepared state. Sending ACK_PRE.\n");
        char msg[64];
        snprintf(msg, sizeof(msg), "ACK_PRE:%d\n", global_node_port);
        send(client_socket, msg, (int)strlen(msg), 0);
        return;
    }

    // Proposer receiving ACK_PRE
    if (strncmp(clean_message, "ACK_PRE:", 8) == 0) {
        int peer_port = atoi(clean_message + 8);
        if (is_proposing) {
            unsigned int bit = (1 << (peer_port - 8000));
            if (!(vote_mask & bit)) {
                vote_mask |= bit;
                vote_count++;
                printf("[3PC] Received UNIQUE ACK_PRE from Node %d. Total: %d\n", peer_port, vote_count + 1);
                
                if (vote_count >= 2) { 
                    if (pending_block.index != -1 && pending_block.index == get_blockchain_height()) {
                        int committed_index = pending_block.index;
                        printf("[3PC] PHASE 3: Network Prepared. Sending DO_COMMIT...\n");
                        add_block(&pending_block); 
                        printf("[SUCCESS] Consensus Reached. Block %d is now IMMUTABLE.\n", committed_index);
                        broadcast_message("DO_COMMIT\n");
                        is_proposing = 0;
                        vote_count = 0;
                        vote_mask = 0;
                        pending_block.index = -1;
                    }
                }
            }
        }
        return;
    }

    // Phase 3: Receiving DO_COMMIT (from Proposer)
    if (strcmp(clean_message, "DO_COMMIT") == 0) {
        if (pending_block.index != -1 && pending_block.index == get_blockchain_height()) {
            int committed_index = pending_block.index;
            printf("[3PC] PHASE 3: Received DO_COMMIT. Finalizing Block %d to ledger.\n", committed_index);
            add_block(&pending_block);
            printf("[SUCCESS] Consensus Reached. Block %d is now IMMUTABLE.\n", committed_index);
            pending_block.index = -1; 
        }
        return;
    }

    // handle block data during sync
    if (strncmp(clean_message, "SYNC_BLOCK:", 11) == 0) {
        Block incoming;
        if (deserialize_block(clean_message + 11, &incoming)) {
            printf("[SYNC] Received block #%d. Validating...\n", incoming.index);
            if (verify_block(&incoming)) {
                add_block(&incoming);
                int local_height = get_blockchain_height();
                if (local_height < sync_target_height) {
                    char request[64];
                    snprintf(request, sizeof(request), "GET_BLOCK:%d\n", local_height);
                    send(client_socket, request, (int)strlen(request), 0);
                } else {
                    printf("[SYNC] Chain fully synchronized.\n");
                    syncing = 0;
                }
            }
        }
        return;
    }

    if (strncmp(clean_message, "GET_BLOCK:", 10) == 0) {
        int index = atoi(clean_message + 10);
        Block block;
        if (get_block_by_index(index, &block)) {
            char buffer[SERIALIZED_BLOCK_SIZE];
            serialize_block(&block, buffer);
            char msg[SERIALIZED_BLOCK_SIZE + 32];
            snprintf(msg, sizeof(msg), "SYNC_BLOCK:%s\n", buffer);
            send(client_socket, msg, (int)strlen(msg), 0);
        }
        return;
    }
}
