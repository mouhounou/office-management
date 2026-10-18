import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Cog,
  FileText,
  Handshake,
  HardHat,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards, type Feature } from "@/components/sections/FeatureCards";
import { ConseilSection } from "@/components/sections/services/ConseilSection";
import { DigitalSection } from "@/components/sections/services/DigitalSection";
import { MethodologieSection } from "@/components/sections/services/MethodologieSection";
import { PolesOverview } from "@/components/sections/services/PolesOverview";
import { SecteursSection } from "@/components/sections/services/SecteursSection";
import { CARD, ServiceHero } from "@/components/sections/services/ServiceHero";
import { TechniquesSection } from "@/components/sections/services/TechniquesSection";
import { Button } from "@/components/ui/button";
import recruitment from "@/assets/recruitment.jpg";
import training from "@/assets/training.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services — Office Management" },
      {
        name: "description",
        content:
          "Six pôles d'expertise : formation, recrutement et mise à disposition de personnel, prestations techniques, conseil RH, services additionnels et solutions digitales (Sage, Excel). Secteurs d'intervention et méthodologie en six étapes.",
      },
      { property: "og:title", content: "Services — Office Management" },
      {
        property: "og:description",
        content: "Six pôles d'expertise pour transformer votre capital humain.",
      },
    ],
  }),
  component: Services,
});

const NAV = [
  ["#poles", "Nos pôles"],
  ["#formation", "Formation"],
  ["#personnel", "Mise à disposition"],
  ["#techniques", "Prestations techniques"],
  ["#conseil", "Conseil RH"],
  ["#additionnels", "Services additionnels"],
  ["#digital", "Digital & logiciels"],
  ["#secteurs", "Secteurs"],
  ["#methodologie", "Méthodologie"],
] as const;

const formations = [
  { i: BookOpen, t: "Assistant comptable", d: "3 mois · certifiant" },
  { i: FileText, t: "Secrétariat bureautique", d: "2 mois · tous niveaux" },
  { i: Users, t: "Gestion des RH", d: "4 mois · intermédiaire" },
  { i: Cog, t: "Informatique bureautique", d: "2 mois" },
  { i: ShieldCheck, t: "QHSE", d: "3 mois · professionnel" },
  { i: Target, t: "Logistique", d: "3 mois" },
  { i: Award, t: "Management", d: "3 mois · cadres" },
  { i: Sparkles, t: "Entrepreneuriat", d: "2 mois" },
  { i: BookOpen, t: "Anglais professionnel", d: "4 mois" },
  { i: HardHat, t: "Formations techniques", d: "Sur mesure" },
];

const personnel: Feature[] = [
  { title: "Assistants administratifs", text: "Gestion d'agenda, courrier, support direction." },
  { title: "Comptables", text: "Tenue, déclarations, clôtures, reporting." },
  { title: "Chauffeurs", text: "Permis B/C, expérience entreprise et VIP." },
  { title: "Techniciens", text: "Maintenance, électricité, climatisation." },
  { title: "Agents commerciaux", text: "Prospection, relation client, vente." },
  { title: "Informaticiens", text: "Support, infra, développement." },
  { title: "Réceptionnistes", text: "Accueil, standard, gestion des visiteurs." },
  { title: "Agents de maintenance", text: "Bâtiment, équipements, propreté." },
];

const additionnels: Feature[] = [
  { icon: FileText, title: "Rédaction de CV professionnels" },
  { icon: FileText, title: "Lettres de motivation" },
  { icon: Handshake, title: "Coaching emploi & orientation" },
  { icon: MessageSquare, title: "Simulations d'entretien & soft skills" },
  { icon: UserCheck, title: "Bilans de compétences" },
  { icon: Users, title: "Gestion des conflits & médiation" },
  { icon: Award, title: "Formations leadership" },
  { icon: Sparkles, title: "Bien-être au travail & QVT" },
  { icon: Target, title: "Démarche RSE" },
  { icon: Briefcase, title: "Gestion de projets d'envergure" },
];

