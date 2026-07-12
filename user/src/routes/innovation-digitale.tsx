import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Cpu, Zap, Bot, Users } from "lucide-react";

export const Route = createFileRoute("/innovation-digitale")({
  head: () => ({
    meta: [
      { title: "Innovation & transformation digitale — Office Management" },
      { name: "description", content: "Digitalisation RH, automatisation, intelligence artificielle, outils collaboratifs." },
    ],
  }),
  component: Page,
});

const items = [
  { i: Cpu, t: "Digitalisation RH", d: "SIRH, dématérialisation des dossiers, signatures électroniques." },
  { i: Zap, t: "Automatisation", d: "Workflows RH, recrutement et paie automatisés." },
  { i: Bot, t: "Intelligence artificielle", d: "Tri de CV, matching candidats/postes, analyse prédictive." },
  { i: Users, t: "Outils collaboratifs", d: "Plateformes de travail à distance et de gestion d'équipe." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Le futur du travail</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Innovation & transformation digitale</h1>
          <p className="text-muted-foreground text-lg">Nous accompagnons votre transformation grâce aux meilleures technologies RH.</p>
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
