import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, FileSpreadsheet, FileSignature, FileCheck2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/telechargements")({
  head: () => ({
    meta: [
      { title: "Téléchargements — Office Management" },
      { name: "description", content: "Brochures, catalogue de formations, fiches d'inscription, grille tarifaire, modèles RH à télécharger." },
      { property: "og:title", content: "Centre de téléchargements — Office Management" },
      { property: "og:description", content: "Documents PDF officiels d'Office Management." },
    ],
  }),
  component: Downloads,
});

const DOCS = [
  { icon: FileText, title: "Brochure entreprise", desc: "Présentation complète d'Office Management.", size: "Bientôt" },
  { icon: BookOpen, title: "Catalogue des formations", desc: "Toutes nos formations 2026 avec durées et tarifs.", size: "Bientôt" },
  { icon: FileSignature, title: "Fiche d'inscription", desc: "Formulaire à remplir pour s'inscrire à une formation.", size: "Bientôt" },
  { icon: FileSpreadsheet, title: "Grille tarifaire", desc: "Tarifs détaillés par service et par formation.", size: "Bientôt" },
  { icon: FileCheck2, title: "Règlement intérieur", desc: "Règles de fonctionnement du centre de formation.", size: "Bientôt" },
  { icon: FileText, title: "Présentation institutionnelle", desc: "Document corporate à destination des partenaires.", size: "Bientôt" },
];

function Downloads() {
  const handle = (title: string) => toast.info(`${title} sera disponible prochainement. Contactez-nous pour l'obtenir.`);
  return (
    <Section className="!py-16">
      <SectionTitle eyebrow="Centre de téléchargements" title="Documents & ressources officiels" subtitle="Téléchargez nos documents institutionnels et supports RH." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCS.map(d => (
          <Card key={d.title} className="glass p-6 hover-lift flex flex-col">
            <div className="h-12 w-12 rounded-lg gradient-cyan flex items-center justify-center mb-4">
              <d.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold mb-1">{d.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">{d.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{d.size}</span>
              <Button size="sm" variant="outline" onClick={() => handle(d.title)}>
                <Download className="h-4 w-4 mr-1.5" />Télécharger
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
