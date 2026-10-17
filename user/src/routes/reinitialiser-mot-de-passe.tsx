import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/account/AuthShell";
import { Field, Pill, TextInput } from "@/components/account/ui";
import { errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import { account } from "@/lib/account";
import { useAccount } from "@/lib/account-context";

type Search = { token?: string };

export const Route = createFileRoute("/reinitialiser-mot-de-passe")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — Espace client Office Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reinitialiser,
});

function Reinitialiser() {
  const { token } = Route.useSearch();
  const { applySession, loading } = useAccount();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (form.password !== form.confirm) {
      setErrors({ confirm: "Les deux mots de passe ne correspondent pas" });
      return;
    }
    setSubmitting(true);
    try {
      applySession(await account.resetPassword(token ?? "", form.password));
      toast.success("Mot de passe modifié. Vous êtes connecté.");
      navigate({ to: "/espace", replace: true });
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthShell
        title="Lien incomplet"
        description="Ce lien de réinitialisation est incomplet. Copiez-le en entier depuis l'email, ou demandez-en un nouveau."
      >
        <Link to="/mot-de-passe-oublie" className="font-medium text-brand-strong hover:underline">
          Demander un nouveau lien
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choisir un nouveau mot de passe"
      description="Vos autres sessions seront déconnectées."
      footer={
        <Link to="/mot-de-passe-oublie" className="font-medium text-brand-strong hover:underline">
          Lien expiré ? En demander un nouveau
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Nouveau mot de passe"
          htmlFor="password"
          error={errors.password}
          hint="8 caractères minimum"
        >
          <TextInput
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            autoFocus
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <Field label="Confirmation" htmlFor="confirm" error={errors.confirm}>
          <TextInput
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </Field>
        <Pill type="submit" className="w-full" loading={submitting} disabled={loading}>
          Enregistrer et me connecter
        </Pill>
      </form>
    </AuthShell>
  );
}
