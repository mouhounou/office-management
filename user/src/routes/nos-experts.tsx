import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

export const Route = createFileRoute("/nos-experts")({
  head: () => ({
    meta: [
      { title: "Nos formateurs & experts — Office Management" },
      { name: "description", content: "Présentation de nos formateurs et experts : spécialités, expérience, certifications." },
    ],
  }),
  component: Page,
});

const experts = [
  { name: "Hassan AKIANA", role: "Directeur Général — Stratégie RH", exp: "15+ ans en conseil RH et gouvernance", domains: ["Audit RH", "Stratégie", "Leadership"] },
  { name: "Expert Comptabilité", role: "Formateur Sage 100 i7 & Comptabilité", exp: "12 ans d'expérience entreprise", domains: ["Sage 100 i7", "Comptabilité", "Fiscalité"] },
  { name: "Expert Bureautique", role: "Formateur Excel Avancé & Office", exp: "10 ans en formation professionnelle", domains: ["Excel Avancé", "Word", "PowerPoint"] },
  { name: "Expert RH", role: "Consultante Assistant RH & Paie", exp: "8 ans en gestion RH opérationnelle", domains: ["Recrutement", "Paie", "GPEC"] },
  { name: "Expert Gestion", role: "Formateur Gestion Administrative", exp: "10 ans en administration", domains: ["Secrétariat", "Archivage", "Procédures"] },
  { name: "Expert Leadership", role: "Coach Management & Leadership", exp: "12 ans en accompagnement de dirigeants", domains: ["Leadership", "Coaching", "Communication"] },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre équipe</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos formateurs & experts</h1>
          <p className="text-muted-foreground text-lg">Des professionnels qualifiés, certifiés, et passionnés par la transmission.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Équipe pédagogique" title="L'expertise au service de votre réussite" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts.map(e => (
            <Card key={e.name} className="gradient-card border-border p-6 hover-lift">
              <div className="h-16 w-16 rounded-full gradient-cyan flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                {e.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <h3 className="font-display text-lg font-bold mb-1">{e.name}</h3>
              <div className="text-sm text-primary mb-2">{e.role}</div>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1"><Award className="h-3 w-3" />{e.exp}</p>
              <div className="flex flex-wrap gap-1">
                {e.domains.map(d => <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{d}</span>)}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
