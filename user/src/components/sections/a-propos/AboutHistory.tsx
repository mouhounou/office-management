import { Building2, GraduationCap, Handshake, TrendingUp, UserSearch } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";

/** Ce que la marque inspire à chacun de ses publics (ex-pages « Notre histoire » et « Écosystème »). */
const AUDIENCES = [
  {
    icon: Building2,
    title: "Pour un dirigeant d'entreprise",
    quote:
      "« Ce cabinet est capable d'accompagner la transformation de notre organisation et de renforcer notre capital humain. »",
  },
  {
    icon: GraduationCap,
    title: "Pour un candidat",
    quote:
      "« Ici, je peux développer mes compétences, trouver des opportunités professionnelles et construire ma carrière. »",
  },
  {
    icon: Handshake,
    title: "Pour un partenaire ou une institution",
    quote:
      "« Office Management est une organisation structurée, crédible, innovante et tournée vers l'excellence. »",
  },
];

const PUBLICS = [
  { icon: Building2, title: "Les entreprises", text: "Pour recruter les meilleurs talents." },
  { icon: GraduationCap, title: "Les étudiants", text: "Pour apprendre et se certifier." },
  {
    icon: UserSearch,
    title: "Les candidats",
    text: "Pour trouver un emploi à la hauteur de leurs ambitions.",
  },
  { icon: Handshake, title: "Les partenaires", text: "Pour collaborer et co-construire." },
  { icon: TrendingUp, title: "Les investisseurs", text: "Pour faire confiance à la marque." },
];

export function AboutHistory() {
  return (
    <Section id="histoire" className="scroll-mt-24">
      <SectionTitle
        eyebrow="Notre histoire"
        title="Trois regards, une même conviction"
        subtitle="Plus qu'un centre de formation ou un cabinet RH : une plateforme au service de tous les acteurs du monde du travail."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {AUDIENCES.map((a) => (
          <figure
            key={a.title}
            className="hover-lift rounded-2xl border border-border bg-card p-7 shadow-card"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <a.icon className="h-5 w-5" />
            </span>
            <figcaption className="mb-3 font-display text-base font-bold">{a.title}</figcaption>
            <blockquote className="text-sm italic leading-relaxed text-muted-foreground">
              {a.quote}
            </blockquote>
          </figure>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-2">Une plateforme, cinq publics</div>
            <h3 className="font-display text-xl font-bold md:text-2xl">Un écosystème complet</h3>
          </div>
          <p className="max-w-md text-sm italic text-muted-foreground">
            Une plateforme nationale de développement des compétences, de recrutement et de
            performance organisationnelle.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PUBLICS.map((p) => (
            <li key={p.title} className="flex items-start gap-3 rounded-xl bg-brand-soft/60 p-4">
              <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-strong" />
              <div>
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="text-xs leading-relaxed text-muted-foreground">{p.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
