/**
 * ============================================================
 *   ROGUE NODE — Malicious Attacker Simulation
 * ============================================================
 *
 * This node intentionally bypasses all security safeguards:
 *   [1] DUPLICATE ATTACK  — re-adds a file already on the chain
 *   [2] FAKE SIG ATTACK   — sends a block with a forged signature
 *   [3] TAMPER ATTACK     — modifies a record file then tries to add it
 *
 * The HONEST validator nodes (8001-8004) will REJECT all of these
 * because verify_block() catches each violation.
 *
 * For demonstration purposes only.
 * ============================================================
 */

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

// Rogue node runs on port 8099 — not a real validator
#define ROGUE_PORT 8099

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

// ============================================================
// ATTACK 1: DUPLICATE — try to add a file already committed
// ============================================================
void attack_duplicate(int target_peer, const char *filename) {
    printf("\n[ROGUE] ============= ATTACK: DUPLICATE RECORD =============\n");
    printf("[ROGUE] Attempting to re-add already-committed file: %s\n", filename);
    printf("[ROGUE] Skipping all local duplicate checks...\n\n");

    Transaction tx;
    strncpy(tx.patient_id, "PAT-EVIL", sizeof(tx.patient_id) - 1);
    strncpy(tx.doctor_id, "DOC-ROGUE", sizeof(tx.doctor_id) - 1);
    tx.timestamp = time(NULL);

    char final_path[256];
    snprintf(final_path, sizeof(final_path), "offchain/records/%s", filename);

    // Encrypt the record (rogue uses its own fake key path)
    char enc_path[256];
    snprintf(enc_path, sizeof(enc_path), "%s.enc", final_path);
    envelope_encrypt_record(final_path, enc_path, tx.patient_id, tx.doctor_id);
    strncpy(tx.data_pointer, enc_path, sizeof(tx.data_pointer) - 1);

    if (!hash_file_content(final_path, tx.data_hash)) {
        printf("[ROGUE] Failed to hash file. Aborting attack.\n");
        return;
    }

    printf("[ROGUE] File hash computed: %.32s...\n", tx.data_hash);
    printf("[ROGUE] !! SKIPPING duplicate check — this hash is ALREADY on the chain !!\n");

    // Use the REAL synced chain height so our block index is correct
    Block real_last;
    int height = get_blockchain_height();
    if (height == 0 || !get_last_block(&real_last)) {
        printf("[ROGUE] Chain not synced yet. Run 'sync' first.\n");
        return;
    }
    printf("[ROGUE] Chain synced at height %d. Targeting block index %d...\n", height, height);

    Block malicious_block;
    init_block(&malicious_block, height, real_last.block_hash);
    add_transaction(&malicious_block, tx);
    malicious_block.validator_port = ROGUE_PORT;
    calculate_block_hash(&malicious_block);

    // Sign with a FORGED key (rogue does not have a real key)
    char fake_sig[HASH_SIZE];
    snprintf(fake_sig, HASH_SIZE, "SIG_V1_%s_keys/%d_private.pem",
             malicious_block.block_hash, ROGUE_PORT);
    strncpy(malicious_block.validator_signature, fake_sig, HASH_SIZE - 1);

    printf("[ROGUE] Malicious block prepared. Broadcasting CAN_COMMIT to honest nodes...\n");

    char buffer[SERIALIZED_BLOCK_SIZE];
    serialize_block(&malicious_block, buffer);
    char msg[SERIALIZED_BLOCK_SIZE + 64];
    snprintf(msg, sizeof(msg), "CAN_COMMIT:%s\n", buffer);
    broadcast_message(msg);

    printf("[ROGUE] CAN_COMMIT sent! Waiting for honest validators to REJECT it...\n");
}

