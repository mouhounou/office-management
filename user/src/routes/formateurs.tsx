import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Award, Target } from "lucide-react";

export const Route = createFileRoute("/formateurs")({
  head: () => ({
    meta: [
      { title: "Formateurs — Office Management" },
      { name: "description", content: "Des formateurs expérimentés et qualifiés pour un accompagnement personnalisé et orienté résultats." },
      { property: "og:title", content: "Formateurs — Office Management" },
      { property: "og:description", content: "Des professionnels qualifiés au service de votre réussite." },
    ],
  }),
  component: Formateurs,
});

const qualities = [
  { i: GraduationCap, t: "Expertise reconnue", d: "Diplômes et années d'expérience dans leurs domaines respectifs." },
  { i: Users, t: "Pédagogie active", d: "Méthodes pratiques, cas concrets et mises en situation." },
  { i: Award, t: "Excellence", d: "Engagement constant pour la réussite des apprenants." },
  { i: Target, t: "Orientés résultats", d: "Suivi personnalisé pour atteindre vos objectifs professionnels." },
];

function Formateurs() {
  return (
    <>
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre équipe pédagogique</div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">Nos formateurs</h1>
          <p className="text-muted-foreground text-lg">
            Nos formateurs sont des professionnels qualifiés disposant d'une solide expérience dans leurs domaines respectifs. Ils assurent un accompagnement personnalisé afin de garantir une formation de qualité orientée vers les résultats.
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="Notre engagement" title="Une équipe pédagogique d'excellence" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {qualities.map((q) => (
            <Card key={q.t} className="gradient-card border-border p-6 hover-lift">
              <q.i className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{q.t}</h3>
              <p className="text-sm text-muted-foreground">{q.d}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
