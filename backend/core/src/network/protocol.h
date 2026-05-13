#ifndef PROTOCOL_H
#define PROTOCOL_H

#define CMD_CAN_COMMIT     "CAN_COMMIT:"
#define CMD_VOTE_YES       "VOTE_YES:"
#define CMD_PRE_COMMIT     "PRE_COMMIT:"
#define CMD_ACK_PRE        "ACK_PRE:"
#define CMD_DO_COMMIT      "DO_COMMIT:"

void protocol_dispatch(int client_socket, const char *message);

#endif