// ============================================================
// ATTACK 2: FAKE SIGNATURE — valid data, completely forged sig
// ============================================================
void attack_fake_signature(const char *filename) {
    printf("\n[ROGUE] ============= ATTACK: FORGED SIGNATURE =============\n");
    printf("[ROGUE] Sending a real block but signing it with a FAKE key.\n");
    printf("[ROGUE] Honest nodes will reject: signature won't match any validator key.\n\n");

    Transaction tx;
    strncpy(tx.patient_id, "PAT-VICTIM", sizeof(tx.patient_id) - 1);
    strncpy(tx.doctor_id, "DOC-ATTACKER", sizeof(tx.doctor_id) - 1);
    tx.timestamp = time(NULL);

    char final_path[256];
    snprintf(final_path, sizeof(final_path), "offchain/records/%s", filename);

    if (!hash_file_content(final_path, tx.data_hash)) {
        printf("[ROGUE] File not found: %s\n", final_path);
        return;
    }

    char enc_path[256];
    snprintf(enc_path, sizeof(enc_path), "%s.enc", final_path);
    envelope_encrypt_record(final_path, enc_path, tx.patient_id, tx.doctor_id);
    strncpy(tx.data_pointer, enc_path, sizeof(tx.data_pointer) - 1);

    // Use the REAL synced chain state for correct block index + prev_hash
    Block real_last;
    int height = get_blockchain_height();
    if (height == 0 || !get_last_block(&real_last)) {
        printf("[ROGUE] Chain not synced yet. Run 'sync' first.\n");
        return;
    }
    printf("[ROGUE] Chain synced at height %d. Forging block at index %d...\n", height, height);

    Block malicious_block;
    init_block(&malicious_block, height, real_last.block_hash);
    add_transaction(&malicious_block, tx);
    malicious_block.validator_port = 8001; // Pretend to be Node 8001
    calculate_block_hash(&malicious_block);

    // Forge a signature that LOOKS like it came from node 8001 but is wrong
    snprintf(malicious_block.validator_signature, HASH_SIZE,
             "SIG_V1_FORGED_DEADBEEF_keys/8001_private.pem");

    printf("[ROGUE] Forged block identity as Node 8001.\n");
    printf("[ROGUE] Broadcasting forged CAN_COMMIT...\n");

    char buffer[SERIALIZED_BLOCK_SIZE];
    serialize_block(&malicious_block, buffer);
    char msg[SERIALIZED_BLOCK_SIZE + 64];
    snprintf(msg, sizeof(msg), "CAN_COMMIT:%s\n", buffer);
    broadcast_message(msg);

    printf("[ROGUE] CAN_COMMIT sent! Honest nodes will verify signature and REJECT.\n");
}

// ============================================================
// ATTACK 3: TAMPER — modify a local file, try to add it
// ============================================================
void attack_tamper_record(const char *filename) {
    printf("\n[ROGUE] ============= ATTACK: TAMPERED RECORD =============\n");
    printf("[ROGUE] Modifying the file content AFTER it was committed to chain.\n");
    printf("[ROGUE] Then trying to re-add — honest nodes will see HASH MISMATCH.\n\n");

    char filepath[256];
    snprintf(filepath, sizeof(filepath), "offchain/records/%s", filename);

    FILE *fp = fopen(filepath, "a");
    if (!fp) {
        printf("[ROGUE] File not found: %s\n", filepath);
        return;
    }
    fprintf(fp, "\n[MALICIOUS DATA INJECTED BY ATTACKER]\n");
    fclose(fp);
    printf("[ROGUE] Injected malicious data into %s\n", filepath);

    // Now try to add this tampered file
    printf("[ROGUE] Computing NEW hash of tampered file...\n");

    Transaction tx;
    strncpy(tx.patient_id, "PAT-TAMPERED", sizeof(tx.patient_id) - 1);
    strncpy(tx.doctor_id, "DOC-EVIL", sizeof(tx.doctor_id) - 1);
    tx.timestamp = time(NULL);

    if (!hash_file_content(filepath, tx.data_hash)) {
        printf("[ROGUE] Cannot hash file.\n");
        return;
    }

    printf("[ROGUE] Tampered hash: %.32s...\n", tx.data_hash);
    printf("[ROGUE] This hash will NOT match what is stored on the blockchain.\n");
    printf("[ROGUE] Run 'verify' on an honest node — it will detect the tamper.\n\n");

    char enc_path[256];
    snprintf(enc_path, sizeof(enc_path), "%s.tampered.enc", filepath);
    envelope_encrypt_record(filepath, enc_path, tx.patient_id, tx.doctor_id);
    strncpy(tx.data_pointer, enc_path, sizeof(tx.data_pointer) - 1);

    // Use the REAL synced chain state for correct block index + prev_hash
    Block real_last;
    int height = get_blockchain_height();
    if (height == 0 || !get_last_block(&real_last)) {
        printf("[ROGUE] Chain not synced yet. Run 'sync' first.\n");
        return;
    }
    printf("[ROGUE] Chain synced at height %d. Inserting tampered block at index %d...\n", height, height);

    Block malicious_block;
    init_block(&malicious_block, height, real_last.block_hash);
    add_transaction(&malicious_block, tx);
    malicious_block.validator_port = ROGUE_PORT;
    calculate_block_hash(&malicious_block);
    snprintf(malicious_block.validator_signature, HASH_SIZE,
             "SIG_V1_%s_keys/%d_private.pem",
             malicious_block.block_hash, ROGUE_PORT);

    printf("[ROGUE] Sending tampered block to network...\n");

    char buffer[SERIALIZED_BLOCK_SIZE];
    serialize_block(&malicious_block, buffer);
    char msg[SERIALIZED_BLOCK_SIZE + 64];
    snprintf(msg, sizeof(msg), "CAN_COMMIT:%s\n", buffer);
    broadcast_message(msg);

    printf("[ROGUE] Block sent. Honest nodes will see invalid hash linkage & reject.\n");
}

