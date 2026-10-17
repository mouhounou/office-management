import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CircleDot, MessageCircle, RefreshCw, Sparkles } from "lucide-react";

import {
  LoadingBlock,
  Panel,
  PanelHeader,
  StatusBadge,
  formatDate,
  pillLink,
} from "@/components/account/ui";
import { account, STATUS, type TimelineEvent } from "@/lib/account";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace/demandes/$kind/$id")({
  component: DetailDemande,
});

const TIME_SLOTS: Record<string, string> = {
  matin: "Matin (8h – 12h)",
  "apres-midi": "Après-midi (13h – 17h)",
};
const REQUEST_TYPES: Record<string, string> = {
  recrutement: "Recrutement",
  formation: "Formation",
  audit_rh: "Audit RH",
  autre: "Autre",
};
const PRIORITIES: Record<string, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

type Item = Record<string, unknown>;
const str = (value: unknown) =>
  value === null || value === undefined || value === "" ? null : String(value);
const date = (value: unknown) => (value ? formatDate(String(value)) : null);

/** Champs affichés au client, par type de demande. */
const FIELDS: Record<string, (i: Item) => [string, string | null][]> = {
  "business-requests": (i) => [
    ["Type", REQUEST_TYPES[String(i.type)] ?? str(i.type)],
    ["Entreprise", str(i.companyName)],
    ["Contact", str(i.contactName)],
    ["Email", str(i.contactEmail)],
    ["Téléphone", str(i.contactPhone)],
    ["Priorité", PRIORITIES[String(i.priority)] ?? str(i.priority)],
    ["Budget", str(i.budget)],
    ["Échéance", date(i.deadline)],
    ...Object.entries((i.details as Record<string, string>) ?? {}).map(
      ([k, v]) =>
        [k.charAt(0).toUpperCase() + k.slice(1).replace(/[_-]/g, " "), str(v)] as [
          string,
          string | null,
        ],
    ),
    ["Description", str(i.description)],
  ],
  quotes: (i) => [
    ["Pôle", str(i.pole)],
    ["Nom", str(i.name)],
    ["Entreprise", str(i.company)],
    ["Email", str(i.email)],
    ["Téléphone", str(i.phone)],
    ["Budget", str(i.budget)],
    ["Échéance", str(i.deadline)],
    ["Message", str(i.message)],
  ],
  "pre-registrations": (i) => [
    ["Formation", str(i.training)],
    ["Durée", str(i.duration)],
    ["Début souhaité", date(i.startDate)],
    ["Financement", str(i.financingType)],
    ["Email", str(i.email)],
    ["Téléphone", str(i.phone)],
  ],
  applications: (i) => [
    ["Offre", (i.offer as { title?: string } | null)?.title ?? "Candidature spontanée"],
    ["Email", str(i.email)],
    ["Téléphone", str(i.phone)],
    ["CV", str(i.cvUrl)],
    ["Message", str(i.coverLetter)],
  ],
  messages: (i) =>
    i.kind === "rendez-vous"
      ? [
          ["Motif", str(i.reason)],
          ["Date souhaitée", date(i.preferredDate)],
          ["Créneau", TIME_SLOTS[String(i.timeSlot)] ?? str(i.timeSlot)],
          ["Téléphone", str(i.phone)],
          ["Précisions", str(i.message)],
        ]
      : [
          ["Sujet", str(i.subject)],
          ["Téléphone", str(i.phone)],
          ["Message", str(i.message)],
        ],
};

function describe(event: TimelineEvent) {
  if (event.type === "created")
    return { icon: Sparkles, text: "Demande envoyée et reçue par notre équipe" };
  if (event.type === "status_change")
    return {
      icon: RefreshCw,
      text: `Statut : ${STATUS[event.toStatus ?? ""]?.label ?? event.toStatus}`,
    };
  return {
    icon: CircleDot,
    text: `Dossier mis à jour${event.toStatus ? ` — ${STATUS[event.toStatus]?.label ?? event.toStatus}` : ""}`,
  };
}

function DetailDemande() {
  const { kind, id } = Route.useParams();
  const { member } = useAccount();
  const { data, isLoading, error } = useQuery({
    queryKey: ["account", "request", kind, id],
    queryFn: () => account.request(kind, id),
    enabled: Boolean(member),
    retry: false,
  });

  if (isLoading) return <LoadingBlock />;
  if (error || !data) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Demande introuvable</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Elle a peut-être été retirée de votre espace.
        </p>
        <Link to="/espace/demandes" className={cn(pillLink("outline", "sm"), "mt-4")}>
          Retour à mes demandes
        </Link>
      </div>
    );
  }

  const { item, timeline } = data;
  const rows = (FIELDS[kind]?.(item) ?? []).filter(([, value]) => value);

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/espace/demandes"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Mes demandes
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{item.title}</h1>
          <StatusBadge status={item.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {item.kindLabel} · envoyée le {formatDate(item.createdAt, true)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHeader title="Votre demande" />
          <dl className="divide-y divide-border px-5 pb-3">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 py-2.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm break-words whitespace-pre-wrap">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Suivi" description="Les étapes de votre dossier." />
            <ol className="relative mx-5 mb-5 space-y-5 border-l border-border pl-6">
              {timeline.map((event, index) => {
                const { icon: Icon, text } = describe(event);
                return (
                  <li key={index} className="relative">
                    <span className="absolute top-0.5 -left-[33px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card">
                      <Icon className="h-3 w-3 text-brand-strong" />
                    </span>
                    <p className="text-sm">{text}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.at, true)}</p>
                  </li>
                );
              })}
            </ol>
          </Panel>
          <Panel className="p-5">
            <MessageCircle className="mb-2 h-6 w-6 text-brand-strong" />
            <p className="text-sm font-semibold">Une précision à apporter ?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Écrivez-nous en rappelant l'objet de votre demande : un conseiller vous répond
              rapidement.
            </p>
            <Link to="/contact" className={cn(pillLink("outline", "sm"), "mt-4 w-full")}>
              Nous écrire
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  );
}
