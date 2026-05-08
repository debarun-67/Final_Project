#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/evp.h>

#include "hash.h"

void sha256(const char *input, char *output)
{
    EVP_MD_CTX *mdctx;
    const EVP_MD *md;
    unsigned char md_value[EVP_MAX_MD_SIZE];
    unsigned int md_len;

    md = EVP_sha256();
    mdctx = EVP_MD_CTX_new();
    EVP_DigestInit_ex(mdctx, md, NULL);
    EVP_DigestUpdate(mdctx, input, strlen(input));
    EVP_DigestFinal_ex(mdctx, md_value, &md_len);
    EVP_MD_CTX_free(mdctx);

    for (unsigned int i = 0; i < md_len; i++)
        sprintf(output + (i * 2), "%02x", md_value[i]);

    output[md_len * 2] = '\0';
}

int hash_file_content(const char *filename, char *output_hash)
{
    FILE *fp = fopen(filename, "rb");
    if (!fp)
        return 0;

    EVP_MD_CTX *mdctx = EVP_MD_CTX_new();
    const EVP_MD *md = EVP_sha256();
    unsigned char md_value[EVP_MAX_MD_SIZE];
    unsigned int md_len;

    EVP_DigestInit_ex(mdctx, md, NULL);

    unsigned char buffer[4096];
    size_t bytes;
    while ((bytes = fread(buffer, 1, sizeof(buffer), fp)) != 0)
    {
        EVP_DigestUpdate(mdctx, buffer, bytes);
    }

    EVP_DigestFinal_ex(mdctx, md_value, &md_len);
    EVP_MD_CTX_free(mdctx);
    fclose(fp);

    for (unsigned int i = 0; i < md_len; i++)
        sprintf(output_hash + (i * 2), "%02x", md_value[i]);

    output_hash[md_len * 2] = '\0';
    return 1;
}

