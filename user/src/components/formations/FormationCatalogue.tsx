import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { FormationCard } from "@/components/formations/FormationCard";
import { Pagination, paginate } from "@/components/Pagination";
import type { Formation } from "@/lib/content";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;
const ALL = "Toutes";

/** Sans accents ni majuscules, pour une recherche tolérante. */
const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Catalogue : une carte par formation, filtre par domaine, recherche et
 * pagination (6 par page). Un clic ouvre la fiche de la formation.
 */
export function FormationCatalogue({ formations }: { formations: Formation[] }) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(formations.map((f) => f.category)))],
    [formations],
  );
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return formations.filter(
      (f) =>
        (category === ALL || f.category === category) &&
        (!q || normalize(`${f.title} ${f.category} ${f.description ?? ""}`).includes(q)),
    );
  }, [formations, category, query]);
  const { pageCount, page: current, items } = paginate(filtered, page, PAGE_SIZE);

  const goTo = (next: number) => {
    setPage(next);
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (formations.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
        Le catalogue détaillé est momentanément indisponible.{" "}
        <Link to="/contact" className="font-medium text-brand-strong">
          Contactez-nous
        </Link>{" "}
        pour connaître les prochaines sessions.
      </p>
    );
  }

  return (
    <div id="catalogue" className="scroll-mt-28">
      <div className="mb-8 flex flex-col items-center gap-5">
        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Rechercher une formation</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher une formation (Excel, paie, QHSE…)"
            className="h-12 w-full rounded-full border border-border bg-card pr-4 pl-11 text-sm shadow-card outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                category === c
                  ? "gradient-cyan text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-primary",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} formation{filtered.length > 1 ? "s" : ""}
          {category !== ALL ? ` en ${category}` : ""}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
          {items.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Aucune formation ne correspond à votre recherche.{" "}
          <Link to="/contact" className="font-medium text-brand-strong">
            Demandez un programme sur mesure
          </Link>
          .
        </p>
      )}

      <Pagination
        page={current}
        pageCount={pageCount}
        onChange={goTo}
        label="Pagination des formations"
      />

      {/* Sans JavaScript (et pour la pré-génération) : toutes les fiches. */}
      <noscript>
        <ul className="mt-10 columns-1 gap-8 text-sm sm:columns-2 lg:columns-3">
          {formations.map((f) => (
            <li key={f.id} className="mb-2">
              <a href={`/formations/${f.slug}`} className="text-brand-strong hover:underline">
                {f.title}
              </a>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
