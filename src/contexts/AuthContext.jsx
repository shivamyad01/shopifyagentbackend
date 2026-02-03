import { createContext, useContext, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

function getUserFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) return null;
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => getUserFromToken(localStorage.getItem('token') || ''));

  const isAuthenticated = !!user && !!token;
  const isSuperAdmin = user?.role === 'super_admin';

  async function login(email, password) {
    const data = await authApi.login(email, password);
    const nextToken = data?.token;
    if (!nextToken) throw new Error('Login did not return token');

    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    setUser(getUserFromToken(nextToken));
    return getUserFromToken(nextToken);
  }

  async function register(tenantName, email, password) {
    return authApi.register(tenantName, email, password);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated, isSuperAdmin, login, register, logout }),
    [token, user, isAuthenticated, isSuperAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
