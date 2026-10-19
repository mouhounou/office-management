import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Mail, Send } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import {
  BrochureScene,
  CatalogueScene,
  FormScene,
  PresentationScene,
  PricingScene,
  RulesScene,
} from "@/components/sections/blog/DocScenes";

/**
 * Documents officiels (anciennement /telechargements). Les fichiers ne sont
 * pas encore en ligne : chaque carte propose de recevoir le document, via le
 * formulaire de contact dont le sujet est prérempli.
 */
const DOCS: { scene: ComponentType; title: string; desc: string; format: string }[] = [
  {
    scene: BrochureScene,
    title: "Brochure entreprise",
    desc: "Présentation complète d'Office Management, de nos pôles et de nos références.",
    format: "PDF",
  },
  {
    scene: CatalogueScene,
    title: "Catalogue des formations",
    desc: "Toutes nos formations 2026 avec programmes, durées et tarifs.",
    format: "PDF",
  },
  {
    scene: FormScene,
    title: "Fiche d'inscription",
    desc: "Le formulaire à remplir pour vous inscrire à une session de formation.",
    format: "PDF",
  },
  {
    scene: PricingScene,
    title: "Grille tarifaire",
    desc: "Tarifs détaillés par service, par pôle et par formation.",
    format: "PDF",
  },
  {
    scene: RulesScene,
    title: "Règlement intérieur",
    desc: "Les règles de fonctionnement de notre centre de formation.",
    format: "PDF",
  },
  {
    scene: PresentationScene,
    title: "Présentation institutionnelle",
    desc: "Le document corporate destiné à nos partenaires et institutions.",
    format: "PDF",
  },
];

const requestSubject = (title: string) => `Demande de document : ${title}`;

export function Telechargements() {
  return (
    <Section id="telechargements" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Téléchargements"
        title="Documents & ressources officiels"
        subtitle="Nos documents institutionnels et supports RH. En attendant leur mise en ligne, recevez-les par email sur simple demande."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
        {DOCS.map((doc) => (
          <article
            key={doc.title}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_48px_-20px_oklch(0.56_0.12_228/0.45)]"
          >
            {/* Illustration animée */}
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)]">
              <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-cyan/25 blur-2xl transition duration-500 group-hover:bg-cyan/40" />
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative h-full px-6 pt-4 transition duration-500 group-hover:scale-105">
                <doc.scene />
              </div>
              <span className="absolute top-3 right-3 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur">
                {doc.format}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-lg font-bold">{doc.title}</h3>
              <p className="mt-1.5 mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {doc.desc}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-strong">
                  <Clock3 className="h-3 w-3" /> Bientôt en ligne
                </span>
                <Link
                  to="/contact"
                  search={{ sujet: requestSubject(doc.title) }}
                  hash="message"
                  className="inline-flex items-center gap-1.5 rounded-full gradient-cyan px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Recevoir{" "}
                  <Send className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Appel à l'action */}
      <div
        className="theme-dark relative mt-12 overflow-hidden rounded-3xl bg-navy-deep px-6 py-10 sm:px-10 md:py-12"
        data-reveal
      >
        <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-20 h-56 w-56 rounded-full border-[18px] border-cyan/15" />
        <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          <span className="ds-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-cyan text-white shadow-lg md:mx-0">
            <Mail className="h-8 w-8" />
          </span>
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
              Un document précis ? Nous vous l'envoyons.
            </h3>
            <p className="mt-2 text-white/70">
              Brochure, catalogue, attestation ou support RH : dites-nous ce qu'il vous faut, notre
              équipe vous répond sous 24 h ouvrées.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              to="/contact"
              search={{ sujet: "Demande de document" }}
              hash="message"
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-cyan px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Demander un document <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/realisations"
              hash="galerie"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Voir la galerie
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
