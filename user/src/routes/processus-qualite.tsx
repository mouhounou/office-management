import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ClipboardCheck, BarChart3, Repeat } from "lucide-react";

export const Route = createFileRoute("/processus-qualite")({
  head: () => ({
    meta: [
      { title: "Nos processus qualité — Office Management" },
      { name: "description", content: "Contrôle qualité, suivi des formations, évaluation des candidats, amélioration continue." },
    ],
  }),
  component: Page,
});

const items = [
  { i: ShieldCheck, t: "Contrôle qualité", d: "Audits réguliers et conformité aux standards les plus exigeants." },
  { i: ClipboardCheck, t: "Suivi des formations", d: "Évaluations à chaud et à froid sur chaque session." },
  { i: BarChart3, t: "Évaluation des candidats", d: "Tests, mises en situation et entretiens structurés." },
  { i: Repeat, t: "Amélioration continue", d: "Boucle de feedback intégrée à chaque projet." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Excellence opérationnelle</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos processus qualité</h1>
          <p className="text-muted-foreground text-lg">Une démarche rigoureuse pour garantir des résultats à la hauteur de vos attentes.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map(i => (
            <Card key={i.t} className="gradient-card border-border p-6 hover-lift">
              <i.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">{i.t}</h3>
              <p className="text-muted-foreground">{i.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
