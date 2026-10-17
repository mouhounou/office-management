import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { ImageUpload } from "@/components/ImageUpload";
import { Button, Card, CardHeader, ErrorBlock, Field, Input, LoadingBlock, PageHeader } from "@/components/ui/primitives";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Settings = Record<string, Record<string, string>>;

/** Groupes affichés : clé du réglage côté API → champs. Le site public lit ces valeurs. */
const GROUPS: { key: string; title: string; description: string; fields: { name: string; label: string; type?: "image"; hint?: string }[] }[] = [
  {
    key: "contact",
    title: "Coordonnées",
    description: "Affichées dans le pied de page et la page contact du site.",
    fields: [
      { name: "email", label: "Email de contact", hint: "Reçoit aussi les notifications des formulaires si EMAIL_ADMIN n'est pas défini." },
      { name: "phone", label: "Téléphone" },
      { name: "whatsapp", label: "WhatsApp", hint: "Format international, ex. +242069480905" },
      { name: "address", label: "Adresse" },
      { name: "hours", label: "Horaires" },
    ],
  },
  {
    key: "legal",
    title: "Mentions légales",
    description: "Identifiants officiels de l'entreprise.",
    fields: [
      { name: "rccm", label: "RCCM" },
      { name: "niu", label: "NIU" },
      { name: "approval", label: "Agrément" },
    ],
  },
  {
    key: "social",
    title: "Réseaux sociaux",
    description: "Liens complets (https://…). Laisser vide pour masquer l'icône.",
    fields: [
      { name: "facebook", label: "Facebook" },
      { name: "instagram", label: "Instagram" },
      { name: "tiktok", label: "TikTok" },
      { name: "linkedin", label: "LinkedIn" },
    ],
  },
  {
    key: "ceo",
    title: "Mot du dirigeant",
    description: "Signature affichée sur le site.",
    fields: [
      { name: "displayName", label: "Nom affiché" },
      { name: "displayTitle", label: "Fonction" },
      { name: "signatureUrl", label: "Signature (image)", type: "image" },
    ],
  },
];

export function SettingsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get<{ settings: Settings }>("/settings")).data.settings,
  });

  if (isLoading) return <LoadingBlock />;
  if (error || !data) return <ErrorBlock error={error} onRetry={refetch} />;

  return (
    <>
      <PageHeader title="Paramètres du site" description="Ces informations sont lues en direct par le site public." />
      <div className="grid gap-6 xl:grid-cols-2">
        {GROUPS.map((group) => (
          <SettingGroup key={group.key} group={group} initial={data[group.key] ?? {}} />
        ))}
      </div>
    </>
  );
}

function SettingGroup({ group, initial }: { group: (typeof GROUPS)[number]; initial: Record<string, string> }) {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(group.fields.map((f) => [f.name, initial[f.name] ?? ""])),
  );
  const dirty = group.fields.some((f) => (initial[f.name] ?? "") !== values[f.name]);
  const readOnly = !can("admin");

  const save = useMutation({
    mutationFn: () => api.put(`/settings/${group.key}`, { value: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success(`${group.title} enregistré(e)s`);
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  return (
    <Card>
      <CardHeader
        title={group.title}
        description={group.description}
        action={
          !readOnly && (
            <Button size="sm" onClick={() => save.mutate()} disabled={!dirty} loading={save.isPending}>
              <Save className="h-3.5 w-3.5" /> Enregistrer
            </Button>
          )
        }
      />
      <div className="space-y-4 p-5">
        {group.fields.map((field) => (
          <Field key={field.name} label={field.label} htmlFor={`${group.key}-${field.name}`} hint={field.hint}>
            {field.type === "image" ? (
              <ImageUpload value={values[field.name]} folder="site" disabled={readOnly} onChange={(url) => setValues({ ...values, [field.name]: url })} />
            ) : (
              <Input id={`${group.key}-${field.name}`} value={values[field.name]} disabled={readOnly} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })} />
            )}
          </Field>
        ))}
        {readOnly && <p className="text-xs text-muted-foreground">Seuls les administrateurs peuvent modifier ces paramètres.</p>}
      </div>
    </Card>
  );
}
