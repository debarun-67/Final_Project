#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef _WIN32
#include <io.h>
#else
#include <unistd.h>
#endif

#include "blockchain.h"
#include "../crypto/hash.h"
#include "../crypto/signature.h"

// --- TRANSACTION INDEXING (HASH MAP) ---
typedef struct TxIndexNode {
    char data_hash[128];
    int block_index;
    int tx_index;
    struct TxIndexNode *next;
} TxIndexNode;

#define TX_HASH_BUCKETS 100007
static TxIndexNode *tx_index[TX_HASH_BUCKETS] = {NULL};
static int index_loaded = 0;
static char blockchain_file[128] = "data/blockchain.dat";

// --- SECONDARY INDEX: patient_id -> list of (block_index, tx_index) ---
typedef struct PatientIndexEntry {
    int block_index;
    int tx_index;
    struct PatientIndexEntry *next;
} PatientIndexEntry;

typedef struct PatientIndexNode {
    char patient_id[32];
    PatientIndexEntry *records;
    struct PatientIndexNode *next;
} PatientIndexNode;

#define PATIENT_BUCKETS 10007
static PatientIndexNode *patient_index[PATIENT_BUCKETS] = {NULL};

// --- SECONDARY INDEX: doctor_id -> list of (block_index, tx_index) ---
typedef struct DoctorIndexNode {
    char doctor_id[32];
    PatientIndexEntry *records; // reuse same entry struct
    struct DoctorIndexNode *next;
} DoctorIndexNode;

#define DOCTOR_BUCKETS 10007
static DoctorIndexNode *doctor_index[DOCTOR_BUCKETS] = {NULL};

// =============================================================
// BLOOM FILTER — O(1) RAM-efficient duplicate detection
// =============================================================
#define BLOOM_BITS     (10000000UL * 10)   // 10 bits per expected entry
#define BLOOM_BYTES    (BLOOM_BITS / 8)    // byte array size

static unsigned char bloom_filter[BLOOM_BYTES];
static int bloom_initialized = 0;

static unsigned long bloom_hash1(const char *s) {
    unsigned long h = 5381;
    int c;
    while ((c = (unsigned char)*s++))
        h = ((h << 5) + h) + c;
    return h % BLOOM_BITS;
}

static unsigned long bloom_hash2(const char *s) {
    unsigned long h = 31337;
    int c;
    while ((c = (unsigned char)*s++))
        h = ((h << 5) + h) ^ c;
    return h % BLOOM_BITS;
}

static unsigned long bloom_hash3(const char *s) {
    unsigned long h = 1000003;
    int c;
    while ((c = (unsigned char)*s++))
        h = (h ^ (h >> 4)) + c;
    return h % BLOOM_BITS;
}

static void bloom_add(const char *data_hash) {
    if (!bloom_initialized) {
        memset(bloom_filter, 0, BLOOM_BYTES);
        bloom_initialized = 1;
    }
    unsigned long b1 = bloom_hash1(data_hash);
    unsigned long b2 = bloom_hash2(data_hash);
    unsigned long b3 = bloom_hash3(data_hash);
    bloom_filter[b1 / 8] |= (1 << (b1 % 8));
    bloom_filter[b2 / 8] |= (1 << (b2 % 8));
    bloom_filter[b3 / 8] |= (1 << (b3 % 8));
}

static int bloom_check(const char *data_hash) {
    if (!bloom_initialized) return 0;
    unsigned long b1 = bloom_hash1(data_hash);
    unsigned long b2 = bloom_hash2(data_hash);
    unsigned long b3 = bloom_hash3(data_hash);
    return (bloom_filter[b1 / 8] & (1 << (b1 % 8))) &&
           (bloom_filter[b2 / 8] & (1 << (b2 % 8))) &&
           (bloom_filter[b3 / 8] & (1 << (b3 % 8)));
}

static unsigned int hash_str(const char *s, unsigned int buckets) {
    unsigned int h = 5381;
    int c;
    while ((c = *s++))
        h = ((h << 5) + h) + c;
    return h % buckets;
}

static unsigned int hash_tx(const char *hash) {
    return hash_str(hash, TX_HASH_BUCKETS);
}

