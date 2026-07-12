import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, UserSearch, Handshake, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/ecosysteme")({
  head: () => ({
    meta: [
      { title: "L'écosystème Office Management" },
      { name: "description", content: "Une plateforme nationale de développement des compétences, de recrutement et de performance organisationnelle." },
    ],
  }),
  component: Page,
});

const actors = [
  { i: Building2, t: "Les entreprises", d: "Viennent pour recruter les meilleurs talents." },
  { i: GraduationCap, t: "Les étudiants", d: "Viennent pour apprendre et se certifier." },
  { i: UserSearch, t: "Les candidats", d: "Viennent pour trouver un emploi à la hauteur de leurs ambitions." },
  { i: Handshake, t: "Les partenaires", d: "Viennent pour collaborer et co-construire." },
  { i: TrendingUp, t: "Les investisseurs", d: "Viennent pour faire confiance à la marque." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Le niveau ultime</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">L'écosystème Office Management</h1>
          <p className="text-muted-foreground text-lg">Plus qu'un centre de formation ou un cabinet RH : une plateforme nationale au service de tous les acteurs du monde du travail.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Une plateforme, cinq publics" title="Un écosystème complet" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actors.map(a => (
            <Card key={a.t} className="gradient-card border-border p-6 hover-lift">
              <a.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{a.t}</h3>
              <p className="text-sm text-muted-foreground">{a.d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg italic text-muted-foreground max-w-2xl mx-auto mb-6">
            « Office Management est devenu une plateforme nationale de développement des compétences, de recrutement et de performance organisationnelle. »
          </p>
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/contact">Rejoindre l'écosystème</Link></Button>
        </div>
      </Section>
    </>
  );
}
