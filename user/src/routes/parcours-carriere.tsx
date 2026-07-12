import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/parcours-carriere")({
  head: () => ({
    meta: [
      { title: "Parcours de carrière — Office Management" },
      { name: "description", content: "Étudiants, salariés, entreprises : trouvez le parcours adapté à votre situation." },
    ],
  }),
  component: Page,
});

const paths = [
  { i: GraduationCap, t: "Je suis étudiant", steps: ["Formation certifiante", "Stage en entreprise", "Premier emploi"], cta: "/formations" },
  { i: TrendingUp, t: "Je suis salarié", steps: ["Formation continue", "Certification reconnue", "Promotion ou évolution"], cta: "/formations" },
  { i: Briefcase, t: "Je suis entreprise", steps: ["Recrutement ciblé", "Formation équipes", "Performance mesurable"], cta: "/devis" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Votre chemin vers la réussite</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Parcours de carrière</h1>
          <p className="text-muted-foreground text-lg">Choisissez votre situation et découvrez le parcours qui vous correspond.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {paths.map(p => (
            <Card key={p.t} className="gradient-card border-border p-6 hover-lift flex flex-col">
              <p.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold mb-4">{p.t}</h3>
              <ol className="space-y-3 mb-6 flex-1">
                {p.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 items-start text-sm">
                    <span className="h-6 w-6 rounded-full gradient-cyan text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <Button asChild variant="outline"><Link to={p.cta}>Commencer</Link></Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
