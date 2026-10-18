import {
  Cog,
  Flame,
  Monitor,
  Network,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sun,
  Video,
  Waves,
  Zap,
} from "lucide-react";

import technical from "@/assets/technical.jpg";
import { SectionTitle } from "@/components/Section";
import { FeatureCards, type Feature } from "@/components/sections/FeatureCards";

const TECHNIQUES: Feature[] = [
  {
    icon: Cog,
    title: "Maintenance industrielle",
    text: "Préventive, curative et prédictive sur sites industriels.",
  },
  {
    icon: Monitor,
    title: "Maintenance informatique",
    text: "Parc informatique, postes et matériels.",
  },
  { icon: Network, title: "Réseaux", text: "Installation et maintenance de réseaux." },
  { icon: Video, title: "Vidéosurveillance", text: "Installation et maintenance de systèmes." },
  {
    icon: Sun,
    title: "Énergie solaire",
    text: "Installation et maintenance d'équipements solaires.",
  },
  { icon: Snowflake, title: "Climatisation", text: "Installation, maintenance et dépannage CVC." },
  { icon: Flame, title: "Soudure", text: "TIG, MIG, MMA — structures et tuyauteries." },
  { icon: Waves, title: "Tuyauterie", text: "Conception, pose, raccordement et tests." },
  { icon: Zap, title: "Électricité bâtiment", text: "Installation, mise aux normes, dépannage." },
  {
    icon: ShieldAlert,
    title: "Sécurité incendie",
    text: "Équipements et dispositifs de sécurité incendie.",
  },
  {
    icon: Sparkles,
    title: "Nettoyage industriel",
    text: "Sites tertiaires et industriels, vitrerie, post-chantier.",
  },
  { icon: ShieldCheck, title: "Agents de sécurité", text: "Agents formés et équipés." },
];

/** Pôle 03 — prestations techniques (ex-page « Technical Services »). */
export function TechniquesSection() {
  return (
    <section id="techniques" className="relative scroll-mt-24 overflow-hidden py-16 md:py-20">
      <img
        src={technical}
        alt=""
        aria-hidden
        className="absolute inset-x-0 top-0 h-80 w-full object-cover opacity-20"
        loading="lazy"
        width={1280}
        height={800}
      />
      <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-background/40 to-background" />
      <div className="container relative mx-auto px-4">
        <SectionTitle
          eyebrow="Pôle 03 · Technical Services"
          title="Prestations techniques"
          subtitle="Notre division technique est spécialisée dans l'ingénierie, la maintenance et les services techniques. Nos équipes interviennent sur site avec un équipement adapté et dans le strict respect des règles de sécurité — au forfait, en régie ou sous contrat de maintenance."
        />
        <FeatureCards items={TECHNIQUES} columns={4} />
      </div>
    </section>
  );
}
