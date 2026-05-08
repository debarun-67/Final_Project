#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <pthread.h>
#include <sys/socket.h>
#include <time.h>

#include "protocol.h"
#include "node.h"

Peer peers[MAX_PEERS];
int peer_count = 0;
pthread_mutex_t peer_lock = PTHREAD_MUTEX_INITIALIZER;
static SSL_CTX *ssl_ctx = NULL;

void initialize_network(int port) {
    SSL_library_init();
    SSL_load_error_strings();
    OpenSSL_add_all_algorithms();

    ssl_ctx = SSL_CTX_new(TLS_method());
    if (!ssl_ctx) {
        printf("[SSL] Failed to create SSL context.\n");
        exit(EXIT_FAILURE);
    }

    // Load certificates based on port
    char cert_path[128], key_path[128];
    snprintf(cert_path, sizeof(cert_path), "keys/%d.crt", port);
    snprintf(key_path, sizeof(key_path), "keys/%d.key", port);

    if (SSL_CTX_use_certificate_file(ssl_ctx, cert_path, SSL_FILETYPE_PEM) <= 0 ||
        SSL_CTX_use_PrivateKey_file(ssl_ctx, key_path, SSL_FILETYPE_PEM) <= 0) {
        printf("[SSL] Failed to load certificates for port %d. Please ensure %s and %s exist.\n", port, cert_path, key_path);
        // For testing, we might want to continue without SSL, but the plan says SSL integration.
        // I will exit for now to ensure security isn't bypassed silently.
        exit(EXIT_FAILURE);
    }
}

// get peer index from socket
int find_peer_by_socket(int socket)
{
    for (int i = 0; i < MAX_PEERS; i++)
    {
        if (peers[i].active && peers[i].socket == socket)
            return i;
    }
    return -1;
}

// disconnect and remove peer
void remove_peer(int socket)
{
    pthread_mutex_lock(&peer_lock);

    int index = find_peer_by_socket(socket);
    if (index != -1)
    {
        printf("[NETWORK] Peer %d disconnected.\n", peers[index].port);

        if (peers[index].ssl) {
            SSL_shutdown(peers[index].ssl);
            SSL_free(peers[index].ssl);
            peers[index].ssl = NULL;
        }
        close(peers[index].socket);
        peers[index].active = 0;
        peer_count--;
    }

    pthread_mutex_unlock(&peer_lock);
}

// update peer timestamp
void update_peer_last_seen(int socket)
{
    pthread_mutex_lock(&peer_lock);

    int index = find_peer_by_socket(socket);
    if (index != -1)
    {
        peers[index].last_seen = time(NULL);
    }

    pthread_mutex_unlock(&peer_lock);
}

// process incoming message with rate limiting
void handle_message(int client_socket, const char *message)
{
    pthread_mutex_lock(&peer_lock);
    int index = find_peer_by_socket(client_socket);
    if (index != -1)
    {
        time_t now = time(NULL);
        // Reset counter every second
        if (now > peers[index].last_reset)
        {
            peers[index].message_count = 0;
            peers[index].last_reset = now;
        }

        peers[index].message_count++;
        peers[index].last_seen = now;

        if (peers[index].message_count > MAX_MSG_PER_SEC)
        {
            printf("[SECURITY] Rate limit exceeded by peer %d. Disconnecting...\n", peers[index].port);
            pthread_mutex_unlock(&peer_lock);
            remove_peer(client_socket);
            return;
        }
    }
    pthread_mutex_unlock(&peer_lock);

    protocol_dispatch(client_socket, message);
}

// handle client connection
void *client_thread(void *arg)
{
    int client_socket = *(int *)arg;
    free(arg);

    pthread_mutex_lock(&peer_lock);
    int index = find_peer_by_socket(client_socket);
    SSL *ssl = (index != -1) ? peers[index].ssl : NULL;
    pthread_mutex_unlock(&peer_lock);

    if (!ssl) {
        close(client_socket);
        return NULL;
    }

    char buffer[BUFFER_SIZE];
    char message_buffer[BUFFER_SIZE];
    int message_len = 0;

    memset(message_buffer, 0, BUFFER_SIZE);

    while (1)
    {
        int bytes = SSL_read(ssl, buffer, BUFFER_SIZE - 1);

        // connection lost
        if (bytes <= 0)
        {
            int err = SSL_get_error(ssl, bytes);
            if (err == SSL_ERROR_ZERO_RETURN)
            {
                printf("[NETWORK] Peer connection closed gracefully.\n");
            }
            else
            {
                printf("[NETWORK] SSL receive error: %d\n", err);
            }

            remove_peer(client_socket);
            break;
        }

        buffer[bytes] = '\0';
        
        // ... (rest of message parsing)

        for (int i = 0; i < bytes; i++)
        {
            if (message_len < BUFFER_SIZE - 1)
            {
                message_buffer[message_len++] = buffer[i];
            }

            message_buffer[message_len] = '\0';

            // block transmission complete
            if (strstr(message_buffer, "~END_BLOCK~") != NULL)
            {
                handle_message(client_socket, message_buffer);
                message_len = 0;
                memset(message_buffer, 0, BUFFER_SIZE);
                continue;
            }

            // single line message
            if (buffer[i] == '\n')
            {
                handle_message(client_socket, message_buffer);
                message_len = 0;
                memset(message_buffer, 0, BUFFER_SIZE);
            }
        }
    }

    return NULL;
}

