import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Building2, Landmark, HeartHandshake, Factory, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "Nos références — Office Management" },
      { name: "description", content: "Entreprises, institutions, ONG, PME et écoles qui nous font confiance." },
    ],
  }),
  component: Page,
});

const groups = [
  { i: Building2, t: "Entreprises", d: "Grands comptes et groupes accompagnés sur leurs enjeux RH." },
  { i: Landmark, t: "Institutions", d: "Collaborations avec organismes publics et institutionnels." },
  { i: HeartHandshake, t: "ONG", d: "Soutien aux organisations à mission sociale." },
  { i: Factory, t: "PME", d: "Accompagnement de proximité des PME congolaises." },
  { i: GraduationCap, t: "Écoles", d: "Partenariats académiques et insertion des jeunes." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Ils nous font confiance</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos références</h1>
          <p className="text-muted-foreground text-lg">Des collaborations ponctuelles ou durables avec des acteurs variés du tissu économique et social.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Diversité" title="Une expertise reconnue par tous les secteurs" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map(g => (
            <Card key={g.t} className="gradient-card border-border p-6 hover-lift">
              <g.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{g.t}</h3>
              <p className="text-sm text-muted-foreground">{g.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
