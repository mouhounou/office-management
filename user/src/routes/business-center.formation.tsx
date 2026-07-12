import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { BusinessRequestForm } from "@/components/BusinessRequestForm";

export const Route = createFileRoute("/business-center/formation")({
  head: () => ({ meta: [{ title: "Commander une formation — Business Center" }, { name: "description", content: "Programmez une formation sur-mesure pour vos équipes." }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <Section>
      <SectionTitle eyebrow="Business Center" title="Commande de formation" subtitle="Programmez une session sur-mesure pour vos équipes." />
      <BusinessRequestForm type="formation" />
    </Section>
  ),
});