// start listening for peers
void start_server(int port)
{
    int server_fd;
    struct sockaddr_in address, client_addr;

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0)
    {
        printf("[NETWORK] Failed to create server socket.\n");
        exit(EXIT_FAILURE);
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0)
    {
        printf("[NETWORK] Failed to bind to port %d.\n", port);
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 10) < 0)
    {
        printf("[NETWORK] Failed to start listening on port %d.\n", port);
        exit(EXIT_FAILURE);
    }

    printf("[NETWORK] Node listening on port %d\n", port);

    while (1)
    {
        int *client_socket = malloc(sizeof(int));
        socklen_t addrlen = sizeof(client_addr);

        *client_socket = accept(server_fd,
                                (struct sockaddr *)&client_addr,
                                &addrlen);

        if (*client_socket < 0)
        {
            free(client_socket);
            continue;
        }

        SSL *ssl = SSL_new(ssl_ctx);
        SSL_set_fd(ssl, *client_socket);

        if (SSL_accept(ssl) <= 0) {
            printf("[SSL] Failed to accept SSL connection.\n");
            ERR_print_errors_fp(stdout);
            close(*client_socket);
            SSL_free(ssl);
            free(client_socket);
            continue;
        }

        pthread_mutex_lock(&peer_lock);

        for (int i = 0; i < MAX_PEERS; i++)
        {
            if (!peers[i].active)
            {
                peers[i].socket = *client_socket;
                peers[i].ssl = ssl;
                peers[i].port = ntohs(client_addr.sin_port);
                peers[i].last_seen = time(NULL);
                peers[i].active = 1;
                peers[i].message_count = 0;
                peers[i].last_reset = time(NULL);
                peer_count++;

                printf("[NETWORK] Inbound connection accepted (remote port %d)\n",
                       peers[i].port);

                break;
            }
        }

        pthread_mutex_unlock(&peer_lock);

        pthread_t thread_id;
        pthread_create(&thread_id, NULL, client_thread, client_socket);
        pthread_detach(thread_id);
    }
}

// connect to a remote peer
void connect_to_peer(const char *ip, int port)
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
        return;

    struct sockaddr_in serv_addr;
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(port);

    if (inet_pton(AF_INET, ip, &serv_addr.sin_addr) <= 0)
    {
        close(sock);
        return;
    }

    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0)
    {
        close(sock);
        return;
    }

    SSL *ssl = SSL_new(ssl_ctx);
    SSL_set_fd(ssl, sock);

    if (SSL_connect(ssl) <= 0) {
        printf("[SSL] Failed to establish SSL connection to peer %d.\n", port);
        ERR_print_errors_fp(stdout);
        SSL_free(ssl);
        close(sock);
        return;
    }

    pthread_mutex_lock(&peer_lock);

    for (int i = 0; i < MAX_PEERS; i++)
    {
        if (!peers[i].active)
        {
            peers[i].socket = sock;
            peers[i].ssl = ssl;
            peers[i].port = port;
            peers[i].last_seen = time(NULL);
            peers[i].active = 1;
            peers[i].message_count = 0;
            peers[i].last_reset = time(NULL);
            peer_count++;
            break;
        }
    }

    pthread_mutex_unlock(&peer_lock);

    printf("[NETWORK] Outbound connection established to peer %d\n", port);

    pthread_t thread_id;
    int *socket_ptr = malloc(sizeof(int));
    *socket_ptr = sock;
    pthread_create(&thread_id, NULL, client_thread, socket_ptr);
    pthread_detach(thread_id);
}

// send message to all peers
void broadcast_message(const char *message)
{
    pthread_mutex_lock(&peer_lock);

    for (int i = 0; i < MAX_PEERS; i++)
    {
        if (peers[i].active && peers[i].ssl)
        {
            SSL_write(peers[i].ssl, message, strlen(message));
        }
    }

    pthread_mutex_unlock(&peer_lock);
}

// active peer count
int get_peer_count()
{
    pthread_mutex_lock(&peer_lock);
    int count = peer_count;
    pthread_mutex_unlock(&peer_lock);
    return count;
}
