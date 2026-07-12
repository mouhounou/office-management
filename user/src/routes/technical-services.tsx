import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Wrench, Monitor, Network, Video, Sun, Snowflake, Flame, Waves, Zap, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/technical-services")({
  head: () => ({
    meta: [
      { title: "Office Management Technical Services" },
      { name: "description", content: "Division technique : maintenance industrielle et informatique, réseaux, vidéosurveillance, solaire, climatisation, soudure, tuyauterie, électricité, sécurité incendie." },
      { property: "og:title", content: "Technical Services — Office Management" },
      { property: "og:description", content: "Une division indépendante d'ingénierie et de maintenance." },
    ],
  }),
  component: Page,
});

const services = [
  { i: Wrench, t: "Maintenance industrielle" },
  { i: Monitor, t: "Maintenance informatique" },
  { i: Network, t: "Réseaux" },
  { i: Video, t: "Vidéosurveillance" },
  { i: Sun, t: "Énergie solaire" },
  { i: Snowflake, t: "Climatisation" },
  { i: Flame, t: "Soudure" },
  { i: Waves, t: "Tuyauterie" },
  { i: Zap, t: "Électricité" },
  { i: ShieldAlert, t: "Sécurité incendie" },
];

function Page() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Division technique</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Office Management Technical Services</h1>
          <p className="text-muted-foreground text-lg">Une division indépendante spécialisée dans l'ingénierie, la maintenance et les services techniques.</p>
        </div>
      </section>
      <Section>
        <SectionTitle eyebrow="Nos services" title="Dix expertises techniques" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {services.map(s => (
            <Card key={s.t} className="gradient-card border-border p-5 hover-lift text-center">
              <s.i className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-display text-sm font-bold">{s.t}</h3>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
