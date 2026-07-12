import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/appels-offres")({
  head: () => ({
    meta: [
      { title: "Appels d'offres — Office Management" },
      { name: "description", content: "Consultez les appels d'offres, téléchargez les dossiers et soumettez vos propositions." },
      { property: "og:title", content: "Appels d'offres — Office Management" },
      { property: "og:description", content: "Nos consultations en cours." },
    ],
  }),
  component: Page,
});

const tenders = [
  { ref: "AO-2026-001", t: "Formation Sage Paie & RH — 3 sessions", closing: "31 mars 2026" },
  { ref: "AO-2026-002", t: "Audit social — société industrielle", closing: "15 avril 2026" },
  { ref: "AO-2026-003", t: "Recrutement de 12 profils techniques", closing: "30 avril 2026" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Consultations</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Appels d'offres</h1>
          <p className="text-muted-foreground text-lg">Consultez nos consultations en cours, téléchargez les dossiers et soumettez vos propositions.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {tenders.map(t => (
            <Card key={t.ref} className="gradient-card border-border p-6 hover-lift">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1">{t.ref}</div>
                  <h3 className="font-display text-lg font-bold mb-2">{t.t}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Clôture : {t.closing}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Dossier</Button>
                  <Button size="sm" className="gradient-cyan text-primary-foreground"><Upload className="h-4 w-4 mr-2" />Soumettre</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
