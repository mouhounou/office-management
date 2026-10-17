import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/data";
import { Badge, Button, Card, EmptyState, ErrorBlock, Field, Input, LoadingBlock, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { api, errorMessage, fieldErrorsOf, type FieldErrors } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useNotificationActions, useNotifications } from "@/lib/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { cn, formatDate } from "@/lib/utils";

const TYPE_TONE = { info: "info", success: "success", warning: "warning", error: "danger" } as const;
const TYPE_LABEL = { info: "Info", success: "Succès", warning: "Attention", error: "Erreur" } as const;

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [composing, setComposing] = useState(false);
  const navigate = useNavigate();
  const { can } = useAuth();
  const { data, isLoading, error, refetch } = useNotifications({ page, unread: unreadOnly });
  const { markRead, markAllRead, remove } = useNotificationActions();

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Nouveaux dépôts du site et messages de l'équipe."
        actions={
          <>
            <Button variant="outline" onClick={() => markAllRead.mutate()} disabled={!data?.unread}>
              <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
            </Button>
            {can("edit") && (
              <Button onClick={() => setComposing(true)}>
                <Plus className="h-4 w-4" /> Message à l'équipe
              </Button>
            )}
          </>
        }
      />

      <div className="mb-4 flex gap-2">
        {[false, true].map((value) => (
          <Button key={String(value)} size="sm" variant={unreadOnly === value ? "primary" : "outline"} onClick={() => { setUnreadOnly(value); setPage(1); }}>
            {value ? `Non lues (${data?.unread ?? 0})` : "Toutes"}
          </Button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorBlock error={error} onRetry={refetch} />
        ) : !data?.items.length ? (
          <EmptyState icon={Bell} title={unreadOnly ? "Tout est lu" : "Aucune notification"} />
        ) : (
          <>
            <ul>
              {data.items.map((n) => (
                <li key={n.id} className={cn("flex items-start gap-4 border-b border-border px-5 py-4", !n.read && "bg-accent/30")}>
                  <button
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      if (!n.read) markRead.mutate(n.id);
                      if (n.link) navigate(n.link);
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={TYPE_TONE[n.type]}>{TYPE_LABEL[n.type]}</Badge>
                      <span className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</span>
                    </div>
                    {n.message && <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt, true)}</p>
                  </button>
                  <div className="flex shrink-0 gap-1">
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead.mutate(n.id)}>
                        Marquer lu
                      </Button>
                    )}
                    {can("edit") && (
                      <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={() => remove.mutate(n.id, { onError: (e) => toast.error(errorMessage(e)) })}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={data.page} pages={data.pages} total={data.total} onChange={setPage} />
          </>
        )}
      </Card>

      <ComposeDialog open={composing} onClose={() => setComposing(false)} />
    </>
  );
}

function ComposeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ type: "info", title: "", message: "", link: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await api.post("/notifications", form);
      toast.success("Message publié pour toute l'équipe");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setForm({ type: "info", title: "", message: "", link: "" });
      onClose();
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Message à l'équipe"
      description="Apparaît dans les notifications de tous les comptes."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" form="compose-notification" loading={saving}>Publier</Button>
        </>
      }
    >
      <form id="compose-notification" className="space-y-4" onSubmit={submit}>
        <Field label="Type" htmlFor="n-type">
          <Select id="n-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Titre" htmlFor="n-title" required error={errors.title}>
          <Input id="n-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Message" htmlFor="n-message" error={errors.message}>
          <Textarea id="n-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </Field>
        <Field label="Lien interne" htmlFor="n-link" hint="Ex. /offers — facultatif." error={errors.link}>
          <Input id="n-link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        </Field>
      </form>
    </Dialog>
  );
}
