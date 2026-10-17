import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BadgeCheck, Briefcase, Building2, MailWarning } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  Panel,
  PanelHeader,
  Pill,
  TextInput,
  Toggle,
  formatDate,
  initials,
} from "@/components/account/ui";
import { errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import { account, type AccountType } from "@/lib/account";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace/profil")({
  component: Profil,
});

function Profil() {
  const { member, setMember } = useAccount();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    fullName: "",
    accountType: "candidat" as AccountType,
    companyName: "",
    phone: "",
    city: "",
    newsletter: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!member) return;
    setForm({
      fullName: member.fullName,
      accountType: member.accountType,
      companyName: member.companyName ?? "",
      phone: member.phone ?? "",
      city: member.city ?? "",
      newsletter: member.newsletter,
    });
  }, [member]);

  if (!member) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      setMember(await account.updateProfile(form));
      queryClient.invalidateQueries({ queryKey: ["account", "overview"] });
      toast.success("Profil enregistré");
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations pré-remplissent vos demandes sur le site.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="relative h-fit overflow-hidden p-6 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)]" />
          <span className="relative mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy to-cyan text-xl font-bold text-white ring-4 ring-card">
            {initials(member.fullName)}
          </span>
          <p className="mt-3 text-lg font-semibold">{member.fullName}</p>
          <p className="text-sm text-muted-foreground">{member.email}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs">
            {member.emailVerified ? (
              <>
                <BadgeCheck className="h-4 w-4 text-brand-strong" /> Email vérifié
              </>
            ) : (
              <>
                <MailWarning className="h-4 w-4 text-muted-foreground" /> Email non vérifié
              </>
            )}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Membre depuis le {formatDate(member.createdAt)}
          </p>
        </Panel>

        <Panel>
          <PanelHeader
            title="Informations"
            description="L'adresse email sert d'identifiant ; écrivez-nous pour la changer."
          />
          <form onSubmit={submit} className="grid gap-5 px-5 pb-5 sm:grid-cols-2">
            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-sm font-medium">Type de compte</legend>
              <div className="grid grid-cols-2 gap-2 sm:max-w-md">
                {(
                  [
                    { value: "candidat", label: "Candidat", icon: Briefcase },
                    { value: "entreprise", label: "Entreprise", icon: Building2 },
                  ] as const
                ).map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    aria-pressed={form.accountType === type.value}
                    onClick={() => setForm({ ...form, accountType: type.value })}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                      form.accountType === type.value
                        ? "border-brand bg-brand-soft"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    <type.icon className="h-4 w-4" /> {type.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <Field
              label="Nom complet"
              htmlFor="fullName"
              error={errors.fullName}
              className="sm:col-span-2"
            >
              <TextInput
                id="fullName"
                required
                minLength={2}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </Field>
            {form.accountType === "entreprise" && (
              <Field
                label="Entreprise"
                htmlFor="companyName"
                error={errors.companyName}
                className="sm:col-span-2"
              >
                <TextInput
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </Field>
            )}
            <Field label="Email" htmlFor="email">
              <TextInput id="email" value={member.email} disabled />
            </Field>
            <Field label="Téléphone" htmlFor="phone" error={errors.phone}>
              <TextInput
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Ville" htmlFor="city" error={errors.city}>
              <TextInput
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </Field>
            <div className="flex items-end sm:col-span-2">
              <Toggle
                checked={form.newsletter}
                onChange={(newsletter) => setForm({ ...form, newsletter })}
                label="Newsletter"
                description="Offres d'emploi, sessions de formation et conseils RH, sans excès."
              />
            </div>
            <div className="sm:col-span-2">
              <Pill type="submit" loading={saving}>
                Enregistrer
              </Pill>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
