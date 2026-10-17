import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { memberToken } from "@/lib/api";
import { account, setUnauthorizedHandler, type Member, type Session } from "@/lib/account";

type AccountContextValue = {
  member: Member | null;
  /** Vrai tant que la session n'a pas été vérifiée (toujours vrai au rendu serveur). */
  loading: boolean;
  login: (email: string, password: string) => Promise<Member>;
  register: (body: Parameters<typeof account.register>[0]) => Promise<Member>;
  logout: () => Promise<void>;
  applySession: (session: Session) => void;
  setMember: (member: Member) => void;
  /** Relit le compte depuis l'API (ex. après la vérification de l'email). */
  refresh: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

/**
 * Session de l'espace client. Le rendu serveur ne connaît pas le visiteur :
 * la session est lue après l'hydratation (jeton local, sinon cookie).
 */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const clear = useCallback(() => {
    memberToken.clear();
    setMember(null);
    queryClient.removeQueries({ queryKey: ["account"] });
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(clear);
    account
      .me()
      .then(setMember)
      .catch(() => memberToken.clear())
      .finally(() => setLoading(false));
    return () => setUnauthorizedHandler(null);
  }, [clear]);

  const applySession = useCallback((session: Session) => {
    memberToken.set(session.token);
    setMember(session.member);
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      member,
      loading,
      async login(email, password) {
        const session = await account.login(email, password);
        applySession(session);
        return session.member;
      },
      async register(body) {
        const session = await account.register(body);
        applySession(session);
        return session.member;
      },
      async logout() {
        try {
          await account.logout();
        } finally {
          clear();
        }
      },
      applySession,
      setMember,
      async refresh() {
        try {
          setMember(await account.me());
        } catch {
          /* pas de session : rien à rafraîchir */
        }
      },
    }),
    [member, loading, applySession, clear],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

/**
 * Coordonnées du compte connecté pour pré-remplir les formulaires du site
 * (champs vides pour un visiteur anonyme). `key` change à la connexion : à poser sur
 * un formulaire non contrôlé pour que ses `defaultValue` soient relues.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMemberPrefill() {
  const { member } = useAccount();
  return useMemo(
    () =>
      member
        ? {
            key: member.id,
            name: member.fullName,
            email: member.email,
            phone: member.phone ?? "",
            company: member.companyName ?? "",
          }
        : { key: "anonyme", name: "", email: "", phone: "", company: "" },
    [member],
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount doit être utilisé dans <AccountProvider>");
  return context;
}
