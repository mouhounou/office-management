import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/account/AuthShell";
import { Field, Pill, TextInput } from "@/components/account/ui";
import { errorMessage } from "@/lib/api";
import { account } from "@/lib/account";
import { useAccount } from "@/lib/account-context";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — Espace client Office Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MotDePasseOublie,
});

function MotDePasseOublie() {
  const { loading } = useAccount();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await account.forgotPassword(email);
      setSent(true);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={sent ? "Vérifiez votre boîte mail" : "Mot de passe oublié"}
      description={
        sent
          ? undefined
          : "Indiquez l'email de votre compte : nous vous envoyons un lien pour choisir un nouveau mot de passe."
      }
      footer={
        <Link to="/connexion" search={{}} className="font-medium text-brand-strong hover:underline">
          Retour à la connexion
        </Link>
      }
    >
      {sent ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <MailCheck className="mb-3 h-8 w-8 text-brand-strong" />
          <p className="text-sm">
            Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vient d'y
            être envoyé. Il est valable 1 heure.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Pensez à regarder dans les courriers indésirables.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Pill type="submit" className="w-full" loading={submitting} disabled={loading}>
            Envoyer le lien
          </Pill>
        </form>
      )}
    </AuthShell>
  );
}
