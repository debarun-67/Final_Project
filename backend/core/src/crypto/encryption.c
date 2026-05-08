#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/err.h>

#include "encryption.h"

#define SALT_SIZE 16
#define PBKDF2_ITERATIONS 100000

// Helper to derive key from password
static int derive_key(const char *password, const unsigned char *salt, unsigned char *key) {
    return PKCS5_PBKDF2_HMAC(password, strlen(password), salt, SALT_SIZE, 
                             PBKDF2_ITERATIONS, EVP_sha256(), AES_KEY_SIZE, key);
}

int encrypt_record_file(const char *input_path, const char *output_path, const char *password) {
    FILE *ifp = fopen(input_path, "rb");
    if (!ifp) return 0;

    FILE *ofp = fopen(output_path, "wb");
    if (!ofp) {
        fclose(ifp);
        return 0;
    }

    unsigned char salt[SALT_SIZE];
    unsigned char iv[AES_IV_SIZE];
    unsigned char key[AES_KEY_SIZE];
    unsigned char tag[AES_TAG_SIZE];

    // Generate random salt and IV
    RAND_bytes(salt, SALT_SIZE);
    RAND_bytes(iv, AES_IV_SIZE);

    // Derive key
    if (!derive_key(password, salt, key)) {
        fclose(ifp); fclose(ofp);
        return 0;
    }

    // Write salt and IV to output file
    fwrite(salt, 1, SALT_SIZE, ofp);
    fwrite(iv, 1, AES_IV_SIZE, ofp);

    // Placeholder for tag - will seek back later
    long tag_pos = ftell(ofp);
    fwrite(tag, 1, AES_TAG_SIZE, ofp);

    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, AES_IV_SIZE, NULL);
    EVP_EncryptInit_ex(ctx, NULL, NULL, key, iv);

    unsigned char in_buf[4096];
    unsigned char out_buf[4096 + EVP_MAX_BLOCK_LENGTH];
    int in_len, out_len;

    while ((in_len = fread(in_buf, 1, sizeof(in_buf), ifp)) > 0) {
        if (!EVP_EncryptUpdate(ctx, out_buf, &out_len, in_buf, in_len)) {
            EVP_CIPHER_CTX_free(ctx);
            fclose(ifp); fclose(ofp);
            return 0;
        }
        fwrite(out_buf, 1, out_len, ofp);
    }

    if (!EVP_EncryptFinal_ex(ctx, out_buf, &out_len)) {
        EVP_CIPHER_CTX_free(ctx);
        fclose(ifp); fclose(ofp);
        return 0;
    }
    fwrite(out_buf, 1, out_len, ofp);

    // Get tag
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, AES_TAG_SIZE, tag);
    EVP_CIPHER_CTX_free(ctx);

    // Seek back and write tag
    fseek(ofp, tag_pos, SEEK_SET);
    fwrite(tag, 1, AES_TAG_SIZE, ofp);

    fclose(ifp);
    fclose(ofp);
    return 1;
}

int decrypt_record_file(const char *input_path, const char *output_path, const char *password) {
    FILE *ifp = fopen(input_path, "rb");
    if (!ifp) return 0;

    FILE *ofp = fopen(output_path, "wb");
    if (!ofp) {
        fclose(ifp);
        return 0;
    }

    unsigned char salt[SALT_SIZE];
    unsigned char iv[AES_IV_SIZE];
    unsigned char key[AES_KEY_SIZE];
    unsigned char tag[AES_TAG_SIZE];

    // Read salt, IV, and tag
    if (fread(salt, 1, SALT_SIZE, ifp) != SALT_SIZE ||
        fread(iv, 1, AES_IV_SIZE, ifp) != AES_IV_SIZE ||
        fread(tag, 1, AES_TAG_SIZE, ifp) != AES_TAG_SIZE) {
        fclose(ifp); fclose(ofp);
        return 0;
    }

    // Derive key
    if (!derive_key(password, salt, key)) {
        fclose(ifp); fclose(ofp);
        return 0;
    }

    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, AES_IV_SIZE, NULL);
    EVP_DecryptInit_ex(ctx, NULL, NULL, key, iv);

    unsigned char in_buf[4096];
    unsigned char out_buf[4096 + EVP_MAX_BLOCK_LENGTH];
    int in_len, out_len;

    while ((in_len = fread(in_buf, 1, sizeof(in_buf), ifp)) > 0) {
        if (!EVP_DecryptUpdate(ctx, out_buf, &out_len, in_buf, in_len)) {
            EVP_CIPHER_CTX_free(ctx);
            fclose(ifp); fclose(ofp);
            return 0;
        }
        fwrite(out_buf, 1, out_len, ofp);
    }

    // Set expected tag
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, AES_TAG_SIZE, tag);

    // Finalize - this checks the tag authenticity
    if (EVP_DecryptFinal_ex(ctx, out_buf, &out_len) <= 0) {
        printf("[DECRYPT] Authentication failed! The file may have been tampered with.\n");
        EVP_CIPHER_CTX_free(ctx);
        fclose(ifp); fclose(ofp);
        remove(output_path); // Delete failed decryption attempt
        return 0;
    }
    fwrite(out_buf, 1, out_len, ofp);

    EVP_CIPHER_CTX_free(ctx);
    fclose(ifp);
    fclose(ofp);
    return 1;
}
