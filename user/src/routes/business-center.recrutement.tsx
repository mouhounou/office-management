import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { BusinessRequestForm } from "@/components/BusinessRequestForm";

export const Route = createFileRoute("/business-center/recrutement")({
  head: () => ({ meta: [{ title: "Demande de recrutement — Business Center" }, { name: "description", content: "Soumettez votre demande de recrutement à Office Management." }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <Section>
      <SectionTitle eyebrow="Business Center" title="Demande de recrutement" subtitle="Détaillez vos besoins en talents. Nous revenons vers vous sous 48h." />
      <BusinessRequestForm type="recrutement" />
    </Section>
  ),
});
