import { useState, useEffect } from 'react';

const DEFAULT_MOCK_USERS = [
  { email: "doctor@hospital.org", password: "password123", role: "doctor", username: "Dr. Smith", id: "mock-doc-1", doctor_id: "DOC_001" },
  { email: "patient@test.com", password: "password123", role: "patient", username: "John Doe", id: "mock-pat-1", patient_id: "PAT_001" },
  { email: "admin@chain.com", password: "password123", role: "admin", username: "Network Admin", id: "mock-adm-1" }
];

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const MOCK_USERS = JSON.parse(import.meta.env.VITE_MOCK_USERS || JSON.stringify(DEFAULT_MOCK_USERS));

  useEffect(() => {
    const savedSession = localStorage.getItem('medchain_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        // Find matching user in our current mock list
        const match = MOCK_USERS.find((u: any) => u.email === sessionData.email);
        if (match) {
          setUser(match);
        }
      } catch (e) {
        console.error("Session recovery failed", e);
      }
    }
    // Small delay to simulate auth check
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const match = MOCK_USERS.find(
          (u: any) => u.email === credentials.email && u.password === credentials.password
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