static void add_to_index(const char *data_hash, int block_index, int transaction_index) {
    // Add to Bloom filter first
    bloom_add(data_hash);

    unsigned int h = hash_tx(data_hash);
    TxIndexNode *node = malloc(sizeof(TxIndexNode));
    if (node) {
        strncpy(node->data_hash, data_hash, sizeof(node->data_hash) - 1);
        node->data_hash[sizeof(node->data_hash) - 1] = '\0';
        node->block_index = block_index;
        node->tx_index = transaction_index;
        node->next = tx_index[h];
        tx_index[h] = node;
    }
}

static void add_to_patient_index(const char *patient_id, int block_index, int tx_index_val) {
    unsigned int h = hash_str(patient_id, PATIENT_BUCKETS);
    PatientIndexNode *pnode = patient_index[h];
    while (pnode) {
        if (strcmp(pnode->patient_id, patient_id) == 0) break;
        pnode = pnode->next;
    }
    if (!pnode) {
        pnode = malloc(sizeof(PatientIndexNode));
        if (!pnode) return;
        strncpy(pnode->patient_id, patient_id, sizeof(pnode->patient_id) - 1);
        pnode->patient_id[sizeof(pnode->patient_id) - 1] = '\0';
        pnode->records = NULL;
        pnode->next = patient_index[h];
        patient_index[h] = pnode;
    }
    PatientIndexEntry *entry = malloc(sizeof(PatientIndexEntry));
    if (!entry) return;
    entry->block_index = block_index;
    entry->tx_index    = tx_index_val;
    entry->next        = pnode->records;
    pnode->records     = entry;
}

static void add_to_doctor_index(const char *doctor_id, int block_index, int tx_index_val) {
    unsigned int h = hash_str(doctor_id, DOCTOR_BUCKETS);
    DoctorIndexNode *dnode = doctor_index[h];
    while (dnode) {
        if (strcmp(dnode->doctor_id, doctor_id) == 0) break;
        dnode = dnode->next;
    }
    if (!dnode) {
        dnode = malloc(sizeof(DoctorIndexNode));
        if (!dnode) return;
        strncpy(dnode->doctor_id, doctor_id, sizeof(dnode->doctor_id) - 1);
        dnode->doctor_id[sizeof(dnode->doctor_id) - 1] = '\0';
        dnode->records = NULL;
        dnode->next = doctor_index[h];
        doctor_index[h] = dnode;
    }
    PatientIndexEntry *entry = malloc(sizeof(PatientIndexEntry));
    if (!entry) return;
    entry->block_index = block_index;
    entry->tx_index    = tx_index_val;
    entry->next        = dnode->records;
    dnode->records     = entry;
}

static void clear_tx_index(void) {
    for (int i = 0; i < TX_HASH_BUCKETS; i++) {
        TxIndexNode *current = tx_index[i];
        while (current) {
            TxIndexNode *next = current->next;
            free(current);
            current = next;
        }
        tx_index[i] = NULL;
    }
    // Clear patient index
    for (int i = 0; i < PATIENT_BUCKETS; i++) {
        PatientIndexNode *pn = patient_index[i];
        while (pn) {
            PatientIndexEntry *e = pn->records;
            while (e) { PatientIndexEntry *ne = e->next; free(e); e = ne; }
            PatientIndexNode *npn = pn->next;
            free(pn);
            pn = npn;
        }
        patient_index[i] = NULL;
    }
    // Clear doctor index
    for (int i = 0; i < DOCTOR_BUCKETS; i++) {
        DoctorIndexNode *dn = doctor_index[i];
        while (dn) {
            PatientIndexEntry *e = dn->records;
            while (e) { PatientIndexEntry *ne = e->next; free(e); e = ne; }
            DoctorIndexNode *ndn = dn->next;
            free(dn);
            dn = ndn;
        }
        doctor_index[i] = NULL;
    }
    // Reset Bloom filter
    if (bloom_initialized) {
        memset(bloom_filter, 0, BLOOM_BYTES);
    }
}

static int transaction_hash_exists_outside_block(const char *data_hash, int block_index) {
    if (!index_loaded) initialize_blockchain();
    if (!bloom_check(data_hash)) return 0; // Bloom filter fast-path!

    unsigned int h = hash_tx(data_hash);
    TxIndexNode *current = tx_index[h];
    while (current) {
        if (strcmp(current->data_hash, data_hash) == 0) {
            if (current->block_index != block_index) {
                return 1;
            }
        }
        current = current->next;
    }
    return 0;
}
// ---------------------------------------

