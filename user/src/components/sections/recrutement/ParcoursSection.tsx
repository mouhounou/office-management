import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";

/** Parcours selon le profil du visiteur (ex-page parcours-carriere). */
const PATHS = [
  {
    icon: GraduationCap,
    title: "Je suis étudiant",
    steps: ["Formation certifiante", "Stage en entreprise", "Premier emploi"],
    to: "/formations",
    cta: "Voir les formations",
  },
  {
    icon: TrendingUp,
    title: "Je suis salarié",
    steps: ["Formation continue", "Certification reconnue", "Promotion ou évolution"],
    to: "/formations",
    cta: "Voir les formations",
  },
  {
    icon: Briefcase,
    title: "Je suis une entreprise",
    steps: ["Recrutement ciblé", "Formation des équipes", "Performance mesurable"],
    to: "/devis",
    cta: "Demander un devis",
  },
] as const;

export function ParcoursSection() {
  return (
    <Section id="parcours" className="scroll-mt-24 pt-0!">
      <SectionTitle eyebrow="Parcours de carrière" title="Un chemin adapté à votre situation" />
      <div className="grid gap-5 md:grid-cols-3">
        {PATHS.map((p) => (
          <div
            key={p.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{p.title}</h3>
            </div>
            <ol className="mb-5 flex-1 space-y-3">
              {p.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <Link
              to={p.to}
              className="inline-flex items-center text-sm font-semibold text-brand-strong hover:underline"
            >
              {p.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
