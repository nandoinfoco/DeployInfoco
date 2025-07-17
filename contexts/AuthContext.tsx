import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => void;
  updatePfp: (pfp: string) => void;
  loading: boolean;
}

const MOCK_USERS: Record<string, { password: string; user: Omit<User, 'pfp'> }> = {
    'admin@infoco.com': { password: 'admin123', user: { email: 'admin@infoco.com', name: 'Administrador Sistema', role: 'admin', department: 'Administração' } },
    'fernando@infoco.com': { password: 'fernando123', user: { email: 'fernando@infoco.com', name: 'Fernando Luiz', role: 'coordinator', department: 'Técnico' } },
    'wendel@gmail.com': { password: 'wendel123', user: { email: 'wendel@gmail.com', name: 'Wendel Infoco', role: 'support', department: 'Suporte' } },
    'uilber@gmail.com': { password: 'uilber123', user: { email: 'uilber@gmail.com', name: 'Uilber Aragão', role: 'director', department: 'SEO' } },
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserStr = sessionStorage.getItem('infoco_user') || localStorage.getItem('infoco_user');
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      // Ensure pfp from localStorage is loaded if not in session, for robustness
      const pfp = localStorage.getItem(`infoco_user_pfp_${storedUser.email}`);
      if (pfp && !storedUser.pfp) {
        storedUser.pfp = pfp;
      }
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string): Promise<User> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const potentialUser = MOCK_USERS[email.toLowerCase()];
        if (potentialUser && potentialUser.password === pass) {
          const authenticatedUser: User = { ...potentialUser.user };
          
          const pfp = localStorage.getItem(`infoco_user_pfp_${authenticatedUser.email}`);
          if (pfp) {
              authenticatedUser.pfp = pfp;
          }

          setUser(authenticatedUser);
          sessionStorage.setItem('infoco_user', JSON.stringify(authenticatedUser));
          setLoading(false);
          resolve(authenticatedUser);
        } else {
          setLoading(false);
          reject(new Error('Email ou senha incorretos'));
        }
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('infoco_user');
    // Keep localStorage for pfp and other potential settings
  };

  const updatePfp = (pfp: string) => {
    if (user) {
        const updatedUser = { ...user, pfp };
        setUser(updatedUser);
        sessionStorage.setItem('infoco_user', JSON.stringify(updatedUser));
        localStorage.setItem(`infoco_user_pfp_${user.email}`, pfp);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, updatePfp, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
