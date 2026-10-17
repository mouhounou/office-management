import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Spinner } from "@/components/ui/primitives";
import { api, type AnyRecord, type Paginated } from "@/lib/api";
import { RESOURCE_BY_KEY } from "@/lib/resources";
import { cn } from "@/lib/utils";

/** Ressources balayées par la recherche globale, dans l'ordre d'affichage. */
const SCOPES = ["business-requests", "quotes", "pre-registrations", "applications", "messages", "companies", "offers", "members"];

type Hit = { key: string; id: string; title: string; group: string };

/**
 * Recherche dans toutes les demandes et fiches (⌘K / Ctrl+K). S'appuie sur le
 * paramètre `q` déjà proposé par chaque liste de l'API.
 */
export function GlobalSearch() {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { data: hits = [], isFetching } = useQuery({
    queryKey: ["search", debounced],
    enabled: debounced.length >= 2,
    queryFn: async () => {
      const results = await Promise.all(
        SCOPES.map((key) =>
          api
            .get<Paginated<AnyRecord>>(`/${key}`, { params: { q: debounced, limit: 3 } })
            .then(({ data }) => data.items.map<Hit>((item) => ({ key, id: item.id, title: RESOURCE_BY_KEY[key].primary(item), group: RESOURCE_BY_KEY[key].title })))
            .catch(() => [] as Hit[]),
        ),
      );
      return results.flat();
    },
  });

  const go = (hit: Hit) => {
    navigate(`/${hit.key}/${hit.id}`);
    setOpen(false);
    setTerm("");
    inputRef.current?.blur();
  };

  const showPanel = open && debounced.length >= 2;

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, hits.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && hits[active]) {
            go(hits[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
          }
        }}
        placeholder="Rechercher une demande, un contact…"
        aria-label="Recherche globale"
        className="h-11 w-full rounded-full border border-border bg-card pr-16 pl-11 text-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans text-[11px] text-muted-foreground sm:block">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>

      {showPanel && (
        <div className="absolute top-full right-0 left-0 z-30 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl">
          {isFetching && !hits.length ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : !hits.length ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Aucun résultat pour « {debounced} ».</p>
          ) : (
            hits.map((hit, index) => (
              <button
                key={`${hit.key}-${hit.id}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(hit)}
                onMouseEnter={() => setActive(index)}
                className={cn("flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm", index === active && "bg-muted")}
              >
                <span className="truncate">{hit.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{hit.group}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
