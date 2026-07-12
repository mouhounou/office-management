import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Users, Calculator, Briefcase, Laptop, Database } from "lucide-react";

export const Route = createFileRoute("/business-school")({
  head: () => ({
    meta: [
      { title: "Office Management Business School — École professionnelle" },
      { name: "description", content: "Une école professionnelle avec 5 académies : RH, Comptabilité & Finance, Management, Informatique et Sage." },
      { property: "og:title", content: "Office Management Business School" },
      { property: "og:description", content: "5 académies, certifications, formateurs experts et parcours professionnalisants." },
    ],
  }),
  component: Page,
});

const academies = [
  { i: Users, t: "Académie RH", items: ["Assistant RH", "Responsable RH", "Gestion Administrative du Personnel", "GPEC", "Audit Social"] },
  { i: Calculator, t: "Académie Comptabilité & Finance", items: ["Comptabilité générale", "Fiscalité", "Contrôle de gestion", "Audit", "Sage Comptabilité"] },
  { i: Briefcase, t: "Académie Management", items: ["Leadership", "Gestion des équipes", "Communication", "Gestion de projet"] },
  { i: Laptop, t: "Académie Informatique", items: ["Excel", "Word", "PowerPoint", "Power BI", "Microsoft 365"] },
  { i: Database, t: "Académie Sage", items: ["Sage Paie & RH", "Sage Comptabilité", "Sage Gestion Commerciale", "Sage Immobilisations"] },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">École professionnelle</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Business School</h1>
          <p className="text-muted-foreground text-lg">Cinq académies, un même standard d'excellence. Formez-vous aux métiers qui font l'entreprise.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Nos académies" title="Cinq académies, un standard d'excellence" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {academies.map(a => (
            <Card key={a.t} className="gradient-card border-border p-6 hover-lift">
              <a.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-3">{a.t}</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {a.items.map(x => <li key={x}>• {x}</li>)}
              </ul>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">Chaque académie dispose de son propre catalogue, ses formateurs, ses certifications, son calendrier, sa galerie et ses témoignages.</p>
      </Section>
    </>
  );
}
