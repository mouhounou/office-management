import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { BookOpen, BarChart3, FileText, GraduationCap, Mic, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/institute")({
  head: () => ({
    meta: [
      { title: "Office Management Institute — Recherche & Innovation RH" },
      { name: "description", content: "Institut dédié à la recherche RH, aux études sur l'emploi, aux livres blancs et aux référentiels de compétences." },
      { property: "og:title", content: "Office Management Institute" },
      { property: "og:description", content: "Recherche, innovation et développement des compétences RH au Congo." },
    ],
  }),
  component: Page,
});

const missions = [
  { i: BookOpen, t: "Études RH", d: "Recherche appliquée sur les Ressources Humaines et le capital humain." },
  { i: BarChart3, t: "Enquêtes emploi", d: "Analyses du marché du travail au Congo et en Afrique centrale." },
  { i: FileText, t: "Livres blancs", d: "Publications de référence pour les décideurs et DRH." },
  { i: GraduationCap, t: "Référentiels", d: "Standards de compétences par métier et secteur d'activité." },
  { i: Mic, t: "Conférences", d: "Événements nationaux et rencontres d'experts RH." },
  { i: TrendingUp, t: "Prospective", d: "Anticiper les mutations du travail et des organisations." },
];

const publications = [
  "Rapport sur l'emploi au Congo",
  "Baromètre des salaires",
  "Tendances RH",
  "Guide du recrutement",
  "Guide de la paie",
  "Rapport sur la formation professionnelle",
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Recherche & Innovation</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Institute</h1>
          <p className="text-muted-foreground text-lg">Une entité prestigieuse dédiée à la recherche, l'innovation et le développement des compétences RH au Congo.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Missions" title="Nos six missions fondatrices" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map(m => (
            <Card key={m.t} className="gradient-card border-border p-6 hover-lift">
              <m.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{m.t}</h3>
              <p className="text-sm text-muted-foreground">{m.d}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section className="py-12">
        <SectionTitle eyebrow="Publications annuelles" title="Nos publications de référence" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {publications.map(p => (
            <Card key={p} className="gradient-card border-border p-5 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium">{p}</span>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
