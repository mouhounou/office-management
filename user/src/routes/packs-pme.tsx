import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Rocket, ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/packs-pme")({
  head: () => ({
    meta: [
      { title: "Packs PME — Starter, Growth, Premium | Office Management" },
      { name: "description", content: "Trois packs RH clé en main pour PME : Starter, Growth, Premium. Recrutement, paie, formation et conseil au juste prix." },
      { property: "og:title", content: "Packs PME — Office Management" },
      { property: "og:description", content: "Solutions RH packagées pour PME en croissance." },
    ],
  }),
  component: PacksPME,
});

const packs = [
  {
    name: "Starter",
    icon: Rocket,
    tagline: "L'essentiel RH pour démarrer",
    price: "Sur devis",
    highlight: false,
    features: [
      "Audit RH initial (1 jour)",
      "Modèles de contrats & règlement intérieur",
      "1 recrutement accompagné / an",
      "Gestion administrative de base",
      "Hotline RH par email (réponse 48h)",
      "2 sessions de formation collective",
    ],
  },
  {
    name: "Growth",
    icon: Sparkles,
    tagline: "Pour structurer et accélérer",
    price: "Sur devis",
    highlight: true,
    features: [
      "Tout le pack Starter",
      "Externalisation de la paie (jusqu'à 30 salariés)",
      "3 recrutements accompagnés / an",
      "Plan de formation annuel sur mesure",
      "Suivi RH mensuel (1 jour / mois)",
      "Hotline RH téléphonique (réponse 24h)",
      "Tableaux de bord RH trimestriels",
    ],
  },
  {
    name: "Premium",
    icon: Crown,
    tagline: "Direction RH externalisée complète",
    price: "Sur devis",
    highlight: false,
    features: [
      "Tout le pack Growth",
      "DRH externalisé dédié (2 jours / semaine)",
      "Recrutements illimités",
      "Paie illimitée + déclarations sociales",
      "QHSE & conformité réglementaire",
      "Coaching dirigeants & managers",
      "Audit annuel + reporting stratégique",
      "Accès prioritaire 7j/7",
    ],
  },
];

function PacksPME() {
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
            <Sparkles className="h-3.5 w-3.5" /> Offres PME
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Packs RH <span className="text-gradient-cyan">pour PME</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Trois formules clé en main pour structurer votre fonction RH selon votre taille et vos ambitions.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <Section className="pt-14!">
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {packs.map((p) => (
            <Card
              key={p.name}
              className={`relative gradient-card p-8 flex flex-col transition-transform ${
                p.highlight
                  ? "border-primary/60 ring-2 ring-primary glow-cyan md:-translate-y-3"
                  : "border-border hover-lift"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full gradient-cyan text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                  <Star className="h-3 w-3 fill-current" /> Le plus choisi
                </div>
              )}
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center mb-4">
                <p.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-extrabold mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-5">{p.tagline}</p>
              <div className="font-display text-3xl font-bold text-gradient-cyan mb-6">{p.price}</div>
              <ul className="space-y-3 text-sm flex-1 mb-6 border-t border-border/50 pt-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Button asChild className={p.highlight ? "gradient-cyan text-primary-foreground font-semibold hover:opacity-90" : "gradient-cyan text-primary-foreground"}>
                  <Link to="/pre-inscription">Choisir {p.name} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="hover:bg-primary/10">
                  <Link to="/devis">Demander un devis</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA SUR MESURE */}
      <Section className="pt-0!">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Besoin d'une formule sur mesure ?</h2>
            <p className="text-muted-foreground mb-8">
              Notre équipe construit un pack RH adapté à la taille, au secteur et aux ambitions de votre PME.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/contact">Parler à un conseiller <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/services">Voir tous nos services</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
