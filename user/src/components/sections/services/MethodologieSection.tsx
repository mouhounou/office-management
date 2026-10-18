import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Lightbulb, LineChart, RefreshCw, Rocket, Search } from "lucide-react";

import { SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { CARD } from "./ServiceHero";

const STEPS = [
  {
    icon: Search,
    title: "Prise de contact",
    desc: "Premier échange pour comprendre votre contexte et vos enjeux.",
  },
  {
    icon: ClipboardCheck,
    title: "Analyse du besoin",
    desc: "Diagnostic approfondi de votre organisation et de vos objectifs.",
  },
  {
    icon: Lightbulb,
    title: "Proposition de solution",
    desc: "Plan d'action sur mesure, devis détaillé, calendrier d'intervention.",
  },
  {
    icon: Rocket,
    title: "Mise en œuvre",
    desc: "Déploiement par nos experts, en lien étroit avec vos équipes.",
  },
  {
    icon: LineChart,
    title: "Suivi & évaluation",
    desc: "Mesure des résultats, indicateurs de performance, reporting régulier.",
  },
  {
    icon: RefreshCw,
    title: "Amélioration continue",
    desc: "Ajustements, accompagnement durable et pérennisation des acquis.",
  },
];

/** Notre méthode en six étapes (ex-page « Processus » + « Comment nous travaillons »). */
export function MethodologieSection() {
  return (
    <section id="methodologie" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
      <SectionTitle
        eyebrow="Notre méthodologie"
        title="Comment nous travaillons"
        subtitle="Chaque mission suit la même rigueur, en six étapes, de la prise de contact au suivi long terme."
      />
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className={`relative p-6 ${CARD}`}>
            <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-primary/15">
              0{i + 1}
            </span>
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mb-1.5 font-display text-base font-bold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild className="gradient-cyan text-primary-foreground glow-cyan">
          <Link to="/devis">Demander un devis</Link>
        </Button>
        <Button asChild variant="outline" className="border-primary/40">
          <Link to="/contact" hash="rendez-vous">
            Réserver un rendez-vous
          </Link>
        </Button>
      </div>
    </section>
  );
}
