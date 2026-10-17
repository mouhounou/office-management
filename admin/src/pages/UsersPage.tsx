import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Pagination, SearchInput, StatusBadge, Table, Td, Th } from "@/components/ui/data";
import { Badge, Button, Card, EmptyState, ErrorBlock, Field, Input, LoadingBlock, PageHeader, Select, Switch } from "@/components/ui/primitives";
import { errorMessage, fieldErrorsOf, type FieldErrors, type User } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ROLES, optionsOf } from "@/lib/constants";
import { paramsFrom, useCreate, useList, useRemove, useUpdate } from "@/lib/queries";
import { formatDate, timeAgo } from "@/lib/utils";

const ROLE_HELP: Record<string, string> = {
  admin: "Tous les droits : utilisateurs, paramètres, suppressions.",
  editor: "Traite les demandes et gère les contenus.",
  viewer: "Consultation seule.",
};

export function UsersPage() {
  const [search, setSearch] = useSearchParams();
  const params = paramsFrom(search, ["role"]);
  const { data, isLoading, error, refetch } = useList<User>("users", params);
  const { user: me } = useAuth();
  const [editing, setEditing] = useState<User | "new" | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const remove = useRemove("users");

  const setParam = useCallback(
    (key: string, value: string) =>
      setSearch((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      }),
    [setSearch],
  );
  const onSearch = useCallback((value: string) => setParam("q", value), [setParam]);

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        description="Comptes d'accès au back-office."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" /> Nouveau compte
          </Button>
        }
      />
      <Card>
        <div className="flex flex-wrap gap-3 border-b border-border p-4">
          <SearchInput value={String(params.q ?? "")} onChange={onSearch} placeholder="Nom ou email…" className="w-full sm:w-auto sm:min-w-56 sm:flex-1" />
          <Select value={String(params.role ?? "")} onChange={(e) => setParam("role", e.target.value)} className="w-full sm:w-auto sm:min-w-40" aria-label="Rôle">
            <option value="">Rôle : tous</option>
            {optionsOf(ROLES).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </div>
        {isLoading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock error={error} onRetry={refetch} />
        ) : !data?.items.length ? (
          <EmptyState icon={UserCog} title="Aucun compte" />
        ) : (
          <>
            <ul className="divide-y divide-border sm:hidden">
              {data.items.map((u) => (
                <li key={u.id}>
                  <button className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-muted" onClick={() => setEditing(u)}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{u.fullName}</span>
                      <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        <StatusBadge value={u.role} map={ROLES} />
                        {u.active ? <Badge tone="success">Actif</Badge> : <Badge>Désactivé</Badge>}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="hidden sm:block">
            <Table>
              <thead>
                <tr>
                  <Th>Nom</Th>
                  <Th>Rôle</Th>
                  <Th>État</Th>
                  <Th>Dernière connexion</Th>
                  <Th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => (
                  <tr key={u.id} className="cursor-pointer hover:bg-muted/60" onClick={() => setEditing(u)}>
                    <Td>
                      <div className="font-medium">
                        {u.fullName} {u.id === me?.id && <Badge className="ml-1">Vous</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </Td>
                    <Td><StatusBadge value={u.role} map={ROLES} /></Td>
                    <Td>{u.active ? <Badge tone="success">Actif</Badge> : <Badge>Désactivé</Badge>}</Td>
                    <Td className="text-muted-foreground" >{u.lastLoginAt ? <span title={formatDate(u.lastLoginAt, true)}>{timeAgo(u.lastLoginAt)}</span> : "Jamais"}</Td>
                    <Td>
                      {u.id !== me?.id && (
                        <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={(e) => { e.stopPropagation(); setDeleting(u); }}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
            <Pagination page={data.page} pages={data.pages} total={data.total} onChange={(page) => setParam("page", String(page))} />
          </>
        )}
      </Card>

      {editing && <UserDialog key={editing === "new" ? "new" : editing.id} user={editing === "new" ? null : editing} isSelf={editing !== "new" && editing.id === me?.id} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        loading={remove.isPending}
        title={`Supprimer le compte de ${deleting?.fullName} ?`}
        description="La personne ne pourra plus se connecter. Préférez la désactivation pour garder l'historique."
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            toast.success("Compte supprimé");
            setDeleting(null);
          } catch (err) {
            toast.error(errorMessage(err));
          }
        }}
      />
    </>
  );
}

function UserDialog({ user, isSelf, onClose }: { user: User | null; isSelf: boolean; onClose: () => void }) {
  const create = useCreate("users");
  const update = useUpdate("users", user?.id);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "editor",
    active: user?.active ?? true,
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    try {
      if (user) await update.mutateAsync(form);
      else await create.mutateAsync(form);
      toast.success(user ? "Compte mis à jour" : "Compte créé — transmettez le mot de passe à la personne");
      onClose();
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={user ? `Modifier ${user.fullName}` : "Nouveau compte"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" form="user-form" loading={create.isPending || update.isPending}>Enregistrer</Button>
        </>
      }
    >
      <form id="user-form" className="space-y-4" onSubmit={submit}>
        <Field label="Nom complet" htmlFor="u-name" required error={errors.fullName}>
          <Input id="u-name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </Field>
        <Field label="Email" htmlFor="u-email" required error={errors.email}>
          <Input id="u-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Rôle" htmlFor="u-role" error={errors.role} hint={isSelf ? "Vous ne pouvez pas modifier votre propre rôle." : ROLE_HELP[form.role]}>
          <Select id="u-role" value={form.role} disabled={isSelf} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}>
            {optionsOf(ROLES).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field
          label={user ? "Nouveau mot de passe" : "Mot de passe"}
          htmlFor="u-password"
          required={!user}
          error={errors.password}
          hint={user ? "Laisser vide pour ne pas le changer. Le changer déconnecte la personne." : "8 caractères minimum."}
        >
          <Input id="u-password" type="password" autoComplete="new-password" required={!user} minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        {!isSelf && <Switch checked={form.active} onChange={(active) => setForm({ ...form, active })} label="Compte actif" />}
      </form>
    </Dialog>
  );
}
