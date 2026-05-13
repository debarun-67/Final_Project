===========================================================
MEDICAL BLOCKCHAIN - DISTRIBUTED NETWORK SYSTEM
===========================================================

1. SYSTEM PREREQUISITES
-----------------------
- Windows OS (MinGW/GCC installed)
- Node.js & npm (for Dashboard)
- PowerShell (for Automation scripts)

2. INITIAL SETUP (ONE-TIME)
---------------------------
To build all C binaries and prepare the environment:
> cd backend/core
> mingw32-make all

To install Dashboard dependencies:
> cd backend/api && npm install
> cd frontend && npm install

3. HOW TO RUN THE FULL SYSTEM
-----------------------------
A. START THE NETWORK (4 NODES):
   > .\scripts\demo_launcher.ps1
   (This opens 4 independent node terminals with a fresh blockchain)

B. START THE BACKEND API:
   > cd backend/api
   > npm start

C. START THE DASHBOARD:
   > cd frontend
   > npm run dev

4. NODE MANAGEMENT COMMANDS
---------------------------
- RESTART A SPECIFIC NODE:
  > .\scripts\run_node.ps1 -NodeIndex <1-4>

- ADD A NEW DYNAMIC NODE (Node 5+):
  > .\scripts\add_new_node.ps1 -NodeIndex 5

5. PERFORMANCE BENCHMARKING & SPEED TEST
----------------------------------------
To measure the speed of block creation and network mesh propagation:
1. Go to any running node terminal (e.g. Node 1)
2. Type: > bench 50
3. Observe all other nodes instantly verifying the 50 new blocks.

The node will display:
- Total execution time
- Blocks Per Second (BPS) throughput

6. TERMINAL COMMANDS (Inside Node Windows)
------------------------------------------
- help   : Show all commands
- add    : Create a new medical record block
- status : Show node port and last hash
- height : Show current ledger size
- verify : Run full chain cryptographic audit

===========================================================
Secure. Distributed. Immutable.
===========================================================
