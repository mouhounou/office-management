import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Office Management" },
      { name: "description", content: "Questions fréquentes sur nos formations, certifications, stages et programmes bilingues." },
      { property: "og:title", content: "FAQ — Office Management" },
      { property: "og:description", content: "Toutes les réponses à vos questions." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  {
    q: "Comment s'inscrire à une formation ?",
    a: "Vous pouvez vous inscrire directement en ligne via notre page Pré-inscription, ou nous contacter via nos numéros officiels.",
  },
  {
    q: "Les formations sont-elles certifiantes ?",
    a: "Oui, nos formations donnent droit à des certificats et diplômes selon la durée choisie.",
  },
  {
    q: "Proposez-vous des stages ?",
    a: "Oui, certains programmes incluent des stages pratiques en entreprise.",
  },
  {
    q: "Les formations sont-elles bilingues ?",
    a: "Oui, plusieurs de nos formations sont disponibles en français et en anglais.",
  },
  {
    q: "Quels sont les modes de formation disponibles ?",
    a: "Nos formations sont disponibles en présentiel à Pointe-Noire et en ligne pour davantage de flexibilité.",
  },
  {
    q: "Quels sont les moyens de paiement acceptés ?",
    a: "Nous acceptons les paiements par mobile money, virement bancaire et espèces selon les modalités convenues.",
  },
];

function FAQ() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Aide</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Questions fréquentes</h1>
          <p className="text-muted-foreground text-lg">Tout ce que vous devez savoir avant de vous lancer.</p>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="FAQ" title="Vos questions, nos réponses" />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-display">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}
