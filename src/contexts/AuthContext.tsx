import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "../services/api";
import type { AuthUser } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const token = localStorage.getItem("blog.token");
  const user = localStorage.getItem("blog.user");
  if (!token || !user) return null;
  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    localStorage.removeItem("blog.token");
    localStorage.removeItem("blog.user");
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  async function login(email: string, password: string) {
    const response = await api.login(email, password);
    localStorage.setItem("blog.token", response.token);
    localStorage.setItem("blog.user", JSON.stringify(response.user));
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem("blog.token");
    localStorage.removeItem("blog.user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
