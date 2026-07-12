import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/integrations/supabase/client";

export type AppRole = "admin" | "client" | "formateur";

type State = {
  loading: boolean;
  user: User | null;
  roles: AppRole[];
  isAdmin: boolean;
  isFormateur: boolean;
  isClient: boolean;
};

const empty: State = { loading: false, user: null, roles: [], isAdmin: false, isFormateur: false, isClient: false };

export function useAdmin(): State {
  const [state, setState] = useState<State>({ ...empty, loading: true });

  useEffect(() => {
    let cancelled = false;

    const check = async (user: User | null) => {
      if (!user) { if (!cancelled) setState({ ...empty }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const roles = ((data ?? []).map(r => r.role) as AppRole[]);
      if (!cancelled) setState({
        loading: false, user, roles,
        isAdmin: roles.includes("admin"),
        isFormateur: roles.includes("formateur"),
        isClient: roles.includes("client"),
      });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { check(session?.user ?? null); });
    supabase.auth.getSession().then(({ data }) => check(data.session?.user ?? null));

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}
