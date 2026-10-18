import { Award } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";

/** Badges « Office Management Certified » (ex-page om-certified). */
const BADGES = [
  { title: "Excel Avancé", text: "Tableaux croisés dynamiques, macros et analyses." },
  { title: "Sage 100 i7", text: "Comptabilité, paie et gestion commerciale." },
  { title: "Assistant RH", text: "Recrutement, paie, administration du personnel." },
  { title: "Gestionnaire administratif", text: "Procédures, archivage et organisation." },
  { title: "Bureautique Pro", text: "Word, Excel, PowerPoint, Outlook." },
  { title: "Comptabilité générale", text: "Tenue des comptes, états financiers." },
];

export function CertificationsSection() {
  return (
    <Section id="certifications" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Office Management Certified"
        title="Des certifications qui valorisent votre profil"
        subtitle="Six badges professionnels pour attester de vos compétences auprès des recruteurs."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((b) => (
          <div
            key={b.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-strong">
                Certifié
              </div>
              <h3 className="font-display text-base font-bold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
