import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Users, LayoutDashboard, BarChart3, Zap, Database, FolderOpen, Cpu } from "lucide-react";

export const Route = createFileRoute("/om-digital")({
  head: () => ({
    meta: [
      { title: "Office Management Digital" },
      { name: "description", content: "Division digitale : digitalisation RH, tableaux de bord, Power BI, automatisation Excel, Sage, GED, transformation numérique." },
      { property: "og:title", content: "Office Management Digital" },
      { property: "og:description", content: "Digitaliser vos processus RH et de gestion." },
    ],
  }),
  component: Page,
});

const services = [
  { i: Users, t: "Digitalisation RH", d: "Dématérialiser les processus RH de A à Z." },
  { i: LayoutDashboard, t: "Tableaux de bord", d: "Pilotage visuel et suivi des KPI." },
  { i: BarChart3, t: "Power BI", d: "Rapports interactifs et analyse avancée." },
  { i: Zap, t: "Automatisation Excel", d: "Macros, VBA et Power Query." },
  { i: Database, t: "Sage", d: "Paramétrage, formation et optimisation." },
  { i: FolderOpen, t: "GED", d: "Gestion Électronique des Documents." },
  { i: Cpu, t: "Transformation numérique", d: "Feuille de route et accompagnement complet." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Division digitale</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Digital</h1>
          <p className="text-muted-foreground text-lg">La division digitale qui transforme vos processus et libère votre productivité.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(s => (
            <Card key={s.t} className="gradient-card border-border p-6 hover-lift">
              <s.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
