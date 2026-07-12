import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export const Route = createFileRoute("/barometre-emploi")({
  head: () => ({
    meta: [
      { title: "Baromètre de l'emploi — Office Management" },
      { name: "description", content: "Métiers recherchés, tendances du marché, secteurs qui recrutent, compétences demandées." },
    ],
  }),
  component: Page,
});

const trending = [
  { t: "Assistant(e) RH", v: "+25%", up: true },
  { t: "Comptable Sage 100", v: "+18%", up: true },
  { t: "Gestionnaire administratif", v: "+15%", up: true },
  { t: "Excel Avancé", v: "+22%", up: true },
  { t: "Secrétaire bilingue", v: "+10%", up: true },
];

const sectors = ["Pétrole & Gaz", "BTP", "Banque & Assurance", "ONG & Coopération", "Distribution", "Télécommunications"];
const skills = ["Excel Avancé", "Sage 100 i7", "Communication écrite", "Gestion de projet", "Anglais professionnel", "Leadership"];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Observatoire du marché</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Baromètre de l'emploi</h1>
          <p className="text-muted-foreground text-lg">Suivi régulier des tendances du marché du travail au Congo.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Top métiers" title="Métiers les plus recherchés" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {trending.map(t => (
            <Card key={t.t} className="gradient-card border-border p-5 flex items-center justify-between hover-lift">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-semibold">{t.t}</span>
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 ${t.up ? "text-green-500" : "text-red-500"}`}>
                {t.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{t.v}
              </span>
            </Card>
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-display text-xl font-bold mb-4">Secteurs qui recrutent</h3>
            <div className="flex flex-wrap gap-2">
              {sectors.map(s => <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{s}</span>)}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-display text-xl font-bold mb-4">Compétences demandées</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{s}</span>)}
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
