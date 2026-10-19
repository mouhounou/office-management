import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, Building2 } from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/account/AuthShell";
import { Field, Pill, TextInput, Toggle } from "@/components/account/ui";
import { errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import type { AccountType } from "@/lib/account";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Créer un compte — Espace client Office Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Inscription,
});

const TYPES: { value: AccountType; label: string; description: string; icon: typeof Briefcase }[] =
  [
    {
      value: "candidat",
      label: "Candidat",
      description: "Formations, candidatures",
      icon: Briefcase,
    },
    {
      value: "entreprise",
      label: "Entreprise",
      description: "Recrutement, devis, audit",
      icon: Building2,
    },
  ];

function Inscription() {
  const { member, loading, register } = useAccount();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    accountType: "candidat" as AccountType,
    companyName: "",
    phone: "",
    newsletter: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && member) navigate({ to: "/espace", replace: true });
  }, [loading, member, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (form.password !== form.confirm) {
      setErrors({ confirm: "Les deux mots de passe ne correspondent pas" });
      return;
    }
    setSubmitting(true);
    try {
      const { confirm: _confirm, ...body } = form;
      await register({
        ...body,
        companyName: body.accountType === "entreprise" ? body.companyName : "",
      });
      toast.success("Compte créé ! Un email de confirmation vient de vous être envoyé.");
      navigate({ to: "/espace", replace: true });
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      compact
      title="Créer votre espace client"
      description="Gratuit, en moins d'une minute."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link
            to="/connexion"
            search={{}}
            className="font-medium text-brand-strong hover:underline"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">Vous êtes</legend>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                aria-pressed={form.accountType === type.value}
                onClick={() => setForm({ ...form, accountType: type.value })}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
                  form.accountType === type.value
                    ? "border-brand bg-brand-soft"
                    : "border-border hover:bg-muted",
                )}
              >
                <type.icon
                  className={cn(
                    "h-4 w-4",
                    form.accountType === type.value ? "text-brand-strong" : "text-muted-foreground",
                  )}
                />
                <span className="text-sm font-semibold">{type.label}</span>
                <span className="text-[11px] text-muted-foreground">{type.description}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <Field label="Nom complet" htmlFor="fullName" error={errors.fullName}>
          <TextInput
            id="fullName"
            required
            minLength={2}
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </Field>
        {form.accountType === "entreprise" && (
          <Field label="Entreprise" htmlFor="companyName" error={errors.companyName}>
            <TextInput
              id="companyName"
              required
              autoComplete="organization"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </Field>
        )}
        <Field label="Email" htmlFor="email" error={errors.email}>
          <TextInput
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Téléphone" htmlFor="phone" error={errors.phone} hint="Facultatif">
          <TextInput
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Mot de passe"
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
        </div>
        <Toggle
          checked={form.newsletter}
          onChange={(newsletter) => setForm({ ...form, newsletter })}
          label="Recevoir la newsletter"
          description="Offres d'emploi, sessions de formation et conseils RH."
        />
        <Pill type="submit" className="w-full" loading={submitting} disabled={loading}>
          Créer mon compte
        </Pill>
      </form>
    </AuthShell>
  );
}
