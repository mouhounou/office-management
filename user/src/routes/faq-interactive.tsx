import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, SectionTitle } from "@/components/Section";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";

export const Route = createFileRoute("/faq-interactive")({
  head: () => ({
    meta: [
      { title: "FAQ interactive — Office Management" },
      { name: "description", content: "Deux espaces de questions fréquentes : entreprises et particuliers, avec recherche intelligente." },
      { property: "og:title", content: "FAQ interactive — Office Management" },
      { property: "og:description", content: "Trouvez rapidement votre réponse." },
    ],
  }),
  component: Page,
});

const entreprises = [
  { q: "Comment demander un recrutement ?", a: "Depuis notre Business Center, rubrique Recrutement. Nous revenons vers vous sous 48 h." },
  { q: "Quels sont vos délais ?", a: "De 15 à 45 jours selon le profil et la rareté des compétences recherchées." },
  { q: "Quels secteurs couvrez-vous ?", a: "Pétrole & gaz, industrie, banque, télécoms, ONG, distribution et administration." },
  { q: "Proposez-vous des audits RH ?", a: "Oui : audit social, audit paie, audit de conformité et audit organisationnel." },
];

const particuliers = [
  { q: "Comment s'inscrire ?", a: "Via notre page Pré-inscription en ligne ou en nous contactant directement." },
  { q: "Comment payer ?", a: "Mobile money, virement bancaire ou espèces selon les modalités convenues." },
  { q: "Comment obtenir son certificat ?", a: "À l'issue de la formation et après validation des évaluations, sous 15 jours ouvrés." },
  { q: "Puis-je suivre une formation à distance ?", a: "Oui, plusieurs de nos formations sont disponibles en ligne." },
];

function FAQList({ items, query }: { items: { q: string; a: string }[]; query: string }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q));
  }, [items, query]);
  if (filtered.length === 0) return <p className="text-center text-sm text-muted-foreground py-8">Aucune question ne correspond à votre recherche.</p>;
  return (
    <Accordion type="single" collapsible className="w-full">
      {filtered.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left font-display">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Page() {
  const [query, setQuery] = useState("");
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Aide</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">FAQ interactive</h1>
          <p className="text-muted-foreground text-lg mb-6">Deux espaces distincts, une recherche intelligente.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher une question…" className="pl-10" />
          </div>
        </div>
      </section>
      <Section>
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="entreprises">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="entreprises">Entreprises</TabsTrigger>
              <TabsTrigger value="particuliers">Particuliers</TabsTrigger>
            </TabsList>
            <TabsContent value="entreprises"><FAQList items={entreprises} query={query} /></TabsContent>
            <TabsContent value="particuliers"><FAQList items={particuliers} query={query} /></TabsContent>
          </Tabs>
        </div>
      </Section>
    </>
  );
}