// mutex removed for zero-dependency demo

// set the blockchain file path
void set_blockchain_file(const char *filename)
{
    strncpy(blockchain_file, filename, sizeof(blockchain_file));
    blockchain_file[sizeof(blockchain_file) - 1] = '\0';
    clear_tx_index();
    index_loaded = 0; // Reset index if file changes
}

void initialize_blockchain() {
    if (index_loaded) {
        return;
    }

    FILE *fp = fopen(blockchain_file, "rb");
    if (!fp) {
        index_loaded = 1;
        return;
    }

    Block temp;
    while (fread(&temp, sizeof(Block), 1, fp) == 1) {
        for (int i = 0; i < temp.transaction_count; i++) {
            add_to_index(temp.transactions[i].data_hash, temp.index, i);
            add_to_patient_index(temp.transactions[i].patient_id, temp.index, i);
            add_to_doctor_index(temp.transactions[i].doctor_id, temp.index, i);
        }
    }

    fclose(fp);
    index_loaded = 1;
}

// create the first block (genesis)
void create_genesis_block(Block *block, int validator_port)
{
    memset(block, 0, sizeof(Block));

    block->index = 0;
    block->timestamp = 1737280140;
    block->validator_port = 8001; // UNIVERSAL GENESIS VALIDATOR

    strcpy(block->previous_hash, "0");

    block->transaction_count = 1;

    strcpy(block->transactions[0].patient_id, "GENESIS");
    strcpy(block->transactions[0].doctor_id, "NETWORK");

    const char *genesis_message =
        "The Fall of the star to the brink of an end from the loving pool";

    sha256(genesis_message,
           block->transactions[0].data_hash);

    strncpy(block->transactions[0].data_pointer,
            genesis_message,
            sizeof(block->transactions[0].data_pointer) - 1);

    block->transactions[0].timestamp = 1737280140;

    calculate_block_hash(block);

    char private_key_path[64];
    snprintf(private_key_path, sizeof(private_key_path), "keys/8001_private.pem");

    if (!sign_data(block->block_hash,
                   private_key_path,
                   block->validator_signature))
    {
        printf("[CRYPTO] Genesis signing failed.\n");
        exit(1);
    }

    printf("[BLOCKCHAIN] Genesis block created (node 8001)\n");
}

// append a block securely
void add_block(Block *new_block)
{
    if (!new_block ||
        new_block->index < 0 ||
        new_block->transaction_count < 0 ||
        new_block->transaction_count > MAX_TRANSACTIONS)
    {
        printf("[STORAGE] Refusing to append invalid block metadata.\n");
        return;
    }

    FILE *fp = fopen(blockchain_file, "ab");
    if (!fp)
    {
        printf("[STORAGE] Failed to open blockchain file.\n");
        return;
    }

    fwrite(new_block, sizeof(Block), 1, fp);
    fflush(fp);

    // Explicit disk sync for durability
#ifdef _WIN32
    _commit(_fileno(fp));
#else
    fsync(fileno(fp));
#endif

    fclose(fp);

    // Update index
    for (int i = 0; i < new_block->transaction_count; i++) {
        add_to_index(new_block->transactions[i].data_hash, new_block->index, i);
        add_to_patient_index(new_block->transactions[i].patient_id, new_block->index, i);
        add_to_doctor_index(new_block->transactions[i].doctor_id, new_block->index, i);
    }

}

