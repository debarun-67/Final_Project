# Merkle Verification and Patient Record Flow

This document explains the end-to-end process of how medical records are stored, how patients retrieve them, and how the system uses Merkle trees to prove the integrity of those records without exposing the raw medical data on the blockchain.

---

## 1. How a Patient Gets Their Record

The system uses a **hybrid storage model**, meaning the sensitive file itself is never stored on the blockchain.

**Step-by-Step Flow:**
1. **Upload:** A doctor uploads a patient's medical file (e.g., an X-ray or diagnosis report).
2. **Encryption & Storage (Off-Chain):** The file is encrypted and saved securely in a local database or file server (the "off-chain" storage).
3. **Hashing (On-Chain):** The system calculates a cryptographic hash (SHA-256 fingerprint) of the encrypted file. 
4. **Blockchain Commit:** This hash, along with metadata (Patient ID, Doctor ID, file pointer, and timestamp), forms a **Transaction**. This transaction is grouped with others into a **Block** and permanently committed to the blockchain.
5. **Retrieval:** When the patient logs into the dashboard, the backend fetches their specific encrypted record from the off-chain storage, decrypts it using their authorized session keys, and displays it.

---

## 2. How We Verify Integrity & Detect Tampering

If a patient or auditor wants to know, *"Has this file been secretly altered since the doctor uploaded it?"*, they can verify it mathematically. 

**The Verification Process:**
1. **Hash the File:** The patient's browser takes the downloaded file and calculates its SHA-256 hash locally.
2. **Request Proof:** The frontend asks the blockchain for a **Merkle Proof** for this specific file.
3. **Reconstruct the Root:** The browser uses the local hash and the provided Merkle proof to recalculate the **Merkle Root**.
4. **Compare:** It compares the recalculated Merkle Root against the official Merkle Root permanently stamped in the block header.
   - **If they match:** The file is **100% authentic** and untampered.
   - **If they don't match:** The file has been modified (tampering detected).

---

## 3. What is a Merkle Tree?

A Merkle tree is a mathematical structure that allows us to securely summarize a large list of transactions into a single hash (the **Merkle Root**). If even a single byte in one transaction changes, the Merkle Root changes entirely.

Instead of downloading the entire block (which could contain thousands of records), a user only needs a small **Merkle Proof** (a few sibling hashes) to prove their specific record is inside that block.

---

## 4. Example: Merkle Tree Calculations with Short Hashes

Let's imagine a block with 4 medical records (Transactions A, B, C, and D). For simplicity, we will use short 2-character hashes.

**The Transactions (Leaves):**
*   **Tx A (Patient 1):** `H(A) = 11`
*   **Tx B (Patient 2):** `H(B) = 22`
*   **Tx C (Our Patient):** `H(C) = 33`
*   **Tx D (Patient 4):** `H(D) = 44`

### Building the Tree (Done by the Node)

The node pairs the hashes and hashes them together to build the tree upwards.

**Level 1 (Leaves):**
`11` | `22` | `33` | `44`

**Level 2 (Pairing):**
*   Hash of (A + B) = `Hash(11 + 22)` = `55`
*   Hash of (C + D) = `Hash(33 + 44)` = `66`

**Level 3 (The Merkle Root):**
*   Hash of (55 + 66) = `Hash(55 + 66)` = **`99`**

The official block header now permanently records **`99`** as the Merkle Root.

```text
          [Root: 99]
          /        \
       [55]        [66]
       /  \        /  \
    (11)  (22)  (33)  (44)
     TxA   TxB   TxC   TxD
```

---

### Generating a Proof for Patient 3 (Tx C)

Patient 3 wants to verify their file (Tx C). They don't need to know about Tx A, B, or D's private data. They only need a **Merkle Proof**.

The node provides the proof, which consists of the *sibling* hashes needed to climb the tree.
*   To get from `33` to `66`, you need the sibling: **`44` (Right)**
*   To get from `66` to `99`, you need the sibling: **`55` (Left)**

**The Merkle Proof given to the Patient:** `[Right: 44, Left: 55]`

---

### Verifying the Proof (Done by the Patient's Browser)

The patient downloads their file and hashes it locally. 
*   **Locally calculated hash:** `33`

Now, the browser applies the proof:
1.  **Step 1:** The proof says the first sibling is `44` on the Right.
    `Hash(33 + 44) = 66`
2.  **Step 2:** The proof says the next sibling is `55` on the Left.
    `Hash(55 + 66) = 99`

The browser successfully recalculated the root as **`99`**. 

It compares this to the official block header (`99`). **They match!** The file is verified as authentic.

### What if the file was tampered with?

Imagine a hacker changed Patient 3's file.
1.  The patient downloads the tampered file and hashes it locally. 
2.  Because the file changed, the hash is completely different. **Locally calculated hash:** `88` (instead of 33).
3.  The browser applies the proof:
    *   **Step 1:** `Hash(88 + 44)` = `77` (Expected 66)
    *   **Step 2:** `Hash(55 + 77)` = `12` (Expected 99)
4.  The final result (`12`) does **not** match the official root (`99`). 
5.  **Tampering is instantly detected**, and the dashboard alerts the patient that the file is corrupt or forged.
