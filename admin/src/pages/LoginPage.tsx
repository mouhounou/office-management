import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import { Button, Field, Input } from "@/components/ui/primitives";
import { api, errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const { user, login, register } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Base vide : on propose de créer le premier compte (qui sera administrateur).
  const { data: bootstrap } = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: async () => (await api.get<{ needsBootstrap: boolean }>("/auth/bootstrap-status")).data,
  });
  const firstAccount = bootstrap?.needsBootstrap ?? false;

  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? "/";
    return <Navigate to={from} replace />;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      if (firstAccount) await register(form.fullName, form.email, form.password);
      else await login(form.email, form.password);
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-deep p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-11 w-11 rounded-xl bg-white p-1" />
          <div>
            <div className="font-display text-lg font-bold tracking-wider text-cyan uppercase">Office Management</div>
            <div className="text-xs tracking-[0.25em] text-white/60 uppercase">Human Resources Consulting</div>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl leading-tight font-bold">Le back-office de votre cabinet RH.</h1>
          <p className="mt-4 text-white/70">
            Demandes des entreprises, devis, pré-inscriptions, candidatures, offres et contenus du site : tout se pilote ici.
          </p>
        </div>
        <p className="relative text-xs text-white/40">Songolo, Pointe-Noire — Congo</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <img src="/logo.png" alt="" className="h-12 w-12 rounded-xl" />
          </div>
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Lock className="h-5 w-5 text-brand-strong" />
          </div>
          <h2 className="text-2xl font-bold">{firstAccount ? "Créer le compte administrateur" : "Connexion"}</h2>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            {firstAccount
              ? "Aucun compte n'existe encore : ce premier compte aura tous les droits."
              : "Accès réservé à l'équipe Office Management."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {firstAccount && (
              <Field label="Nom complet" htmlFor="fullName" error={errors.fullName}>
                <Input id="fullName" required autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </Field>
            )}
            <Field label="Email" htmlFor="email" error={errors.email}>
              <Input id="email" type="email" required autoComplete="email" autoFocus value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Mot de passe" htmlFor="password" error={errors.password} hint={firstAccount ? "8 caractères minimum." : undefined}>
              <Input
                id="password"
                type="password"
                required
                minLength={firstAccount ? 8 : undefined}
                autoComplete={firstAccount ? "new-password" : "current-password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Field>
            <Button type="submit" className="w-full justify-center" loading={submitting}>
              {firstAccount ? "Créer le compte" : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
