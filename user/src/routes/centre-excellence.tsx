import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Settings, Cpu, Heart } from "lucide-react";

export const Route = createFileRoute("/centre-excellence")({
  head: () => ({
    meta: [
      { title: "Centre d'excellence — Office Management" },
      { name: "description", content: "Nos cinq axes d'excellence : pédagogique, RH, opérationnelle, digitale et relation client." },
      { property: "og:title", content: "Centre d'excellence — Office Management" },
      { property: "og:description", content: "Les standards de qualité qui guident nos équipes." },
    ],
  }),
  component: Page,
});

const axes = [
  { i: GraduationCap, t: "Excellence pédagogique", d: "Méthodes actives, formateurs experts, évaluations rigoureuses." },
  { i: Users, t: "Excellence RH", d: "Talents, culture d'engagement, développement continu." },
  { i: Settings, t: "Excellence opérationnelle", d: "Processus fiables, ponctualité et qualité de service." },
  { i: Cpu, t: "Excellence digitale", d: "Outils modernes, automatisation, données et pilotage." },
  { i: Heart, t: "Excellence relation client", d: "Écoute, personnalisation, suivi après prestation." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nos standards</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Centre d'excellence</h1>
          <p className="text-muted-foreground text-lg">Cinq axes d'excellence qui structurent chacune de nos missions.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {axes.map(a => (
            <Card key={a.t} className="gradient-card border-border p-6 hover-lift">
              <a.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{a.t}</h3>
              <p className="text-sm text-muted-foreground">{a.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
