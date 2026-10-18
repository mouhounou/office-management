import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Factory,
  GraduationCap,
  HeartHandshake,
  Landmark,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Galerie } from "@/components/sections/realisations/Galerie";

export const Route = createFileRoute("/realisations")({
  head: () => ({
    meta: [
      { title: "Réalisations, références & galerie — Office Management" },
      {
        name: "description",
        content:
          "Nos réalisations (formations certifiantes, accompagnement d'entreprises, recrutements, séminaires), nos références par secteur et la galerie photos d'Office Management.",
      },
      { property: "og:title", content: "Réalisations — Office Management" },
      {
        property: "og:description",
        content: "Des résultats concrets, des clients variés et nos équipes en images.",
      },
    ],
  }),
  component: Realisations,
});

const items = [
  {
    icon: Award,
    title: "Formations professionnelles certifiantes",
    text: "Des dizaines de promotions formées avec succès.",
  },
  {
    icon: Briefcase,
    title: "Accompagnement des entreprises",
    text: "Audit RH, externalisation paie, conseil organisationnel.",
  },
  {
    icon: UserCheck,
    title: "Recrutements réussis",
    text: "Placement de talents qualifiés dans divers secteurs.",
  },
  {
    icon: Calendar,
    title: "Séminaires et ateliers",
    text: "Organisation d'événements professionnels à fort impact.",
  },
  {
    icon: TrendingUp,
    title: "Développement des compétences",
    text: "Renforcement durable des capacités professionnelles.",
  },
];

const references = [
  {
    icon: Building2,
    title: "Entreprises",
    text: "Grands comptes et groupes accompagnés sur leurs enjeux RH.",
  },
  {
    icon: Landmark,
    title: "Institutions",
    text: "Collaborations avec organismes publics et institutionnels.",
  },
  { icon: HeartHandshake, title: "ONG", text: "Soutien aux organisations à mission sociale." },
  { icon: Factory, title: "PME", text: "Accompagnement de proximité des PME congolaises." },
  {
    icon: GraduationCap,
    title: "Écoles",
    text: "Partenariats académiques et insertion des jeunes.",
  },
];

const anchors = [
  { href: "#references", label: "Références" },
  { href: "#galerie", label: "Galerie" },
];

function Realisations() {
  return (
    <>
      <section className="gradient-hero py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <span className="eyebrow mb-3">Nos réussites</span>
          <h1 className="mb-4 font-display text-4xl font-extrabold md:text-6xl">Réalisations</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Depuis notre création, nous avons accompagné plusieurs entreprises et formé de nombreux
            professionnels dans différents secteurs d'activité.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="glass rounded-full px-4 py-1.5 text-sm transition hover:text-primary"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="Nos réalisations" title="Des résultats concrets" />
        <FeatureCards items={items} />
      </Section>

      <Section id="references" className="scroll-mt-24 pt-0!">
        <SectionTitle
          eyebrow="Ils nous font confiance"
          title="Nos références"
          subtitle="Des collaborations ponctuelles ou durables avec des acteurs variés du tissu économique et social."
        />
        <FeatureCards items={references} />
      </Section>

      <Galerie />
    </>
  );
}
