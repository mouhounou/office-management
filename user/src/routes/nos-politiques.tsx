import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/nos-politiques")({
  head: () => ({
    meta: [
      { title: "Nos politiques — Office Management" },
      { name: "description", content: "Politiques qualité, confidentialité, protection des données, santé sécurité, RSE, anti-corruption, diversité et inclusion." },
      { property: "og:title", content: "Nos politiques — Office Management" },
      { property: "og:description", content: "Nos engagements formalisés au service de nos parties prenantes." },
    ],
  }),
  component: Page,
});

const policies = [
  "Politique qualité",
  "Politique de confidentialité",
  "Politique de protection des données",
  "Politique santé & sécurité",
  "Politique RSE",
  "Politique anti-corruption",
  "Politique diversité",
  "Politique inclusion",
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Transparence</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos politiques</h1>
          <p className="text-muted-foreground text-lg">Nos engagements formalisés, disponibles en téléchargement.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
          {policies.map(p => (
            <Card key={p} className="gradient-card border-border p-5 flex items-center justify-between hover-lift">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">{p}</span>
              </div>
              <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />PDF</Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
