import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Users, Building, Sparkles } from "lucide-react";

export const Route = createFileRoute("/offres-speciales")({
  head: () => ({
    meta: [
      { title: "Offres spéciales — Office Management" },
      { name: "description", content: "Réductions étudiants, offres groupe, promotions entreprises et sessions sponsorisées." },
    ],
  }),
  component: Page,
});

const offers = [
  { i: Tag, t: "Réduction étudiants", d: "-20% sur toutes les formations sur présentation de la carte." },
  { i: Users, t: "Offre groupe", d: "Tarifs dégressifs dès 3 inscriptions à la même session." },
  { i: Building, t: "Promotion entreprises", d: "Pack 5 formations + audit RH offert." },
  { i: Sparkles, t: "Sessions sponsorisées", d: "Formations subventionnées en partenariat avec nos sponsors." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Profitez-en</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Offres spéciales</h1>
          <p className="text-muted-foreground text-lg mb-8">Des opportunités à saisir pour vos formations, vos équipes ou vos partenariats.</p>
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/devis">Demander un devis</Link></Button>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {offers.map(o => (
            <Card key={o.t} className="gradient-card border-border p-6 hover-lift">
              <o.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">{o.t}</h3>
              <p className="text-muted-foreground">{o.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
