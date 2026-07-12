import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/carrieres-talents")({
  head: () => ({
    meta: [
      { title: "Carrières & talents — Office Management" },
      { name: "description", content: "Rejoignez Office Management : consultants, formateurs, commerciaux, assistants RH, développeurs et techniciens." },
      { property: "og:title", content: "Carrières & talents — Office Management" },
      { property: "og:description", content: "Un parcours de candidature simplifié." },
    ],
  }),
  component: Page,
});

const jobs = [
  { t: "Consultant RH senior", type: "CDI", loc: "Pointe-Noire" },
  { t: "Formateur Sage & Excel", type: "Vacations", loc: "Pointe-Noire / Brazzaville" },
  { t: "Commercial B2B", type: "CDI", loc: "Pointe-Noire" },
  { t: "Assistant RH", type: "CDI", loc: "Pointe-Noire" },
  { t: "Développeur full-stack", type: "CDI", loc: "Hybride" },
  { t: "Technicien maintenance", type: "CDI", loc: "Pointe-Noire" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nous recrutons</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Carrières & talents</h1>
          <p className="text-muted-foreground text-lg">Rejoignez une équipe engagée pour l'excellence et le développement du capital humain.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
          {jobs.map(j => (
            <Card key={j.t} className="gradient-card border-border p-6 hover-lift flex items-start justify-between gap-4">
              <div>
                <Briefcase className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-display text-base font-bold mb-1">{j.t}</h3>
                <div className="text-xs text-muted-foreground">{j.type} • {j.loc}</div>
              </div>
              <Button asChild size="sm" className="gradient-cyan text-primary-foreground shrink-0">
                <Link to="/contact">Postuler</Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
