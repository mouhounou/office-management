import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/account/AuthShell";
import { Field, Pill, TextInput } from "@/components/account/ui";
import { errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import { useAccount } from "@/lib/account-context";

type Search = { redirect?: string };

/** N'accepte qu'un chemin interne à l'espace client (pas de redirection ouverte). */
function safeRedirect(value?: string) {
  return value && value.startsWith("/espace") ? value : "/espace";
}

export const Route = createFileRoute("/connexion")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Connexion — Espace client Office Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Connexion,
});

function Connexion() {
  const { redirect } = Route.useSearch();
  const { member, loading, login } = useAccount();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && member) navigate({ to: safeRedirect(redirect), replace: true });
  }, [loading, member, navigate, redirect]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate({ to: safeRedirect(redirect), replace: true });
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Connexion"
      description="Accédez à votre espace client pour suivre vos demandes."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-medium text-brand-strong hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <TextInput
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Mot de passe" htmlFor="password" error={errors.password}>
          <TextInput
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <div className="flex justify-end">
          <Link to="/mot-de-passe-oublie" className="text-sm text-brand-strong hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Pill type="submit" className="w-full" loading={submitting} disabled={loading}>
          Se connecter
        </Pill>
      </form>
    </AuthShell>
  );
}
