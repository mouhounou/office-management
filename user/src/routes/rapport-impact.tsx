import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Users, Briefcase, Building2, Smile, GraduationCap, Handshake } from "lucide-react";

export const Route = createFileRoute("/rapport-impact")({
  head: () => ({
    meta: [
      { title: "Rapport d'impact — Office Management" },
      { name: "description", content: "Notre impact 2026 : 520 personnes formées, 280 recrutements, 45 entreprises accompagnées, 98% de satisfaction." },
      { property: "og:title", content: "Rapport d'impact — Office Management" },
      { property: "og:description", content: "Chiffres clés et mesure de l'impact de nos actions." },
    ],
  }),
  component: Page,
});

const stats = [
  { i: Users, v: "520", l: "Personnes formées" },
  { i: Briefcase, v: "280", l: "Recrutements" },
  { i: Building2, v: "45", l: "Entreprises accompagnées" },
  { i: Smile, v: "98 %", l: "Satisfaction" },
  { i: GraduationCap, v: "25", l: "Formations organisées" },
  { i: Handshake, v: "18", l: "Partenaires" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Année 2026</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Rapport d'impact</h1>
          <p className="text-muted-foreground text-lg">Mesurer notre impact pour l'amplifier chaque année.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map(s => (
            <Card key={s.l} className="gradient-card border-border p-8 text-center hover-lift">
              <s.i className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="font-display text-4xl font-extrabold text-gradient-cyan mb-1">{s.v}</div>
              <div className="text-sm text-muted-foreground">{s.l}</div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
