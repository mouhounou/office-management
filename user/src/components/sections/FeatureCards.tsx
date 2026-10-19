import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CountUp } from "@/components/CountUp";
import { cn } from "@/lib/utils";

export type Feature = { icon?: LucideIcon; title: string; text?: ReactNode };

const COLUMNS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * Grille de cartes « icône + titre + texte » partagée par les pages du site,
 * dans le style de l'accueil (carte blanche, pastille cyan).
 */
export function FeatureCards({
  items,
  columns = 3,
  className,
}: {
  items: Feature[];
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5", COLUMNS[columns], className)} data-reveal-stagger>
      {items.map((item) => (
        <div
          key={item.title}
          className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          {item.icon && (
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <item.icon className="h-5 w-5" />
            </span>
          )}
          <h3 className="mb-1.5 font-display text-base font-bold">{item.title}</h3>
          {item.text && (
            <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/** Liste de pastilles (secteurs, compétences, publications…). */
export function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand-strong"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/** Chiffres clés alignés, gros nombres en dégradé cyan. */
export function StatRow({
  items,
  className,
}: {
  items: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-5 lg:grid-cols-4", className)} data-reveal-stagger>
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-border bg-card p-6 text-center shadow-card"
        >
          <div className="font-display text-3xl font-extrabold text-gradient-cyan md:text-4xl">
            <CountUp value={s.value} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
