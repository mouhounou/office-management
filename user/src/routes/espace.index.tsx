import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowUpRight,
  CircleCheck,
  FileText,
  GraduationCap,
  Handshake,
  Mail,
  MailWarning,
  Phone,
  Plus,
  Receipt,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  LoadingBlock,
  Panel,
  PanelHeader,
  Pill,
  StatusBadge,
  pillLink,
  timeAgo,
} from "@/components/account/ui";
import { errorMessage } from "@/lib/api";
import { account, type RequestKind } from "@/lib/account";
import { QUICK_ACTIONS } from "@/lib/account-actions";
import { useAccount } from "@/lib/account-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace/")({
  component: EspaceAccueil,
});

const KIND_ICONS: Record<RequestKind, LucideIcon> = {
  "business-requests": Handshake,
  quotes: Receipt,
  "pre-registrations": GraduationCap,
  applications: UserCheck,
  messages: Mail,
};

function EspaceAccueil() {
  const { member } = useAccount();
  const { data, isLoading } = useQuery({
    queryKey: ["account", "overview"],
    queryFn: account.overview,
    enabled: Boolean(member),
  });

  if (!member) return null;
  if (isLoading || !data) return <LoadingBlock />;

  const firstName = member.fullName.split(" ")[0];
  const actions = QUICK_ACTIONS.filter(
    (a) => !a.audience || a.audience === member.accountType,
  ).slice(0, 4);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {firstName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez vos demandes et gérez votre compte Office Management.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/espace/nouvelle-demande" className={pillLink()}>
            <Plus className="h-4 w-4" /> Nouvelle demande
          </Link>
          <Link to="/rendez-vous" className={pillLink("outline")}>
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      {!member.emailVerified && <VerifyBanner email={member.email} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          highlight
          title="Demandes en cours"
          value={data.open}
          caption="en attente ou en traitement"
          to="/espace/demandes"
          search={{ state: "open" }}
        />
        <StatCard
          title="Toutes mes demandes"
          value={data.total}
          caption="depuis la création du compte"
          to="/espace/demandes"
        />
        <StatCard
          title="Demandes abouties"
          value={data.completed}
          caption="terminées ou acceptées"
          to="/espace/demandes"
          search={{ state: "closed" }}
        />
        <StatCard
          title="Profil complété"
          value={`${data.profileCompletion} %`}
          caption="pour des formulaires pré-remplis"
          to="/espace/profil"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Mes dernières demandes"
            action={
              <Link
                to="/espace/demandes"
                aria-label="Voir toutes mes demandes"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition hover:rotate-45"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
          {data.latest.length === 0 ? (
            <div className="px-5 pb-8 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Vous n'avez encore envoyé aucune demande.
              </p>
              <Link to="/espace/nouvelle-demande" className={cn(pillLink("outline", "sm"), "mt-4")}>
                Faire une demande
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border px-2 pb-2">
              {data.latest.map((request, index) => {
                const Icon = KIND_ICONS[request.kind];
                return (
                  <li key={`${request.kind}-${request.id}`}>
                    <Link
                      to="/espace/demandes/$kind/$id"
                      params={{ kind: request.kind, id: request.id }}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          index % 2
                            ? "bg-silver/15 text-silver"
                            : "bg-brand-soft text-brand-strong",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{request.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {request.kindLabel} · {timeAgo(request.createdAt)}
                        </span>
                      </span>
                      <StatusBadge status={request.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <ProgressCard open={data.open} completed={data.completed} total={data.total} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Démarches rapides"
            description="Vos coordonnées sont pré-remplies et la demande arrive directement dans votre espace."
          />
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group flex items-center gap-3 rounded-xl border border-border p-3 transition hover:border-brand/60 hover:bg-muted"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{action.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:rotate-45" />
              </Link>
            ))}
          </div>
        </Panel>
        <HelpCard />
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  caption,
  to,
  search,
  highlight,
}: {
  title: string;
  value: number | string;
  caption: string;
  to: string;
  search?: Record<string, string>;
  highlight?: boolean;
}) {
  return (
    <Link to={to} search={search} className="group">
      <Panel
        className={cn(
          "relative h-full overflow-hidden p-5 transition group-hover:-translate-y-0.5",
          highlight &&
            "border-transparent bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)]",
        )}
      >
        {highlight && (
          <div className="pointer-events-none absolute -right-10 -bottom-16 h-40 w-40 rounded-full bg-cyan/30 blur-2xl" />
        )}
        <div className="relative flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition group-hover:rotate-45",
              highlight ? "border-white bg-white text-navy-deep" : "border-foreground/20",
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="relative mt-3 font-display text-5xl font-bold tabular-nums">{value}</div>
        <p
          className={cn(
            "relative mt-2 text-xs",
            highlight ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {caption}
        </p>
      </Panel>
    </Link>
  );
}

function VerifyBanner({ email }: { email: string }) {
  const [sending, setSending] = useState(false);
  const resend = async () => {
    setSending(true);
    try {
      await account.resendVerification();
      toast.success(`Email de confirmation renvoyé à ${email}`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSending(false);
    }
  };
  return (
    <Panel className="flex flex-wrap items-center gap-4 border-brand/40 bg-brand-soft/40 p-4">
      <MailWarning className="h-6 w-6 shrink-0 text-brand-strong" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Confirmez votre adresse email</p>
        <p className="text-xs text-muted-foreground">
          Cliquez sur le lien envoyé à {email}. Vos demandes envoyées avant l'inscription
          apparaîtront alors ici.
        </p>
      </div>
      <Pill size="sm" variant="outline" onClick={resend} loading={sending}>
        Renvoyer l'email
      </Pill>
    </Panel>
  );
}

/** Jauge en demi-cercle, comme le tableau de bord du back-office. */
function ProgressCard({
  open,
  completed,
  total,
}: {
  open: number;
  completed: number;
  total: number;
}) {
  const other = Math.max(0, total - open - completed);
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const length = Math.PI * 80;
  const arc = (value: number) => (total ? (value / total) * length : 0);
  const segments = [
    { value: completed, stroke: "var(--silver)" },
    { value: open, stroke: "var(--cyan)" },
    { value: other, stroke: "url(#espace-hatch)" },
  ];
  let offset = 0;

  return (
    <Panel className="flex flex-col p-5">
      <h2 className="text-base font-semibold">Avancement</h2>
      <p className="text-xs text-muted-foreground">Toutes vos demandes</p>
      <div className="relative mx-auto mt-4 w-full max-w-60">
        <svg
          viewBox="0 0 200 110"
          className="w-full"
          role="img"
          aria-label={`${percent} % de vos demandes ont abouti`}
        >
          <defs>
            <pattern
              id="espace-hatch"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="var(--card)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--hatch)" strokeWidth="2.5" />
            </pattern>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="22"
          />
          {segments.map((segment, index) => {
            const size = arc(segment.value);
            if (!size) return null;
            const element = (
              <path
                key={index}
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                strokeWidth="22"
                stroke={segment.stroke}
                strokeDasharray={`${Math.max(0, size - 3)} ${length}`}
                strokeDashoffset={-offset}
              />
            );
            offset += size;
            return element;
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="font-display text-4xl font-bold tabular-nums">{percent} %</div>
          <div className="text-xs text-muted-foreground">abouties</div>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-silver" />
          Abouties · {completed}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-cyan" />
          En cours · {open}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="hatched h-3 w-3 rounded-full" />
          Autres · {other}
        </li>
      </ul>
    </Panel>
  );
}

function HelpCard() {
  const { settings } = useLoaderData({ from: "__root__" });
  const phone = settings?.contact?.phone ?? "06 948 09 05";
  const whatsapp = (settings?.contact?.whatsapp ?? "+242069480905").replace(/[^\d]/g, "");
  return (
    <Panel className="relative flex flex-col overflow-hidden border-transparent bg-navy-deep p-5">
      <div className="pointer-events-none absolute -right-16 -bottom-20 h-64 w-64 rounded-full border-[18px] border-cyan/15" />
      <div className="pointer-events-none absolute -right-6 -bottom-10 h-40 w-40 rounded-full border-[14px] border-cyan/25" />
      <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
      <div className="relative">
        <CircleCheck className="mb-3 h-7 w-7 text-cyan" />
        <h2 className="text-base font-semibold text-white">Un conseiller à votre écoute</h2>
        <p className="mt-1 text-xs text-white/60">Du lundi au vendredi, de 8 h à 17 h.</p>
        <p className="mt-4 flex items-center gap-2 text-sm text-white">
          <Phone className="h-4 w-4 text-cyan" /> {phone}
        </p>
      </div>
      <div className="relative mt-auto flex gap-2 pt-6">
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className={cn(pillLink("light"), "flex-1")}
        >
          WhatsApp
        </a>
        <Link
          to="/contact"
          aria-label="Nous écrire"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan text-navy-deep transition hover:bg-cyan-glow"
        >
          <Mail className="h-4 w-4" />
        </Link>
      </div>
    </Panel>
  );
}
