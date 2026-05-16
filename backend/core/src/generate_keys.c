#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#ifdef _WIN32
#include <direct.h>
#endif

void ensure_keys_directory()
{
    struct stat st = {0};
    if (stat("keys", &st) == -1) {
#ifdef _WIN32
        _mkdir("keys");
#else
        mkdir("keys", 0700);
#endif
    }
}

int generate_keypair_for_port(int port)
{
    char private_path[64];
    char public_path[64];

    snprintf(private_path, sizeof(private_path),
             "keys/%d_private.pem", port);
    snprintf(public_path, sizeof(public_path),
             "keys/%d_public.pem", port);

    FILE *fp = fopen(private_path, "w");
    if (!fp)
    {
        printf("Cannot open private key file\n");
        return 0;
    }

    fprintf(fp, "DEMO_PRIVATE_KEY_FOR_PORT_%d\n", port);
    fclose(fp);

    fp = fopen(public_path, "w");
    if (!fp)
    {
        printf("Cannot open public key file\n");
        return 0;
    }

    fprintf(fp, "DEMO_PUBLIC_KEY_FOR_PORT_%d\n", port);
    fclose(fp);

    printf("Generated keys for port %d\n", port);
    return 1;
}

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        printf("Usage: %s <port1> <port2> ...\n", argv[0]);
        return 1;
    }

    ensure_keys_directory();

    for (int i = 1; i < argc; i++)
    {
        int port = atoi(argv[i]);
        if (port > 0)
            generate_keypair_for_port(port);
    }

    printf("Key generation complete.\n");
    return 0;
}
