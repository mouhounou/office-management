import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export const Route = createFileRoute("/engagements-entreprises")({
  head: () => ({
    meta: [
      { title: "Nos engagements envers les entreprises — Office Management" },
      { name: "description", content: "Réactivité, confidentialité, qualité, accompagnement, innovation, résultats mesurables." },
    ],
  }),
  component: Page,
});

const items = [
  { t: "Réactivité", d: "Réponse sous 24h ouvrées à toute sollicitation." },
  { t: "Confidentialité", d: "Vos données et projets restent strictement confidentiels." },
  { t: "Qualité", d: "Démarche qualité certifiée et amélioration continue." },
  { t: "Accompagnement", d: "Un interlocuteur dédié pour chaque mission." },
  { t: "Innovation", d: "Outils digitaux et méthodes modernes au service de vos enjeux." },
  { t: "Résultats mesurables", d: "Indicateurs de performance suivis et restitués." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre promesse client</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos engagements envers les entreprises</h1>
          <p className="text-muted-foreground text-lg">Six engagements concrets qui guident chacune de nos missions.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(i => (
            <Card key={i.t} className="gradient-card border-border p-6 hover-lift">
              <div className="h-10 w-10 rounded-full gradient-cyan flex items-center justify-center mb-4">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{i.t}</h3>
              <p className="text-sm text-muted-foreground">{i.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
