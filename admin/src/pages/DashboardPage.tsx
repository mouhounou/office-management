import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarClock,
  Download,
  GraduationCap,
  Handshake,
  Mail,
  Plus,
  Receipt,
  TrendingDown,
  TrendingUp,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/ui/data";
import { Button, Card, ErrorBlock, LoadingBlock } from "@/components/ui/primitives";
import { api, errorMessage, type AnyRecord } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { REQUEST_TYPES, SIMPLE_STATUSES, TIME_SLOTS } from "@/lib/constants";
import { cn, formatDate, timeAgo } from "@/lib/utils";

type Trend = { current: number; previous: number };
type Counts = Record<string, { total?: number; pending?: number; published?: number; last30Days?: number }>;
type TeamMember = { id: string; fullName: string; email: string; open: number; current: { id: string; title: string; status: string } };
type Dashboard = {
  counts: Counts;
  byStatus: Record<string, Record<string, number>>;
  latest: Record<string, AnyRecord[]>;
  trends: Record<string, Trend>;
  nextAppointment: AnyRecord | null;
  team: TeamMember[];
};
type Week = { week: string; businessRequests: number; quotes: number; preRegistrations: number; applications: number };

const STREAMS: { key: string; label: string; to: string; icon: LucideIcon; pendingStatus: string }[] = [
  { key: "businessRequests", label: "Business Center", to: "/business-requests", icon: Handshake, pendingStatus: "new" },
  { key: "quotes", label: "Devis", to: "/quotes", icon: Receipt, pendingStatus: "new" },
  { key: "preRegistrations", label: "Pré-inscriptions", to: "/pre-registrations", icon: GraduationCap, pendingStatus: "new" },
  { key: "applications", label: "Candidatures", to: "/applications", icon: UserCheck, pendingStatus: "submitted" },
  { key: "messages", label: "Messages", to: "/messages", icon: Mail, pendingStatus: "new" },
];

