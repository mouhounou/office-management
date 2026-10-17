import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge, Button, Input } from "@/components/ui/primitives";
import type { StatusDef } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ value, map }: { value?: string | null; map: Record<string, StatusDef> }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const def = map[value] ?? { label: value, tone: "neutral" as const };
  return (
    <Badge tone={def.tone}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {def.label}
    </Badge>
  );
}

export function Pagination({
  page,
  pages,
  total,
  onChange,
}: {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-sm text-muted-foreground">
      <span>
        {total} élément{total > 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-2">
        <span>
          Page {page} / {pages}
        </span>
        <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Page précédente">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Page suivante">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/** Recherche avec temporisation : la requête part 300 ms après la dernière frappe. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => onChange(draft), 300);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}

/** Tableau simple : en-têtes + lignes cliquables. */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-border px-4 py-3 align-middle", className)}>{children}</td>;
}

/** Ligne libellé / valeur pour les fiches en lecture. */
export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm break-words whitespace-pre-wrap">{children ?? "—"}</dd>
    </div>
  );
}
