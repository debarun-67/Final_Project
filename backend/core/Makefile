CC = gcc
CFLAGS = -Wall -Isrc
LIBS = 

# Core modules source files
SRCS_COMMON = src/blockchain/block.c \
              src/blockchain/blockchain.c \
              src/crypto/hash.c \
              src/crypto/signature.c

# Targets
all: setup blockchain cli viewer validate keygen node

setup:
	if not exist bin mkdir bin

blockchain: src/main.c $(SRCS_COMMON)
	$(CC) src/main.c $(SRCS_COMMON) -o bin/blockchain.exe $(CFLAGS) -lws2_32 -lmswsock

cli: src/cli/cli.c $(SRCS_COMMON)
	$(CC) src/cli/cli.c $(SRCS_COMMON) -o bin/cli_tool.exe $(CFLAGS)

viewer: src/viewer.c $(SRCS_COMMON)
	$(CC) src/viewer.c $(SRCS_COMMON) -o bin/viewer.exe $(CFLAGS)

validate: src/validate.c $(SRCS_COMMON)
	$(CC) src/validate.c $(SRCS_COMMON) -o bin/validate_record.exe $(CFLAGS)

keygen: src/generate_keys.c
	$(CC) src/generate_keys.c -o bin/generate_keys.exe $(CFLAGS)

node: src/node_app.c $(SRCS_COMMON) src/network/node.c src/network/protocol.c src/network/proposal.c src/network/serializer.c src/network/sync.c
	$(CC) src/node_app.c $(SRCS_COMMON) src/network/node.c src/network/protocol.c src/network/proposal.c src/network/serializer.c src/network/sync.c -o bin/node_app.exe $(CFLAGS) -lws2_32

benchmark: src/benchmark_node.c $(SRCS_COMMON)
	$(CC) src/benchmark_node.c $(SRCS_COMMON) -o bin/benchmark_node.exe $(CFLAGS)

clean:
	del /f bin\*.exe
