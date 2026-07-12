import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Workflow, TrendingUp, ClipboardCheck, Smile, Star } from "lucide-react";

export const Route = createFileRoute("/certification-qualite")({
  head: () => ({
    meta: [
      { title: "Certification qualité — Office Management" },
      { name: "description", content: "Notre démarche qualité : processus, amélioration continue, contrôle qualité, satisfaction client et évaluation des formations." },
      { property: "og:title", content: "Certification qualité — Office Management" },
      { property: "og:description", content: "Une démarche qualité structurée et mesurable." },
    ],
  }),
  component: Page,
});

const pillars = [
  { i: Workflow, t: "Processus", d: "Procédures documentées et référentiels internes." },
  { i: TrendingUp, t: "Amélioration continue", d: "Revues qualité, retours clients, actions correctives." },
  { i: ClipboardCheck, t: "Contrôle qualité", d: "Vérifications à chaque étape de nos prestations." },
  { i: Smile, t: "Satisfaction client", d: "Enquêtes régulières et mesure du NPS." },
  { i: Star, t: "Évaluation des formations", d: "À chaud, à froid, et sur le transfert en situation de travail." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre démarche</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Certification qualité</h1>
          <p className="text-muted-foreground text-lg">Une démarche qualité rigoureuse, gage de sérieux et de résultats.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map(p => (
            <Card key={p.t} className="gradient-card border-border p-6 hover-lift">
              <p.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{p.t}</h3>
              <p className="text-sm text-muted-foreground">{p.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
