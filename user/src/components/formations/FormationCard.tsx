import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Clock, Signal, Wallet } from "lucide-react";

import type { Formation } from "@/lib/content";
import { formationImage } from "@/lib/content-images";

/**
 * Carte d'une formation du catalogue : image (zoom au survol), catégorie,
 * badge « certifiante », titre, résumé, durée / niveau / tarif et lien animé
 * vers la fiche détaillée.
 */
export function FormationCard({ formation }: { formation: Formation }) {
  const meta = [
    formation.duration && { icon: Clock, label: formation.duration },
    formation.level && { icon: Signal, label: formation.level },
    formation.price && { icon: Wallet, label: formation.price },
  ].filter(Boolean) as { icon: typeof Clock; label: string }[];

  return (
    <Link
      to="/formations/$slug"
      params={{ slug: formation.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_48px_-20px_oklch(0.56_0.12_228/0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={formationImage(formation.imageUrl, formation.category, formation.slug)}
          alt=""
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          width={640}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent opacity-80 transition group-hover:opacity-100" />
        <span className="absolute top-4 left-4 max-w-[70%] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-strong backdrop-blur">
          {formation.category}
        </span>
        {formation.certifying && (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full gradient-cyan px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <BadgeCheck className="h-3.5 w-3.5" /> Certifiante
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 font-display text-lg leading-snug font-bold transition-colors group-hover:text-primary">
          {formation.title}
        </h3>
        {formation.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {formation.description}
          </p>
        )}
        {meta.length > 0 && (
          <div className="mt-auto mb-5 flex flex-wrap gap-2">
            {meta.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-strong"
              >
                <m.icon className="h-3.5 w-3.5" /> {m.label}
              </span>
            ))}
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="relative">
            Voir la formation
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
