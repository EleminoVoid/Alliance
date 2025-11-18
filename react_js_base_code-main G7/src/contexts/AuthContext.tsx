import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api";

interface AuthContextShape {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextShape>({
  user: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
  refreshUser: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.getCurrentUser();
      if (data) {
        const normalized = {
          id: data.id || data.Id,
          username: data.username || data.Username,
          email: data.email || data.Email,
          role: data.role || data.Role,
        };
        setUser(normalized);
        return normalized;
      }
    } catch (err) {
      // not authenticated or error
      setUser(null);
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    // Try to populate user from server session/cookie on mount
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await api.login(email, password);
    // If backend returned a token, set it so subsequent requests include it
    const token = resp?.token || resp?.Token || resp?.accessToken || resp?.AccessToken || resp?.authToken || resp?.AuthToken;
    if (token) {
      api.setAuthToken(token);
    }

    // Backend may set an HTTP-only cookie or return tokens. After login,
    // refresh the current user from the server to get normalized profile.
    const current = await refreshUser();

    // If refreshUser still returned null but the login response contained
    // a user object, use that as a fallback.
    if (!current && resp && (resp.Id || resp.id || resp.username || resp.Username)) {
      const normalized = {
        id: resp.id || resp.Id,
        username: resp.username || resp.Username,
        email: resp.email || resp.Email,
        role: resp.role || resp.Role,
      };
      setUser(normalized);
      return normalized;
    }

    return current || resp;
  };

  const logout = async () => {
    try {
      if (api && (api as any).logout) {
        await (api as any).logout();
      }
    } catch (err) {
      // ignore
    }
    api.setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
