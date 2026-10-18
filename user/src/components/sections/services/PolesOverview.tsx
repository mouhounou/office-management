import { ArrowRight, Briefcase, Cpu, GraduationCap, Sparkles, Users, Wrench } from "lucide-react";

import { SectionTitle } from "@/components/Section";
import { CARD } from "./ServiceHero";

const POLES = [
  {
    icon: GraduationCap,
    name: "Formation & développement",
    href: "#formation",
    desc: "Formations certifiantes, montée en compétences, coaching individuel et collectif.",
  },
  {
    icon: Users,
    name: "Recrutement & mise à disposition",
    href: "#personnel",
    desc: "Sourcing, sélection et mise à disposition de talents qualifiés.",
  },
  {
    icon: Wrench,
    name: "Prestations techniques",
    href: "#techniques",
    desc: "Maintenance, installation, sécurité et assistance technique sur site.",
  },
  {
    icon: Briefcase,
    name: "Conseil RH & stratégie",
    href: "#conseil",
    desc: "Audit, externalisation, organisation et transformation des organisations.",
  },
  {
    icon: Sparkles,
    name: "Services additionnels",
    href: "#additionnels",
    desc: "CV, coaching carrière, orientation, soft skills et leadership.",
  },
  {
    icon: Cpu,
    name: "Solutions digitales & logiciels",
    href: "#digital",
    desc: "Digitalisation RH, reporting, automatisation, Sage 100 i7 et Excel.",
  },
];

/** Vue d'ensemble des six pôles ; chaque carte renvoie à sa section détaillée. */
export function PolesOverview() {
  return (
    <section id="poles" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
      <SectionTitle
        eyebrow="Nos pôles d'expertise"
        title="Six pôles, une seule mission"
        subtitle="Chaque pôle dispose de son expertise et de ses équipes dédiées. Un besoin qui en touche plusieurs ? Nous combinons les expertises adaptées à votre contexte."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POLES.map((p, i) => (
          <a key={p.href} href={p.href} className={`group hover-lift block p-6 ${CARD}`}>
            <div className="mb-4 flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </span>
              <span className="font-display text-3xl font-extrabold leading-none text-primary/20">
                0{i + 1}
              </span>
            </div>
            <h3 className="mb-1.5 font-display text-base font-bold">{p.name}</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Découvrir
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
