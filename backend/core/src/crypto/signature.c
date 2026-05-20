#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "signature.h"

// Simplified "Mock" Signature Implementation for Demo
// This removes the OpenSSL dependency while still demonstrating the logic
int sign_data(const char *data, const char *private_key_path, char *signature_output) {
    // In a real system, this would use RSA/ECDSA. 
    // For this demo, we "sign" by combining the data hash with the key path string
    // to prove that the specific node's key was "accessed".
    
    FILE *fp = fopen(private_key_path, "r");
    if (!fp) {
        printf("DEBUG: Key not found at %s\n", private_key_path);
        return 0;
    }
    fclose(fp);

    // Mock signature: Just a "signed" prefix + data hash + first 8 chars of key path
    char mock_sig[256];
    snprintf(mock_sig, sizeof(mock_sig), "SIG_V1_%s_%s", data, private_key_path);
    
    // Copy to output (hex-like string)
    strncpy(signature_output, mock_sig, 255);
    signature_output[255] = '\0';
    
    return 1;
}

int verify_signature(const char *data, const char *public_key_path, const char *signature) {
    char expected_key_path[128];
    char expected_signature[256];

    strncpy(expected_key_path, public_key_path, sizeof(expected_key_path) - 1);
    expected_key_path[sizeof(expected_key_path) - 1] = '\0';

    char *suffix = strstr(expected_key_path, "_public.pem");
    if (!suffix)
        return 0;
    strcpy(suffix, "_private.pem");

    snprintf(expected_signature,
             sizeof(expected_signature),
             "SIG_V1_%s_%s",
             data,
             expected_key_path);

    return strcmp(signature, expected_signature) == 0;
}
