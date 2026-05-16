export interface Transaction {
    patient_id: string;
    doctor_id: string;
    data_hash: string;
    data_pointer: string;
    timestamp: number;
}

export interface Block {
    index: number;
    timestamp: number;
    previous_hash: string;
    block_hash: string;
    merkle_root: string;
    validator_signature: string;
    validator_port: number;
    transactions: Transaction[];
    transaction_count: number;
}

export interface NodeStatus {
    height: number;
    peer_count: number;
    is_syncing: boolean;
    uptime: number;
}

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AuthUser {
    email: string;
    password: string;
    role: UserRole;
    username: string;
    id: string;
    doctor_id?: string;
    patient_id?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface NetworkNode {
    port: number;
    status: 'online' | 'offline' | string;
    type: string;
    latency: string;
}