// validate a single block
int verify_block(Block *block) {
    char original_hash[HASH_SIZE];
    strcpy(original_hash, block->block_hash);

    // 1. Recompute Hash
    calculate_block_hash(block);
    if (strcmp(original_hash, block->block_hash) != 0) {
        printf("[CRYPTO] Block hash mismatch!\n");
        return 0;
    }

    // 2. Verify Signature
    char public_key_path[64];
    snprintf(public_key_path, sizeof(public_key_path), "keys/%d_public.pem", block->validator_port);
    
    if (!verify_signature(original_hash, public_key_path, block->validator_signature)) {
        printf("[CRYPTO] Signature validation failed for node %d\n", block->validator_port);
        return 0;
    }

    // 3. Verify Linkage (if not genesis)
    if (block->index > 0) {
        Block last;
        if (get_last_block(&last)) {
            if (strcmp(block->previous_hash, last.block_hash) != 0) {
                printf("[CRYPTO] Linkage failed! Block %d points to wrong previous hash.\n", block->index);
                return 0;
            }
        }
    }

    // 4. Check for duplicate transactions within the block and existing chain.
    for (int i = 0; i < block->transaction_count; i++) {
        for (int j = i + 1; j < block->transaction_count; j++) {
            if (strcmp(block->transactions[i].data_hash, block->transactions[j].data_hash) == 0) {
                printf("[SECURITY] DUPLICATE TRANSACTION DETECTED inside block %d: Hash %s.\n",
                       block->index,
                       block->transactions[i].data_hash);
                return 0;
            }
        }

        if (transaction_hash_exists_outside_block(block->transactions[i].data_hash, block->index)) {
            printf("[SECURITY] DUPLICATE TRANSACTION DETECTED: Hash %s already on chain.\n", 
                   block->transactions[i].data_hash);
            return 0;
        }
    }

    return 1;
}

// retrieve the last block locally
int get_last_block(Block *last_block)
{

    FILE *fp = fopen(blockchain_file, "rb");
    if (!fp)
    {
        return 0;
    }

    Block temp;
    int found = 0;

    while (fread(&temp, sizeof(Block), 1, fp) == 1)
    {
        *last_block = temp;
        found = 1;
    }

    fclose(fp);

    return found;
}

// get latest block hash
int get_last_block_hash(char *output_hash)
{
    Block last_block;

    if (!get_last_block(&last_block))
        return 0;

    strcpy(output_hash, last_block.block_hash);
    return 1;
}

// validate the entire chain
int verify_blockchain()
{

    FILE *fp = fopen(blockchain_file, "rb");
    if (!fp)
    {
        return 0;
    }

    Block prev, curr;

    if (fread(&prev, sizeof(Block), 1, fp) != 1)
    {
        fclose(fp);
        return 0;
    }

    char stored_hash[HASH_SIZE];
    strcpy(stored_hash, prev.block_hash);

    calculate_block_hash(&prev);

    if (strcmp(stored_hash, prev.block_hash) != 0)
    {
        printf("[BLOCKCHAIN] Genesis hash validation failed.\n");
        fclose(fp);
        return 0;
    }

    char public_key_path[64];
    snprintf(public_key_path, sizeof(public_key_path),
             "keys/%d_public.pem", prev.validator_port);

    if (!verify_signature(stored_hash,
                          public_key_path,
                          prev.validator_signature))
    {
        printf("[CRYPTO] Genesis signature validation failed.\n");
        fclose(fp);
        return 0;
    }

    strcpy(stored_hash, prev.block_hash);

    while (fread(&curr, sizeof(Block), 1, fp) == 1)
    {
        if (strcmp(curr.previous_hash, stored_hash) != 0)
        {
            printf("[BLOCKCHAIN] Previous hash mismatch at block %d.\n",
                   curr.index);
            fclose(fp);
            return 0;
        }

        char original_hash[HASH_SIZE];
        strcpy(original_hash, curr.block_hash);

        calculate_block_hash(&curr);

        if (strcmp(original_hash, curr.block_hash) != 0)
        {
            printf("[BLOCKCHAIN] Hash validation failed at block %d.\n",
                   curr.index);
            fclose(fp);
            return 0;
        }

        snprintf(public_key_path, sizeof(public_key_path),
                 "keys/%d_public.pem", curr.validator_port);

        if (!verify_signature(original_hash,
                              public_key_path,
                              curr.validator_signature))
        {
            printf("[CRYPTO] Signature validation failed at block %d.\n",
                   curr.index);
            fclose(fp);
            return 0;
        }

        strcpy(stored_hash, original_hash);
        prev = curr;
    }

    fclose(fp);

    return 1;
}

// get chain length
int get_blockchain_height()
{

    FILE *fp = fopen(blockchain_file, "rb");
    if (!fp)
    {
        return 0;
    }

    int count = 0;
    Block temp;

    while (fread(&temp, sizeof(Block), 1, fp) == 1)
        count++;

    fclose(fp);

    return count;
}

