import { Briefcase, Building2, Globe2, Landmark } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";

/** Réseau de partenaires recruteurs (ex-page partenaires-recruteurs). */
const GROUPS = [
  {
    icon: Building2,
    title: "Entreprises",
    text: "Multinationales et groupes locaux à la recherche de talents.",
  },
  {
    icon: Briefcase,
    title: "Cabinets",
    text: "Cabinets de conseil et d'expertise qui recrutent nos certifiés.",
  },
  { icon: Globe2, title: "ONG", text: "Organisations à mission sociale et humanitaire." },
  { icon: Landmark, title: "Institutions", text: "Organismes publics et parapublics partenaires." },
];

export function PartenairesSection() {
  return (
    <Section id="partenaires" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Partenaires recruteurs"
        title="Un réseau qui ouvre des portes"
        subtitle="Un accès privilégié à l'emploi pour nos apprenants et candidats."
      />
      <FeatureCards items={GROUPS} columns={4} />
    </Section>
  );
}
