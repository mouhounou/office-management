import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, FileText, MessageSquare, Briefcase, MapPin } from "lucide-react";

export const Route = createFileRoute("/jeunes-talents")({
  head: () => ({
    meta: [
      { title: "Programme Jeunes Talents — Office Management" },
      { name: "description", content: "Coaching, CV, simulation d'entretien, stage et placement pour jeunes diplômés." },
    ],
  }),
  component: Page,
});

const services = [
  { i: UserCheck, t: "Coaching individuel", d: "Accompagnement personnalisé sur votre projet professionnel." },
  { i: FileText, t: "Mise en valeur du CV", d: "Conception et optimisation de votre CV et lettre de motivation." },
  { i: MessageSquare, t: "Simulation d'entretien", d: "Préparation aux entretiens d'embauche avec feedback détaillé." },
  { i: Briefcase, t: "Recherche de stage", d: "Accès à notre réseau de partenaires recruteurs." },
  { i: MapPin, t: "Placement professionnel", d: "Mise en relation directe avec des employeurs." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Spécial jeunes diplômés</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Programme Jeunes Talents</h1>
          <p className="text-muted-foreground text-lg mb-8">Un accompagnement complet de la fin de vos études à votre premier emploi.</p>
          <Button asChild className="gradient-cyan text-primary-foreground"><Link to="/contact">Rejoindre le programme</Link></Button>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(s => (
            <Card key={s.t} className="gradient-card border-border p-6 hover-lift">
              <s.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
