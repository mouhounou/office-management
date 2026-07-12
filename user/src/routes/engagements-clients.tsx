import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Clock, Lock, Target, HeartHandshake, RefreshCcw, FileCheck } from "lucide-react";

export const Route = createFileRoute("/engagements-clients")({
  head: () => ({
    meta: [
      { title: "Nos engagements envers nos clients — Office Management" },
      { name: "description", content: "Notre charte de service : réponse rapide, confidentialité, solutions adaptées, suivi et transparence." },
      { property: "og:title", content: "Nos engagements envers nos clients" },
      { property: "og:description", content: "Une charte de service exigeante." },
    ],
  }),
  component: Page,
});

const commitments = [
  { i: Clock, t: "Réactivité", d: "Réponse aux demandes sous 24 à 48 heures ouvrées." },
  { i: Lock, t: "Confidentialité", d: "Vos informations sont strictement protégées." },
  { i: Target, t: "Solutions adaptées", d: "Une réponse sur-mesure à vos besoins." },
  { i: HeartHandshake, t: "Accompagnement personnalisé", d: "Un interlocuteur dédié pour chaque mission." },
  { i: RefreshCcw, t: "Suivi après prestation", d: "Nous restons à vos côtés après la livraison." },
  { i: FileCheck, t: "Transparence", d: "Des devis clairs et des contrats sans ambiguïté." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Charte de service</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos engagements envers nos clients</h1>
          <p className="text-muted-foreground text-lg">Six engagements qui définissent notre manière de travailler avec vous.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {commitments.map(c => (
            <Card key={c.t} className="gradient-card border-border p-6 hover-lift">
              <c.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{c.t}</h3>
              <p className="text-sm text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
