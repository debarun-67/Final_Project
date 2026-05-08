#ifndef ENCRYPTION_H
#define ENCRYPTION_H

#define AES_KEY_SIZE 32
#define AES_IV_SIZE 12
#define AES_TAG_SIZE 16

/**
 * Encrypts a file using AES-256-GCM.
 * @param input_path Path to the plaintext file.
 * @param output_path Path to save the encrypted file.
 * @param password Password used to derive the key.
 * @return 1 on success, 0 on failure.
 */
int encrypt_record_file(const char *input_path, const char *output_path, const char *password);

/**
 * Decrypts a file using AES-256-GCM.
 * @param input_path Path to the encrypted (.enc) file.
 * @param output_path Path to save the decrypted file.
 * @param password Password used to derive the key.
 * @return 1 on success, 0 on failure.
 */
int decrypt_record_file(const char *input_path, const char *output_path, const char *password);

#endif
