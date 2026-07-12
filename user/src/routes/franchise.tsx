import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Handshake } from "lucide-react";

export const Route = createFileRoute("/franchise")({
  head: () => ({
    meta: [
      { title: "Franchise & représentations — Office Management" },
      { name: "description", content: "Développer Office Management dans plusieurs villes du Congo : opportunités de franchise et représentations." },
    ],
  }),
  component: Page,
});

const benefits = [
  { i: Building, t: "Marque reconnue", d: "Bénéficiez de la notoriété d'Office Management." },
  { i: Handshake, t: "Accompagnement", d: "Formation initiale, support continu et outils prêts à l'emploi." },
  { i: MapPin, t: "Territoire exclusif", d: "Une zone de chalandise garantie pour développer votre activité." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Vision d'expansion</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Franchise & représentations</h1>
          <p className="text-muted-foreground text-lg mb-8">Rejoignez le réseau Office Management et développez votre activité dans votre ville.</p>
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/contact">Devenir franchisé</Link></Button>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map(b => (
            <Card key={b.t} className="gradient-card border-border p-6 hover-lift">
              <b.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{b.t}</h3>
              <p className="text-sm text-muted-foreground">{b.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
