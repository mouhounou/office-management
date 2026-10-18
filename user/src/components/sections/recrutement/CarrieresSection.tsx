import { Link } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  CalendarClock,
  GraduationCap,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/content";
import { formatFrenchDate } from "@/lib/content-images";

/** Pourquoi nous rejoindre (ex-page carrieres). */
const REASONS = [
  {
    icon: Sparkles,
    title: "Environnement stimulant",
    text: "Une équipe passionnée et un cadre professionnel motivant.",
  },
  {
    icon: TrendingUp,
    title: "Opportunités d'évolution",
    text: "Évoluez et prenez des responsabilités au sein du cabinet.",
  },
  {
    icon: GraduationCap,
    title: "Formation continue",
    text: "Développez vos compétences tout au long de votre parcours.",
  },
  {
    icon: Award,
    title: "Valorisation des compétences",
    text: "Vos talents sont reconnus et récompensés.",
  },
];

const CONTRACT_LABELS: Record<string, string> = {
  stage: "Stage",
  cdd: "CDD",
  cdi: "CDI",
  interim: "Intérim",
  consultance: "Consultance",
  alternance: "Alternance",
};

/**
 * Offres d'emploi et de stage publiées depuis le back-office (ressource
 * « offers » de l'API). `onApply` bascule le formulaire sur l'espace candidat
 * et rattache la candidature à l'offre.
 */
export function CarrieresSection({
  offers,
  onApply,
}: {
  offers: Offer[];
  onApply: (offer?: Offer) => void;
}) {
  return (
    <Section id="carrieres" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Carrières"
        title="Offres d'emploi & de stage"
        subtitle="Les postes ouverts chez nos clients et chez Office Management, mis à jour par notre équipe."
      />
      {offers.length > 0 ? (
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
                  <Briefcase className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-display font-bold">{offer.title}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand-strong">
                      {CONTRACT_LABELS[offer.contractType] ?? offer.contractType}
                    </span>
                    {offer.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {offer.location}
                      </span>
                    )}
                    {offer.sector && <span>{offer.sector}</span>}
                    {offer.duration && <span>{offer.duration}</span>}
                  </div>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {offer.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {offer.expiresAt && (
                    <>
                      <CalendarClock className="h-3.5 w-3.5" /> Jusqu'au{" "}
                      {formatFrenchDate(offer.expiresAt)}
                    </>
                  )}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="shrink-0 gradient-cyan text-primary-foreground"
                >
                  <Link to="/recrutement" hash="candidature" onClick={() => onApply(offer)}>
                    Postuler
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Aucune offre n'est publiée pour le moment. Déposez une candidature spontanée : nous vous
            recontactons dès qu'un poste correspond à votre profil.
          </p>
          <Button asChild size="sm" className="mt-4 gradient-cyan text-primary-foreground">
            <Link to="/recrutement" hash="candidature" onClick={() => onApply()}>
              Candidature spontanée
            </Link>
          </Button>
        </div>
      )}

      <h3 className="mt-16 mb-6 text-center font-display text-xl font-bold">
        Pourquoi rejoindre Office Management ?
      </h3>
      <FeatureCards items={REASONS} columns={4} />
    </Section>
  );
}
