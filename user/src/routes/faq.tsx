import { createFileRoute, Link } from "@tanstack/react-router";

import { Section } from "@/components/Section";
import { FaqExplorer } from "@/components/sections/faq/FaqExplorer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Office Management" },
      {
        name: "description",
        content:
          "Questions fréquentes des particuliers (inscription, certificats, stages, formations à distance, paiement) et des entreprises (recrutement, délais, secteurs, audits RH), avec recherche.",
      },
      { property: "og:title", content: "FAQ — Office Management" },
      {
        property: "og:description",
        content: "Toutes les réponses à vos questions, particuliers et entreprises.",
      },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <>
      <section className="gradient-hero py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <span className="eyebrow mb-3">Aide</span>
          <h1 className="mb-4 font-display text-4xl font-extrabold md:text-6xl">
            Questions fréquentes
          </h1>
          <p className="text-lg text-muted-foreground">
            Particuliers ou entreprises : trouvez rapidement votre réponse.
          </p>
        </div>
      </section>

      <Section>
        <FaqExplorer />
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="mb-4 text-muted-foreground">Vous ne trouvez pas votre réponse ?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="gradient-cyan text-primary-foreground">
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/pre-inscription">Pré-inscription</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/business-center">Business Center</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
