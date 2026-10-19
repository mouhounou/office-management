import { Link } from "@tanstack/react-router";
import { ArrowRight, Crown, FileText } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";

const DIRECTIONS = [
  "Direction Formation",
  "Direction RH",
  "Direction Commerciale",
  "Direction Technique",
  "Direction Administrative & Financière",
  "Direction Digitale",
  "Direction Qualité",
];

const POLICIES = [
  "Politique qualité",
  "Politique de confidentialité",
  "Politique de protection des données",
  "Politique santé & sécurité",
  "Politique RSE",
  "Politique anti-corruption",
  "Politique diversité & inclusion",
];

/** Organigramme (ex-page « Gouvernance ») et liste des politiques (ex-page « Nos politiques »). */
export function AboutGovernance() {
  return (
    <Section>
      <SectionTitle
        eyebrow="Gouvernance & transparence"
        title="Une organisation claire"
        subtitle="Une chaîne de responsabilité maîtrisée et des engagements formalisés au service de nos parties prenantes."
      />
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div
          id="gouvernance"
          className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
        >
          <div className="eyebrow mb-6">Organigramme</div>
          {/* Arbre : les liaisons se dessinent au défilement. */}
          <div className="flex flex-col items-center">
            <div
              className="flex items-center gap-2 rounded-xl gradient-cyan px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-lg"
              data-reveal
            >
              <Crown className="h-4 w-4" /> Président Directeur Général
            </div>
            <span aria-hidden data-reveal="line" className="h-6 w-0.5 origin-top bg-primary/50" />
            <div
              className="rounded-xl border border-primary/40 bg-brand-soft px-5 py-3 font-display text-sm font-bold text-brand-strong"
              data-reveal
            >
              Direction Générale
            </div>
            <span aria-hidden data-reveal="line" className="h-6 w-0.5 origin-top bg-primary/50" />
          </div>
          <div className="relative">
            <span
              aria-hidden
              data-reveal="line-x"
              className="absolute top-0 right-[8%] left-[8%] hidden h-0.5 origin-left bg-primary/40 sm:block"
            />
            <ul
              className="grid gap-3 pt-0 sm:grid-cols-2 sm:pt-5 lg:grid-cols-3"
              data-reveal-stagger
            >
              {DIRECTIONS.map((d) => (
                <li
                  key={d}
                  className="group relative flex items-center justify-center rounded-xl border border-border bg-background px-3 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary transition group-hover:scale-150" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          id="politiques"
          className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
        >
          <div className="eyebrow mb-6">Nos politiques</div>
          <ul className="divide-y divide-border" data-reveal-stagger>
            {POLICIES.map((p) => (
              <li key={p} className="flex items-center gap-3 py-2.5 text-sm font-medium">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong hover:underline"
          >
            Documents disponibles sur demande <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
