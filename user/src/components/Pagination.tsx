import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40";

/** Numéros affichés : première, dernière et voisines de la page courante, « … » entre. */
function pageItems(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? (["…", n] as const) : [n]));
}

/** Pagination numérotée (blog, catalogue des formations). Masquée s'il n'y a qu'une page. */
export function Pagination({
  page,
  pageCount,
  onChange,
  label,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
      aria-label={label}
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={arrowClass}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageItems(page, pageCount).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition",
              n === page
                ? "gradient-cyan text-primary-foreground"
                : "border border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-primary",
            )}
          >
            {n}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        className={arrowClass}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/** Découpe une liste en pages ; la page demandée est ramenée dans les bornes. */
export function paginate<T>(items: T[], page: number, size: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pageCount);
  return { pageCount, page: current, items: items.slice((current - 1) * size, current * size) };
}
