import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/evenements")({
  head: () => ({
    meta: [
      { title: "Nos événements — Office Management" },
      { name: "description", content: "Forums emploi, journées portes ouvertes, conférences RH, séminaires, bootcamps et masterclass." },
      { property: "og:title", content: "Nos événements — Office Management" },
      { property: "og:description", content: "Calendrier des événements et inscriptions." },
    ],
  }),
  component: Page,
});

const events = [
  { t: "Forum emploi Pointe-Noire", cat: "Forum", date: "12 mars 2026", loc: "Songolo, Pointe-Noire" },
  { t: "Conférence RH : GPEC et talents", cat: "Conférence", date: "24 mars 2026", loc: "Radisson Blu" },
  { t: "Journée portes ouvertes Business School", cat: "Portes ouvertes", date: "6 avril 2026", loc: "Siège OM" },
  { t: "Bootcamp Excel & Power BI", cat: "Bootcamp", date: "15-19 avril 2026", loc: "Centre de formation" },
  { t: "Masterclass Leadership", cat: "Masterclass", date: "3 mai 2026", loc: "En ligne" },
  { t: "Séminaire Paie & Fiscalité", cat: "Séminaire", date: "22 mai 2026", loc: "Kintélé" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Calendrier</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos événements</h1>
          <p className="text-muted-foreground text-lg">Rencontrez-nous et développez votre réseau lors de nos prochains rendez-vous.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map(e => (
            <Card key={e.t} className="gradient-card border-border p-6 hover-lift">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">{e.cat}</span>
              <h3 className="font-display text-lg font-bold mt-3 mb-3">{e.t}</h3>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Calendar className="h-4 w-4 text-primary" />{e.date}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4"><MapPin className="h-4 w-4 text-primary" />{e.loc}</div>
              <Button size="sm" className="gradient-cyan text-primary-foreground w-full">S'inscrire</Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