// find block by index
int get_block_by_index(int index, Block *block)
{

    FILE *fp = fopen(blockchain_file, "rb");
    if (!fp)
    {
        return 0;
    }

    Block temp;

    while (fread(&temp, sizeof(Block), 1, fp) == 1)
    {
        if (temp.index == index)
        {
            *block = temp;
            fclose(fp);
            return 1;
        }
    }

    fclose(fp);

    return 0;
}

// check if block exists
int block_exists_by_index(int index)
{

    FILE *fp = fopen(blockchain_file, "rb");
    if (!fp)
    {
        return 0;
    }

    Block temp;

    while (fread(&temp, sizeof(Block), 1, fp) == 1)
    {
        if (temp.index == index)
        {
            fclose(fp);
            return 1;
        }
    }

    fclose(fp);

    return 0;
}

// checking for duplicate transactions using indexed hash map
int transaction_hash_exists(const char *data_hash)
{
    if (!index_loaded) initialize_blockchain();
    if (!bloom_check(data_hash)) return 0; // Bloom filter fast-path!

    unsigned int h = hash_tx(data_hash);
    TxIndexNode *current = tx_index[h];
    
    while (current) {
        if (strcmp(current->data_hash, data_hash) == 0) {
            return 1;
        }
        current = current->next;
    }

    return 0;
}

int find_transaction_location(const char *data_hash, int *block_index, int *transaction_index)
{
    if (!index_loaded) initialize_blockchain();
    if (!bloom_check(data_hash)) return 0; // Bloom filter fast-path!

    unsigned int h = hash_tx(data_hash);
    TxIndexNode *current = tx_index[h];

    while (current) {
        if (strcmp(current->data_hash, data_hash) == 0) {
            if (block_index) *block_index = current->block_index;
            if (transaction_index) *transaction_index = current->tx_index;
            return 1;
        }
        current = current->next;
    }

    return 0;
}

void get_records_by_patient(const char *patient_id) {
    if (!index_loaded) initialize_blockchain();
    unsigned int h = hash_str(patient_id, PATIENT_BUCKETS);
    PatientIndexNode *pnode = patient_index[h];
    while (pnode) {
        if (strcmp(pnode->patient_id, patient_id) == 0) {
            printf("[QUERY] Records for Patient '%s':\n", patient_id);
            PatientIndexEntry *e = pnode->records;
            int count = 0;
            while (e) {
                Block blk;
                if (get_block_by_index(e->block_index, &blk)) {
                    Transaction *tx = &blk.transactions[e->tx_index];
                    printf("  [%d] Block %-3d | Doctor: %-12s | Hash: %.24s... | File: %s\n",
                           ++count, e->block_index, tx->doctor_id, tx->data_hash, tx->data_pointer);
                }
                e = e->next;
            }
            if (count == 0) printf("  (no records found)\n");
            printf("[QUERY] Total: %d record(s) found.\n", count);
            return;
        }
        pnode = pnode->next;
    }
    printf("[QUERY] No records found for Patient '%s'.\n", patient_id);
}

void get_records_by_doctor(const char *doctor_id) {
    if (!index_loaded) initialize_blockchain();
    unsigned int h = hash_str(doctor_id, DOCTOR_BUCKETS);
    DoctorIndexNode *dnode = doctor_index[h];
    while (dnode) {
        if (strcmp(dnode->doctor_id, doctor_id) == 0) {
            printf("[QUERY] Records for Doctor '%s':\n", doctor_id);
            PatientIndexEntry *e = dnode->records;
            int count = 0;
            while (e) {
                Block blk;
                if (get_block_by_index(e->block_index, &blk)) {
                    Transaction *tx = &blk.transactions[e->tx_index];
                    printf("  [%d] Block %-3d | Patient: %-12s | Hash: %.24s... | File: %s\n",
                           ++count, e->block_index, tx->patient_id, tx->data_hash, tx->data_pointer);
                }
                e = e->next;
            }
            if (count == 0) printf("  (no records found)\n");
            printf("[QUERY] Total: %d record(s) found.\n", count);
            return;
        }
        dnode = dnode->next;
    }
    printf("[QUERY] No records found for Doctor '%s'.\n", doctor_id);
}
