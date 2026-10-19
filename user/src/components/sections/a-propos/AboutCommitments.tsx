import {
  BadgeCheck,
  BarChart3,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Repeat,
  ShieldCheck,
  Smile,
  Star,
  Trophy,
  Workflow,
  Award,
} from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { GraduationScene } from "@/components/formations/GraduationScene";
import { HandshakeScene } from "@/components/sections/a-propos/Scenes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Engagements fusionnés (charte clients, engagements entreprises, engagements formation
 * et garanties de la page certifications), dédoublonnés.
 */
const BUSINESS = [
  { title: "Réactivité", text: "Premier retour sous 24 heures ouvrées à toute sollicitation." },
  {
    title: "Confidentialité",
    text: "Vos données, vos projets et ceux des candidats restent strictement protégés.",
  },
  {
    title: "Solutions sur-mesure",
    text: "Une réponse adaptée à vos besoins, pas une offre standard.",
  },
  {
    title: "Interlocuteur dédié",
    text: "Un accompagnement personnalisé pendant la mission… et après la livraison.",
  },
  { title: "Personnel qualifié", text: "Des profils expérimentés, sélectionnés avec soin." },
  { title: "Transparence", text: "Des devis clairs et des contrats sans ambiguïté." },
  { title: "Résultats mesurables", text: "Des indicateurs de performance suivis et restitués." },
  { title: "Conformité", text: "Respect du cadre réglementaire et légal garanti." },
];

const LEARNERS = [
  {
    title: "Formation pratique",
    text: "Mises en situation, cas concrets, outils réels et méthodes pédagogiques actives.",
  },
  {
    title: "Formateurs expérimentés",
    text: "Des professionnels du métier, pas seulement des théoriciens.",
  },
  {
    title: "Accompagnement personnalisé",
    text: "Un suivi individuel tout au long de votre parcours.",
  },
  { title: "Certificat reconnu", text: "Une attestation valorisée sur le marché du travail." },
  { title: "Insertion professionnelle", text: "L'accès à notre réseau de partenaires recruteurs." },
];

