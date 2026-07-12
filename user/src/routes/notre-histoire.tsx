import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, Handshake } from "lucide-react";

export const Route = createFileRoute("/notre-histoire")({
  head: () => ({
    meta: [
      { title: "Notre histoire & identité de marque — Office Management" },
      { name: "description", content: "Une identité de marque complète : ce que nous inspirons aux dirigeants, aux candidats et à nos partenaires." },
      { property: "og:title", content: "Notre histoire — Office Management" },
      { property: "og:description", content: "Une organisation structurée, crédible, innovante et tournée vers l'excellence." },
    ],
  }),
  component: Page,
});

const audiences = [
  {
    i: Building2,
    t: "Pour un dirigeant d'entreprise",
    q: "« Ce cabinet est capable d'accompagner la transformation de notre organisation et de renforcer notre capital humain. »",
  },
  {
    i: GraduationCap,
    t: "Pour un candidat",
    q: "« Ici, je peux développer mes compétences, trouver des opportunités professionnelles et construire ma carrière. »",
  },
  {
    i: Handshake,
    t: "Pour un partenaire ou une institution",
    q: "« Office Management est une organisation structurée, crédible, innovante et tournée vers l'excellence. »",
  },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Identité de marque</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Notre histoire</h1>
          <p className="text-muted-foreground text-lg">Notre site — et notre marque — racontent une histoire. Chaque visiteur y trouve une promesse claire.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Ce que nous inspirons" title="Trois regards, une même conviction" />
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map(a => (
            <Card key={a.t} className="gradient-card border-border p-8 hover-lift">
              <a.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-3">{a.t}</h3>
              <p className="text-muted-foreground italic">{a.q}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/a-propos">En savoir plus sur Office Management</Link></Button>
        </div>
      </Section>
    </>
  );
}
