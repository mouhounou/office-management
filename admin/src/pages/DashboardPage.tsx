import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Handshake,
  ImageIcon,
  Mail,
  Newspaper,
  Plus,
  Receipt,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { StatusBadge } from "@/components/ui/data";
import { Button, Card, CardHeader, ErrorBlock, LoadingBlock } from "@/components/ui/primitives";
import { api, type AnyRecord } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { APPLICATION_STATUSES, MESSAGE_KINDS, REQUEST_TYPES, SIMPLE_STATUSES, type StatusDef } from "@/lib/constants";
import { useTheme } from "@/lib/theme";
import { cn, timeAgo } from "@/lib/utils";

type Counts = Record<string, { total?: number; pending?: number; published?: number; last30Days?: number }>;
type Dashboard = {
  counts: Counts;
  byStatus: Record<string, Record<string, number>>;
  latest: Record<string, AnyRecord[]>;
};
type Week = { week: string; businessRequests: number; quotes: number; preRegistrations: number; applications: number };

// Palette catégorielle validée (skill dataviz) — ordre fixe, une teinte par flux.
const SERIES = [
  { key: "businessRequests", label: "Business Center", light: "#2a78d6", dark: "#3987e5" },
  { key: "quotes", label: "Devis", light: "#eb6834", dark: "#d95926" },
  { key: "preRegistrations", label: "Pré-inscriptions", light: "#1baf7a", dark: "#199e70" },
  { key: "applications", label: "Candidatures", light: "#eda100", dark: "#c98500" },
] as const;

const INBOX: { key: string; label: string; to: string; icon: LucideIcon; pendingStatus: string }[] = [
  { key: "businessRequests", label: "Business Center", to: "/business-requests", icon: Handshake, pendingStatus: "new" },
  { key: "quotes", label: "Devis", to: "/quotes", icon: Receipt, pendingStatus: "new" },
  { key: "preRegistrations", label: "Pré-inscriptions", to: "/pre-registrations", icon: GraduationCap, pendingStatus: "new" },
  { key: "applications", label: "Candidatures", to: "/applications", icon: UserCheck, pendingStatus: "submitted" },
  { key: "messages", label: "Messages", to: "/messages", icon: Mail, pendingStatus: "new" },
];

function greeting() {
  const hour = new Date().getHours();
  return hour < 18 ? "Bonjour" : "Bonsoir";
}

