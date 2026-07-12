import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Send, Activity, Star } from "lucide-react";

export const Route = createFileRoute("/stages-insertion")({
  head: () => ({
    meta: [
      { title: "Stages & insertion — Office Management" },
      { name: "description", content: "Espace dédié aux étudiants : recherche de stage, candidature, suivi de placement, recommandations." },
    ],
  }),
  component: Page,
});

const steps = [
  { i: Search, t: "Rechercher un stage", d: "Accédez à notre base d'opportunités." },
  { i: Send, t: "Candidater", d: "Postulez en quelques clics avec votre dossier." },
  { i: Activity, t: "Suivre son placement", d: "Visibilité sur l'avancement de votre candidature." },
  { i: Star, t: "Recevoir des recommandations", d: "Lettres de recommandation à la fin de votre stage." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Espace étudiant</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Stages & insertion professionnelle</h1>
          <p className="text-muted-foreground text-lg mb-8">Nous accompagnons les étudiants de la recherche de stage à leur premier emploi.</p>
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/contact">Postuler maintenant</Link></Button>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Notre accompagnement" title="Un parcours complet" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(s => (
            <Card key={s.t} className="gradient-card border-border p-6 hover-lift">
              <s.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
