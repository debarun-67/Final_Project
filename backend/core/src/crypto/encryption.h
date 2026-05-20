#ifndef ENCRYPTION_H
#define ENCRYPTION_H

/**
 * Encrypts a file using Mock Envelope Encryption (Zero Dependency).
 * Generates a random file key, encrypts it for both Patient and Doctor,
 * and then encrypts the file data using the file key.
 *
 * @param input_path Path to the plaintext file.
 * @param output_path Path to save the encrypted file.
 * @param patient_key The patient's "public key" (or identifier).
 * @param doctor_key The doctor's "public key" (or identifier).
 * @return 1 on success, 0 on failure.
 */
int envelope_encrypt_record(const char *input_path, const char *output_path, const char *patient_key, const char *doctor_key);

/**
 * Decrypts a file using Mock Envelope Encryption.
 * Uses the provided user_key to attempt to unlock the file key from the envelope,
 * then decrypts the payload.
 *
 * @param input_path Path to the encrypted (.enc) file.
 * @param output_path Path to save the decrypted file.
 * @param user_key The user's (patient or doctor) "private key" to unlock the file.
 * @return 1 on success, 0 on failure.
 */
int envelope_decrypt_record(const char *input_path, const char *output_path, const char *user_key);

#endif
