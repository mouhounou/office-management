import {
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck,
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
import { FeatureCards } from "@/components/sections/FeatureCards";
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

function CheckList({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((c) => (
        <li
          key={c.title}
          className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <div className="font-display text-sm font-bold">{c.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        </li>
      ))}
    </ul>
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
            <CheckList items={BUSINESS} />
          </TabsContent>
          <TabsContent value="apprenants" forceMount className="data-[state=inactive]:hidden">
            <CheckList items={LEARNERS} />
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="qualite" className="scroll-mt-24">
        <SectionTitle
          eyebrow="Qualité & certifications"
          title="Une démarche qualité structurée et mesurable"
          subtitle="Une reconnaissance officielle et des processus rigoureux, gages de sérieux et de résultats."
        />
        <FeatureCards items={BADGES} columns={4} />
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="eyebrow mb-6">Nos processus qualité</div>
          <ol className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-sm font-bold">
                    <span className="mr-1.5 text-brand-strong">0{i + 1}</span>
                    {p.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
