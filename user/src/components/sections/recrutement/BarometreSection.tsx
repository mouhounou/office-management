import { TrendingUp } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { Chips } from "@/components/sections/FeatureCards";

/** Baromètre de l'emploi (ex-page barometre-emploi). */
const TRENDING = [
  { title: "Assistant(e) RH", value: "+25%" },
  { title: "Excel avancé", value: "+22%" },
  { title: "Comptable Sage 100", value: "+18%" },
  { title: "Gestionnaire administratif", value: "+15%" },
  { title: "Secrétaire bilingue", value: "+10%" },
];
const SECTORS = [
  "Pétrole & Gaz",
  "BTP",
  "Banque & Assurance",
  "ONG & Coopération",
  "Distribution",
  "Télécommunications",
];
const SKILLS = [
  "Excel avancé",
  "Sage 100 i7",
  "Communication écrite",
  "Gestion de projet",
  "Anglais professionnel",
  "Leadership",
];

export function BarometreSection() {
  return (
    <Section id="barometre" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Baromètre de l'emploi"
        title="Ce que recherche le marché"
        subtitle="Tendances du marché du travail au Congo : métiers, secteurs et compétences demandés."
      />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-bold">Métiers les plus recherchés</h3>
          <ul className="divide-y divide-border">
            {TRENDING.map((t) => (
              <li key={t.title} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{t.title}</span>
                <span className="flex items-center gap-1 font-bold text-brand-strong">
                  <TrendingUp className="h-4 w-4 text-primary" /> {t.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-bold">Secteurs qui recrutent</h3>
            <Chips items={SECTORS} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-bold">Compétences demandées</h3>
            <Chips items={SKILLS} />
          </div>
        </div>
      </div>
    </Section>
  );
}
