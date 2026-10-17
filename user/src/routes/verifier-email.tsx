import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

import { AuthShell } from "@/components/account/AuthShell";
import { LoadingBlock, pillLink } from "@/components/account/ui";
import { errorMessage } from "@/lib/api";
import { account } from "@/lib/account";
import { useAccount } from "@/lib/account-context";

type Search = { token?: string };

export const Route = createFileRoute("/verifier-email")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Confirmation de l'email — Espace client Office Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifierEmail,
});

function VerifierEmail() {
  const { token } = Route.useSearch();
  const { refresh } = useAccount();
  const [state, setState] = useState<{
    status: "pending" | "done" | "error";
    linked?: number;
    message?: string;
  }>({ status: "pending" });
  const started = useRef(false);

  useEffect(() => {
    // Le jeton ne sert qu'une fois : on évite le double appel du mode strict.
    if (started.current) return;
    started.current = true;
    if (!token) {
      setState({ status: "error", message: "Ce lien est incomplet." });
      return;
    }
    account
      .verifyEmail(token)
      .then(({ linked }) => {
        setState({ status: "done", linked });
        // Si ce navigateur a une session, le compte affiché passe à « vérifié ».
        void refresh();
      })
      .catch((error) => setState({ status: "error", message: errorMessage(error) }));
  }, [token, refresh]);

  if (state.status === "pending") {
    return (
      <AuthShell title="Confirmation en cours">
        <LoadingBlock label="Vérification du lien…" />
      </AuthShell>
    );
  }

  if (state.status === "error") {
    return (
      <AuthShell title="Lien invalide">
        <div className="rounded-2xl border border-border bg-card p-5">
          <CircleAlert className="mb-3 h-8 w-8 text-destructive" />
          <p className="text-sm">{state.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Vous pouvez demander un nouveau lien depuis la page Sécurité de votre espace.
          </p>
        </div>
        <Link to="/espace/securite" className={`${pillLink()} mt-6 w-full`}>
          Aller à mon espace
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Adresse confirmée">
      <div className="rounded-2xl border border-border bg-card p-5">
        <CircleCheck className="mb-3 h-8 w-8 text-brand-strong" />
        <p className="text-sm">Merci, votre adresse email est confirmée.</p>
        {state.linked ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {state.linked} demande{state.linked > 1 ? "s" : ""} envoyée{state.linked > 1 ? "s" : ""}{" "}
            avec cette adresse {state.linked > 1 ? "ont" : "a"} été ajoutée
            {state.linked > 1 ? "s" : ""} à votre espace.
          </p>
        ) : null}
      </div>
      <Link to="/espace" className={`${pillLink()} mt-6 w-full`}>
        Accéder à mon espace
      </Link>
    </AuthShell>
  );
}
