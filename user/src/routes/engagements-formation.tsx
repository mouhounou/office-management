import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export const Route = createFileRoute("/engagements-formation")({
  head: () => ({
    meta: [
      { title: "Nos engagements en matière de formation — Office Management" },
      { name: "description", content: "Formation pratique, formateurs expérimentés, accompagnement, certificat reconnu, insertion professionnelle." },
    ],
  }),
  component: Page,
});

const items = [
  { t: "Formation pratique", d: "Mises en situation, cas concrets, outils réels." },
  { t: "Formateurs expérimentés", d: "Des professionnels du métier, pas seulement des théoriciens." },
  { t: "Accompagnement personnalisé", d: "Suivi individuel tout au long de votre parcours." },
  { t: "Certificat reconnu", d: "Diplôme valorisé sur le marché du travail." },
  { t: "Insertion professionnelle", d: "Accès à notre réseau de partenaires recruteurs." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre promesse</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos engagements en matière de formation</h1>
          <p className="text-muted-foreground text-lg">Cinq promesses fortes pour faire de votre formation une véritable réussite.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(i => (
            <Card key={i.t} className="gradient-card border-border p-6 hover-lift">
              <div className="h-10 w-10 rounded-full gradient-cyan flex items-center justify-center mb-4">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{i.t}</h3>
              <p className="text-sm text-muted-foreground">{i.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
