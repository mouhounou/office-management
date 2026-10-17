import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FolderOpen,
  GraduationCap,
  Handshake,
  Mail,
  Receipt,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { LoadingBlock, Panel, StatusBadge, formatDate, pillLink } from "@/components/account/ui";
import { account, KIND_LABELS, type RequestKind } from "@/lib/account";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

type Search = { kind?: RequestKind; state?: "open" | "closed" };

const KINDS = Object.keys(KIND_LABELS) as RequestKind[];

export const Route = createFileRoute("/espace/demandes/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    kind: KINDS.includes(search.kind as RequestKind) ? (search.kind as RequestKind) : undefined,
    state: search.state === "open" || search.state === "closed" ? search.state : undefined,
  }),
  component: MesDemandes,
});

const ICONS: Record<RequestKind, LucideIcon> = {
  "business-requests": Handshake,
  quotes: Receipt,
  "pre-registrations": GraduationCap,
  applications: UserCheck,
  messages: Mail,
};

function MesDemandes() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/espace/demandes/" });
  const { member } = useAccount();
  const { data, isLoading } = useQuery({
    queryKey: ["account", "requests", search],
    queryFn: () => account.requests({ kind: search.kind, state: search.state }),
    enabled: Boolean(member),
  });

  const setSearch = (next: Partial<Search>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes demandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Devis, pré-inscriptions, demandes Business Center, candidatures et messages envoyés depuis
          le site.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-border bg-card p-1">
          {[undefined, ...KINDS].map((kind) => (
            <button
              key={kind ?? "all"}
              onClick={() => setSearch({ kind })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition",
                search.kind === kind
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {kind ? KIND_LABELS[kind] : "Toutes"}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1 text-sm">
          {([undefined, "open", "closed"] as const).map((state) => (
            <button
              key={state ?? "all"}
              onClick={() => setSearch({ state })}
              className={cn(
                "rounded-full px-3.5 py-1.5 transition",
                search.state === state
                  ? "bg-muted font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {state === "open" ? "En cours" : state === "closed" ? "Clôturées" : "Tous statuts"}
            </button>
          ))}
        </div>
      </div>

      <Panel>
        {isLoading ? (
          <LoadingBlock />
        ) : !data?.items.length ? (
          <div className="px-6 py-14 text-center">
            <FolderOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">
              Aucune demande {search.kind || search.state ? "pour ce filtre" : "pour l'instant"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Les demandes envoyées en étant connecté apparaissent ici automatiquement.
            </p>
            <Link to="/espace/nouvelle-demande" className={cn(pillLink("outline", "sm"), "mt-4")}>
              Faire une demande
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.items.map((request) => {
              const Icon = ICONS[request.kind];
              return (
                <li key={`${request.kind}-${request.id}`}>
                  <Link
                    to="/espace/demandes/$kind/$id"
                    params={{ kind: request.kind, id: request.id }}
                    className="flex flex-wrap items-center gap-3 px-5 py-4 transition hover:bg-muted/60 sm:flex-nowrap"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{request.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {request.kindLabel}
                        {request.subtitle ? ` · ${request.subtitle}` : ""}
                      </span>
                    </span>
                    <span className="flex w-full items-center justify-between gap-3 pl-[52px] sm:w-auto sm:pl-0">
                      <StatusBadge status={request.status} />
                      <span className="text-xs whitespace-nowrap text-muted-foreground sm:w-24 sm:text-right">
                        {formatDate(request.createdAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
