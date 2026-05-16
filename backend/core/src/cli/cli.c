#include <stdio.h>
#include <string.h>
#include <time.h>
#include "../blockchain/blockchain.h"
#include "../crypto/hash.h"
#include "../crypto/signature.h"

int main() {
    const int validator_port = 8001;

    Block genesis;
    create_genesis_block(&genesis, validator_port);
    add_block(&genesis);

    printf("Genesis block created.\n");

    Block block;
    init_block(&block, 1, genesis.block_hash);

    Transaction tx;
    strcpy(tx.patient_id, "PATIENT123");
    strcpy(tx.doctor_id, "DOCTOR01");
    strcpy(tx.data_pointer, "file://offchain/storage/record1.enc");
    sha256("encrypted_record_content", tx.data_hash);
    tx.timestamp = time(NULL);

    block.transactions[0] = tx;
    block.transaction_count = 1;
    block.validator_port = validator_port;

    calculate_block_hash(&block);

    if (!sign_data(block.block_hash, "keys/8001_private.pem", block.validator_signature)) {
        printf("Block signing failed.\n");
        return 1;
    }
    add_block(&block);

    printf("Block added.\n");

    if (verify_blockchain())
        printf("Blockchain verified successfully.\n");
    else
        printf("Blockchain verification failed.\n");

    return 0;
}
