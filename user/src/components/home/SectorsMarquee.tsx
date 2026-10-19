import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Sector = { icon: LucideIcon; label: string };

const TONES = ["gradient-cyan text-white", "bg-navy text-white", "bg-accent text-primary"];

function Row({
  sectors,
  reverse,
  offset,
}: {
  sectors: Sector[];
  reverse?: boolean;
  offset: number;
}) {
  // La piste contient la liste deux fois : le décalage de -50 % boucle sans à-coup.
  const items = [...sectors, ...sectors];
  return (
    <div className={cn("marquee overflow-hidden py-2", reverse && "marquee-reverse")}>
      <div
        className="marquee-track flex w-max gap-4"
        style={{ ["--marquee-duration" as string]: "45s" }}
      >
        {items.map((sector, index) => {
          const copy = index >= sectors.length;
          return (
            <Link
              key={`${sector.label}-${index}`}
              to="/services"
              hash="secteurs"
              aria-hidden={copy}
              tabIndex={copy ? -1 : undefined}
              className="group flex shrink-0 items-center gap-3 rounded-full border border-border bg-card py-2 pr-6 pl-2 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition duration-300 group-hover:rotate-[-8deg]",
                  TONES[(index + offset) % TONES.length],
                )}
              >
                <sector.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">{sector.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Secteurs d'intervention en deux bandeaux qui défilent en sens opposés
 * (pause au survol). Remplace l'ancienne grille d'icônes.
 */
export function SectorsMarquee({ sectors }: { sectors: Sector[] }) {
  // Chaque bande montre tous les secteurs (deuxième bande décalée), pour que
  // sa longueur dépasse toujours la largeur de l'écran.
  const half = Math.ceil(sectors.length / 2);
  const shifted = [...sectors.slice(half), ...sectors.slice(0, half)];
  return (
    <div className="space-y-3" data-reveal>
      <Row sectors={sectors} offset={0} />
      <Row sectors={shifted} reverse offset={1} />
    </div>
  );
}
