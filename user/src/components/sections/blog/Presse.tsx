import { Award, Calendar, Handshake, Megaphone, Sparkles, type LucideIcon } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";

/** Communiqués et faits marquants (anciennement /salle-de-presse). */
const news = [
  {
    date: "15 mai 2026",
    tag: "Communiqué",
    t: "Office Management lance son académie de certification",
    d: "Une nouvelle ère pour la formation professionnelle au Congo.",
  },
  {
    date: "02 avril 2026",
    tag: "Partenariat",
    t: "Signature d'un partenariat stratégique",
    d: "Nouvelle convention avec une grande entreprise du secteur pétrolier.",
  },
  {
    date: "20 mars 2026",
    tag: "Événement",
    t: "Remise de certificats — Promotion 2026",
    d: "150 nouveaux certifiés rejoignent le marché du travail.",
  },
  {
    date: "10 février 2026",
    tag: "Nouveauté",
    t: "Lancement d'une nouvelle formation Sage 100 i7",
    d: "Programme intensif sur 4 semaines.",
  },
];

const TAG_ICONS: Record<string, LucideIcon> = {
  Communiqué: Megaphone,
  Partenariat: Handshake,
  Événement: Award,
  Nouveauté: Sparkles,
};

/**
 * Frise chronologique : un trait qui se dessine au défilement, des jalons qui
 * pulsent et des cartes qui arrivent alternativement de gauche et de droite
 * (une seule colonne sur mobile).
 */
export function Presse() {
  return (
    <Section id="presse" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Salle de presse"
        title="Communiqués & faits marquants"
        subtitle="Les annonces officielles et les temps forts d'Office Management."
      />
      <div className="relative mx-auto max-w-5xl overflow-x-clip px-1 py-2">
        {/* Trait de la frise */}
        <div
          aria-hidden
          data-reveal="line"
          className="absolute top-2 bottom-2 left-5 w-0.5 origin-top bg-gradient-to-b from-primary via-primary/40 to-transparent md:left-1/2 md:-translate-x-1/2"
        />
        <ol className="space-y-8 md:space-y-12">
          {news.map((n, index) => {
            const Icon = TAG_ICONS[n.tag] ?? Megaphone;
            const right = index % 2 === 1;
            return (
              <li key={n.t} className="relative pl-16 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                {/* Jalon */}
                <span className="absolute top-5 left-5 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full gradient-cyan text-white shadow-lg ring-4 ring-background md:left-1/2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2.6s]" />
                  <Icon className="relative h-5 w-5" />
                </span>
                <article
                  data-reveal={right ? "right" : "left"}
                  className={`group relative rounded-2xl border border-border bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/30 ${
                    right ? "md:col-start-2" : "md:col-start-1 md:text-right"
                  }`}
                >
                  <div
                    className={`mb-3 flex flex-wrap items-center gap-3 ${right ? "" : "md:justify-end"}`}
                  >
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-brand-strong uppercase">
                      {n.tag}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {n.date}
                    </span>
                  </div>
                  <h3 className="mb-1.5 font-display text-lg font-bold transition-colors group-hover:text-primary">
                    {n.t}
                  </h3>
                  <p className="text-sm text-muted-foreground">{n.d}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
