import {
  Cpu,
  Landmark,
  RefreshCw,
  Settings,
  Sprout,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import team from "@/assets/team.jpg";
import { FeatureCards, type Feature } from "@/components/sections/FeatureCards";
import { ServiceHero } from "./ServiceHero";

/** Missions opérationnelles du pôle conseil. */
const MISSIONS = [
  "Audit organisationnel & RH",
  "Externalisation de la paie",
  "Externalisation des fonctions RH",
  "Gestion documentaire & archivage",
  "Veille juridique & réglementaire",
  "Marque employeur",
];

/** Huit domaines de conseil (ex-page « Office Management Consulting »). */
const DOMAINES: Feature[] = [
  {
    icon: Users,
    title: "Conseil RH",
    text: "Stratégie RH, politique de rémunération, culture d'entreprise.",
  },
  {
    icon: Target,
    title: "Conseil stratégique",
    text: "Vision, plan de développement, positionnement.",
  },
  { icon: Settings, title: "Organisation", text: "Structures, processus, fiches de poste." },
  {
    icon: Cpu,
    title: "Transformation digitale",
    text: "Digitaliser les fonctions clés de l'entreprise, à commencer par les RH.",
  },
  {
    icon: RefreshCw,
    title: "Gestion du changement",
    text: "Accompagnement humain des transformations.",
  },
  { icon: TrendingUp, title: "Performance", text: "Tableaux de bord RH, KPI et pilotage." },
  { icon: Landmark, title: "Gouvernance", text: "Comités, instances et bonnes pratiques." },
  { icon: Sprout, title: "Développement organisationnel", text: "Maturité, culture, leadership." },
];

/** Pôle 04 — conseil RH et stratégique. */
export function ConseilSection() {
  return (
    <>
      <ServiceHero
        id="conseil"
        eyebrow="Pôle 04 · Office Management Consulting"
        title="Conseil RH & stratégie"
        image={team}
        desc="Notre cabinet de conseil accompagne les dirigeants et les organisations qui veulent aller plus loin. De l'audit à la transformation digitale, nous structurons votre fonction RH et votre organisation pour la performance."
        bullets={MISSIONS}
      />
      <section className="container mx-auto px-4 pb-16 md:pb-20">
        <h3 className="mb-6 text-center font-display text-xl font-bold md:text-2xl">
          Huit domaines de conseil
        </h3>
        <FeatureCards items={DOMAINES} columns={4} />
      </section>
    </>
  );
}