export function DashboardPage() {
  const { user, can } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: async () => (await api.get<Dashboard>("/stats/dashboard")).data,
    refetchInterval: 60_000,
  });

  if (isLoading) return <LoadingBlock label="Chargement du tableau de bord…" />;
  if (error || !data) return <ErrorBlock error={error} onRetry={refetch} />;

  const { counts } = data;
  const totalPending = INBOX.reduce((sum, item) => sum + (counts[item.key]?.pending ?? 0), 0);
  const date = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const today = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <div className="space-y-6">
      {/* En-tête d'accueil */}
      <section className="relative overflow-hidden rounded-2xl bg-navy-deep px-6 py-7 text-white sm:px-8">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-cyan/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm text-white/60">{today}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {greeting()}, {user?.fullName.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-white/75">
              {totalPending
                ? `${totalPending} dossier${totalPending > 1 ? "s" : ""} en attente de traitement.`
                : "Tout est à jour : aucun dossier en attente."}
            </p>
          </div>
          {can("edit") && (
            <div className="flex flex-wrap gap-2">
              <QuickAction to="/offers/new" icon={Briefcase} label="Offre" />
              <QuickAction to="/posts/new" icon={Newspaper} label="Article" />
              <QuickAction to="/formations/new" icon={GraduationCap} label="Formation" />
            </div>
          )}
        </div>
      </section>

      {/* À traiter */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {INBOX.map((item) => {
          const pending = counts[item.key]?.pending ?? 0;
          return (
            <Link key={item.key} to={`${item.to}?status=${item.pendingStatus}`} className="group">
              <Card className="h-full p-4 transition group-hover:border-primary/50 group-hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                    <item.icon className="h-4 w-4 text-primary" />
                  </span>
                  {pending > 0 && <span className="h-2 w-2 rounded-full bg-cyan" aria-hidden />}
                </div>
                <div className="mt-3 font-display text-3xl font-bold tabular-nums">{pending}</div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">à traiter · {counts[item.key]?.total ?? 0} au total</div>
              </Card>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <ActivityCard />
        <PipelineCard byStatus={data.byStatus.businessRequests ?? {}} total={counts.businessRequests?.total ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        <LatestCard latest={data.latest} />
        <ContentCard counts={counts} />
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <Link to={to}>
      <Button variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/20">
        <Plus className="h-4 w-4" />
        <Icon className="h-4 w-4" /> {label}
      </Button>
    </Link>
  );
}

/** Dépôts hebdomadaires sur 12 semaines, empilés par flux. */
function ActivityCard() {
  const { dark } = useTheme();
  const [view, setView] = useState<"chart" | "table">("chart");
  const { data, isLoading } = useQuery({
    queryKey: ["stats", "activity"],
    queryFn: async () => (await api.get<{ weeks: Week[] }>("/stats/activity", { params: { weeks: 12 } })).data,
  });

  const weeks = useMemo(
    () => (data?.weeks ?? []).map((w) => ({ ...w, label: new Date(w.week).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) })),
    [data],
  );
  const totals = SERIES.map((s) => weeks.reduce((sum, w) => sum + w[s.key], 0));

  return (
    <Card className="xl:col-span-2">
      <CardHeader
        title="Dépôts reçus"
        description="Par semaine, sur les 12 dernières semaines"
        action={
          <div className="flex rounded-lg border border-border p-0.5 text-xs">
            {(["chart", "table"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn("rounded-md px-2.5 py-1 transition", view === v ? "bg-muted font-medium" : "text-muted-foreground")}>
                {v === "chart" ? "Graphique" : "Tableau"}
              </button>
            ))}
          </div>
        }
      />
      <div className="p-5">
        {/* Légende toujours visible, avec les totaux : l'identité ne repose pas sur la couleur seule. */}
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {SERIES.map((s, index) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: dark ? s.dark : s.light }} />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-semibold tabular-nums">{totals[index]}</span>
            </li>
          ))}
        </ul>

        {isLoading ? (
          <LoadingBlock />
        ) : view === "chart" ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip content={<ActivityTooltip dark={dark} />} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
                {SERIES.map((s, index) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    stackId="a"
                    fill={dark ? s.dark : s.light}
                    stroke="var(--card)"
                    strokeWidth={2}
                    radius={index === SERIES.length - 1 ? [4, 4, 0, 0] : 0}
                    maxBarSize={36}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 text-left font-medium">Semaine du</th>
                  {SERIES.map((s) => (
                    <th key={s.key} className="py-2 text-right font-medium">{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.week} className="border-t border-border">
                    <td className="py-1.5">{w.label}</td>
                    {SERIES.map((s) => (
                      <td key={s.key} className="py-1.5 text-right tabular-nums">{w[s.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

function ActivityTooltip({ active, payload, label, dark }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string; dark: boolean }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-semibold">Semaine du {label}</div>
      {SERIES.map((s) => {
        const value = payload.find((p) => p.dataKey === s.key)?.value ?? 0;
        return (
          <div key={s.key} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm" style={{ background: dark ? s.dark : s.light }} />
              {s.label}
            </span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        );
      })}
      <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{total}</span>
      </div>
    </div>
  );
}

/** Où en sont les demandes du Business Center. */
function PipelineCard({ byStatus, total }: { byStatus: Record<string, number>; total: number }) {
  return (
    <Card>
      <CardHeader title="Suivi Business Center" description={`${total} demande${total > 1 ? "s" : ""} au total`} />
      <ul className="space-y-4 p-5">
        {Object.entries(SIMPLE_STATUSES).map(([status, def]) => {
          const count = byStatus[status] ?? 0;
          const share = total ? Math.round((count / total) * 100) : 0;
          return (
            <li key={status}>
              <Link to={`/business-requests?status=${status}`} className="group block">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="group-hover:text-primary">{def.label}</span>
                  <span className="tabular-nums">
                    <span className="font-semibold">{count}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">{share} %</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${share}%` }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

const LATEST_TABS: { key: string; label: string; to: string; title: (i: AnyRecord) => string; sub: (i: AnyRecord) => string; map: Record<string, StatusDef> }[] = [
  { key: "businessRequests", label: "Business", to: "/business-requests", title: (i) => i.title, sub: (i) => `${i.companyName} · ${REQUEST_TYPES[i.type] ?? i.type}`, map: SIMPLE_STATUSES },
  { key: "quotes", label: "Devis", to: "/quotes", title: (i) => i.name, sub: (i) => i.pole, map: SIMPLE_STATUSES },
  { key: "preRegistrations", label: "Pré-inscriptions", to: "/pre-registrations", title: (i) => i.fullName, sub: (i) => i.training, map: SIMPLE_STATUSES },
  { key: "applications", label: "Candidatures", to: "/applications", title: (i) => i.fullName, sub: (i) => i.email, map: APPLICATION_STATUSES },
  { key: "messages", label: "Messages", to: "/messages", title: (i) => i.name, sub: (i) => `${MESSAGE_KINDS[i.kind] ?? i.kind} · ${i.subject ?? i.reason ?? ""}`, map: SIMPLE_STATUSES },
];

function LatestCard({ latest }: { latest: Record<string, AnyRecord[]> }) {
  const [tab, setTab] = useState(LATEST_TABS[0].key);
  const current = LATEST_TABS.find((t) => t.key === tab)!;
  const items = latest[tab] ?? [];

  return (
    <Card className="xl:col-span-2">
      <CardHeader
        title="Derniers dépôts"
        action={
          <Link to={current.to} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="flex gap-1 overflow-x-auto border-b border-border px-3">
        {LATEST_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn("border-b-2 px-3 py-2.5 text-sm whitespace-nowrap transition", tab === t.key ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-muted-foreground">Rien de reçu pour l'instant.</p>
      ) : (
        <ul className="max-h-96 divide-y divide-border overflow-y-auto">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`${current.to}/${item.id}`} className="flex items-center gap-4 px-5 py-3 transition hover:bg-muted/60">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{current.title(item)}</div>
                  <div className="truncate text-xs text-muted-foreground">{current.sub(item)}</div>
                </div>
                <StatusBadge value={item.status} map={current.map} />
                <span className="hidden w-24 text-right text-xs text-muted-foreground sm:block">{timeAgo(item.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ContentCard({ counts }: { counts: Counts }) {
  const rows: { label: string; to: string; icon: LucideIcon; value: number; detail: string }[] = [
    { label: "Offres d'emploi", to: "/offers", icon: Briefcase, value: counts.offers?.published ?? 0, detail: `publiées sur ${counts.offers?.total ?? 0}` },
    { label: "Formations", to: "/formations", icon: GraduationCap, value: counts.formations?.published ?? 0, detail: `publiées sur ${counts.formations?.total ?? 0}` },
    { label: "Articles", to: "/posts", icon: Newspaper, value: counts.posts?.published ?? 0, detail: `publiés sur ${counts.posts?.total ?? 0}` },
    { label: "Abonnés newsletter", to: "/subscribers", icon: Users, value: counts.subscribers?.total ?? 0, detail: `+${counts.subscribers?.last30Days ?? 0} en 30 jours` },
    { label: "Médias", to: "/media", icon: ImageIcon, value: counts.media?.total ?? 0, detail: "fichiers" },
  ];

  return (
    <Card>
      <CardHeader title="Contenus du site" />
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.to}>
            <Link to={row.to} className="flex items-center gap-3 px-5 py-3 transition hover:bg-muted/60">
              <row.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{row.label}</span>
              <span className="text-right">
                <span className="block font-semibold tabular-nums">{row.value}</span>
                <span className="block text-xs text-muted-foreground">{row.detail}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
