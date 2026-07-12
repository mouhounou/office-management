import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Newspaper, Calendar } from "lucide-react";

export const Route = createFileRoute("/salle-de-presse")({
  head: () => ({
    meta: [
      { title: "Salle de presse — Office Management" },
      { name: "description", content: "Communiqués, événements, partenariats, remises de certificats et nouvelles formations." },
    ],
  }),
  component: Page,
});

const news = [
  { date: "15 mai 2026", tag: "Communiqué", t: "Office Management lance son académie de certification", d: "Une nouvelle ère pour la formation professionnelle au Congo." },
  { date: "02 avril 2026", tag: "Partenariat", t: "Signature d'un partenariat stratégique", d: "Nouvelle convention avec une grande entreprise du secteur pétrolier." },
  { date: "20 mars 2026", tag: "Événement", t: "Remise de certificats — Promotion 2026", d: "150 nouveaux certifiés rejoignent le marché du travail." },
  { date: "10 février 2026", tag: "Nouveauté", t: "Lancement d'une nouvelle formation Sage 100 i7", d: "Programme intensif sur 4 semaines." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Actualités institutionnelles</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Salle de presse</h1>
          <p className="text-muted-foreground text-lg">Communiqués officiels, événements et faits marquants d'Office Management.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 max-w-4xl mx-auto">
          {news.map(n => (
            <Card key={n.t} className="gradient-card border-border p-6 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">{n.tag}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{n.date}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2 flex items-start gap-2"><Newspaper className="h-5 w-5 text-primary mt-1 shrink-0" />{n.t}</h3>
              <p className="text-muted-foreground">{n.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