/** Liste qui se coche au défilement, à côté d'une scène animée. */
function CheckList({
  items,
  scene,
}: {
  items: { title: string; text: string }[];
  scene: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
      <div
        className="theme-dark relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)] p-6 shadow-card"
        data-reveal="left"
      >
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-cyan/25 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative aspect-[13/10]">{scene}</div>
      </div>
      <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2" data-reveal-stagger>
        {items.map((c) => (
          <li
            key={c.title}
            className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-card hover:shadow-card"
          >
            <svg viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0" aria-hidden>
              <circle cx="12" cy="12" r="11" className="fill-primary/10" />
              <path
                d="M7 12.5l3.2 3.2L17 9"
                className="why-check fill-none stroke-primary"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <div className="font-display text-sm font-bold">{c.title}</div>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const BADGES = [
  {
    icon: Award,
    title: "Cabinet agréé",
    text: "Agrément Nº 123 MJSECFQE/CAB/DGFQE/DDFQE-PN/SD délivré par le Ministère.",
  },
  {
    icon: BadgeCheck,
    title: "Formations certifiantes",
    text: "Attestations officielles avec QR code et vérification.",
  },
  {
    icon: ShieldCheck,
    title: "Expertise RH reconnue",
    text: "Plus de 120 entreprises accompagnées au Congo.",
  },
  {
    icon: Trophy,
    title: "Partenaire professionnel",
    text: "Référencé par les entreprises du secteur Oil & Gas et BTP.",
  },
];

/** Démarche qualité fusionnée (ex-pages « Certification qualité » et « Processus qualité »). */
const PROCESS = [
  {
    icon: Workflow,
    title: "Procédures documentées",
    text: "Processus formalisés et référentiels internes.",
  },
  {
    icon: ClipboardCheck,
    title: "Contrôle qualité",
    text: "Audits réguliers et vérifications à chaque étape de nos prestations.",
  },
  {
    icon: Star,
    title: "Évaluation des formations",
    text: "À chaud, à froid, et sur le transfert en situation de travail.",
  },
  {
    icon: BarChart3,
    title: "Évaluation des candidats",
    text: "Tests, mises en situation et entretiens structurés.",
  },
  { icon: Smile, title: "Satisfaction client", text: "Enquêtes régulières et mesure du NPS." },
  {
    icon: Repeat,
    title: "Amélioration continue",
    text: "Revues qualité, retours clients et actions correctives intégrées à chaque projet.",
  },
];

export function AboutCommitments() {
  return (
    <>
      <Section id="engagements" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Nos engagements"
          title="Des promesses tenues, mission après mission"
          subtitle="Une charte de service unique, déclinée pour nos clients et pour nos apprenants."
        />
        <Tabs defaultValue="entreprises">
          <div className="mb-8 flex justify-center">
            <TabsList className="h-auto rounded-full bg-brand-soft p-1">
              <TabsTrigger value="entreprises" className="gap-2 rounded-full px-4 py-2">
                <Building2 className="h-4 w-4" /> Clients & entreprises
              </TabsTrigger>
              <TabsTrigger value="apprenants" className="gap-2 rounded-full px-4 py-2">
                <GraduationCap className="h-4 w-4" /> Apprenants
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="entreprises" forceMount className="data-[state=inactive]:hidden">
            <CheckList items={BUSINESS} scene={<HandshakeScene />} />
          </TabsContent>
          <TabsContent value="apprenants" forceMount className="data-[state=inactive]:hidden">
            <CheckList items={LEARNERS} scene={<GraduationScene />} />
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="qualite" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Qualité & certifications"
          title="Une démarche qualité structurée et mesurable"
          subtitle="Une reconnaissance officielle et des processus rigoureux, gages de sérieux et de résultats."
        />
        {/* Sceaux de reconnaissance */}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
          {BADGES.map((b) => (
            <li key={b.title} className="group flex flex-col items-center text-center">
              <span className="relative mb-4 flex h-28 w-28 items-center justify-center">
                <span className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-primary/40" />
                <span className="absolute inset-2 rounded-full bg-brand-soft transition duration-500 group-hover:scale-105" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full gradient-cyan text-white shadow-lg transition duration-500 group-hover:rotate-[-8deg]">
                  <b.icon className="h-7 w-7" />
                </span>
              </span>
              <h3 className="font-display text-base font-bold">{b.title}</h3>
              <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                {b.text}
              </p>
            </li>
          ))}
        </ul>

        {/* Processus qualité : frise en six étapes */}
        <div className="mt-16">
          <div className="eyebrow mb-8 justify-center" data-reveal>
            Nos processus qualité
          </div>
          <div className="relative">
            <div
              aria-hidden
              data-reveal="line-x"
              className="absolute top-7 right-[8%] left-[8%] hidden h-0.5 origin-left bg-gradient-to-r from-primary via-primary/50 to-primary/20 lg:block"
            />
            <div
              aria-hidden
              data-reveal="line"
              className="absolute top-2 bottom-2 left-7 w-0.5 origin-top bg-gradient-to-b from-primary via-primary/50 to-transparent lg:hidden"
            />
            <ol className="relative grid gap-6 lg:grid-cols-6 lg:gap-4" data-reveal-stagger>
              {PROCESS.map((p, i) => (
                <li key={p.title} className="flex gap-4 lg:flex-col lg:items-center lg:text-center">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full gradient-cyan text-white shadow-lg ring-4 ring-background">
                    <p.icon className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy-deep font-display text-[10px] font-bold text-white">
                      0{i + 1}
                    </span>
                  </span>
                  <div className="pt-1 lg:pt-0">
                    <div className="font-display text-sm font-bold">{p.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </>
  );
}
