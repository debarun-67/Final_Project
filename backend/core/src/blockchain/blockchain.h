#ifndef BLOCKCHAIN_H
#define BLOCKCHAIN_H

#include "block.h"

void initialize_blockchain();
void create_genesis_block(Block *block, int validator_port);
void add_block(Block *new_block);
int verify_block(Block *block);
int get_last_block(Block *last_block);
int verify_blockchain();
int get_last_block_hash(char *output_hash);
int get_blockchain_height();
int get_block_by_index(int index, Block *block);
void set_blockchain_file(const char *filename);
int block_exists_by_index(int index);
int transaction_hash_exists(const char *data_hash);
int find_transaction_location(const char *data_hash, int *block_index, int *tx_index);

// Secondary index queries (Semester 8)
void get_records_by_patient(const char *patient_id);
void get_records_by_doctor(const char *doctor_id);



#endif
