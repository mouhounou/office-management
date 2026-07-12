import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Award, Briefcase, UserCheck, Calendar, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/realisations")({
  head: () => ({
    meta: [
      { title: "Réalisations — Office Management" },
      { name: "description", content: "Découvrez nos réalisations : formations certifiantes, accompagnement d'entreprises, recrutements réussis et séminaires." },
      { property: "og:title", content: "Réalisations — Office Management" },
      { property: "og:description", content: "Des résultats concrets pour nos clients et partenaires." },
    ],
  }),
  component: Realisations,
});

const items = [
  { i: Award, t: "Formations professionnelles certifiantes", d: "Des dizaines de promotions formées avec succès." },
  { i: Briefcase, t: "Accompagnement des entreprises", d: "Audit RH, externalisation paie, conseil organisationnel." },
  { i: UserCheck, t: "Recrutements réussis", d: "Placement de talents qualifiés dans divers secteurs." },
  { i: Calendar, t: "Séminaires et ateliers", d: "Organisation d'événements professionnels à fort impact." },
  { i: TrendingUp, t: "Développement des compétences", d: "Renforcement durable des capacités professionnelles." },
];

function Realisations() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Nos réussites</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Réalisations</h1>
          <p className="text-muted-foreground text-lg">
            Depuis notre création, nous avons accompagné plusieurs entreprises et formé de nombreux professionnels dans différents secteurs d'activité.
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="Nos réalisations" title="Des résultats concrets" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.t} className="gradient-card border-border p-6 hover-lift">
              <it.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{it.t}</h3>
              <p className="text-sm text-muted-foreground">{it.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
