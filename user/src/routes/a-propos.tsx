import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, Award, Zap, Heart, Target,
  Quote, Sparkles, GraduationCap, Briefcase, UserCheck, ArrowRight, MapPin,
} from "lucide-react";
import team from "@/assets/team.jpg";
import ceo from "@/assets/ceo-akiana.jpg";
import { CeoSignature } from "@/components/CeoSignature";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Office Management" },
      { name: "description", content: "Cabinet de conseil RH spécialisé dans le développement des compétences et la valorisation du capital humain à Pointe-Noire." },
      { property: "og:title", content: "À propos — Office Management" },
      { property: "og:description", content: "Découvrez notre vision, notre mission et nos valeurs." },
    ],
  }),
  component: About,
});

const values = [
  { i: ShieldCheck, t: "Professionnalisme", d: "Rigueur et éthique dans chaque intervention." },
  { i: Award, t: "Excellence", d: "Recherche permanente de la meilleure qualité de service." },
  { i: Zap, t: "Innovation", d: "Solutions modernes adaptées aux défis actuels." },
  { i: Heart, t: "Intégrité", d: "Transparence et respect des engagements." },
  { i: Target, t: "Réactivité", d: "Réponses rapides et efficaces aux besoins du marché." },
];

const stats = [
  { icon: GraduationCap, v: "500+", l: "Personnes formées" },
  { icon: Briefcase, v: "120+", l: "Entreprises accompagnées" },
  { icon: UserCheck, v: "300+", l: "Placements réussis" },
  { icon: Award, v: "10 ans", l: "D'expertise RH" },
];

function About() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> À propos de nous
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Bienvenue chez <span className="text-gradient-cyan">Office Management</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Votre partenaire en formation professionnelle, mise à disposition de personnel et prestation de services.
            Animés par une vision innovante des ressources humaines.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
              <Link to="/devis">Travailler avec nous <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
              <Link to="/services">Nos services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <Section className="py-14!">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="glass rounded-2xl p-6 text-center">
              <div className="mx-auto mb-3 h-11 w-11 rounded-xl gradient-cyan flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="font-display text-3xl md:text-4xl font-extrabold text-gradient-cyan leading-none">{s.v}</div>
              <div className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* VISION */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/15 blur-3xl rounded-full" />
            <img src={team} alt="Équipe Office Management" className="relative rounded-2xl shadow-elegant w-full" width={1280} height={800} loading="lazy" />
            <div className="absolute -bottom-6 -right-6 glass rounded-xl p-5 hidden md:block">
              <div className="font-display text-3xl font-bold text-gradient-cyan">+10 ans</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">au service du capital humain</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Notre vision</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Le capital humain, moteur de votre croissance</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Votre capital humain est votre atout le plus précieux. Mais les compétences d'hier ne suffisent plus pour relever les défis d'aujourd'hui.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              L'efficacité maximale et régulière ne peut être obtenue que par la mise à jour permanente des connaissances et un renforcement des capacités productives.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Office Management est une entreprise dynamique et innovante, spécialisée dans la formation professionnelle, la mise à disposition de personnel qualifié, la prestation de services et les services additionnels.
            </p>
          </div>
        </div>
      </Section>

      {/* MOT DU PDG */}
      <Section>
        <Card className="gradient-card border-primary/30 p-8 md:p-14 relative overflow-hidden">
          <Quote className="absolute top-8 right-8 h-16 w-16 text-primary/10" />
          <div className="absolute -top-24 -left-24 h-72 w-72 bg-primary/15 blur-3xl rounded-full" />
          <div className="relative grid lg:grid-cols-[auto_1fr] gap-10 items-center max-w-4xl mx-auto">
            <div className="relative mx-auto">
              <div className="absolute -inset-3 gradient-cyan rounded-2xl blur-2xl opacity-30" aria-hidden />
              <img
                src={ceo}
                alt="Monsieur Hassan Monlay I AKIANA, PDG d'Office Management"
                className="relative rounded-2xl shadow-elegant w-64 md:w-72 object-cover aspect-3/4"
                width={576}
                height={768}
                loading="lazy"
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Le mot du Président Directeur Général</div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-5">Monsieur Hassan Monlay I AKIANA</h3>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                « Notre engagement : faire du capital humain le moteur d'une croissance durable au Congo. Chez Office Management, nous mettons l'expertise, la rigueur et l'innovation au service de chaque entreprise et de chaque talent. »
              </p>

              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <CeoSignature />
                <div className="text-sm text-muted-foreground sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end font-semibold text-foreground"><MapPin className="h-4 w-4 text-primary" /> Pointe-Noire</div>
                  <div>Fait le {new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* VALEURS */}
      <Section>
        <SectionTitle eyebrow="Nos valeurs" title="Ce qui nous guide au quotidien" subtitle="Cinq principes ancrés dans chacune de nos missions." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <Card key={i} className="group gradient-card border-border p-7 hover-lift">
              <div className="flex items-center justify-between mb-5">
                <div className="h-12 w-12 rounded-xl gradient-cyan flex items-center justify-center group-hover:glow-cyan transition">
                  <v.i className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-display text-4xl font-extrabold text-primary/15">0{i + 1}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{v.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </Card>
          ))}
        </div>
      </Section>

    </>
  );
}
