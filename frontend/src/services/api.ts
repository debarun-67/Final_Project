import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const savedSession = localStorage.getItem('medchain_session');
  if (savedSession) {
    const session = JSON.parse(savedSession);
    config.headers['X-Mock-User-ID'] = session.id;
  }
  return config;
});

export const blockchainService = {
  getHeight: () => api.get('/height'),
  getBlocks: () => api.get('/blocks'),
  getBlock: (index: number) => api.get(`/block/${index}`),
  getNetworkHealth: () => api.get('/network/health'),
  getNetworkLogs: () => api.get('/network/logs'),
  verifyChain: () => api.get('/verify'),
};

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const recordService = {
  upload: (formData: FormData) => api.post('/records/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
