#include <stdio.h>
#include <string.h>

#include "proposal.h"
#include "serializer.h"
#include "node.h"
#include "../blockchain/blockchain.h"

// proposal state management
static Block current_proposal;
static int proposal_active = 0;
static int approve_votes = 0;

void propose_block(Block *block) {
    current_proposal = *block;
    proposal_active = 1;
    approve_votes = 1;

    char buffer[SERIALIZED_BLOCK_SIZE];
    char message[SERIALIZED_BLOCK_SIZE + 32];
    serialize_block(block, buffer);
    snprintf(message, sizeof(message), "PROPOSE_BLOCK:%s\n", buffer);
    printf("[CONSENSUS] Proposed Block #%d to the mesh network...\n", block->index);
    broadcast_message(message);
}

void register_vote(const char *vote) {
    if (!proposal_active) return;
    if (strstr(vote, "APPROVE")) approve_votes++;

    int total_nodes = get_peer_count() + 1;
    int majority = (total_nodes / 2) + 1;

    if (approve_votes >= majority) {
        printf("[CONSENSUS] Majority reached (%d/%d). Committing Block #%d\n", approve_votes, total_nodes, current_proposal.index);
        add_block(&current_proposal);
        char buffer[SERIALIZED_BLOCK_SIZE];
        char message[SERIALIZED_BLOCK_SIZE + 32];
        serialize_block(&current_proposal, buffer);
        snprintf(message, sizeof(message), "COMMIT_BLOCK:%s\n", buffer);
        broadcast_message(message);
        proposal_active = 0;
    }
}

void handle_commit(const char *serialized) {
    Block incoming;
    if (deserialize_block(serialized, &incoming)) {
        if (!block_exists_by_index(incoming.index)) {
            printf("[CONSENSUS] Received network commit for Block #%d. Updating ledger...\n", incoming.index);
            add_block(&incoming);
        }
    }
}
