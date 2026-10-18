import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionTitle } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowRight,
  Tag,
  Clock,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchPosts, type Post } from "@/lib/content";
import { formatFrenchDate, postImage } from "@/lib/content-images";
import { Evenements } from "@/components/sections/blog/Evenements";
import { Presse } from "@/components/sections/blog/Presse";
import { Telechargements } from "@/components/sections/blog/Telechargements";

const PAGE_SIZE = 6;

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Actualités & Blog RH — Office Management" },
      {
        name: "description",
        content:
          "Articles et conseils RH, communiqués de presse, événements récents et documents officiels à télécharger (brochure, catalogue des formations, fiche d'inscription) d'Office Management.",
      },
      { property: "og:title", content: "Actualités & Blog RH — Office Management" },
      {
        property: "og:description",
        content: "Articles, analyses et conseils RH par Office Management.",
      },
    ],
  }),
  loader: async () => {
    try {
      return { posts: await fetchPosts(), unavailable: false };
    } catch {
      // Le blog ne doit pas casser la page si l'API est momentanément absente.
      return { posts: [] as Post[], unavailable: true };
    }
  },
  component: Blog,
});

function Blog() {
  const { posts, unavailable } = Route.useLoaderData();
  const [active, setActive] = useState("Tous");

  // Les catégories affichées sont celles réellement présentes dans les articles.
  const categories = ["Tous", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = active === "Tous" ? posts : posts.filter((p) => p.category === active);

  // Pagination : 6 articles par page, remise à la première page au changement de catégorie.
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goTo = (next: number) => {
    setPage(next);
    document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const featured = posts.find((p) => p.featured) ?? posts[0];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div
          className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-cyan-glow/15 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative container mx-auto px-4 text-center max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium uppercase tracking-widest text-primary">
            <Newspaper className="h-3.5 w-3.5" /> Actualités & Blog RH
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05] mb-6">
            Insights, actualités & <span className="text-gradient-cyan">conseils RH</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Nos analyses pour entreprises et candidats sur les enjeux du capital humain.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "#presse", label: "Salle de presse" },
              { href: "#evenements", label: "Événements" },
              { href: "#telechargements", label: "Téléchargements" },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="glass rounded-full px-4 py-1.5 text-sm hover:text-primary transition"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured ? (
        <Section className="pt-14!">
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="block">
            <Card className="group rounded-2xl border-border bg-card shadow-card overflow-hidden grid md:grid-cols-2 hover-lift">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src={postImage(featured.imageUrl, featured.category)}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full gradient-cyan text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  À la une
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="text-xs uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                  <Tag className="h-3 w-3" /> {featured.category}
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-4 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />{" "}
                      {formatFrenchDate(featured.publishedAt ?? featured.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {featured.readTime}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary font-semibold">
                    Lire l'article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </Section>
      ) : null}

      {/* CATEGORIES + GRID */}
      <Section id="articles" className="pt-0! scroll-mt-24">
        <SectionTitle eyebrow="Catégories" title="Parcourir par thématique" />
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActive(c);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === c
                  ? "gradient-cyan text-primary-foreground glow-cyan"
                  : "glass text-foreground/80 hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="block">
              <Card className="group rounded-2xl border-border bg-card shadow-card overflow-hidden hover-lift flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={postImage(p.imageUrl, p.category)}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold text-primary">
                    {p.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {formatFrenchDate(p.publishedAt ?? p.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                      Lire <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {pageCount > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination des articles"
          >
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => goTo(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                  n === currentPage
                    ? "gradient-cyan text-primary-foreground"
                    : "border border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition hover:border-primary/50 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            {unavailable
              ? "Les articles ne sont pas disponibles pour le moment. Réessayez dans quelques instants."
              : "Aucun article dans cette catégorie pour le moment."}
          </p>
        )}
      </Section>

      <Presse />
      <Evenements />
      <Telechargements />

      {/* CTA */}
      <Section className="pt-0!">
        <Card className="rounded-2xl bg-card shadow-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 bg-primary/25 blur-3xl rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Une question RH, un projet de formation ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Nos experts vous accompagnent. Échangeons sur vos enjeux capital humain.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90 glow-cyan"
              >
                <Link to="/contact">
                  Nous contacter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/40 hover:bg-primary/10"
              >
                <Link to="/services">Voir nos services</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
