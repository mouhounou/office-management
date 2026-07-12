import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ClipboardCheck, Lightbulb, Rocket, LineChart, RefreshCw, Workflow, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/processus")({
  head: () => ({
    meta: [
      { title: "Notre méthodologie — Office Management" },
      { name: "description", content: "De l'analyse du besoin au suivi post-mission, découvrez notre processus en 6 étapes structurées." },
      { property: "og:title", content: "Notre méthodologie — Office Management" },
      { property: "og:description", content: "Une approche structurée orientée résultats." },
    ],
  }),
  component: Process,
});

const STEPS = [
  { n: "01", icon: Search, title: "Prise de contact", desc: "Premier échange pour comprendre votre contexte et vos enjeux." },
  { n: "02", icon: ClipboardCheck, title: "Analyse du besoin", desc: "Diagnostic approfondi de votre organisation et de vos objectifs RH." },
  { n: "03", icon: Lightbulb, title: "Proposition de solution", desc: "Plan d'action sur-mesure, devis détaillé, calendrier d'intervention." },
  { n: "04", icon: Rocket, title: "Mise en œuvre", desc: "Déploiement opérationnel par nos consultants et formateurs experts." },
  { n: "05", icon: LineChart, title: "Suivi & évaluation", desc: "Mesure des résultats, indicateurs de performance, reporting régulier." },
  { n: "06", icon: RefreshCw, title: "Amélioration continue", desc: "Ajustements, accompagnement durable et pérennisation des acquis." },
];

function Process() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Workflow className="h-3.5 w-3.5" /> Notre méthodologie
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Un processus structuré en <span className="text-gradient-cyan">6 étapes</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Chaque mission suit la même rigueur, de la prise de contact au suivi long terme.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <Section className="pt-14!">
        <div className="relative max-w-4xl mx-auto">
          {/* Center line (desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-linear-to-b from-primary/0 via-primary/40 to-primary/0" />
          {/* Left line (mobile) */}
          <div className="md:hidden absolute left-6 top-2 bottom-2 w-px bg-linear-to-b from-primary/0 via-primary/40 to-primary/0" />

          <div className="space-y-6 md:space-y-10">
            {STEPS.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <div key={s.n} className="relative md:grid md:grid-cols-2 md:gap-10 md:items-center">
                  {/* Node dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-10">
                    <span className="flex h-4 w-4 rounded-full gradient-cyan ring-4 ring-background" />
                  </div>

                  {/* Card */}
                  <div className={left ? "md:col-start-1" : "md:col-start-2"}>
                    <Card className="group gradient-card border-border p-7 hover-lift ml-14 md:ml-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center group-hover:glow-cyan transition">
                          <s.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="font-display text-4xl font-extrabold text-primary/20">{s.n}</div>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-1.5">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0!">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
            <p className="text-muted-foreground mb-8">
              Lançons ensemble la première étape : un échange pour comprendre vos enjeux, sans engagement.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/devis">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/rendez-vous">Réserver un rendez-vous</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
