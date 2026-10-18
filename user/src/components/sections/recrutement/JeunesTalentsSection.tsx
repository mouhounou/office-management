import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  FileText,
  MapPin,
  MessageSquare,
  Star,
  UserCheck,
} from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Button } from "@/components/ui/button";

/** Programme Jeunes Talents + Stages & insertion (ex-pages jeunes-talents et stages-insertion, dédoublonnées). */
const SERVICES = [
  {
    icon: UserCheck,
    title: "Coaching individuel",
    text: "Accompagnement personnalisé sur votre projet professionnel.",
  },
  {
    icon: FileText,
    title: "CV & lettre de motivation",
    text: "Conception et optimisation de votre dossier de candidature.",
  },
  {
    icon: MessageSquare,
    title: "Simulation d'entretien",
    text: "Préparation aux entretiens d'embauche avec retour détaillé.",
  },
  {
    icon: Briefcase,
    title: "Recherche de stage",
    text: "Accès à nos opportunités et à notre réseau de partenaires recruteurs.",
  },
  {
    icon: MapPin,
    title: "Placement professionnel",
    text: "Mise en relation directe avec des employeurs et suivi jusqu'à l'embauche.",
  },
  {
    icon: Star,
    title: "Recommandations",
    text: "Lettre de recommandation à l'issue de votre stage.",
  },
];

export function JeunesTalentsSection({ onApply }: { onApply: () => void }) {
  return (
    <Section id="jeunes-talents" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Jeunes diplômés & étudiants"
        title="Programme Jeunes Talents"
        subtitle="Un accompagnement complet, de la recherche de stage à votre premier emploi."
      />
      <FeatureCards items={SERVICES} />
      <div className="mt-8 text-center">
        <Button asChild className="gradient-cyan text-primary-foreground">
          <Link to="/recrutement" hash="candidature" onClick={onApply}>
            Rejoindre le programme <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