function Services() {
  return (
    <>
      {/* HERO */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="eyebrow mb-3">Nos services</div>
          <h1 className="mb-4 font-display text-4xl font-extrabold md:text-6xl">
            Une offre globale et intégrée
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Six pôles d'expertise pour répondre aux besoins concrets des entreprises et des
            particuliers — de la formation au placement, en passant par les prestations techniques,
            le conseil RH et la transformation digitale.
          </p>
          <nav aria-label="Sections de la page" className="flex flex-wrap justify-center gap-2">
            {NAV.map(([h, t]) => (
              <a
                key={h}
                href={h}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-card transition hover:text-primary"
              >
                {t}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <PolesOverview />

      {/* PÔLE 01 — FORMATION */}
      <ServiceHero
        id="formation"
        eyebrow="Pôle 01"
        title="Formation professionnelle"
        image={training}
        desc="Nous offrons une large variété de programmes de formation pour renforcer les compétences et développer les talents au sein des entreprises. Ateliers, séminaires, coaching, mentorat et certifications — en présentiel comme en ligne."
        bullets={[
          "Formations certifiantes reconnues",
          "Formateurs experts métier",
          "Modalités présentiel, distanciel et hybride",
          "Catalogue inter-entreprises et intra sur mesure",
          "Stages professionnels intégrés",
        ]}
      />
      <Section className="pt-0!">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {formations.map((f) => (
            <div key={f.t} className={`hover-lift p-5 ${CARD}`}>
              <f.i className="mb-3 h-7 w-7 text-primary" />
              <div className="mb-1 font-display text-sm font-bold">{f.t}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {f.d}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="border-primary/40">
            <Link to="/formations">Voir le catalogue des formations</Link>
          </Button>
        </div>
      </Section>

      {/* PÔLE 02 — MISE À DISPOSITION */}
      <span id="mise-a-disposition" className="block scroll-mt-24" aria-hidden />
      <ServiceHero
        id="personnel"
        eyebrow="Pôle 02"
        title="Recrutement & mise à disposition de personnel"
        image={recruitment}
        reverse
        desc="Nous mettons à disposition des entreprises un personnel qualifié et immédiatement opérationnel, pour vos missions temporaires comme permanentes. Notre vivier est rigoureusement évalué et formé."
        bullets={[
          "Profils pré-qualifiés et testés",
          "Délai de mise à disposition rapide",
          "Gestion administrative et paie incluse",
          "Suivi qualité tout au long de la mission",
          "Remplacement garanti en cas d'inadéquation",
        ]}
      />
      <Section className="pt-0!">
        <SectionTitle eyebrow="Profils disponibles" title="Des compétences pour tous vos besoins" />
        <FeatureCards items={personnel} columns={4} />
      </Section>

      {/* PÔLE 03 */}
      <TechniquesSection />

      {/* PÔLE 04 */}
      <ConseilSection />

      {/* PÔLE 05 — ADDITIONNELS */}
      <section id="additionnels" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
        <SectionTitle
          eyebrow="Pôle 05"
          title="Services additionnels"
          subtitle="Un accompagnement complet pour particuliers et entreprises, au-delà du recrutement et de la formation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {additionnels.map((a) => (
            <div key={a.title} className={`hover-lift flex items-center gap-3 p-4 ${CARD}`}>
              {a.icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                  <a.icon className="h-5 w-5" />
                </span>
              )}
              <span className="font-display text-sm font-semibold">{a.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PÔLE 06 — #digital + #logiciels */}
      <DigitalSection />

      <SecteursSection />

      <MethodologieSection />

      {/* CTA */}
      <Section>
        <div className={`relative overflow-hidden p-10 text-center md:p-14 ${CARD}`}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
              Un projet en tête ?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Parlez-nous de votre besoin — nous vous proposons une solution adaptée sous 48h.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground glow-cyan">
                <Link to="/devis">Demander un devis</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