export function DashboardPage() {
  const { user, can } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: async () => (await api.get<Dashboard>("/stats/dashboard")).data,
    refetchInterval: 60_000,
  });

  if (isLoading) return <LoadingBlock label="Chargement du tableau de bord…" />;
  if (error || !data) return <ErrorBlock error={error} onRetry={refetch} />;

  const { counts, trends } = data;
  const totalPending = STREAMS.reduce((sum, s) => sum + (counts[s.key]?.pending ?? 0), 0);
  const totalTrend = STREAMS.reduce(
    (acc, s) => ({ current: acc.current + (trends?.[s.key]?.current ?? 0), previous: acc.previous + (trends?.[s.key]?.previous ?? 0) }),
    { current: 0, previous: 0 },
  );
  const firstName = user?.fullName.split(" ")[0] ?? "";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bonjour {firstName}, voici l'activité du cabinet : demandes, contenus et équipe.
          </p>
        </div>
        {can("edit") && (
          <div className="flex flex-wrap gap-2">
            <Link to="/offers/new">
              <Button>
                <Plus className="h-4 w-4" /> Nouvelle offre
              </Button>
            </Link>
            <Link to="/posts/new">
              <Button variant="outline">Nouvel article</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Chiffres clés */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard highlight title="Dossiers à traiter" value={totalPending} to="/business-requests?status=new" trend={totalTrend} trendLabel="dépôts" />
        {STREAMS.slice(0, 3).map((stream) => (
          <StatCard
            key={stream.key}
            title={stream.label}
            value={counts[stream.key]?.pending ?? 0}
            caption={`à traiter · ${counts[stream.key]?.total ?? 0} au total`}
            to={`${stream.to}?status=${stream.pendingStatus}`}
            trend={trends?.[stream.key]}
            trendLabel="reçus"
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
        <ActivityCard className="lg:col-span-2" />
        <AppointmentCard appointment={data.nextAppointment} />
        <LatestCard latest={data.latest} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
        <TeamCard team={data.team ?? []} className="lg:col-span-2" />
        <ProgressCard byStatus={data.byStatus.businessRequests ?? {}} />
        <NewsletterCard total={counts.subscribers?.total ?? 0} recent={counts.subscribers?.last30Days ?? 0} />
      </section>
    </div>
  );
}

// --- Cartes de chiffres ------------------------------------------------------

function TrendLine({ trend, label, inverted }: { trend?: Trend; label: string; inverted?: boolean }) {
  if (!trend) return null;
  const diff = trend.current - trend.previous;
  const Icon = diff < 0 ? TrendingDown : TrendingUp;
  // 30 derniers jours comparés aux 30 précédents.
  const text = diff === 0 ? `Stable vs mois précédent` : `${diff > 0 ? "+" : ""}${diff} ${label} vs mois précédent`;
  return (
    <p className={cn("flex items-center gap-2 text-xs", inverted ? "text-white/75" : "text-muted-foreground")}>
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", inverted ? "border-white/30 text-cyan-glow" : "border-border text-brand-strong")}>
        <Icon className="h-3 w-3" />
      </span>
      <span className="truncate">{text}</span>
    </p>
  );
}

function StatCard({
  title,
  value,
  caption,
  to,
  trend,
  trendLabel,
  highlight,
}: {
  title: string;
  value: number;
  caption?: string;
  to: string;
  trend?: Trend;
  trendLabel: string;
  highlight?: boolean;
}) {
  return (
    <Link to={to} className="group">
      <Card
        className={cn(
          "relative h-full overflow-hidden p-5 transition group-hover:-translate-y-0.5 group-hover:shadow-lg",
          highlight && "border-transparent bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)] text-white",
        )}
      >
        {highlight && <div className="pointer-events-none absolute -right-10 -bottom-16 h-40 w-40 rounded-full bg-cyan/30 blur-2xl" />}
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
        {caption && <p className="relative mt-1 text-xs text-muted-foreground">{caption}</p>}
        <div className="relative mt-3">
          <TrendLine trend={trend} label={trendLabel} inverted={highlight} />
        </div>
      </Card>
    </Link>
  );
}

// --- Activité : barres en pilule ----------------------------------------------

const WEEK_PARTS: { key: keyof Week; label: string }[] = [
  { key: "businessRequests", label: "Business Center" },
  { key: "quotes", label: "Devis" },
  { key: "preRegistrations", label: "Pré-inscriptions" },
  { key: "applications", label: "Candidatures" },
];

/**
 * Dépôts par semaine. Chaque colonne est une piste hachurée remplie depuis le
 * bas par le volume de la semaine : la semaine en cours en navy, les autres en
 * cyan. Le détail par flux est dans l'infobulle et la vue tableau.
 */
function ActivityCard({ className }: { className?: string }) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hover, setHover] = useState<number | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["stats", "activity", 8],
    queryFn: async () => (await api.get<{ weeks: Week[] }>("/stats/activity", { params: { weeks: 8 } })).data,
  });

  const weeks = useMemo(
    () =>
      (data?.weeks ?? []).map((w) => ({
        ...w,
        total: WEEK_PARTS.reduce((sum, p) => sum + (w[p.key] as number), 0),
        label: new Date(w.week).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
        // Axe compact (12/10) : huit libellés tiennent même sur un écran de 360 px.
        short: new Date(w.week).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      })),
    [data],
  );
  const max = Math.max(1, ...weeks.map((w) => w.total));
  const total = weeks.reduce((sum, w) => sum + w.total, 0);

  return (
    <Card className={cn("flex flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Activité des dépôts</h2>
          <p className="text-xs text-muted-foreground">{total} dépôts sur 8 semaines</p>
        </div>
        <div className="flex rounded-full border border-border p-0.5 text-xs">
          {(["chart", "table"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("rounded-full px-3 py-1 transition", view === v ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground")}>
              {v === "chart" ? "Graphique" : "Tableau"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingBlock />
      ) : view === "chart" ? (
        <div className="mt-6 flex flex-1 items-end gap-1.5 sm:gap-3" style={{ minHeight: 200 }}>
          {weeks.map((week, index) => {
            const current = index === weeks.length - 1;
            const height = week.total ? Math.max(14, (week.total / max) * 100) : 0;
            return (
              <div
                key={week.week}
                className="relative flex h-full min-w-0 flex-1 flex-col items-center gap-2 outline-none"
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(index)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`Semaine du ${week.label} : ${week.total} dépôt${week.total > 1 ? "s" : ""}`}
              >
                <div className="hatched relative w-full max-w-12 flex-1 overflow-hidden rounded-full" style={{ minHeight: 150 }}>
                  {week.total > 0 && (
                    <div
                      className={cn("absolute inset-x-0 bottom-0 rounded-full transition-all", current ? "bg-navy-deep dark:bg-silver" : "bg-brand")}
                      style={{ height: `${height}%` }}
                    />
                  )}
                </div>
                {current && week.total > 0 && hover === null && (
                  <span className="absolute -top-3 rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-semibold shadow-sm">{week.total}</span>
                )}
                <span className={cn("text-[10px] whitespace-nowrap sm:text-[11px]", current ? "font-semibold" : "text-muted-foreground")}>{week.short}</span>
                {hover === index && (
                  <div className={cn("absolute bottom-full z-10 mb-2 w-44 rounded-xl border border-border bg-card p-2.5 text-xs shadow-xl", index > weeks.length / 2 ? "right-0" : "left-0")}>
                    <div className="mb-1 font-semibold">Semaine du {week.label}</div>
                    {WEEK_PARTS.map((p) => (
                      <div key={p.key} className="flex justify-between gap-3 text-muted-foreground">
                        <span>{p.label}</span>
                        <span className="font-medium text-foreground tabular-nums">{week[p.key] as number}</span>
                      </div>
                    ))}
                    <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold">
                      <span>Total</span>
                      <span className="tabular-nums">{week.total}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card text-xs text-muted-foreground">
              <tr>
                <th className="py-2 text-left font-medium">Semaine du</th>
                {WEEK_PARTS.map((p) => (
                  <th key={p.key} className="py-2 text-right font-medium">{p.label}</th>
                ))}
                <th className="py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.week} className="border-t border-border">
                  <td className="py-1.5">{w.label}</td>
                  {WEEK_PARTS.map((p) => (
                    <td key={p.key} className="py-1.5 text-right tabular-nums">{w[p.key] as number}</td>
                  ))}
                  <td className="py-1.5 text-right font-semibold tabular-nums">{w.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// --- Prochain rendez-vous ------------------------------------------------------

function AppointmentCard({ appointment }: { appointment: AnyRecord | null }) {
  return (
    <Card className="flex flex-col p-5">
      <h2 className="text-base font-semibold">Prochain rendez-vous</h2>
      {appointment ? (
        <>
          <p className="mt-4 font-display text-xl leading-snug font-bold">{appointment.reason}</p>
          <p className="mt-1 text-sm text-muted-foreground">avec {appointment.name}</p>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="h-4 w-4 text-brand-strong" />
            {formatDate(appointment.preferredDate)} · {TIME_SLOTS[appointment.timeSlot] ?? appointment.timeSlot}
          </p>
          <div className="mt-auto pt-5">
            <Link to={`/messages/${appointment.id}`}>
              <Button className="w-full justify-center">
                <CalendarClock className="h-4 w-4" /> Voir la demande
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted-foreground">Aucun rendez-vous à venir.</p>
          <div className="mt-auto pt-5">
            <Link to="/messages?kind=rendez-vous">
              <Button variant="outline" className="w-full justify-center">Demandes de rendez-vous</Button>
            </Link>
          </div>
        </>
      )}
    </Card>
  );
}

// --- Derniers dépôts, tous flux confondus ---------------------------------------

const LATEST: Record<string, { to: string; icon: LucideIcon; title: (i: AnyRecord) => string }> = {
  businessRequests: { to: "/business-requests", icon: Handshake, title: (i) => `${i.title} — ${REQUEST_TYPES[i.type] ?? i.type}` },
  quotes: { to: "/quotes", icon: Receipt, title: (i) => `Devis · ${i.name}` },
  preRegistrations: { to: "/pre-registrations", icon: GraduationCap, title: (i) => `${i.fullName} · ${i.training}` },
  applications: { to: "/applications", icon: UserCheck, title: (i) => `Candidature · ${i.fullName}` },
  messages: { to: "/messages", icon: Mail, title: (i) => `${i.kind === "rendez-vous" ? "Rendez-vous" : "Message"} · ${i.name}` },
};

function LatestCard({ latest }: { latest: Record<string, AnyRecord[]> }) {
  const items = Object.entries(LATEST)
    .flatMap(([key, def]) => (latest[key] ?? []).map((item) => ({ key, def, item })))
    .sort((a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Derniers dépôts</h2>
        <Link
          to="/notifications"
          aria-label="Voir toutes les notifications"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition hover:rotate-45"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Rien de reçu pour l'instant.</p>
      ) : (
        <ul className="mt-4 space-y-3.5">
          {items.map(({ key, def, item }, index) => (
            <li key={`${key}-${item.id}`}>
              <Link to={`${def.to}/${item.id}`} className="group flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    index % 2 ? "bg-navy text-white dark:bg-silver/20" : "bg-brand-soft text-brand-strong",
                  )}
                >
                  <def.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium group-hover:text-brand-strong">{def.title(item)}</span>
                  <span className="block text-[11px] text-muted-foreground">Reçu {timeAgo(item.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// --- Équipe --------------------------------------------------------------------

function TeamCard({ team, className }: { team: TeamMember[]; className?: string }) {
  const { can } = useAuth();
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Équipe</h2>
          <p className="text-xs text-muted-foreground">Demandes Business Center en cours, par personne</p>
        </div>
        {can("admin") && (
          <Link to="/users">
            <Button size="sm" variant="outline">
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </Button>
          </Link>
        )}
      </div>
      {team.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Assignez des demandes pour suivre la charge de l'équipe.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {team.map((member, index) => (
            <li key={member.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  ["bg-brand-soft text-brand-strong", "bg-navy text-white", "bg-silver/40 text-navy dark:text-white"][index % 3],
                )}
              >
                {member.fullName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {member.fullName}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {member.open} demande{member.open > 1 ? "s" : ""}
                  </span>
                </p>
                <Link to={`/business-requests/${member.current.id}`} className="block truncate text-xs text-muted-foreground hover:text-brand-strong">
                  Travaille sur <span className="font-medium text-foreground">{member.current.title}</span>
                </Link>
              </div>
              <StatusBadge value={member.current.status} map={SIMPLE_STATUSES} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// --- Avancement : jauge en demi-cercle -------------------------------------------

function ProgressCard({ byStatus }: { byStatus: Record<string, number> }) {
  const done = byStatus.completed ?? 0;
  const ongoing = (byStatus.in_review ?? 0) + (byStatus.in_progress ?? 0);
  const waiting = byStatus.new ?? 0;
  const total = done + ongoing + waiting;
  const percent = total ? Math.round((done / total) * 100) : 0;

  // Demi-cercle de rayon 80 : longueur 80π, découpée en trois arcs.
  const length = Math.PI * 80;
  const arc = (value: number) => (total ? (value / total) * length : 0);
  const segments = [
    { value: done, className: "stroke-navy-deep dark:stroke-silver" },
    { value: ongoing, className: "stroke-brand" },
    { value: waiting, className: "", hatched: true },
  ];
  let offset = 0;

  return (
    <Card className="flex flex-col p-5">
      <h2 className="text-base font-semibold">Avancement</h2>
      <p className="text-xs text-muted-foreground">Demandes Business Center, hors annulées</p>
      <div className="relative mx-auto mt-4 w-full max-w-60">
        <svg viewBox="0 0 200 110" className="w-full" role="img" aria-label={`${percent} % des demandes terminées`}>
          <defs>
            <pattern id="gauge-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--card)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--hatch)" strokeWidth="2.5" />
            </pattern>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--muted)" strokeWidth="22" />
          {segments.map((segment, index) => {
            const size = arc(segment.value);
            if (!size) return null;
            // Un écart de 3 unités entre arcs, comme les séparations de la maquette.
            const element = (
              <path
                key={index}
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                strokeWidth="22"
                strokeDasharray={`${Math.max(0, size - 3)} ${length}`}
                strokeDashoffset={-offset}
                className={segment.className}
                stroke={segment.hatched ? "url(#gauge-hatch)" : undefined}
              />
            );
            offset += size;
            return element;
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="font-display text-4xl font-bold tabular-nums">{percent} %</div>
          <div className="text-xs text-muted-foreground">terminées</div>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-navy-deep dark:bg-silver" />Terminées · {done}</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-brand" />En cours · {ongoing}</li>
        <li className="flex items-center gap-1.5"><span className="hatched h-3 w-3 rounded-full" />Nouvelles · {waiting}</li>
      </ul>
    </Card>
  );
}

// --- Newsletter : carte sombre ----------------------------------------------------

function NewsletterCard({ total, recent }: { total: number; recent: number }) {
  const [exporting, setExporting] = useState(false);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const { data } = await api.get<Blob>("/subscribers/export/csv", { responseType: "blob" });
      const url = URL.createObjectURL(data);
      Object.assign(document.createElement("a"), { href: url, download: "abonnes-newsletter.csv" }).click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="relative flex flex-col overflow-hidden border-transparent bg-navy-deep p-5 text-white">
      {/* Ondes concentriques, à la manière de la carte sombre de la maquette. */}
      <div className="pointer-events-none absolute -right-16 -bottom-20 h-64 w-64 rounded-full border-[18px] border-cyan/15" />
      <div className="pointer-events-none absolute -right-6 -bottom-10 h-40 w-40 rounded-full border-[14px] border-cyan/25" />
      <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
      <div className="relative">
        <h2 className="text-base font-semibold">Newsletter</h2>
        <p className="text-xs text-white/60">Abonnés actifs</p>
        <div className="mt-4 font-display text-5xl font-bold tabular-nums">{total}</div>
        <p className="mt-1 text-xs text-cyan-glow">+{recent} ces 30 derniers jours</p>
      </div>
      <div className="relative mt-auto flex items-center gap-2 pt-6">
        <Link to="/subscribers" className="flex-1">
          <span className="flex h-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-navy-deep transition hover:bg-white/90">Gérer</span>
        </Link>
        <button
          onClick={exportCsv}
          disabled={exporting}
          aria-label="Exporter les abonnés en CSV"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan text-navy-deep transition hover:bg-cyan-glow disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
