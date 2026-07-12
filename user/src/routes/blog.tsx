import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Tag, Clock, Newspaper } from "lucide-react";
import { posts, categories } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Actualités & Blog RH — Office Management" },
      { name: "description", content: "Actualités, conseils RH, tendances du marché du travail, formation, recrutement et management pour entreprises et candidats." },
      { property: "og:title", content: "Actualités & Blog RH — Office Management" },
      { property: "og:description", content: "Articles, analyses et conseils RH par Office Management." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const [active, setActive] = useState("Tous");
  const filtered = active === "Tous" ? posts : posts.filter((p) => p.c === active);
  const featured = posts.find((p) => p.featured)!;

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
            <Newspaper className="h-3.5 w-3.5" /> Actualités & Blog RH
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Insights, actualités & <span className="text-gradient-cyan">conseils RH</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nos analyses pour entreprises et candidats sur les enjeux du capital humain.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <Section className="pt-14!">
        <Link to="/blog/$slug" params={{ slug: featured.slug }} className="block">
          <Card className="group gradient-card border-border overflow-hidden grid md:grid-cols-2 hover-lift">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img src={featured.img} alt={featured.t} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full gradient-cyan text-primary-foreground text-xs font-bold uppercase tracking-wider">À la une</div>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><Tag className="h-3 w-3" /> {featured.c}</div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-4 group-hover:text-primary transition-colors">{featured.t}</h2>
              <p className="text-muted-foreground mb-6">{featured.e}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {featured.d}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {featured.readTime}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-semibold">Lire l'article <ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>
          </Card>
        </Link>
      </Section>

      {/* CATEGORIES + GRID */}
      <Section className="pt-0!">
        <SectionTitle eyebrow="Catégories" title="Parcourir par thématique" />
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button key={c} onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === c
                  ? "gradient-cyan text-primary-foreground glow-cyan"
                  : "glass text-foreground/80 hover:text-primary"
              }`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="block">
              <Card className="group gradient-card border-border overflow-hidden hover-lift flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.img} alt={p.t} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold text-primary">{p.c}</div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold mb-3 group-hover:text-primary transition-colors">{p.t}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{p.e}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.d}</span>
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">Lire <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">Aucun article dans cette catégorie pour le moment.</p>
        )}
      </Section>

      {/* CTA */}
      <Section className="pt-0!">
        <Card className="gradient-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Une question RH, un projet de formation ?</h2>
            <p className="text-muted-foreground mb-8">Nos experts vous accompagnent. Échangeons sur vos enjeux capital humain.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan">
                <Link to="/contact">Nous contacter <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
