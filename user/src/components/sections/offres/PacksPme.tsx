import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Crown, Rocket, Sparkles, Star } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Formules RH groupées pour PME (anciennement /packs-pme). Elles regroupent,
 * dans un abonnement unique, les prestations proposées à la carte plus haut
 * (conseil RH, paie, recrutement, formation).
 */
const packs = [
  {
    name: "Starter",
    icon: Rocket,
    tagline: "L'essentiel RH pour démarrer",
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

export function PacksPme() {
  return (
    <Section id="packs-pme" className="scroll-mt-24">
      <SectionTitle
        eyebrow="Packs PME"
        title="Votre fonction RH, en une seule formule"
        subtitle="Trois abonnements clé en main qui regroupent conseil, paie, recrutement et formation selon la taille et les ambitions de votre PME. Tarifs sur devis."
      />
      <div className="grid items-start gap-6 md:grid-cols-3">
        {packs.map((p) => (
          <div
            key={p.name}
            className={cn(
              "relative flex h-full flex-col rounded-2xl border bg-card p-8 shadow-card",
              p.highlight
                ? "border-primary/60 ring-2 ring-primary md:-translate-y-3"
                : "border-border hover-lift",
            )}
          >
            {p.highlight && (
              <div className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full gradient-cyan px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                <Star className="h-3 w-3 fill-current" /> Le plus choisi
              </div>
            )}
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mb-1 font-display text-2xl font-extrabold">{p.name}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{p.tagline}</p>
            <div className="mb-6 font-display text-2xl font-bold text-gradient-cyan">Sur devis</div>
            <ul className="mb-6 flex-1 space-y-3 border-t border-border pt-6 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                    <Check className="h-3 w-3 text-brand-strong" />
                  </span>
                  <span className="text-foreground/85">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={p.highlight ? "default" : "outline"}
              className={p.highlight ? "gradient-cyan text-primary-foreground" : ""}
            >
              <Link to="/devis">
                Demander un devis {p.name} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </Section>
  );
}
