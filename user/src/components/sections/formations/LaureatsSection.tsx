import { PlayCircle, Trophy } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { Chips } from "@/components/sections/FeatureCards";

/** Mur des lauréats (ex-page laureats). */
const LAUREATS = [
  {
    name: "M. NKOUKA",
    formation: "Excel Avancé",
    result: "Major de promotion",
    job: "Assistant de Direction — Total",
  },
  {
    name: "Mlle MOUKOKO",
    formation: "Assistant RH",
    result: "Mention Très Bien",
    job: "Chargée RH — Eni Congo",
  },
  {
    name: "M. TATY",
    formation: "Sage 100 i7",
    result: "Certification obtenue",
    job: "Comptable — PwC",
  },
  {
    name: "Mme MAYINDOU",
    formation: "Gestion Administrative",
    result: "Major de promotion",
    job: "Secrétaire de Direction",
  },
  {
    name: "M. LOEMBA",
    formation: "Bureautique Pro",
    result: "Mention Bien",
    job: "Agent Administratif",
  },
  {
    name: "Mlle BOUITY",
    formation: "Comptabilité Générale",
    result: "Mention Très Bien",
    job: "Aide-comptable",
  },
];

/** Thèmes prévus pour les capsules vidéo (ex-page academy-tv, pas encore en ligne). */
const CAPSULES = [
  "Astuces Excel",
  "Sage 100 i7",
  "Bases de la paie",
  "Rédiger son CV",
  "Réussir son entretien",
];

export function LaureatsSection() {
  return (
    <Section id="laureats" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Ils ont brillé"
        title="Le mur des lauréats"
        subtitle="Nos meilleurs apprenants, leur résultat et leur insertion professionnelle."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LAUREATS.map((l) => (
          <div
            key={l.name}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <Trophy className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold">{l.name}</h3>
              <div className="text-sm text-brand-strong">
                {l.formation} · {l.result}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{l.job}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-brand-soft/40 p-5 md:flex-row md:items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
          <PlayCircle className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold">Capsules vidéo — bientôt</h3>
          <p className="text-sm text-muted-foreground">
            Des cours courts et gratuits pour progresser à votre rythme sont en préparation.
          </p>
        </div>
        <Chips items={CAPSULES} className="md:max-w-md md:justify-end" />
      </div>
    </Section>
  );
}
