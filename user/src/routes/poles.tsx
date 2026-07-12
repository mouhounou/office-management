import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Briefcase, Wrench, Sparkles, Cpu, ArrowRight, CheckCircle2, Layers } from "lucide-react";

export const Route = createFileRoute("/poles")({
  head: () => ({
    meta: [
      { title: "Nos pôles d'activités — Office Management" },
      { name: "description", content: "Découvrez les 6 pôles d'expertise d'Office Management : Formation, Recrutement, Consulting RH, Prestations techniques, Services additionnels, Solutions digitales." },
      { property: "og:title", content: "Nos pôles d'activités — Office Management" },
      { property: "og:description", content: "6 pôles d'expertise au service de votre capital humain." },
    ],
  }),
  component: Poles,
});

const POLES = [
  { icon: GraduationCap, name: "Formation & Développement", tag: "Pôle Formation", desc: "Formations certifiantes, montée en compétences, coaching individuel et collectif.", items: ["Sage 100 i7", "Excel avancé", "RH & Paie", "Leadership", "QHSE"] },
  { icon: Users, name: "Recrutement & Placement", tag: "Pôle Recrutement", desc: "Sourcing, sélection, mise à disposition de talents qualifiés.", items: ["Sourcing actif", "Tests d'aptitude", "Entretiens", "Onboarding", "Mise à disposition"] },
  { icon: Briefcase, name: "Consulting RH", tag: "Pôle Conseil", desc: "Audit, externalisation, transformation organisationnelle.", items: ["Audit RH", "Externalisation paie", "Organisation", "Conformité", "Digitalisation"] },
  { icon: Wrench, name: "Prestations Techniques", tag: "Pôle Technique", desc: "Maintenance, sécurité, assistance technique sur site.", items: ["Maintenance", "Sécurité", "Installation", "Support sur site", "Logistique"] },
  { icon: Sparkles, name: "Services Additionnels", tag: "Pôle Services", desc: "CV, coaching, orientation, soft skills, leadership.", items: ["Rédaction CV", "Coaching carrière", "Soft skills", "Simulation entretien", "Orientation"] },
  { icon: Cpu, name: "Solutions Digitales", tag: "Pôle Digital", desc: "Sage, Excel, reporting, digitalisation RH, automatisation.", items: ["Sage 100 i7", "Reporting RH", "Tableaux de bord", "Archivage", "Automatisation"] },
];

function Poles() {
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
            <Layers className="h-3.5 w-3.5" /> Nos pôles d'expertise
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Six pôles, une seule mission : <span className="text-gradient-cyan">votre performance RH</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Chaque pôle fonctionne comme une mini-marque interne, avec son expertise dédiée et ses équipes spécialisées.
          </p>
        </div>
      </section>

      {/* GRID */}
      <Section className="pt-14!">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POLES.map((p, i) => (
            <Card key={p.name} className="group gradient-card border-border p-7 hover-lift">
              <div className="flex items-start justify-between mb-5">
                <div className="h-14 w-14 rounded-xl gradient-cyan flex items-center justify-center group-hover:glow-cyan transition">
                  <p.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="font-display text-4xl font-extrabold text-primary/15 leading-none">0{i + 1}</span>
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{p.tag}</div>
              <h3 className="font-display text-xl font-bold mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{p.desc}</p>
              <ul className="space-y-2 border-t border-border/50 pt-4">
                {p.items.map((it) => (
                  <li key={it} className="text-sm flex items-center gap-2 text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0!">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Un besoin qui touche plusieurs pôles ?</h2>
            <p className="text-muted-foreground mb-8">
              Nos équipes construisent une solution sur mesure en combinant les expertises adaptées à votre contexte.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/devis">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
