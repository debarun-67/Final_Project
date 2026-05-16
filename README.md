# Custom Blockchain for Secure Medical Record Storage

This project implements a custom blockchain system for integrity-verified medical record storage. It uses a Proof of Authority style validator network and stores sensitive medical files off-chain while anchoring file hashes on-chain.

## Features

- Tamper-evident ledger with verifiable block hashes and signatures.
- Proof of Authority style validation for a lightweight local network.
- Encrypted off-chain medical record storage.
- Multi-node synchronization and consensus flow.
- React dashboard with ledger, record, network, and log views.
- Express API bridge for frontend access to the C blockchain core.

## Prerequisites

- Node.js and npm for the API and frontend.
- MinGW/GCC for the C core on Windows.

## Installation & Build

### C Blockchain Core

```bash
cd backend/core
mingw32-make all
```

### API

```bash
cd backend/api
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Usage

### Single Node Blockchain

```bash
cd backend/core
bin/blockchain.exe
```

### Generate Demo Keys

```bash
cd backend/core
bin/generate_keys.exe 8001 8002 8003
```

### Distributed Network

Open separate terminals:

```bash
cd backend/core
bin/node_app.exe 8001 8002 8003
```

```bash
cd backend/core
bin/node_app.exe 8002 8001 8003
```

```bash
cd backend/core
bin/node_app.exe 8003 8001 8002
```

### Blockchain Viewer

```bash
cd backend/core
bin/viewer.exe
```

### Record Validator

```bash
cd backend/core
bin/validate_record.exe
```

## Node Commands

When running `node_app`, these commands are available:

- `height`: Show the current block height.
- `status`: Show the current node identity and last block hash.
- `peers`: List connected peer nodes.
- `sync`: Force synchronization with peers.
- `verify`: Run full chain integrity verification.
- `add [file]`: Add and broadcast a medical record.
- `bench <n>`: Add `n` records for a local stress test.
- `help`: List available commands.
- `exit`: Shut down the node.

## Project Structure

- `backend/core/src/`: C blockchain core source.
- `backend/core/src/blockchain/`: Blocks and chain management.
- `backend/core/src/crypto/`: Hashing and demo signatures.
- `backend/core/src/network/`: P2P networking and consensus logic.
- `backend/api/`: Express API bridge.
- `frontend/`: Vite React dashboard.
- `backend/core/offchain/`: Encrypted record files.
- `backend/core/keys/`: Node key files.
- `backend/core/data/`: Local blockchain persistence.
- `tests/`: Test and benchmark sources.
