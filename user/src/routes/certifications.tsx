import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Award, BadgeCheck, ShieldCheck, Trophy, Star, Lock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications & garanties — Office Management" },
      { name: "description", content: "Cabinet agréé, formations certifiantes, expertise RH reconnue. Découvrez nos certifications et engagements qualité." },
      { property: "og:title", content: "Certifications & garanties — Office Management" },
      { property: "og:description", content: "Conformité, qualité et reconnaissance officielle." },
    ],
  }),
  component: Certs,
});

const BADGES = [
  { icon: Award, title: "Cabinet agréé", desc: "Agrément Nº 123 MJSECFQE/CAB/DGFQE/DDFQE-PN/SD délivré par le Ministère." },
  { icon: BadgeCheck, title: "Formations certifiantes", desc: "Attestations officielles avec QR code et vérification." },
  { icon: ShieldCheck, title: "Expertise RH reconnue", desc: "Plus de 120 entreprises accompagnées au Congo." },
  { icon: Trophy, title: "Partenaire professionnel", desc: "Référencé par les entreprises du secteur Oil & Gas et BTP." },
  { icon: Star, title: "Formation pratique", desc: "Méthodologie orientée mise en situation et études de cas." },
  { icon: Lock, title: "Confidentialité garantie", desc: "Protection rigoureuse des données candidats et clients." },
];

const GUARANTEES = [
  "Confidentialité absolue des données candidats et entreprises",
  "Réactivité : premier retour sous 24 heures ouvrées",
  "Personnel qualifié, expérimenté et sélectionné",
  "Méthodes pédagogiques modernes et pratiques",
  "Accompagnement personnalisé tout au long de la mission",
  "Conformité réglementaire et légale garantie",
];

function Certs() {
  return (
    <>
      <Section className="!py-16">
        <SectionTitle eyebrow="Reconnaissance officielle" title="Nos certifications & accréditations" subtitle="Des badges qui témoignent de notre sérieux et de notre expertise." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map(b => (
            <Card key={b.title} className="glass p-7 hover-lift text-center">
              <div className="mx-auto h-16 w-16 rounded-full gradient-cyan flex items-center justify-center mb-4 animate-pulse-glow">
                <b.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="!py-16">
        <SectionTitle eyebrow="Nos engagements" title="6 garanties qui font la différence" />
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {GUARANTEES.map(g => (
            <div key={g} className="glass rounded-xl p-5 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{g}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
