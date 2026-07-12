import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Truck, ShoppingBag, HardHat, Hotel, Landmark, GraduationCap, Heart, Factory, Antenna, Building2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/secteurs")({
  head: () => ({
    meta: [
      { title: "Secteurs d'intervention — Office Management" },
      { name: "description", content: "Office Management adapte ses solutions RH aux réalités sectorielles : Oil & Gas, BTP, logistique, hôtellerie, ONG, administration publique." },
      { property: "og:title", content: "Secteurs d'intervention — Office Management" },
      { property: "og:description", content: "Solutions RH adaptées à chaque secteur d'activité." },
    ],
  }),
  component: Secteurs,
});

const SECTORS = [
  { icon: Fuel, name: "Pétrole & Gaz", desc: "Mise à disposition de personnel qualifié pour les majors et sous-traitants." },
  { icon: HardHat, name: "BTP & Construction", desc: "Recrutement d'ouvriers, chefs de chantier, ingénieurs travaux." },
  { icon: Truck, name: "Logistique & Transport", desc: "Personnel administratif, chauffeurs, gestionnaires de flotte." },
  { icon: ShoppingBag, name: "Commerce & Distribution", desc: "Vendeurs, caissiers, responsables de magasin formés." },
  { icon: Hotel, name: "Hôtellerie & Restauration", desc: "Personnel de service, réception, housekeeping qualifié." },
  { icon: Landmark, name: "Administration publique", desc: "Renforcement de capacités, formations continues sur mesure." },
  { icon: GraduationCap, name: "Éducation & Formation", desc: "Formateurs, encadrants, ingénierie pédagogique." },
  { icon: Heart, name: "ONG & Humanitaire", desc: "Recrutement projet, expatriation locale, gestion RH." },
  { icon: Factory, name: "PME & PMI", desc: "Packs RH adaptés aux structures en croissance." },
  { icon: Antenna, name: "Télécommunications", desc: "Techniciens, commerciaux, support client." },
];

function Secteurs() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Building2 className="h-3.5 w-3.5" /> Secteurs d'intervention
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Nous comprenons <span className="text-gradient-cyan">votre métier</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nous adaptons nos solutions RH aux réalités sectorielles de chaque organisation, du terrain aux exigences réglementaires.
          </p>
        </div>
      </section>

      {/* GRID */}
      <Section className="pt-14!">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {SECTORS.map((s) => (
            <Card key={s.name} className="group gradient-card border-border p-5 hover-lift">
              <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center mb-4 group-hover:glow-cyan transition">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-sm mb-1.5">{s.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0!">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Votre secteur n'est pas listé ?</h2>
            <p className="text-muted-foreground mb-8">
              Nos équipes s'adaptent à toute organisation. Parlons de vos enjeux et construisons la solution qui vous ressemble.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/contact">Discuter de mon besoin <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                <Link to="/services">Voir nos services</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
