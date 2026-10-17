import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, MessageSquare, Paperclip, RefreshCw, Save, Send, Trash2, Upload, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ui/dialog";
import { DetailRow, StatusBadge } from "@/components/ui/data";
import { Badge, Button, Card, CardHeader, ErrorBlock, Field, Input, LoadingBlock, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { api, errorMessage, type AnyRecord } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { DOCUMENT_TYPES, PRIORITIES, REQUEST_TYPES, SIMPLE_STATUSES, optionsOf } from "@/lib/constants";
import { useItem, useRemove, useUpdate } from "@/lib/queries";
import { formatBytes, formatDate, timeAgo, toDateInput } from "@/lib/utils";

const PATH = "business-requests";

type RequestEvent = { id: string; eventType: string; actorName?: string | null; fromStatus?: string | null; toStatus?: string | null; comment?: string | null; createdAt: string };
type RequestDocument = { id: string; name: string; url: string; type: string; sizeBytes?: number | null; createdAt: string };

export function BusinessRequestPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { data: item, isLoading, error, refetch } = useItem(PATH, id);
  const remove = useRemove(PATH);
  const [confirm, setConfirm] = useState(false);

  if (isLoading) return <LoadingBlock />;
  if (error || !item) return <ErrorBlock error={error ?? new Error("Demande introuvable")} onRetry={refetch} />;

  const details = (item.details ?? {}) as Record<string, string>;

  return (
    <>
      <PageHeader
        back={
          <Link to={`/${PATH}`} className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Business Center
          </Link>
        }
        title={item.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone="progress">{REQUEST_TYPES[item.type] ?? item.type}</Badge>
            <StatusBadge value={item.status} map={SIMPLE_STATUSES} />
            <StatusBadge value={item.priority} map={PRIORITIES} />
            <span>· reçue {timeAgo(item.createdAt)}</span>
          </span>
        }
        actions={
          can("admin") && (
            <Button variant="outline" className="text-destructive" onClick={() => setConfirm(true)}>
              <Trash2 className="h-4 w-4" /> Supprimer
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Demande" />
            <dl className="divide-y divide-border px-5 py-2">
              <DetailRow label="Entreprise">{item.companyName}</DetailRow>
              <DetailRow label="Contact">{item.contactName}</DetailRow>
              <DetailRow label="Email">
                <a href={`mailto:${item.contactEmail}`} className="text-primary hover:underline">{item.contactEmail}</a>
              </DetailRow>
              <DetailRow label="Téléphone">
                <a href={`tel:${item.contactPhone}`} className="text-primary hover:underline">{item.contactPhone}</a>
              </DetailRow>
              <DetailRow label="Budget">{item.budget || "—"}</DetailRow>
              <DetailRow label="Échéance">{formatDate(item.deadline)}</DetailRow>
              {Object.entries(details).map(([key, value]) => (
                <DetailRow key={key} label={humanize(key)}>{value || "—"}</DetailRow>
              ))}
              <DetailRow label="Description">{item.description}</DetailRow>
            </dl>
          </Card>

          <DocumentsCard requestId={item.id} />
          <TimelineCard requestId={item.id} />
        </div>

        <ProcessingCard item={item} />
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        loading={remove.isPending}
        title="Supprimer cette demande ?"
        description="La demande, son journal et ses pièces jointes ne seront plus accessibles."
        onConfirm={async () => {
          try {
            await remove.mutateAsync(item.id);
            toast.success("Demande supprimée");
            navigate(`/${PATH}`, { replace: true });
          } catch (err) {
            toast.error(errorMessage(err));
          }
        }}
      />
    </>
  );
}

function humanize(key: string) {
  const spaced = key.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Statut, priorité, assignation, échéance et notes internes. */
function ProcessingCard({ item }: { item: AnyRecord }) {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const update = useUpdate(PATH, item.id);
  const readOnly = !can("edit");
  const initial = {
    status: item.status as string,
    priority: item.priority as string,
    assignedTo: (item.assignedTo?.id ?? "") as string,
    deadline: toDateInput(item.deadline),
    budget: (item.budget ?? "") as string,
    adminNotes: (item.adminNotes ?? "") as string,
  };
  const [form, setForm] = useState(initial);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const { data: assignable } = useQuery({
    queryKey: ["users", "assignable"],
    queryFn: async () => (await api.get<{ items: { id: string; fullName: string }[] }>("/users/assignable")).data.items,
  });

  const save = async () => {
    try {
      await update.mutateAsync({ ...form, assignedTo: form.assignedTo || null, deadline: form.deadline || null });
      queryClient.invalidateQueries({ queryKey: [PATH, "events", item.id] });
      toast.success(form.status !== initial.status && form.status !== "new" ? "Demande mise à jour — le contact est prévenu par email" : "Demande mise à jour");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <Card className="h-fit lg:sticky lg:top-20">
      <CardHeader title="Traitement" description="Un changement de statut envoie un email de suivi au contact." />
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Statut" htmlFor="br-status">
            <Select id="br-status" value={form.status} disabled={readOnly} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {optionsOf(SIMPLE_STATUSES).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
          <Field label="Priorité" htmlFor="br-priority">
            <Select id="br-priority" value={form.priority} disabled={readOnly} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {optionsOf(PRIORITIES).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Assignée à" htmlFor="br-assigned">
          <Select id="br-assigned" value={form.assignedTo} disabled={readOnly} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            <option value="">Personne</option>
            {assignable?.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Échéance" htmlFor="br-deadline">
            <Input id="br-deadline" type="date" value={form.deadline} disabled={readOnly} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </Field>
          <Field label="Budget" htmlFor="br-budget">
            <Input id="br-budget" value={form.budget} disabled={readOnly} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </Field>
        </div>
        <Field label="Notes internes" htmlFor="br-notes">
          <Textarea id="br-notes" rows={5} value={form.adminNotes} disabled={readOnly} onChange={(e) => setForm({ ...form, adminNotes: e.target.value })} />
        </Field>
        {!readOnly && (
          <div className="flex gap-2">
            <Button className="flex-1 justify-center" onClick={save} disabled={!dirty} loading={update.isPending}>
              <Save className="h-4 w-4" /> Enregistrer
            </Button>
            {dirty && (
              <Button variant="outline" size="icon" onClick={() => setForm(initial)} aria-label="Annuler les modifications">
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  created: Sparkles,
  status_change: RefreshCw,
  assignment: UserPlus,
  comment: MessageSquare,
};

function describeEvent(event: RequestEvent) {
  switch (event.eventType) {
    case "created":
      return "Demande créée";
    case "status_change":
      return `Statut : ${SIMPLE_STATUSES[event.fromStatus ?? ""]?.label ?? event.fromStatus ?? "—"} → ${SIMPLE_STATUSES[event.toStatus ?? ""]?.label ?? event.toStatus}`;
    case "assignment":
      return event.comment ?? "Assignation modifiée";
    default:
      return null;
  }
}

/** Journal de la demande + ajout de commentaires. */
function TimelineCard({ requestId }: { requestId: string }) {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const key = [PATH, "events", requestId];

  const { data: events, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => (await api.get<{ items: RequestEvent[] }>(`/${PATH}/${requestId}/events`)).data.items,
  });

  const add = useMutation({
    mutationFn: async () => (await api.post<{ items: RequestEvent[] }>(`/${PATH}/${requestId}/events`, { comment })).data.items,
    onSuccess: (items) => {
      queryClient.setQueryData(key, items);
      setComment("");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Card>
      <CardHeader title="Journal" description="Historique des actions et commentaires de l'équipe." />
      <div className="p-5">
        {isLoading ? (
          <LoadingBlock />
        ) : (
          <ol className="relative space-y-5 border-l border-border pl-6">
            {events?.map((event) => {
              const Icon = EVENT_ICONS[event.eventType] ?? MessageSquare;
              const summary = describeEvent(event);
              return (
                <li key={event.id} className="relative">
                  <span className="absolute top-0.5 -left-[33px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card">
                    <Icon className="h-3 w-3 text-primary" />
                  </span>
                  <div className="text-sm">
                    <span className="font-medium">{event.actorName ?? "Système"}</span>
                    <span className="ml-2 text-xs text-muted-foreground" title={formatDate(event.createdAt, true)}>{timeAgo(event.createdAt)}</span>
                  </div>
                  {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
                  {event.eventType === "comment" && event.comment && (
                    <p className="mt-1 rounded-lg bg-muted px-3 py-2 text-sm whitespace-pre-wrap">{event.comment}</p>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {can("edit") && (
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (comment.trim()) add.mutate();
            }}
          >
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder="Ajouter un commentaire…" className="min-h-0" />
            <Button type="submit" size="icon" className="h-auto w-12 justify-center" loading={add.isPending} disabled={!comment.trim()} aria-label="Publier le commentaire">
              {!add.isPending && <Send className="h-4 w-4" />}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}

/** Pièces jointes (Cloudinary). */
function DocumentsCard({ requestId }: { requestId: string }) {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("autre");
  const key = [PATH, "documents", requestId];

  const { data: documents, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => (await api.get<{ items: RequestDocument[] }>(`/${PATH}/${requestId}/documents`)).data.items,
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      form.append("type", docType);
      await api.post(`/${PATH}/${requestId}/documents`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      toast.success("Document ajouté");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (docId: string) => api.delete(`/${PATH}/${requestId}/documents/${docId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Card>
      <CardHeader
        title="Pièces jointes"
        action={
          can("edit") && (
            <div className="flex gap-2">
              <Select value={docType} onChange={(e) => setDocType(e.target.value)} className="h-8 w-32 text-xs" aria-label="Type de document">
                {optionsOf(DOCUMENT_TYPES).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
              <Button size="sm" variant="outline" loading={upload.isPending} onClick={() => inputRef.current?.click()}>
                {!upload.isPending && <Upload className="h-3.5 w-3.5" />} Ajouter
              </Button>
              <input
                ref={inputRef}
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload.mutate(file);
                  e.target.value = "";
                }}
              />
            </div>
          )
        }
      />
      {isLoading ? (
        <LoadingBlock />
      ) : !documents?.length ? (
        <p className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-muted-foreground">
          <Paperclip className="h-4 w-4" /> Aucun document. PDF, Word, Excel ou images (15 Mo max).
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 px-5 py-3">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <a href={doc.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium hover:text-primary">{doc.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {DOCUMENT_TYPES[doc.type] ?? doc.type} · {formatBytes(doc.sizeBytes)} · {formatDate(doc.createdAt)}
                </span>
              </a>
              {can("edit") && (
                <Button size="icon" variant="ghost" aria-label="Supprimer le document" onClick={() => remove.mutate(doc.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
