import { useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/ui/data";
import { Button, Card, CardHeader, Field, Input, PageHeader } from "@/components/ui/primitives";
import { api, errorMessage, fieldErrorsOf, type FieldErrors, type User } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export function ProfilePage() {
  const { user, setUser, applySession } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.patch<{ user: User }>("/auth/me", { fullName });
      setUser(data.user);
      toast.success("Profil mis à jour");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (passwords.newPassword !== passwords.confirm) {
      setErrors({ confirm: "Les deux mots de passe ne correspondent pas" });
      return;
    }
    setSavingPassword(true);
    try {
      const { data } = await api.post<{ token: string; user: User }>("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      // L'API invalide les anciennes sessions et en ré-émet une pour ce navigateur.
      applySession(data);
      setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Mot de passe modifié — vos autres sessions sont déconnectées");
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <PageHeader title="Mon profil" description={<span className="inline-flex items-center gap-2">{user.email} <StatusBadge value={user.role} map={ROLES} /></span>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Informations" description={`Compte créé le ${formatDate(user.createdAt)}`} />
          <form className="space-y-4 p-5" onSubmit={saveProfile}>
            <Field label="Nom complet" htmlFor="p-name">
              <Input id="p-name" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Email" htmlFor="p-email" hint="Seul un administrateur peut modifier l'email.">
              <Input id="p-email" value={user.email} disabled />
            </Field>
            <Button type="submit" loading={savingProfile} disabled={fullName === user.fullName}>Enregistrer</Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Mot de passe" />
          <form className="space-y-4 p-5" onSubmit={changePassword}>
            <Field label="Mot de passe actuel" htmlFor="p-current" error={errors.currentPassword}>
              <Input id="p-current" type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
            </Field>
            <Field label="Nouveau mot de passe" htmlFor="p-new" error={errors.newPassword} hint="8 caractères minimum.">
              <Input id="p-new" type="password" autoComplete="new-password" required minLength={8} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            </Field>
            <Field label="Confirmation" htmlFor="p-confirm" error={errors.confirm}>
              <Input id="p-confirm" type="password" autoComplete="new-password" required value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
            </Field>
            <Button type="submit" loading={savingPassword}>Changer le mot de passe</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