// ============================================================
// MAIN
// ============================================================
int main(int argc, char *argv[]) {
    // Rogue node always runs on 8099 and connects to honest peers passed as args
    global_node_port = ROGUE_PORT;

    printf("\n");
    printf("##############################################\n");
    printf("##  !! ROGUE / MALICIOUS NODE STARTED !!   ##\n");
    printf("##  Identity: Port %-4d (UNAUTHORIZED)     ##\n", ROGUE_PORT);
    printf("##  Mode: ATTACK SIMULATION                 ##\n");
    printf("##############################################\n\n");

    // Initialize local (empty) ledger - rogue will sync blocks from honest nodes
    set_blockchain_file("data/blockchain.dat");
    initialize_blockchain();
    // NOTE: We intentionally do NOT create a genesis block here.
    //       The rogue has no keys. It will receive blocks via sync from honest peers.

    initialize_network(ROGUE_PORT);

#ifdef _WIN32
    int rogue_port_val = ROGUE_PORT;
    _beginthread(server_runner, 0, &rogue_port_val);
    Sleep(300);
#else
    pthread_t server_thread;
    int *port_ptr = malloc(sizeof(int));
    *port_ptr = ROGUE_PORT;
    pthread_create(&server_thread, NULL, server_runner, port_ptr);
    usleep(300000);
#endif

    // Connect to honest nodes passed via command line
    printf("[ROGUE] Infiltrating honest validator network...\n");
    for (int i = 1; i < argc; i++) {
        int peer_port = atoi(argv[i]);
        connect_to_peer("127.0.0.1", peer_port);
        printf("[ROGUE] Connected to honest Node %d\n", peer_port);
    }

#ifdef _WIN32
    Sleep(800);
#else
    usleep(800000);
#endif

    printf("\n[ROGUE] Connected to %d honest node(s).\n", get_peer_count());

    // -------------------------------------------------------
    // SYNC: Pull the full chain from honest nodes
    // -------------------------------------------------------
    printf("[ROGUE] Syncing blockchain from honest nodes...\n");
    initiate_chain_sync();

    // Wait for sync to complete (give network time to transfer blocks)
#ifdef _WIN32
    Sleep(2000);
#else
    usleep(2000000);
#endif

    int synced_height = get_blockchain_height();
    printf("[ROGUE] Sync complete. Chain height acquired: %d block(s)\n", synced_height);

    if (synced_height == 0) {
        printf("[ROGUE] WARNING: No blocks synced. Make sure honest nodes have records committed first.\n");
        printf("[ROGUE] You can still try attacks — they will target block index 1.\n");
    }

    printf("\n--- ATTACK MENU ---\n");
    printf("  1 <file>  - DUPLICATE ATTACK  (re-add a file already on the chain)\n");
    printf("  2 <file>  - FAKE SIG ATTACK   (send a block with a forged signature)\n");
    printf("  3 <file>  - TAMPER ATTACK     (modify a record then try to add it)\n");
    printf("  sync      - Re-sync chain from honest nodes\n");
    printf("  height    - Show current known chain height\n");
    printf("  exit      - Quit\n\n");

    char line[256];
    while (1) {
        printf("[ROGUE]> ");
        fflush(stdout);
        if (fgets(line, sizeof(line), stdin) == NULL) break;
        line[strcspn(line, "\n")] = 0;

        char *command = strtok(line, " ");
        char *arg = strtok(NULL, " ");
        const char *target_file = (arg != NULL) ? arg : "record1.txt";

        if (command == NULL) continue;

        if (strcmp(command, "exit") == 0) {
            printf("[ROGUE] Attack session ended.\n");
            break;
        } else if (strcmp(command, "sync") == 0) {
            printf("[ROGUE] Re-syncing chain from honest nodes...\n");
            initiate_chain_sync();
#ifdef _WIN32
            Sleep(2000);
#else
            usleep(2000000);
#endif
            printf("[ROGUE] Sync complete. Chain height: %d\n", get_blockchain_height());
        } else if (strcmp(command, "height") == 0) {
            printf("[ROGUE] Known chain height: %d block(s)\n", get_blockchain_height());
        } else if (strcmp(command, "1") == 0) {
            attack_duplicate(8001, target_file);
        } else if (strcmp(command, "2") == 0) {
            attack_fake_signature(target_file);
        } else if (strcmp(command, "3") == 0) {
            attack_tamper_record(target_file);
        } else {
            printf("[ROGUE] Unknown command. Use 1, 2, 3, sync, height, or exit.\n");
        }
    }

    return 0;
}
