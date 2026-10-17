import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, KeyRound, MailWarning, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Field, Panel, PanelHeader, Pill, TextInput } from "@/components/account/ui";
import { errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import { account } from "@/lib/account";
import { useAccount } from "@/lib/account-context";

export const Route = createFileRoute("/espace/securite")({
  component: Securite,
});

function Securite() {
  const { member } = useAccount();
  if (!member) return null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sécurité</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mot de passe, adresse email et suppression du compte.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <PasswordCard />
        <div className="space-y-4">
          <EmailCard />
          <DeleteCard />
        </div>
      </div>
    </div>
  );
}

function PasswordCard() {
  const { applySession } = useAccount();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (form.newPassword !== form.confirm) {
      setErrors({ confirm: "Les deux mots de passe ne correspondent pas" });
      return;
    }
    setSaving(true);
    try {
      // L'API déconnecte les autres sessions et en ré-émet une pour ce navigateur.
      applySession(await account.changePassword(form.currentPassword, form.newPassword));
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Mot de passe modifié. Vos autres sessions sont déconnectées.");
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel className="h-fit">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand-strong" /> Mot de passe
          </span>
        }
        description="Un email de confirmation vous est envoyé après chaque changement."
      />
      <form onSubmit={submit} className="space-y-4 px-5 pb-5">
        <Field label="Mot de passe actuel" htmlFor="currentPassword" error={errors.currentPassword}>
          <TextInput
            id="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </Field>
        <Field
          label="Nouveau mot de passe"
          htmlFor="newPassword"
          error={errors.newPassword}
          hint="8 caractères minimum"
        >
          <TextInput
            id="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
        </Field>
        <Field label="Confirmation" htmlFor="confirmPassword" error={errors.confirm}>
          <TextInput
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </Field>
        <Pill type="submit" loading={saving}>
          Changer le mot de passe
        </Pill>
      </form>
    </Panel>
  );
}

function EmailCard() {
  const { member } = useAccount();
  const [sending, setSending] = useState(false);
  if (!member) return null;

  const resend = async () => {
    setSending(true);
    try {
      await account.resendVerification();
      toast.success(`Email de confirmation envoyé à ${member.email}`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <Panel className="p-5">
      <div className="flex items-start gap-3">
        {member.emailVerified ? (
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-strong" />
        ) : (
          <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {member.emailVerified ? "Adresse email vérifiée" : "Adresse email à confirmer"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          {!member.emailVerified && (
            <p className="mt-2 text-xs text-muted-foreground">
              La confirmation ajoute à votre espace les demandes envoyées avec cette adresse avant
              l'inscription.
            </p>
          )}
        </div>
        {!member.emailVerified && (
          <Pill size="sm" variant="outline" onClick={resend} loading={sending}>
            Renvoyer
          </Pill>
        )}
      </div>
    </Panel>
  );
}

function DeleteCard() {
  const { logout } = useAccount();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [deleting, setDeleting] = useState(false);

  const remove = async (event: React.FormEvent) => {
    event.preventDefault();
    setDeleting(true);
    setError(undefined);
    try {
      await account.deleteAccount(password);
      await logout().catch(() => undefined);
      toast.success("Votre compte a été supprimé.");
      navigate({ to: "/" });
    } catch (err) {
      setError(fieldErrorsOf(err).password ?? errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Panel className="border-destructive/30 p-5">
      <div className="flex items-start gap-3">
        <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Supprimer mon compte</p>
          <p className="text-xs text-muted-foreground">
            Votre compte et vos informations de profil sont effacés. Vos demandes en cours restent
            traitées par notre équipe.
          </p>
        </div>
      </div>
      {confirming ? (
        <form onSubmit={remove} className="mt-4 space-y-3">
          <Field label="Confirmez avec votre mot de passe" htmlFor="deletePassword" error={error}>
            <TextInput
              id="deletePassword"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <div className="flex gap-2">
            <Pill type="submit" variant="danger" size="sm" loading={deleting}>
              Supprimer définitivement
            </Pill>
            <Pill type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)}>
              Annuler
            </Pill>
          </div>
        </form>
      ) : (
        <Pill
          variant="outline"
          size="sm"
          className="mt-4 text-destructive"
          onClick={() => setConfirming(true)}
        >
          Supprimer mon compte
        </Pill>
      )}
    </Panel>
  );
}
