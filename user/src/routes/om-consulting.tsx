import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Users, Target, Settings, Cpu, RefreshCw, TrendingUp, Landmark, Sprout } from "lucide-react";

export const Route = createFileRoute("/om-consulting")({
  head: () => ({
    meta: [
      { title: "Office Management Consulting — Conseil stratégique & RH" },
      { name: "description", content: "Cabinet de conseil : RH, stratégie, organisation, transformation digitale, gouvernance et performance." },
      { property: "og:title", content: "Office Management Consulting" },
      { property: "og:description", content: "Accompagner la transformation des organisations congolaises." },
    ],
  }),
  component: Page,
});

const services = [
  { i: Users, t: "Conseil RH", d: "Stratégie RH, politique de rémunération, culture d'entreprise." },
  { i: Target, t: "Conseil stratégique", d: "Vision, plan de développement, positionnement." },
  { i: Settings, t: "Organisation", d: "Structures, processus, fiches de poste." },
  { i: Cpu, t: "Transformation digitale", d: "Digitaliser les fonctions clés de l'entreprise." },
  { i: RefreshCw, t: "Gestion du changement", d: "Accompagnement humain des transformations." },
  { i: TrendingUp, t: "Performance", d: "Tableaux de bord, KPI et pilotage." },
  { i: Landmark, t: "Gouvernance", d: "Comités, instances et bonnes pratiques." },
  { i: Sprout, t: "Développement organisationnel", d: "Maturité, culture, leadership." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Cabinet de conseil</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Consulting</h1>
          <p className="text-muted-foreground text-lg">Un cabinet de conseil au service des dirigeants et des organisations qui veulent aller plus loin.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Nos expertises" title="Huit domaines de conseil" />
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
