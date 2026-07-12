import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

export const Route = createFileRoute("/objectifs-2030")({
  head: () => ({
    meta: [
      { title: "Nos objectifs 2030 — Office Management" },
      { name: "description", content: "Vision stratégique 2030 : 10 000 personnes formées, 1 000 recrutements, présence nationale." },
    ],
  }),
  component: Page,
});

const goals = [
  { v: "10 000", l: "Personnes formées" },
  { v: "1 000", l: "Recrutements facilités" },
  { v: "100%", l: "Couverture nationale" },
  { v: "#1", l: "Plateforme RH de référence" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Vision stratégique</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos objectifs 2030</h1>
          <p className="text-muted-foreground text-lg">Une ambition claire pour devenir la référence RH, formation et recrutement au Congo.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {goals.map(g => (
            <Card key={g.l} className="gradient-card border-border p-8 text-center hover-lift">
              <Target className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="font-display text-4xl font-extrabold text-gradient-cyan mb-2">{g.v}</div>
              <div className="text-sm text-muted-foreground">{g.l}</div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
