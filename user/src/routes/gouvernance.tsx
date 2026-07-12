import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Crown, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/gouvernance")({
  head: () => ({
    meta: [
      { title: "Gouvernance — Office Management" },
      { name: "description", content: "Structure et organigramme d'Office Management : direction générale et directions opérationnelles." },
      { property: "og:title", content: "Gouvernance — Office Management" },
      { property: "og:description", content: "Une organisation structurée au service de nos clients." },
    ],
  }),
  component: Page,
});

const org = [
  "Président Directeur Général",
  "Direction Générale",
  "Direction Formation",
  "Direction RH",
  "Direction Commerciale",
  "Direction Technique",
  "Direction Administrative & Financière",
  "Direction Digitale",
  "Direction Qualité",
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Crown className="h-10 w-10 text-primary mx-auto mb-4" />
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Structure</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Gouvernance</h1>
          <p className="text-muted-foreground text-lg">Une organisation claire, une chaîne de responsabilité maîtrisée.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Organigramme" title="Nos directions" />
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          {org.map((role, i) => (
            <div key={role} className="w-full flex flex-col items-center">
              <Card className="gradient-card border-border p-4 w-full text-center hover-lift">
                <div className="font-display font-bold">{role}</div>
              </Card>
              {i < org.length - 1 && <ChevronDown className="h-5 w-5 text-primary my-1" />}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
