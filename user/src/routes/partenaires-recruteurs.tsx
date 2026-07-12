import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Building2, Briefcase, Globe2, Landmark } from "lucide-react";

export const Route = createFileRoute("/partenaires-recruteurs")({
  head: () => ({
    meta: [
      { title: "Nos partenaires recruteurs — Office Management" },
      { name: "description", content: "Entreprises, cabinets, ONG et institutions partenaires offrant un accès privilégié à l'emploi." },
    ],
  }),
  component: Page,
});

const groups = [
  { i: Building2, t: "Entreprises", d: "Multinationales et groupes locaux à la recherche de talents." },
  { i: Briefcase, t: "Cabinets", d: "Cabinets de conseil et d'expertise qui recrutent nos certifiés." },
  { i: Globe2, t: "ONG", d: "Organisations à mission sociale et humanitaire." },
  { i: Landmark, t: "Institutions", d: "Organismes publics et parapublics partenaires." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Accès privilégié à l'emploi</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos partenaires recruteurs</h1>
          <p className="text-muted-foreground text-lg">Un réseau qui ouvre des opportunités concrètes à nos apprenants et candidats.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
