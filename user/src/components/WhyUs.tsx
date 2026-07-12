import { Link } from "@tanstack/react-router";
import { Globe2, Hammer, Network, Layers, HeartHandshake, Zap, ArrowRight } from "lucide-react";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const REASONS = [
  { icon: Globe2, title: "Expertise locale + vision internationale", desc: "Une compréhension fine du marché congolais avec des standards de cabinet international." },
  { icon: Hammer, title: "Formations 100% pratiques", desc: "Études de cas réels, mises en situation, projets concrets — pas de théorie inutile." },
  { icon: Network, title: "Réseau d'entreprises actif", desc: "Plus de 120 entreprises clientes : vos talents trouvent rapidement leur place." },
  { icon: Layers, title: "Solutions RH complètes", desc: "Du recrutement à la formation, en passant par l'audit et l'externalisation paie." },
  { icon: HeartHandshake, title: "Accompagnement durable", desc: "Nous restons à vos côtés après la mission pour pérenniser les résultats." },
  { icon: Zap, title: "Réactivité garantie", desc: "Premier retour sous 24h, déploiement rapide, équipes disponibles." },
];

export function WhyUs() {
  return (
    <Section id="pourquoi-nous">
      <SectionTitle
        eyebrow="Pourquoi nous"
        title="6 raisons de choisir Office Management"
        subtitle="Ce qui fait la différence entre un prestataire ordinaire et un partenaire RH stratégique."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REASONS.map((r, i) => (
          <Card key={r.title} className="group gradient-card border-border p-7 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className="h-14 w-14 rounded-xl gradient-cyan flex items-center justify-center group-hover:glow-cyan transition">
                <r.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="font-display text-4xl font-extrabold text-primary/15 leading-none">0{i + 1}</span>
            </div>
            <h3 className="font-display text-lg font-bold mb-2">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
          <Link to="/rendez-vous">Réserver un rendez-vous <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </Section>
  );
}
