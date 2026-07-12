import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { BusinessRequestForm } from "@/components/BusinessRequestForm";

export const Route = createFileRoute("/business-center/audit-rh")({
  head: () => ({ meta: [{ title: "Demande d'audit RH — Business Center" }, { name: "description", content: "Diagnostic complet de votre fonction RH." }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <Section>
      <SectionTitle eyebrow="Business Center" title="Demande d'audit RH" subtitle="Diagnostic complet et plan d'action sur-mesure." />
      <BusinessRequestForm type="audit_rh" />
    </Section>
  ),
});
