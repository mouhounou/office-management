import { Link } from "@tanstack/react-router";
import {
  Antenna,
  Factory,
  Fuel,
  GraduationCap,
  HardHat,
  Heart,
  Hotel,
  Landmark,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { SectionTitle } from "@/components/Section";
import { CARD } from "./ServiceHero";

const SECTORS = [
  {
    icon: Fuel,
    name: "Pétrole & Gaz",
    desc: "Mise à disposition de personnel qualifié pour les majors et sous-traitants.",
  },
  {
    icon: HardHat,
    name: "BTP & Construction",
    desc: "Recrutement d'ouvriers, chefs de chantier, ingénieurs travaux.",
  },
  {
    icon: Truck,
    name: "Logistique & Transport",
    desc: "Personnel administratif, chauffeurs, gestionnaires de flotte.",
  },
  {
    icon: ShoppingBag,
    name: "Commerce & Distribution",
    desc: "Vendeurs, caissiers, responsables de magasin formés.",
  },
  {
    icon: Hotel,
    name: "Hôtellerie & Restauration",
    desc: "Personnel de service, réception, housekeeping qualifié.",
  },
  {
    icon: Landmark,
    name: "Administration publique",
    desc: "Renforcement de capacités, formations continues sur mesure.",
  },
  {
    icon: GraduationCap,
    name: "Éducation & Formation",
    desc: "Formateurs, encadrants, ingénierie pédagogique.",
  },
  {
    icon: Heart,
    name: "ONG & Humanitaire",
    desc: "Recrutement projet, expatriation locale, gestion RH.",
  },
  { icon: Factory, name: "PME & PMI", desc: "Packs RH adaptés aux structures en croissance." },
  { icon: Antenna, name: "Télécommunications", desc: "Techniciens, commerciaux, support client." },
];

/** Secteurs d'intervention (ex-page « Secteurs »). */
export function SecteursSection() {
  return (
    <section id="secteurs" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
      <SectionTitle
        eyebrow="Secteurs d'intervention"
        title="Nous comprenons votre métier"
        subtitle="Nous adaptons nos solutions RH aux réalités sectorielles de chaque organisation, du terrain aux exigences réglementaires."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SECTORS.map((s) => (
          <div key={s.name} className={`hover-lift p-5 ${CARD}`}>
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mb-1 font-display text-sm font-bold">{s.name}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Votre secteur n'est pas listé ? Nos équipes s'adaptent à toute organisation.{" "}
        <Link to="/contact" className="font-semibold text-primary hover:underline">
          Parlons de vos enjeux
        </Link>
        .
      </p>
    </section>
  );
}
