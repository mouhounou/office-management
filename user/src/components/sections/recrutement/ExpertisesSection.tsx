import { Award, Brain, Clock, FileCheck, Globe, Search, ShieldCheck, Users } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";

/** Les huit expertises de l'agence de recrutement (ex-page recruitment-agency). */
const EXPERTISES = [
  {
    icon: Users,
    title: "Recrutement local",
    text: "Sourcing ciblé et présélection rigoureuse sur le marché congolais.",
  },
  {
    icon: Globe,
    title: "Recrutement international",
    text: "Talents expatriés et diaspora qualifiée.",
  },
  {
    icon: Search,
    title: "Chasse de têtes",
    text: "Approche directe pour profils rares et dirigeants.",
  },
  {
    icon: Clock,
    title: "Intérim",
    text: "Mise à disposition rapide de compétences pour vos missions courtes.",
  },
  {
    icon: Award,
    title: "Placement permanent",
    text: "Contrats durables, avec intégration et onboarding jusqu'à la prise de poste.",
  },
  {
    icon: Brain,
    title: "Assessment center",
    text: "Évaluation multicritère : tests techniques et entretiens structurés.",
  },
  {
    icon: FileCheck,
    title: "Tests psychotechniques",
    text: "Aptitudes, personnalité et raisonnement.",
  },
  {
    icon: ShieldCheck,
    title: "Vérification des références",
    text: "Contrôle rigoureux des parcours et des diplômes.",
  },
];

export function ExpertisesSection() {
  return (
    <Section id="expertises" className="scroll-mt-24 pt-14!">
      <SectionTitle
        eyebrow="Agence de recrutement"
        title="Huit expertises complémentaires"
        subtitle="Identifier, évaluer et intégrer les meilleurs talents, du poste opérationnel au profil de direction."
      />
      <FeatureCards items={EXPERTISES} columns={4} />
    </Section>
  );
}
