import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  HandHeart,
  Heart,
  Lightbulb,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import ceo from "@/assets/ceo-akiana.jpg";
import team from "@/assets/team.jpg";
import { CeoSignature } from "@/components/CeoSignature";
import { Section, SectionTitle } from "@/components/Section";
import { AboutCommitments } from "@/components/sections/a-propos/AboutCommitments";
import { AboutGovernance } from "@/components/sections/a-propos/AboutGovernance";
import { AboutHistory } from "@/components/sections/a-propos/AboutHistory";
import { AboutImpact } from "@/components/sections/a-propos/AboutImpact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DESCRIPTION =
  "Office Management, cabinet RH à Pointe-Noire : histoire, valeurs, engagements, qualité et certifications, gouvernance, impact, vision 2030 et réseau.";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Office Management" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "À propos — Office Management" },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: About,
});

/** Valeurs de la page « À propos » fusionnées avec « Nos valeurs en action ». */
const values = [
  { i: ShieldCheck, t: "Professionnalisme", d: "Rigueur et éthique dans chaque intervention." },
  {
    i: Award,
    t: "Excellence",
    d: "Chaque mission est préparée selon une méthodologie rigoureuse, du cadrage à la restitution.",
  },
  {
    i: Lightbulb,
    t: "Innovation",
    d: "Des outils numériques modernes et des méthodes pédagogiques actives pour maximiser l'impact.",
  },
  {
    i: Heart,
    t: "Intégrité",
    d: "Nous respectons nos engagements et garantissons la confidentialité des informations confiées.",
  },
  { i: Zap, t: "Réactivité", d: "Des réponses rapides et efficaces aux besoins du marché." },
  {
    i: HandHeart,
    t: "Engagement",
    d: "Nous accompagnons nos clients jusqu'à l'atteinte des objectifs — pas seulement jusqu'à la fin du contrat.",
  },
];

function About() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div
          className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> À propos de nous
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Bienvenue chez <span className="text-gradient-cyan">Office Management</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Votre partenaire en formation professionnelle, mise à disposition de personnel et
            prestation de services. Animés par une vision innovante des ressources humaines.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan"
            >
              <Link to="/devis">
                Travailler avec nous <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10"
            >
              <Link to="/services">Nos services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VISION */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/15 blur-3xl rounded-full" />
            <img
              src={team}
              alt="Équipe Office Management"
              className="relative rounded-2xl shadow-elegant w-full"
              width={1280}
              height={800}
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 glass rounded-xl p-5 hidden md:block">
              <div className="font-display text-3xl font-bold text-gradient-cyan">+10 ans</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                au service du capital humain
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              Notre vision
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Le capital humain, moteur de votre croissance
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Votre capital humain est votre atout le plus précieux. Mais les compétences d'hier ne
              suffisent plus pour relever les défis d'aujourd'hui.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              L'efficacité maximale et régulière ne peut être obtenue que par la mise à jour
              permanente des connaissances et un renforcement des capacités productives.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Office Management est une entreprise dynamique et innovante, spécialisée dans la
              formation professionnelle, la mise à disposition de personnel qualifié, la prestation
              de services et les services additionnels.
            </p>
          </div>
        </div>
      </Section>

      <AboutHistory />

      {/* MOT DU PDG */}
      <Section>
        <Card className="gradient-card border-primary/30 p-8 md:p-14 relative overflow-hidden">
          <Quote className="absolute top-8 right-8 h-16 w-16 text-primary/10" />
          <div className="absolute -top-24 -left-24 h-72 w-72 bg-primary/15 blur-3xl rounded-full" />
          <div className="relative grid lg:grid-cols-[auto_1fr] gap-10 items-center max-w-4xl mx-auto">
            <div className="relative mx-auto">
              <div
                className="absolute -inset-3 gradient-cyan rounded-2xl blur-2xl opacity-30"
                aria-hidden
              />
              <img
                src={ceo}
                alt="Monsieur Hassan Monlay I AKIANA, PDG d'Office Management"
                className="relative rounded-2xl shadow-elegant w-64 md:w-72 object-cover aspect-3/4"
                width={576}
                height={768}
                loading="lazy"
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                Le mot du Président Directeur Général
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-5">
                Monsieur Hassan Monlay I AKIANA
              </h3>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                « Notre engagement : faire du capital humain le moteur d'une croissance durable au
                Congo. Chez Office Management, nous mettons l'expertise, la rigueur et l'innovation
                au service de chaque entreprise et de chaque talent. »
              </p>

              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <CeoSignature />
                <div className="text-sm text-muted-foreground sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end font-semibold text-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> Pointe-Noire
                  </div>
                  <div>
                    Fait le{" "}
                    {new Date().toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* VALEURS */}
      <Section id="valeurs" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Nos valeurs"
          title="Des valeurs vécues au quotidien"
          subtitle="Six principes ancrés dans chacune de nos missions, illustrés par des pratiques concrètes."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.t}
              className="hover-lift rounded-2xl border border-border bg-card p-7 shadow-card"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                  <v.i className="h-5 w-5" />
                </span>
                <span className="font-display text-4xl font-extrabold text-primary/15">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mb-2 font-display text-lg font-bold">{v.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <AboutCommitments />
      <AboutGovernance />
      <AboutImpact />

      {/* CTA */}
      <Section className="pt-0!">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card md:p-12">
          <h2 className="mb-3 font-display text-2xl font-bold md:text-3xl">
            Construisons ensemble votre capital humain
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Formation, mise à disposition de personnel ou prestation de services : parlons de votre
            projet.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="gradient-cyan font-semibold text-primary-foreground hover:opacity-90"
            >
              <Link to="/devis">
                Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10"
            >
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
