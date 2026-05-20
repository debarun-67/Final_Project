#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "encryption.h"

#define AES_KEY_SIZE 32
#define HEADER_MAGIC "ENV_V1"
#define MAGIC_LEN 6

// A simple XOR cipher to act as our "Mock AES" and "Mock RSA"
static void xor_crypt(const unsigned char *input, size_t input_len, 
                      const unsigned char *key, size_t key_len, 
                      unsigned char *output) {
    for (size_t i = 0; i < input_len; i++) {
        output[i] = input[i] ^ key[i % key_len];
    }
}

// Generate a mock random 32-byte AES key
static void generate_random_key(unsigned char *key, size_t size) {
    srand((unsigned int)time(NULL));
    for (size_t i = 0; i < size; i++) {
        key[i] = (unsigned char)(rand() % 256);
    }
}

int envelope_encrypt_record(const char *input_path, const char *output_path, const char *patient_key, const char *doctor_key) {
    FILE *ifp = fopen(input_path, "rb");
    if (!ifp) return 0;

    FILE *ofp = fopen(output_path, "wb");
    if (!ofp) {
        fclose(ifp);
        return 0;
    }

    // 1. Generate random 32-byte file key (Mock AES Key)
    unsigned char file_key[AES_KEY_SIZE];
    generate_random_key(file_key, AES_KEY_SIZE);

    // 2. Encrypt the file key for the Patient (Mock RSA)
    unsigned char patient_encrypted_key[AES_KEY_SIZE];
    xor_crypt(file_key, AES_KEY_SIZE, (const unsigned char*)patient_key, strlen(patient_key), patient_encrypted_key);

    // 3. Encrypt the file key for the Doctor (Mock RSA)
    unsigned char doctor_encrypted_key[AES_KEY_SIZE];
    xor_crypt(file_key, AES_KEY_SIZE, (const unsigned char*)doctor_key, strlen(doctor_key), doctor_encrypted_key);

    // 4. Write Envelope Header
    fwrite(HEADER_MAGIC, 1, MAGIC_LEN, ofp);
    
    // Write lengths of keys for dynamic reading
    int p_len = strlen(patient_key);
    int d_len = strlen(doctor_key);
    fwrite(&p_len, sizeof(int), 1, ofp);
    fwrite(patient_key, 1, p_len, ofp); // Save identity (public key) in plaintext to know which slot belongs to whom
    fwrite(patient_encrypted_key, 1, AES_KEY_SIZE, ofp);

    fwrite(&d_len, sizeof(int), 1, ofp);
    fwrite(doctor_key, 1, d_len, ofp); // Save identity
    fwrite(doctor_encrypted_key, 1, AES_KEY_SIZE, ofp);

    // 5. Encrypt data (Mock AES)
    unsigned char in_buf[4096];
    unsigned char out_buf[4096];
    size_t in_len;

    while ((in_len = fread(in_buf, 1, sizeof(in_buf), ifp)) > 0) {
        xor_crypt(in_buf, in_len, file_key, AES_KEY_SIZE, out_buf);
        fwrite(out_buf, 1, in_len, ofp);
    }

    fclose(ifp);
    fclose(ofp);
    return 1;
}

int envelope_decrypt_record(const char *input_path, const char *output_path, const char *user_key) {
    FILE *ifp = fopen(input_path, "rb");
    if (!ifp) return 0;

    FILE *ofp = fopen(output_path, "wb");
    if (!ofp) {
        fclose(ifp);
        return 0;
    }

    // Read Magic
    char magic[MAGIC_LEN];
    if (fread(magic, 1, MAGIC_LEN, ifp) != MAGIC_LEN || memcmp(magic, HEADER_MAGIC, MAGIC_LEN) != 0) {
        printf("[DECRYPT] Not a valid Envelope file!\n");
        fclose(ifp); fclose(ofp);
        remove(output_path);
        return 0; 
    }

    // Read Patient Slot
    int p_len;
    fread(&p_len, sizeof(int), 1, ifp);
    char p_id[256] = {0};
    fread(p_id, 1, p_len, ifp);
    unsigned char p_enc_key[AES_KEY_SIZE];
    fread(p_enc_key, 1, AES_KEY_SIZE, ifp);

    // Read Doctor Slot
    int d_len;
    fread(&d_len, sizeof(int), 1, ifp);
    char d_id[256] = {0};
    fread(d_id, 1, d_len, ifp);
    unsigned char d_enc_key[AES_KEY_SIZE];
    fread(d_enc_key, 1, AES_KEY_SIZE, ifp);

    unsigned char file_key[AES_KEY_SIZE];
    int key_found = 0;

    // Check if user_key matches patient identity
    if (strcmp(user_key, p_id) == 0) {
        // Unlock with Patient's key
        xor_crypt(p_enc_key, AES_KEY_SIZE, (const unsigned char*)user_key, strlen(user_key), file_key);
        key_found = 1;
    } 
    // Check if user_key matches doctor identity
    else if (strcmp(user_key, d_id) == 0) {
        // Unlock with Doctor's key
        xor_crypt(d_enc_key, AES_KEY_SIZE, (const unsigned char*)user_key, strlen(user_key), file_key);
        key_found = 1;
    }

    if (!key_found) {
        printf("[DECRYPT] Unauthorized! Access denied for user: %s\n", user_key);
        fclose(ifp); fclose(ofp);
        remove(output_path); // Delete empty file
        return 0;
    }

    // Decrypt data (Mock AES)
    unsigned char in_buf[4096];
    unsigned char out_buf[4096];
    size_t in_len;

    while ((in_len = fread(in_buf, 1, sizeof(in_buf), ifp)) > 0) {
        xor_crypt(in_buf, in_len, file_key, AES_KEY_SIZE, out_buf);
        fwrite(out_buf, 1, in_len, ofp);
    }

    fclose(ifp);
    fclose(ofp);
    return 1;
}
