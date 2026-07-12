import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Award, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/om-certified")({
  head: () => ({
    meta: [
      { title: "Office Management Certified — Académie de certification" },
      { name: "description", content: "Certifications professionnelles vérifiables en ligne : Excel, Sage, RH, Gestion administrative." },
    ],
  }),
  component: Page,
});

const badges = [
  { t: "Certifié Excel Avancé", d: "Maîtrise des tableaux croisés, macros et analyses." },
  { t: "Certifié Sage 100 i7", d: "Comptabilité, paie et gestion commerciale." },
  { t: "Certifié Assistant RH", d: "Recrutement, paie, administration du personnel." },
  { t: "Certifié Gestionnaire Administratif", d: "Procédures, archivage et organisation." },
  { t: "Certifié Bureautique Pro", d: "Word, Excel, PowerPoint, Outlook." },
  { t: "Certifié Comptabilité Générale", d: "Tenue de comptes, états financiers." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Académie de certification</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Certified</h1>
          <p className="text-muted-foreground text-lg">Des certifications reconnues, vérifiables en ligne, qui valorisent vos compétences sur le marché du travail.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Nos badges" title="Certifications professionnelles" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {badges.map(b => (
            <Card key={b.t} className="gradient-card border-border p-6 hover-lift">
              <div className="h-14 w-14 rounded-full gradient-cyan flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">🏅 {b.t}</h3>
              <p className="text-sm text-muted-foreground mb-3">{b.d}</p>
              <div className="text-xs text-primary flex items-center gap-1"><ShieldCheck className="h-3 w-3" />Vérifiable en ligne</div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
