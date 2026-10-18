import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Calculator,
  CheckCircle2,
  Cpu,
  Database,
  FolderOpen,
  LayoutDashboard,
  Share2,
  Users,
  Zap,
} from "lucide-react";

import { SectionTitle } from "@/components/Section";
import { FeatureCards, type Feature } from "@/components/sections/FeatureCards";
import { Button } from "@/components/ui/button";
import { CARD } from "./ServiceHero";

/** Ex-pages « Office Management Digital » et « Innovation digitale », dédupliquées. */
const DIGITAL: Feature[] = [
  {
    icon: Users,
    title: "Digitalisation RH",
    text: "SIRH, dématérialisation des dossiers et des processus RH, signatures électroniques.",
  },
  {
    icon: Zap,
    title: "Automatisation",
    text: "Workflows RH, recrutement et paie automatisés ; macros, VBA et Power Query sous Excel.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableaux de bord & Power BI",
    text: "Pilotage visuel des KPI, rapports interactifs et analyse avancée.",
  },
  { icon: FolderOpen, title: "GED", text: "Gestion électronique des documents et archivage." },
  {
    icon: Bot,
    title: "Intelligence artificielle",
    text: "Tri de CV, matching candidats/postes, analyse prédictive.",
  },
  {
    icon: Share2,
    title: "Outils collaboratifs",
    text: "Plateformes de travail à distance et de gestion d'équipe.",
  },
  {
    icon: Cpu,
    title: "Transformation numérique",
    text: "Feuille de route et accompagnement complet.",
  },
  {
    icon: Database,
    title: "Sage 100 i7 & Excel",
    text: (
      <>
        Vente, paramétrage et formation —{" "}
        <a href="#logiciels" className="font-semibold text-primary hover:underline">
          voir le détail
        </a>
        .
      </>
    ),
  },
];

const LOGICIELS = [
  "Licences SAGE 100 i7 — Comptabilité & Gestion commerciale",
  "Installation et paramétrage personnalisés",
  "Formation des équipes (initiation à perfectionnement)",
  "Excel — formules avancées, TCD, tableaux de bord, macros",
  "Support technique et assistance continue",
];

const LOGICIELS_CARDS = [
  { t: "Excel", d: "Tableaux de bord, automatisation, formation tous niveaux." },
  { t: "SAGE 100 i7", d: "Comptabilité générale, analytique et auxiliaire." },
  { t: "Installation", d: "Paramétrage métier sur site ou à distance." },
  { t: "Support", d: "Hotline, intervention et maintenance applicative." },
];

/** Pôle 06 — solutions digitales (#digital) et logiciels Excel / SAGE (#logiciels). */
export function DigitalSection() {
  return (
    <>
      <section id="digital" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
        <SectionTitle
          eyebrow="Pôle 06 · Office Management Digital"
          title="Solutions digitales & innovation"
          subtitle="Nous digitalisons vos processus RH et de gestion grâce aux technologies adaptées, pour libérer la productivité de vos équipes."
        />
        <FeatureCards items={DIGITAL} columns={4} />
      </section>

      <section id="logiciels" className="container mx-auto scroll-mt-24 px-4 pb-16 md:pb-20">
        <div className={`relative overflow-hidden p-8 md:p-12 ${CARD}`}>
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="eyebrow mb-3">Pôle 06 · Logiciels</div>
              <h2 className="mb-5 font-display text-3xl font-bold md:text-4xl">
                Vente, installation & formation logiciels
              </h2>
              <p className="mb-6 text-muted-foreground">
                Office Management est votre partenaire pour les logiciels métiers{" "}
                <strong className="text-foreground">Excel</strong> et{" "}
                <strong className="text-foreground">SAGE 100 i7</strong> — de la vente à la
                formation des utilisateurs.
              </p>
              <ul className="mb-6 space-y-2.5">
                {LOGICIELS.map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{x}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="gradient-cyan text-primary-foreground glow-cyan">
                <Link to="/contact">
                  Demander une démo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {LOGICIELS_CARDS.map((c) => (
                <div key={c.t} className="rounded-2xl border border-border bg-brand-soft/40 p-5">
                  <Calculator className="mb-3 h-7 w-7 text-primary" />
                  <div className="mb-1 font-display font-bold">{c.t}</div>
                  <p className="text-xs text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
