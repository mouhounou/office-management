import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Heart, Users, GraduationCap, Sprout } from "lucide-react";

export const Route = createFileRoute("/foundation")({
  head: () => ({
    meta: [
      { title: "Office Management Foundation" },
      { name: "description", content: "Vision sociétale : insertion des jeunes, aide à l'emploi, mentorat, développement local." },
    ],
  }),
  component: Page,
});

const actions = [
  { i: Users, t: "Insertion des jeunes", d: "Programmes dédiés aux jeunes sans qualification." },
  { i: GraduationCap, t: "Aide à l'emploi", d: "Bourses de formation et accompagnement à la recherche d'emploi." },
  { i: Heart, t: "Mentorat", d: "Mise en relation avec des professionnels pour guider les parcours." },
  { i: Sprout, t: "Développement local", d: "Actions au plus près des communautés." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre engagement sociétal</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Foundation</h1>
          <p className="text-muted-foreground text-lg">Rendre le développement professionnel accessible à tous, partout au Congo.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {actions.map(a => (
            <Card key={a.t} className="gradient-card border-border p-6 hover-lift">
              <a.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{a.t}</h3>
              <p className="text-sm text-muted-foreground">{a.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
