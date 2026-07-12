import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/laureats")({
  head: () => ({
    meta: [
      { title: "Mur des lauréats — Office Management" },
      { name: "description", content: "Découvrez nos meilleurs apprenants : formation suivie, résultats, emplois trouvés." },
    ],
  }),
  component: Page,
});

const laureats = [
  { name: "M. NKOUKA", formation: "Excel Avancé", result: "Major de promotion", job: "Assistant de Direction — Total" },
  { name: "Mlle MOUKOKO", formation: "Assistant RH", result: "Mention Très Bien", job: "Chargée RH — Eni Congo" },
  { name: "M. TATY", formation: "Sage 100 i7", result: "Certification obtenue", job: "Comptable — PwC" },
  { name: "Mme MAYINDOU", formation: "Gestion Administrative", result: "Major de promotion", job: "Secrétaire de Direction" },
  { name: "M. LOEMBA", formation: "Bureautique Pro", result: "Mention Bien", job: "Agent Administratif" },
  { name: "Mlle BOUITY", formation: "Comptabilité Générale", result: "Mention Très Bien", job: "Aide-comptable" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Ils ont brillé</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Le mur des lauréats</h1>
          <p className="text-muted-foreground text-lg">Nos meilleurs apprenants, leur parcours et leur insertion professionnelle.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {laureats.map(l => (
            <Card key={l.name} className="gradient-card border-border p-6 hover-lift text-center">
              <div className="h-20 w-20 mx-auto rounded-full gradient-cyan flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">{l.name}</h3>
              <div className="text-sm text-primary mb-2">{l.formation}</div>
              <p className="text-xs text-muted-foreground mb-1">🏆 {l.result}</p>
              <p className="text-xs text-foreground/80">💼 {l.job}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
