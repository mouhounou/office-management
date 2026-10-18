import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building,
  CheckCircle2,
  GraduationCap,
  Heart,
  Sprout,
  Target,
  Users,
} from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { Chips, FeatureCards, StatRow } from "@/components/sections/FeatureCards";
import { Button } from "@/components/ui/button";

/** Chiffres du rapport annuel 2025 — seule source retenue pour rester cohérent sur toute la page. */
const KEY_FIGURES = {
  trained: "2 500+",
  certifications: "1 800+",
  jobs: "650+",
  companies: "120+",
};

const HIGHLIGHTS = [
  "Ouverture de 12 nouvelles sessions de formation certifiantes",
  "Signature de partenariats avec 8 entreprises majeures de la place",
  "Lancement de l'académie de certification « Office Management Certified »",
  "Plus de 90 % de taux d'insertion professionnelle sur nos certifiés",
];

const FOUNDATION = [
  {
    icon: Users,
    title: "Insertion des jeunes",
    text: "Programmes dédiés aux jeunes sans qualification.",
  },
  {
    icon: GraduationCap,
    title: "Aide à l'emploi",
    text: "Bourses de formation et accompagnement à la recherche d'emploi.",
  },
  {
    icon: Heart,
    title: "Mentorat",
    text: "Mise en relation avec des professionnels pour guider les parcours.",
  },
  { icon: Sprout, title: "Développement local", text: "Actions au plus près des communautés." },
];

const GOALS_2030 = [
  { value: "10 000", label: "Personnes formées" },
  { value: "1 000", label: "Recrutements facilités" },
  { value: "100 %", label: "Couverture nationale" },
  { value: "#1", label: "Plateforme RH de référence" },
];

const INSTITUTE_MISSIONS = [
  "Études RH",
  "Enquêtes emploi",
  "Livres blancs",
  "Référentiels de compétences",
  "Conférences",
  "Prospective",
];

const PUBLICATIONS = [
  "Rapport sur l'emploi au Congo",
  "Baromètre des salaires",
  "Tendances RH",
  "Guide du recrutement",
  "Guide de la paie",
  "Rapport sur la formation professionnelle",
];

const FRANCHISE = [
  { title: "Marque reconnue", text: "Bénéficiez de la notoriété d'Office Management." },
  {
    title: "Accompagnement",
    text: "Formation initiale, support continu et outils prêts à l'emploi.",
  },
  { title: "Territoire exclusif", text: "Une zone garantie pour développer votre activité." },
];

/** Impact (rapport annuel + Foundation), Vision 2030 et réseau (Institute, franchise). */
export function AboutImpact() {
  return (
    <>
      <Section id="impact" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Notre impact"
          title="Bilan 2025"
          subtitle="Transparence et redevabilité : nos chiffres clés, nos faits marquants et notre engagement sociétal."
        />
        <StatRow
          items={[
            { value: KEY_FIGURES.trained, label: "Personnes formées" },
            { value: KEY_FIGURES.certifications, label: "Certifications délivrées" },
            { value: KEY_FIGURES.jobs, label: "Emplois facilités" },
            { value: KEY_FIGURES.companies, label: "Entreprises clientes" },
          ]}
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="eyebrow mb-4">Faits marquants 2025</div>
            <ul className="space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong hover:underline"
            >
              Rapport annuel complet sur demande <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-brand-soft/50 p-6 md:p-8">
            <div className="eyebrow mb-2">Office Management Foundation</div>
            <p className="mb-5 text-sm text-muted-foreground">
              Rendre le développement professionnel accessible à tous, partout au Congo.
            </p>
            <FeatureCards items={FOUNDATION} columns={2} />
          </div>
        </div>
      </Section>

      <Section id="vision-2030" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Vision 2030"
          title="Nos objectifs 2030"
          subtitle="Une ambition claire : devenir la référence RH, formation et recrutement au Congo."
        />
        <StatRow items={GOALS_2030} />
      </Section>

      <Section id="reseau" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Notre réseau"
          title="Un réseau qui grandit"
          subtitle="Recherche, expansion territoriale et partenariats pour porter l'écosystème Office Management."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold">Office Management Institute</h3>
            <p className="mt-1.5 mb-4 text-sm leading-relaxed text-muted-foreground">
              Recherche appliquée sur les ressources humaines, analyses du marché du travail au
              Congo et en Afrique centrale, standards de compétences par métier et anticipation des
              mutations du travail.
            </p>
            <Chips items={INSTITUTE_MISSIONS} className="mb-5" />
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <BarChart3 className="h-4 w-4 text-primary" /> Publications de référence
            </div>
            <ul className="grid gap-x-4 gap-y-1.5 text-sm text-muted-foreground sm:grid-cols-2">
              {PUBLICATIONS.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <Building className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-bold">Franchise & représentations</h3>
            <p className="mt-1.5 mb-4 text-sm leading-relaxed text-muted-foreground">
              Rejoignez le réseau Office Management et développez votre activité dans votre ville.
            </p>
            <ul className="space-y-3">
              {FRANCHISE.map((f) => (
                <li key={f.title} className="flex items-start gap-3 text-sm">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-semibold">{f.title}</span>
                    <span className="text-muted-foreground"> — {f.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Button asChild className="gradient-cyan text-primary-foreground hover:opacity-90">
                <Link to="/contact">Devenir franchisé</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/contact">Rejoindre l'écosystème</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
