import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Award, Briefcase } from "lucide-react";

export const Route = createFileRoute("/rapport-annuel")({
  head: () => ({
    meta: [
      { title: "Rapport annuel — Office Management" },
      { name: "description", content: "Chiffres clés, réalisations, impact social, formations réalisées et emplois générés." },
    ],
  }),
  component: Page,
});

const stats = [
  { i: Users, v: "2 500+", l: "Personnes formées" },
  { i: Award, v: "1 800+", l: "Certifications délivrées" },
  { i: Briefcase, v: "650+", l: "Emplois facilités" },
  { i: TrendingUp, v: "120+", l: "Entreprises clientes" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre impact</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Rapport annuel 2025</h1>
          <p className="text-muted-foreground text-lg mb-8">Transparence et redevabilité : retrouvez nos chiffres clés et nos réalisations.</p>
          <Button className="gradient-cyan text-primary-foreground"><Download className="h-4 w-4 mr-2" />Télécharger le PDF</Button>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map(s => (
            <Card key={s.l} className="gradient-card border-border p-6 text-center hover-lift">
              <s.i className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="font-display text-3xl font-extrabold text-gradient-cyan mb-1">{s.v}</div>
              <div className="text-sm text-muted-foreground">{s.l}</div>
            </Card>
          ))}
        </div>
        <Card className="p-8">
          <h2 className="font-display text-2xl font-bold mb-4">Faits marquants 2025</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>• Ouverture de 12 nouvelles sessions de formation certifiantes</li>
            <li>• Signature de partenariats avec 8 entreprises majeures de la place</li>
            <li>• Lancement de l'académie de certification "Office Management Certified"</li>
            <li>• Plus de 90% de taux d'insertion professionnelle sur nos certifiés</li>
          </ul>
        </Card>
      </Section>
    </>
  );
}
