import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Download,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";

/**
 * Documents officiels (anciennement /telechargements). Les fichiers ne sont pas
 * encore en ligne : le bouton prévient l'internaute et l'invite à nous contacter.
 */
const DOCS = [
  {
    icon: FileText,
    title: "Brochure entreprise",
    desc: "Présentation complète d'Office Management.",
  },
  {
    icon: BookOpen,
    title: "Catalogue des formations",
    desc: "Toutes nos formations 2026 avec durées et tarifs.",
  },
  {
    icon: FileSignature,
    title: "Fiche d'inscription",
    desc: "Formulaire à remplir pour s'inscrire à une formation.",
  },
  {
    icon: FileSpreadsheet,
    title: "Grille tarifaire",
    desc: "Tarifs détaillés par service et par formation.",
  },
  {
    icon: FileCheck2,
    title: "Règlement intérieur",
    desc: "Règles de fonctionnement du centre de formation.",
  },
  {
    icon: FileText,
    title: "Présentation institutionnelle",
    desc: "Document corporate à destination des partenaires.",
  },
];

export function Telechargements() {
  const handle = (title: string) =>
    toast.info(`${title} sera disponible prochainement. Contactez-nous pour l'obtenir.`);

  return (
    <Section id="telechargements" className="scroll-mt-24 pt-0!">
      <SectionTitle
        eyebrow="Téléchargements"
        title="Documents & ressources officiels"
        subtitle="Nos documents institutionnels et supports RH. Ils seront bientôt téléchargeables en ligne."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {DOCS.map((d) => (
          <div
            key={d.title}
            className="hover-lift flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full gradient-cyan text-primary-foreground">
              <d.icon className="h-5 w-5" />
            </span>
            <h3 className="mb-1 font-display text-base font-bold">{d.title}</h3>
            <p className="mb-4 flex-1 text-sm text-muted-foreground">{d.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Bientôt
              </span>
              <Button size="sm" variant="outline" onClick={() => handle(d.title)}>
                <Download className="mr-1.5 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Vous cherchez des photos ? Rendez-vous sur{" "}
        <Link
          to="/realisations"
          hash="galerie"
          className="font-semibold text-brand-strong hover:underline"
        >
          notre galerie
        </Link>
        . Besoin d'un document précis ?{" "}
        <Link to="/contact" className="font-semibold text-brand-strong hover:underline">
          Contactez-nous
        </Link>
        .
      </p>
    </Section>
  );
}
