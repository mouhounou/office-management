import { Link } from "@tanstack/react-router";
import { Award, Briefcase, GraduationCap, MapPin, Sparkles, TrendingUp } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Button } from "@/components/ui/button";

/** Pourquoi nous rejoindre (ex-page carrieres). */
const REASONS = [
  {
    icon: Sparkles,
    title: "Environnement stimulant",
    text: "Une équipe passionnée et un cadre professionnel motivant.",
  },
  {
    icon: TrendingUp,
    title: "Opportunités d'évolution",
    text: "Évoluez et prenez des responsabilités au sein du cabinet.",
  },
  {
    icon: GraduationCap,
    title: "Formation continue",
    text: "Développez vos compétences tout au long de votre parcours.",
  },
  {
    icon: Award,
    title: "Valorisation des compétences",
    text: "Vos talents sont reconnus et récompensés.",
  },
];

/** Postes ouverts chez Office Management (ex-page carrieres-talents). */
const JOBS = [
  { title: "Consultant RH senior", type: "CDI", loc: "Pointe-Noire" },
  { title: "Formateur Sage & Excel", type: "Vacations", loc: "Pointe-Noire / Brazzaville" },
  { title: "Commercial B2B", type: "CDI", loc: "Pointe-Noire" },
  { title: "Assistant RH", type: "CDI", loc: "Pointe-Noire" },
  { title: "Développeur full-stack", type: "CDI", loc: "Hybride" },
  { title: "Technicien maintenance", type: "CDI", loc: "Pointe-Noire" },
];

/** `onApply` bascule le formulaire sur l'espace candidat et préremplit le poste. */
export function CarrieresSection({ onApply }: { onApply: (position: string) => void }) {
  return (
    <Section id="carrieres" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Carrières"
        title="Rejoignez notre équipe"
        subtitle="Nous recherchons des talents motivés pour contribuer au développement des entreprises et des compétences."
      />
      <FeatureCards items={REASONS} columns={4} />
      <h3 className="mt-12 mb-5 text-center font-display text-xl font-bold">Postes ouverts</h3>
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        {JOBS.map((j) => (
          <div
            key={j.title}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                <Briefcase className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display font-bold">{j.title}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {j.type} · <MapPin className="h-3 w-3" /> {j.loc}
                </div>
              </div>
            </div>
            <Button asChild size="sm" className="shrink-0 gradient-cyan text-primary-foreground">
              <Link to="/recrutement" hash="candidature" onClick={() => onApply(j.title)}>
                Postuler
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </Section>
  );
}
