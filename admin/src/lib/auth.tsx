import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { api, setUnauthorizedHandler, tokenStore, type Role, type User } from "@/lib/api";

type Session = { token: string; user: User };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  /** Enregistre la session ré-émise par l'API (changement de mot de passe). */
  applySession: (session: Session) => void;
  can: (level: "edit" | "admin") => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const EDIT_ROLES: Role[] = ["admin", "editor"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const clear = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(clear);
    api
      .get<{ user: User }>("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
    return () => setUnauthorizedHandler(null);
  }, [clear]);

  const applySession = useCallback((session: Session) => {
    tokenStore.set(session.token);
    setUser(session.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const { data } = await api.post<Session>("/auth/login", { email, password });
        applySession(data);
      },
      async register(fullName, email, password) {
        const { data } = await api.post<Session>("/auth/register", { fullName, email, password });
        applySession(data);
      },
      async logout() {
        try {
          await api.post("/auth/logout");
        } finally {
          clear();
        }
      },
      setUser,
      applySession,
      can(level) {
        if (!user) return false;
        return level === "admin" ? user.role === "admin" : EDIT_ROLES.includes(user.role);
      },
    }),
    [user, loading, applySession, clear],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return context;
}
