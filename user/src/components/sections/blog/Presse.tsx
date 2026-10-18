import { Calendar } from "lucide-react";

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

export function Presse() {
  return (
    <Section id="presse" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Salle de presse"
        title="Communiqués & faits marquants"
        subtitle="Les annonces officielles et les temps forts d'Office Management."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {news.map((n) => (
          <article
            key={n.t}
            className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-strong">
                {n.tag}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {n.date}
              </span>
            </div>
            <h3 className="mb-1.5 font-display text-lg font-bold">{n.t}</h3>
            <p className="text-sm text-muted-foreground">{n.d}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
