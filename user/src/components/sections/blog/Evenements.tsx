import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";

/**
 * Événements passés (anciennement /evenements). Toutes les dates sont
 * révolues : on les présente comme « récents », sans bouton d'inscription.
 */
const events = [
  {
    t: "Forum emploi Pointe-Noire",
    cat: "Forum",
    date: "12 mars 2026",
    loc: "Songolo, Pointe-Noire",
  },
  {
    t: "Conférence RH : GPEC et talents",
    cat: "Conférence",
    date: "24 mars 2026",
    loc: "Radisson Blu",
  },
  {
    t: "Journée portes ouvertes Business School",
    cat: "Portes ouvertes",
    date: "6 avril 2026",
    loc: "Siège OM",
  },
  {
    t: "Bootcamp Excel & Power BI",
    cat: "Bootcamp",
    date: "15-19 avril 2026",
    loc: "Centre de formation",
  },
  { t: "Masterclass Leadership", cat: "Masterclass", date: "3 mai 2026", loc: "En ligne" },
  { t: "Séminaire Paie & Fiscalité", cat: "Séminaire", date: "22 mai 2026", loc: "Kintélé" },
];

export function Evenements() {
  return (
    <Section id="evenements" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Événements récents"
        title="Nos derniers rendez-vous"
        subtitle="Forums, conférences, bootcamps et séminaires organisés par Office Management."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <article key={e.t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-strong">
              {e.cat}
            </span>
            <h3 className="mb-3 mt-3 font-display text-base font-bold">{e.t}</h3>
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              {e.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {e.loc}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Vous souhaitez être informé de nos prochains événements ou en organiser un avec nous ?
        </p>
        <Button asChild variant="outline">
          <Link to="/contact">
            Nous contacter <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
