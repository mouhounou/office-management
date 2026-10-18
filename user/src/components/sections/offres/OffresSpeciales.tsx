import { Link } from "@tanstack/react-router";
import { Building, Sparkles, Tag, Users } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Button } from "@/components/ui/button";

/** Réductions et promotions (anciennement /offres-speciales). */
const offers = [
  {
    icon: Tag,
    title: "Réduction étudiants",
    text: "-20% sur toutes les formations sur présentation de la carte.",
  },
  {
    icon: Users,
    title: "Offre groupe",
    text: "Tarifs dégressifs dès 3 inscriptions à la même session.",
  },
  { icon: Building, title: "Promotion entreprises", text: "Pack 5 formations + audit RH offert." },
  {
    icon: Sparkles,
    title: "Sessions sponsorisées",
    text: "Formations subventionnées en partenariat avec nos sponsors.",
  },
];

export function OffresSpeciales() {
  return (
    <Section id="offres-speciales" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Offres spéciales"
        title="Des opportunités à saisir"
        subtitle="Réductions et formules avantageuses pour vos formations, vos équipes ou vos partenariats."
      />
      <FeatureCards items={offers} columns={4} />
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link to="/devis">Profiter d'une offre</Link>
        </Button>
      </div>
    </Section>
  );
}
