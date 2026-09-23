import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

function loadUserFromStorage() {
  try {
    const stored = localStorage.getItem('ss_user_session');
    const token = localStorage.getItem('ss_auth_token');
    if (stored && token) return JSON.parse(stored);
  } catch (e) {}
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUserFromStorage());

  const login = async (email, password) => {
    const res = await loginUser(email, password);

    if (!res.success) {
      throw new Error(res.error || 'Login failed');
    }

    const { token, user: userData } = res.data;

    localStorage.setItem('ss_auth_token', token);
    localStorage.setItem('ss_user_session', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ss_auth_token');
    localStorage.removeItem('ss_user_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
