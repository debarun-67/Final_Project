import { useState, useEffect } from 'react';
import type { AuthUser, LoginCredentials } from '../types/blockchain';

const DEFAULT_MOCK_USERS: AuthUser[] = [
  { email: "doctor@hospital.org", password: "password123", role: "doctor", username: "Dr. Smith", id: "mock-doc-1", doctor_id: "DOC_001" },
  { email: "doctor2@hospital.org", password: "password123", role: "doctor", username: "Dr. Jones", id: "mock-doc-2", doctor_id: "DOC_002" },
  { email: "doctor3@hospital.org", password: "password123", role: "doctor", username: "Dr. Watson", id: "mock-doc-3", doctor_id: "DOC_003" },
  { email: "patient@test.com", password: "password123", role: "patient", username: "John Doe", id: "mock-pat-1", patient_id: "PAT_001" },
  { email: "patient2@test.com", password: "password123", role: "patient", username: "Jane Doe", id: "mock-pat-2", patient_id: "PAT_002" },
  { email: "admin@chain.com", password: "password123", role: "admin", username: "Network Admin", id: "mock-adm-1" }
];

const MOCK_USERS: AuthUser[] = JSON.parse(import.meta.env.VITE_MOCK_USERS || JSON.stringify(DEFAULT_MOCK_USERS));

const getSavedUser = () => {
  const savedSession = localStorage.getItem('medchain_session');
  if (!savedSession) {
    return null;
  }

  try {
    const sessionData = JSON.parse(savedSession) as Pick<AuthUser, 'email'>;
    return MOCK_USERS.find((u) => u.email === sessionData.email) ?? null;
  } catch (e) {
    console.error("Session recovery failed", e);
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(() => getSavedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to simulate auth check
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    setLoading(true);
    return new Promise<AuthUser>((resolve, reject) => {
      setTimeout(() => {
        const match = MOCK_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (match) {
          setUser(match);
          localStorage.setItem('medchain_session', JSON.stringify({ email: match.email, id: match.id }));
          localStorage.setItem('medchain_role', match.role);
          setLoading(false);
          resolve(match);
        } else {
          setLoading(false);
          reject(new Error('Invalid local credentials. Check your .env file.'));
        }
      }, 800);
    });
  };

  const logout = async () => {
    localStorage.removeItem('medchain_session');
    localStorage.removeItem('medchain_role');
    setUser(null);
  };

  return { user, loading, login, logout };
};
