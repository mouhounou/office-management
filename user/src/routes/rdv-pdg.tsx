import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Calendar, Star } from "lucide-react";

export const Route = createFileRoute("/rdv-pdg")({
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous avec le PDG — Office Management" },
      { name: "description", content: "Service premium pour grands comptes, partenaires, investisseurs et institutions." },
    ],
  }),
  component: Page,
});

const audiences = [
  { t: "Grands comptes", d: "Stratégies RH sur-mesure pour vos enjeux complexes." },
  { t: "Partenaires", d: "Construire des collaborations à long terme." },
  { t: "Investisseurs", d: "Présentation de la vision et des opportunités." },
  { t: "Institutions", d: "Discussions de haut niveau sur les politiques RH." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Star className="h-10 w-10 text-primary mx-auto mb-4" />
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Service premium</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Rendez-vous avec le PDG</h1>
          <p className="text-muted-foreground text-lg mb-8">Un échange direct, confidentiel et stratégique avec la direction générale.</p>
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/rendez-vous"><Calendar className="h-4 w-4 mr-2" />Réserver un créneau</Link></Button>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="À qui s'adresse ce service" title="Un service exclusif" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map(a => (
            <Card key={a.t} className="gradient-card border-border p-6 hover-lift">
              <Crown className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{a.t}</h3>
              <p className="text-sm text-muted-foreground">{a.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
