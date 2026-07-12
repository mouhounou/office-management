import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, GraduationCap, Award } from "lucide-react";

export const Route = createFileRoute("/carrieres")({
  head: () => ({
    meta: [
      { title: "Carrières — Office Management" },
      { name: "description", content: "Rejoignez une équipe dynamique et ambitieuse. Découvrez nos opportunités de carrière chez Office Management." },
      { property: "og:title", content: "Carrières — Office Management" },
      { property: "og:description", content: "Talents motivés, environnement stimulant, opportunités d'évolution." },
    ],
  }),
  component: Carrieres,
});

const reasons = [
  { i: Sparkles, t: "Environnement stimulant", d: "Une équipe passionnée et un cadre professionnel motivant." },
  { i: TrendingUp, t: "Opportunités d'évolution", d: "Évoluez et prenez des responsabilités au sein du cabinet." },
  { i: GraduationCap, t: "Formations continues", d: "Développez vos compétences tout au long de votre parcours." },
  { i: Award, t: "Valorisation des compétences", d: "Vos talents sont reconnus et récompensés." },
];

function Carrieres() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Carrières</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Rejoignez notre équipe</h1>
          <p className="text-muted-foreground text-lg">
            Nous recherchons des talents motivés prêts à contribuer au développement des entreprises et des compétences professionnelles.
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="Pourquoi nous rejoindre" title="Pourquoi travailler avec nous ?" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <Card key={r.t} className="gradient-card border-border p-6 hover-lift">
              <r.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{r.t}</h3>
              <p className="text-sm text-muted-foreground">{r.d}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="gradient-cyan text-primary-foreground glow-cyan">
            <Link to="/recrutement">Envoyer ma candidature</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
