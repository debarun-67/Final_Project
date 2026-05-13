#ifndef NODE_H
#define NODE_H

#include <time.h>

#define MAX_PEERS 50
#define BUFFER_SIZE 8192
#define MAX_MSG_PER_SEC 100

typedef struct {
    int socket;
    int port;
    time_t last_seen;
    int active;
    int message_count;
    time_t last_reset;
} Peer;

void initialize_network(int port);
void start_server(int port);
void connect_to_peer(const char *ip, int port);
void broadcast_message(const char *message);
int get_peer_count();

#endif
