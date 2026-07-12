import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Users, Calculator, Briefcase, Monitor, Crown, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/centre-competences")({
  head: () => ({
    meta: [
      { title: "Centre de compétences — Office Management" },
      { name: "description", content: "Domaines d'expertise : RH, Comptabilité, Gestion, Informatique, Leadership, Commerce." },
    ],
  }),
  component: Page,
});

const domains = [
  { i: Users, t: "Ressources Humaines", topics: ["Recrutement", "Paie", "GPEC", "Audit RH"] },
  { i: Calculator, t: "Comptabilité", topics: ["Sage 100 i7", "Comptabilité générale", "Fiscalité"] },
  { i: Briefcase, t: "Gestion", topics: ["Administration", "Gestion de projet", "Procédures"] },
  { i: Monitor, t: "Informatique", topics: ["Bureautique", "Excel Avancé", "Outils digitaux"] },
  { i: Crown, t: "Leadership", topics: ["Management", "Coaching", "Communication"] },
  { i: ShoppingBag, t: "Commerce", topics: ["Vente", "Négociation", "Relation client"] },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nos pôles d'expertise</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Centre de compétences</h1>
          <p className="text-muted-foreground text-lg">Chaque domaine regroupe formations, certifications, ressources et débouchés professionnels.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map(d => (
            <Card key={d.t} className="gradient-card border-border p-6 hover-lift">
              <d.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-3">{d.t}</h3>
              <ul className="space-y-1">
                {d.topics.map(t => <li key={t} className="text-sm text-muted-foreground flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{t}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
