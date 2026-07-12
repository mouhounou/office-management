import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Award, Lightbulb, ShieldCheck, HandHeart } from "lucide-react";

export const Route = createFileRoute("/valeurs-en-action")({
  head: () => ({
    meta: [
      { title: "Nos valeurs en action — Office Management" },
      { name: "description", content: "Excellence, innovation, intégrité et engagement : nos valeurs illustrées par des exemples concrets." },
      { property: "og:title", content: "Nos valeurs en action" },
      { property: "og:description", content: "Des valeurs vécues, pas seulement affichées." },
    ],
  }),
  component: Page,
});

const values = [
  { i: Award, t: "Excellence", d: "Chaque mission est préparée selon une méthodologie rigoureuse, du cadrage à la restitution." },
  { i: Lightbulb, t: "Innovation", d: "Nous utilisons des outils numériques modernes et des méthodes pédagogiques actives pour maximiser l'impact." },
  { i: ShieldCheck, t: "Intégrité", d: "Nous respectons nos engagements et garantissons la confidentialité des informations qui nous sont confiées." },
  { i: HandHeart, t: "Engagement", d: "Nous accompagnons nos clients jusqu'à l'atteinte des objectifs — pas seulement jusqu'à la fin du contrat." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nos valeurs</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos valeurs en action</h1>
          <p className="text-muted-foreground text-lg">Des valeurs qui se vivent au quotidien, à travers des exemples concrets.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {values.map(v => (
            <Card key={v.t} className="gradient-card border-border p-8 hover-lift">
              <v.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold mb-3">{v.t}</h3>
              <p className="text-muted-foreground">{v.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
