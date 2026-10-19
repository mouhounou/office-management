import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { fetchPost, fetchPosts, parseContent, type Post } from "@/lib/content";
import { formatFrenchDate, postImage } from "@/lib/content-images";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params }) => {
    const post = await fetchPost(params.slug).catch(() => null);
    if (!post) throw notFound();
    const others = await fetchPosts().catch(() => [] as Post[]);
    return { post, others };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Office Management` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          {
            property: "og:image",
            content: postImage(loaderData.post.imageUrl, loaderData.post.category),
          },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { post, others } = Route.useLoaderData();
  const blocks = parseContent(post.content);
  const related = others
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 4);
  const fallback = others.filter((p) => p.slug !== post.slug).slice(0, 4);
  const suggestions = related.length > 0 ? related : fallback;

  return (
    <>
      <ReadingProgress targetId="article" />

      {/* HERO : l'image de l'article en fond, titre en surimpression. */}
      <section className="theme-dark relative isolate flex min-h-[70vh] items-end overflow-hidden bg-navy-deep md:min-h-[78vh]">
        <img
          src={postImage(post.imageUrl, post.category)}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{ animation: "ken-burns 14s ease-out both" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep via-navy-deep/45 to-navy-deep/5" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/60 via-navy-deep/10 to-transparent" />

        <div className="container mx-auto px-4 pt-24 pb-14 md:pb-20">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> Tous les articles
          </Link>
          <div className="animate-fade-in-up">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full gradient-cyan px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase">
              <Tag className="h-3 w-3" /> {post.category}
            </span>
            <h1 className="max-w-4xl font-display text-3xl leading-[1.08] font-extrabold text-white md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 font-display text-xs font-bold text-white">
                  OM
                </span>
                Office Management
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-cyan-glow" />{" "}
                {formatFrenchDate(post.publishedAt ?? post.createdAt)}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-glow" /> {post.readTime} de lecture
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BODY — pleine largeur, 2 colonnes */}
      <Section className="pt-12!">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 xl:gap-14 items-start">
          {/* Article */}
          <div id="article" className="min-w-0">
            <article className="space-y-5 max-w-3xl">
              {blocks.map((block, i) => {
                if (block.type === "h") {
                  return (
                    <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-2">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i} className="space-y-2">
                      {block.items.map((it) => (
                        <li key={it} className="flex items-start gap-2.5 text-foreground/85">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-foreground/85 leading-relaxed">
                    {block.text}
                  </p>
                );
              })}
            </article>

            {/* Auteur / CTA */}
            <Card className="gradient-card border-primary/30 p-6 md:p-8 mt-12 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left max-w-3xl">
              <div className="h-14 w-14 rounded-full gradient-cyan flex items-center justify-center shrink-0 font-display font-extrabold text-primary-foreground text-lg">
                OM
              </div>
              <div className="flex-1">
                <div className="font-display font-bold">Office Management</div>
                <p className="text-sm text-muted-foreground">
                  Cabinet conseil RH & formation à Pointe-Noire.
                </p>
              </div>
              <Button
                asChild
                className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90"
              >
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            {suggestions.length > 0 && (
              <Card className="gradient-card border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4">À lire aussi</h2>
                <div className="space-y-4">
                  {suggestions.map((p) => (
                    <Link
                      key={p.slug}
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="group flex gap-3"
                    >
                      <img
                        src={postImage(p.imageUrl, p.category)}
                        alt=""
                        className="h-16 w-20 rounded-lg object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-primary mb-1">
                          {p.category}
                        </div>
                        <div className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {p.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            <Card className="gradient-card border-primary/30 p-6 text-center">
              <div className="font-display font-bold mb-2">Besoin d'un accompagnement RH ?</div>
              <p className="text-sm text-muted-foreground mb-4">
                Nos experts répondent à vos enjeux capital humain.
              </p>
              <Button
                asChild
                className="w-full gradient-cyan text-primary-foreground font-semibold hover:opacity-90"
              >
                <Link to="/devis">
                  Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
