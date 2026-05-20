#ifdef _WIN32
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0600
#endif
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #include <process.h>
    #define close closesocket
    typedef int socklen_t;
#else
    #include <unistd.h>
    #include <arpa/inet.h>
    #include <sys/socket.h>
    #include <pthread.h>
#endif

#include "protocol.h"
#include "node.h"

// Helper to log events to file for the website to read
void log_network_event(const char *event) {
    FILE *f = fopen("data/network.log", "a");
    if (f) {
        time_t now = time(NULL);
        char *time_str = ctime(&now);
        time_str[strlen(time_str) - 1] = '\0'; // Remove newline
        fprintf(f, "[%s] %s\n", time_str, event);
        fclose(f);
    }
}

Peer peers[MAX_PEERS];
int peer_count = 0;

#ifdef _WIN32
    CRITICAL_SECTION protocol_mutex;
#else
    pthread_mutex_t protocol_mutex;
#endif

// Mutex-less design for demo simplicity on Windows -> NOPE, added mutex to fix race condition!
void initialize_network(int port) {
#ifdef _WIN32
    InitializeCriticalSection(&protocol_mutex);
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) {
        printf("[NETWORK] Winsock initialization failed.\n");
        exit(EXIT_FAILURE);
    }
#else
    pthread_mutex_init(&protocol_mutex, NULL);
#endif
    memset(peers, 0, sizeof(peers));
    
    char init_msg[100];
    sprintf(init_msg, "Node started on port %d", port);
    log_network_event(init_msg);
    
    printf("[NETWORK] Network layer initialized on port %d\n", port);
}

int find_peer_by_socket(int socket) {
    for (int i = 0; i < MAX_PEERS; i++) {
        if (peers[i].active && peers[i].socket == socket)
            return i;
    }
    return -1;
}

int find_peer_by_port(int port) {
    for (int i = 0; i < MAX_PEERS; i++) {
        if (peers[i].active && peers[i].port == port)
            return i;
    }
    return -1;
}

void remove_peer(int socket) {
    int index = find_peer_by_socket(socket);
    if (index != -1) {
        char msg[100];
        sprintf(msg, "Peer %d disconnected", peers[index].port);
        log_network_event(msg);
        
        printf("[NETWORK] Peer %d disconnected.\n", peers[index].port);
        close(peers[index].socket);
        peers[index].active = 0;
        peer_count--;
    }
}

void handle_message(int client_socket, const char *message) {
#ifdef _WIN32
    EnterCriticalSection(&protocol_mutex);
#else
    pthread_mutex_lock(&protocol_mutex);
#endif

    // For demo, we just dispatch to protocol
    protocol_dispatch(client_socket, message);

#ifdef _WIN32
    LeaveCriticalSection(&protocol_mutex);
#else
    pthread_mutex_unlock(&protocol_mutex);
#endif
}

#ifdef _WIN32
void client_thread(void *arg) {
#else
void *client_thread(void *arg) {
#endif
    int client_socket = *(int *)arg;
    free(arg);

    char buffer[BUFFER_SIZE];
    char message_buffer[BUFFER_SIZE];
    int message_len = 0;
    int received_any_data = 0;

    while (1) {
        int bytes = recv(client_socket, buffer, BUFFER_SIZE - 1, 0);
        if (bytes <= 0) {
            // Only log disconnection if we actually had a real conversation
            if (received_any_data) {
                remove_peer(client_socket);
            } else {
                // Silent cleanup for health-check pings
                int index = find_peer_by_socket(client_socket);
                if (index != -1) {
                    close(peers[index].socket);
                    peers[index].active = 0;
                    peer_count--;
                }
            }
            break;
        }

        if (!received_any_data) {
            received_any_data = 1;
            int index = find_peer_by_socket(client_socket);
            if (index != -1) {
                char msg[100];
                sprintf(msg, "Connection established with Peer %d", peers[index].port);
                log_network_event(msg);
                printf("[NETWORK] Connection verified with Peer (Port %d)\n", peers[index].port);
            }
        }

        buffer[bytes] = '\0';
        for (int i = 0; i < bytes; i++) {
            if (message_len < BUFFER_SIZE - 1) {
                message_buffer[message_len++] = buffer[i];
            }
            if (buffer[i] == '\n' || strstr(message_buffer, "~END_BLOCK~")) {
                message_buffer[message_len] = '\0';
                handle_message(client_socket, message_buffer);
                message_len = 0;
                memset(message_buffer, 0, BUFFER_SIZE);
            }
        }
    }
#ifndef _WIN32
    return NULL;
#endif
}

void start_server(int port) {
    int server_fd;
    struct sockaddr_in address, client_addr;

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1) {
        printf("[NETWORK] Failed to create server socket.\n");
        return;
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt));

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        printf("[NETWORK] Failed to bind to port %d.\n", port);
        return;
    }

    listen(server_fd, 10);
    printf("[NETWORK] Node is now LIVE and listening on Port %d\n", port);

    while (1) {
        socklen_t addrlen = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr *)&client_addr, &addrlen);
        if (client_fd < 0) continue;

        for (int i = 0; i < MAX_PEERS; i++) {
            if (!peers[i].active) {
                peers[i].socket = client_fd;
                peers[i].port = ntohs(client_addr.sin_port);
                peers[i].active = 1;
                peer_count++;
                
                // We don't print "Accepted" here yet to keep health-pings silent
                
                int *socket_ptr = malloc(sizeof(int));
                *socket_ptr = client_fd;
#ifdef _WIN32
                _beginthread(client_thread, 0, socket_ptr);
#else
                pthread_t tid;
                pthread_create(&tid, NULL, client_thread, socket_ptr);
                pthread_detach(tid);
#endif
                break;
            }
        }
    }
}

void connect_to_peer(const char *ip, int port) {
    if (find_peer_by_port(port) != -1) {
        // Already connected (likely from their side first)
        return;
    }

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return;

    struct sockaddr_in serv_addr;
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(port);
    serv_addr.sin_addr.s_addr = inet_addr(ip);

    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        printf("[NETWORK] Failed to connect to Peer %d (Connection Refused)\n", port);
        close(sock);
        return;
    }

    for (int i = 0; i < MAX_PEERS; i++) {
        if (!peers[i].active) {
            peers[i].socket = sock;
            peers[i].port = port;
            peers[i].active = 1;
            peer_count++;
            printf("[NETWORK] Outbound connection successful to Peer %d\n", port);
            
            int *socket_ptr = malloc(sizeof(int));
            *socket_ptr = sock;

            // Send handshake
            extern int global_node_port;
            char handshake[32];
            snprintf(handshake, sizeof(handshake), "MY_PORT:%d\n", global_node_port);
            send(sock, handshake, (int)strlen(handshake), 0);

#ifdef _WIN32
            _beginthread(client_thread, 0, socket_ptr);
#else
            pthread_t tid;
            pthread_create(&tid, NULL, client_thread, socket_ptr);
            pthread_detach(tid);
#endif
            break;
        }
    }
}

void broadcast_message(const char *message) {
    char msg_with_newline[BUFFER_SIZE + 2];
    snprintf(msg_with_newline, sizeof(msg_with_newline), "%s\n", message);
    
    for (int i = 0; i < MAX_PEERS; i++) {
        if (peers[i].active) {
            send(peers[i].socket, msg_with_newline, strlen(msg_with_newline), 0);
        }
    }
}

int get_peer_count() {
    return peer_count;
}
