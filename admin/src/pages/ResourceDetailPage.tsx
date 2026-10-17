import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ResourceForm } from "@/components/ResourceForm";
import { ConfirmDialog } from "@/components/ui/dialog";
import { DetailRow, StatusBadge } from "@/components/ui/data";
import { Button, Card, CardHeader, ErrorBlock, Field, LoadingBlock, PageHeader, Select, Textarea } from "@/components/ui/primitives";
import { errorMessage, fieldErrorsOf, type AnyRecord, type FieldErrors } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { optionsOf } from "@/lib/constants";
import { useCreate, useItem, useRemove, useUpdate } from "@/lib/queries";
import { RESOURCE_BY_KEY, type ResourceDef } from "@/lib/resources";
import { formatDate } from "@/lib/utils";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function ResourceDetailPage() {
  const { resource: key = "", id = "" } = useParams();
  const def = RESOURCE_BY_KEY[key];
  if (!def) return <NotFoundPage />;
  if (id === "new") return def.mode === "content" ? <CreateView def={def} /> : <NotFoundPage />;
  return <ExistingView key={`${def.key}-${id}`} def={def} id={id} />;
}

function BackLink({ def }: { def: ResourceDef }) {
  return (
    <Link to={`/${def.key}`} className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> {def.title}
    </Link>
  );
}

function CreateView({ def }: { def: ResourceDef }) {
  const navigate = useNavigate();
  const create = useCreate(def.key);
  const [errors, setErrors] = useState<FieldErrors>({});
  const formId = `create-${def.key}`;

  const submit = async (payload: Record<string, unknown>) => {
    setErrors({});
    try {
      const item = await create.mutateAsync(payload);
      toast.success(`${capitalize(def.singular)} créé(e)`);
      navigate(`/${def.key}/${item.id}`, { replace: true });
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        back={<BackLink def={def} />}
        title={`Nouveau : ${def.singular}`}
        actions={
          <Button type="submit" form={formId} loading={create.isPending}>
            <Save className="h-4 w-4" /> Enregistrer
          </Button>
        }
      />
      <Card className="p-5">
        <ResourceForm formId={formId} fields={def.fields ?? []} errors={errors} onSubmit={submit} />
      </Card>
    </>
  );
}

function ExistingView({ def, id }: { def: ResourceDef; id: string }) {
  const navigate = useNavigate();
  const { can } = useAuth();
  const { data: item, isLoading, error, refetch } = useItem(def.key, id);
  const remove = useRemove(def.key);
  const [confirm, setConfirm] = useState(false);

  if (isLoading) return <LoadingBlock />;
  if (error || !item) return <ErrorBlock error={error ?? new Error("Introuvable")} onRetry={refetch} />;

  const canDelete = can(def.deleteLevel === "admin" ? "admin" : "edit");

  const onDelete = async () => {
    try {
      await remove.mutateAsync(id);
      toast.success("Supprimé");
      navigate(`/${def.key}`, { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <>
      <PageHeader
        back={<BackLink def={def} />}
        title={def.primary(item)}
        description={`Créé le ${formatDate(item.createdAt, true)}${item.updatedAt && item.updatedAt !== item.createdAt ? ` · modifié le ${formatDate(item.updatedAt, true)}` : ""}`}
        actions={
          <>
            {canDelete && (
              <Button variant="outline" onClick={() => setConfirm(true)} className="text-destructive">
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            )}
            {def.mode === "content" && can("edit") && (
              <Button type="submit" form={`edit-${def.key}`}>
                <Save className="h-4 w-4" /> Enregistrer
              </Button>
            )}
          </>
        }
      />

      {def.mode === "inbox" ? <InboxView def={def} item={item} /> : <ContentEdit def={def} item={item} />}

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={onDelete}
        loading={remove.isPending}
        title={`Supprimer cet(te) ${def.singular} ?`}
        description="Cette action est définitive."
      />
    </>
  );
}

function ContentEdit({ def, item }: { def: ResourceDef; item: AnyRecord }) {
  const { can } = useAuth();
  const update = useUpdate(def.key, item.id);
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = async (payload: Record<string, unknown>) => {
    setErrors({});
    try {
      await update.mutateAsync(payload);
      toast.success("Modifications enregistrées");
    } catch (error) {
      setErrors(fieldErrorsOf(error));
      toast.error(errorMessage(error));
    }
  };

  return (
    <Card className="p-5">
      <ResourceForm formId={`edit-${def.key}`} fields={def.fields ?? []} item={item} errors={errors} readOnly={!can("edit")} onSubmit={submit} />
    </Card>
  );
}

/** Dépôt du site : détail en lecture, traitement (statut + notes) à droite. */
function InboxView({ def, item }: { def: ResourceDef; item: AnyRecord }) {
  const { can } = useAuth();
  const update = useUpdate(def.key, item.id);
  const [status, setStatus] = useState<string>(item.status ?? "");
  const [notes, setNotes] = useState<string>(item.adminNotes ?? "");
  const statusMap = def.statusMap ?? {};
  const dirty = status !== (item.status ?? "") || notes !== (item.adminNotes ?? "");

  const save = async () => {
    try {
      await update.mutateAsync({ status, adminNotes: notes });
      toast.success("Dossier mis à jour");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader title="Détail" action={<StatusBadge value={item.status} map={statusMap} />} />
        <dl className="divide-y divide-border px-5 py-2">
          {(def.details?.(item) ?? []).map(([label, value]) => (
            <DetailRow key={label} label={label}>
              {value === undefined || value === null || value === "" ? "—" : value}
            </DetailRow>
          ))}
        </dl>
      </Card>

      <Card className="h-fit lg:sticky lg:top-20">
        <CardHeader title="Traitement" description="Visible uniquement par l'équipe." />
        <div className="space-y-4 p-5">
          <Field label="Statut" htmlFor="status">
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={!can("edit")}>
              {optionsOf(statusMap).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Notes internes" htmlFor="notes">
            <Textarea id="notes" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!can("edit")} placeholder="Appel passé, pièces reçues…" />
          </Field>
          {can("edit") && (
            <Button className="w-full justify-center" onClick={save} disabled={!dirty} loading={update.isPending}>
              <Save className="h-4 w-4" /> Enregistrer
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
