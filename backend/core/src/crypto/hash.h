#ifndef HASH_H
#define HASH_H

void sha256(const char *input, char output[65]);
int hash_file_content(const char *filename, char *output_hash);

#endif
