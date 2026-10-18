import { Award, GraduationCap, Target, Users } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { Chips, FeatureCards } from "@/components/sections/FeatureCards";

/** Engagements de l'équipe pédagogique (ex-pages formateurs / centre d'excellence). */
const QUALITIES = [
  {
    icon: GraduationCap,
    title: "Expertise reconnue",
    text: "Diplômes et années d'expérience dans leurs domaines respectifs.",
  },
  {
    icon: Users,
    title: "Pédagogie active",
    text: "Méthodes pratiques, cas concrets et mises en situation.",
  },
  {
    icon: Award,
    title: "Exigence de qualité",
    text: "Évaluations rigoureuses et engagement pour la réussite des apprenants.",
  },
  {
    icon: Target,
    title: "Orientés résultats",
    text: "Suivi personnalisé pour atteindre vos objectifs professionnels.",
  },
];

/** Équipe pédagogique (ex-page nos-experts). */
const EXPERTS = [
  {
    name: "Hassan AKIANA",
    role: "Directeur Général — Stratégie RH",
    exp: "15+ ans en conseil RH et gouvernance",
    domains: ["Audit RH", "Stratégie", "Leadership"],
  },
  {
    name: "Formateur Comptabilité",
    role: "Sage 100 i7 & comptabilité",
    exp: "12 ans d'expérience en entreprise",
    domains: ["Sage 100 i7", "Comptabilité", "Fiscalité"],
  },
  {
    name: "Formateur Bureautique",
    role: "Excel avancé & Office",
    exp: "10 ans en formation professionnelle",
    domains: ["Excel avancé", "Word", "PowerPoint"],
  },
  {
    name: "Consultante RH",
    role: "Assistant RH & paie",
    exp: "8 ans en gestion RH opérationnelle",
    domains: ["Recrutement", "Paie", "GPEC"],
  },
  {
    name: "Formateur Gestion",
    role: "Gestion administrative",
    exp: "10 ans en administration",
    domains: ["Secrétariat", "Archivage", "Procédures"],
  },
  {
    name: "Coach Leadership",
    role: "Management & leadership",
    exp: "12 ans d'accompagnement de dirigeants",
    domains: ["Leadership", "Coaching", "Communication"],
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

export function FormateursSection() {
  return (
    <Section id="formateurs" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Équipe pédagogique"
        title="Des formateurs issus du terrain"
        subtitle="Des professionnels qualifiés qui assurent un accompagnement personnalisé, orienté résultats."
      />
      <FeatureCards items={QUALITIES} columns={4} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERTS.map((e) => (
          <div key={e.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-cyan font-bold text-primary-foreground">
                {initials(e.name)}
              </span>
              <div>
                <h3 className="font-display text-base font-bold leading-tight">{e.name}</h3>
                <div className="text-sm text-brand-strong">{e.role}</div>
              </div>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{e.exp}</p>
            <Chips
              items={e.domains}
              className="gap-1.5 [&>span]:px-2.5 [&>span]:py-0.5 [&>span]:text-xs"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
