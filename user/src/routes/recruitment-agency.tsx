import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Users, Globe, Search, Clock, Award, Brain, FileCheck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/recruitment-agency")({
  head: () => ({
    meta: [
      { title: "Office Management Recruitment Agency" },
      { name: "description", content: "Agence de recrutement : local, international, chasse de têtes, intérim, assessment center et tests psychotechniques." },
      { property: "og:title", content: "Recruitment Agency — Office Management" },
      { property: "og:description", content: "Trouvez les talents qui font la différence." },
    ],
  }),
  component: Page,
});

const services = [
  { i: Users, t: "Recrutement local", d: "Sourcing et sélection sur le marché congolais." },
  { i: Globe, t: "Recrutement international", d: "Talents expatriés et diaspora qualifiée." },
  { i: Search, t: "Chasse de têtes", d: "Approche directe pour profils rares et dirigeants." },
  { i: Clock, t: "Intérim", d: "Mise à disposition rapide de compétences." },
  { i: Award, t: "Placement permanent", d: "Contrats durables et intégration réussie." },
  { i: Brain, t: "Assessment Center", d: "Évaluation multi-critères des candidats." },
  { i: FileCheck, t: "Tests psychotechniques", d: "Aptitudes, personnalité et raisonnement." },
  { i: ShieldCheck, t: "Vérification des références", d: "Contrôle rigoureux des parcours." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Agence de recrutement</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Recruitment Agency</h1>
          <p className="text-muted-foreground text-lg">Une véritable agence de recrutement pour identifier, évaluer et intégrer les meilleurs talents.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Services" title="Huit expertises complémentaires" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map(s => (
            <Card key={s.t} className="gradient-card border-border p-6 hover-lift">
              <s.i className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-display text-base font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
