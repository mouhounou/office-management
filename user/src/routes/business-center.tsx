import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase, GraduationCap, FileSearch, FolderOpen, FileText, ShieldCheck,
  LayoutDashboard, ArrowRight, FilePlus2, MessagesSquare, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/business-center")({
  head: () => ({
    meta: [
      { title: "Business Center — Office Management" },
      { name: "description", content: "Portail entreprises : recrutement, formation, audit RH, factures et suivi de dossiers en temps réel." },
    ],
  }),
  component: Page,
});

const actions = [
  { to: "/business-center/recrutement", icon: Briefcase, t: "Demander un recrutement", d: "Décrivez vos besoins en talents. Nous lançons la mission sous 48h." },
  { to: "/business-center/formation", icon: GraduationCap, t: "Commander une formation", d: "Programmez des sessions sur-mesure pour vos équipes." },
  { to: "/business-center/audit-rh", icon: FileSearch, t: "Demander un audit RH", d: "Diagnostic complet et plan d'action de votre fonction RH." },
] as const;

const steps = [
  { icon: FilePlus2, t: "Soumettez votre demande", d: "Recrutement, formation ou audit — en quelques minutes." },
  { icon: MessagesSquare, t: "Échangez avec nos experts", d: "Cadrage du besoin et proposition adaptée sous 48h." },
  { icon: FolderOpen, t: "Suivez votre dossier", d: "Avancement, documents et factures en temps réel." },
  { icon: CheckCircle2, t: "Obtenez des résultats", d: "Livrables validés et accompagnement dans la durée." },
];

const benefits = [
  { i: FolderOpen, t: "Suivi en temps réel", d: "Visibilité sur l'avancement de chaque dossier." },
  { i: FileText, t: "Documents & factures", d: "Téléchargez devis, contrats, rapports et factures." },
  { i: ShieldCheck, t: "Confidentialité", d: "Données chiffrées, accès réservé à votre entreprise." },
];

function Page() {
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
            <LayoutDashboard className="h-3.5 w-3.5" /> Portail entreprises
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            <span className="text-gradient-cyan">Business Center</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Une plateforme unique pour piloter recrutement, formation et audit RH — avec suivi en temps réel.
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
      </section>

      {/* ACTIONS */}
      <Section className="pt-14!">
        <SectionTitle eyebrow="Soumettre une demande" title="Choisissez le type de mission" />
        <div className="grid gap-6 md:grid-cols-3">
          {actions.map((a, i) => (
            <Card key={a.to} className="group gradient-card border-border p-7 hover-lift flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className="h-14 w-14 rounded-xl gradient-cyan flex items-center justify-center group-hover:glow-cyan transition">
                  <a.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="font-display text-4xl font-extrabold text-primary/15 leading-none">0{i + 1}</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{a.t}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">{a.d}</p>
              <Button asChild variant="outline" size="sm" className="border-primary/40 hover:bg-primary/10">
                <Link to={a.to}>Démarrer <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* COMMENT ÇA MARCHE */}
      <Section className="pt-0!">
        <SectionTitle eyebrow="Comment ça marche" title="Quatre étapes, zéro friction" subtitle="De la demande aux résultats, un parcours clair et traçable." />
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="relative">
              <Card className="gradient-card border-border p-6 h-full hover-lift text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl gradient-cyan flex items-center justify-center">
                  <s.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-xs uppercase tracking-widest text-primary mb-1">Étape {i + 1}</div>
                <div className="font-display font-bold mb-1">{s.t}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.d}</p>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* BÉNÉFICES */}
      <Section className="pt-0!">
        <SectionTitle eyebrow="Pourquoi le Business Center" title="Tout en un, sécurisé, traçable" />
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.t} className="glass p-7 hover-lift">
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center mb-4">
                <b.i className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-base font-bold mb-1.5">{b.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
