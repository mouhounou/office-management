import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Image, Video, BookOpen, Layers, Newspaper, FileText, Radio } from "lucide-react";

export const Route = createFileRoute("/mediatheque")({
  head: () => ({
    meta: [
      { title: "Médiathèque — Office Management" },
      { name: "description", content: "Photos, vidéos, brochures, catalogues, flyers, communiqués et rapports regroupés en une seule médiathèque." },
      { property: "og:title", content: "Médiathèque — Office Management" },
      { property: "og:description", content: "Toutes nos ressources en un seul endroit." },
    ],
  }),
  component: Page,
});

const collections = [
  { i: Image, t: "Photos", d: "Nos événements, formations et équipes." },
  { i: Video, t: "Vidéos", d: "Reportages, capsules pédagogiques et témoignages." },
  { i: BookOpen, t: "Brochures", d: "Présentations synthétiques par offre." },
  { i: Layers, t: "Catalogues", d: "Catalogues formations et services." },
  { i: FileText, t: "Flyers", d: "Supports imprimables pour vos équipes." },
  { i: Radio, t: "Communiqués", d: "Communications officielles et annonces." },
  { i: Newspaper, t: "Rapports", d: "Rapports annuels et d'impact." },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Ressources</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Médiathèque</h1>
          <p className="text-muted-foreground text-lg">Toutes nos ressources visuelles et documentaires, en un seul endroit.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map(c => (
            <Card key={c.t} className="gradient-card border-border p-6 hover-lift">
              <c.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{c.t}</h3>
              <p className="text-sm text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
