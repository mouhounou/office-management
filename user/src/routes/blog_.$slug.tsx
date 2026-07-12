import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { getPost, posts } from "@/lib/blog";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.t} — Office Management` },
          { name: "description", content: loaderData.post.e },
          { property: "og:title", content: loaderData.post.t },
          { property: "og:description", content: loaderData.post.e },
          { property: "og:image", content: loaderData.post.img },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug && p.c === post.c).slice(0, 4);
  const fallback = posts.filter((p) => p.slug !== post.slug).slice(0, 4);
  const suggestions = related.length > 0 ? related : fallback;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <img src={post.img} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
        <div className="absolute inset-0 -z-10 bg-grid" />
        <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />

        <div className="relative container mx-auto px-4 max-w-4xl animate-fade-in-up">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 hover:bg-primary/10">
            <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-1" /> Tous les articles</Link>
          </Button>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-5 text-xs font-medium uppercase tracking-widest text-primary">
            <Tag className="h-3 w-3" /> {post.c}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-[1.08] mb-5">{post.t}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {post.d}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {post.readTime} de lecture</span>
          </div>
        </div>
      </section>

      {/* BODY — pleine largeur, 2 colonnes */}
      <Section className="pt-12!">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 xl:gap-14 items-start">
          {/* Article */}
          <div className="min-w-0">
            <img src={post.img} alt={post.t} className="w-full rounded-2xl shadow-elegant mb-10 aspect-video object-cover" />

            <article className="space-y-5 max-w-3xl">
              <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary pl-4">{post.e}</p>
              {post.content.map((block, i) => {
                if (block.type === "h") {
                  return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-2">{block.text}</h2>;
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
                return <p key={i} className="text-foreground/85 leading-relaxed">{block.text}</p>;
              })}
            </article>

            {/* Auteur / CTA */}
            <Card className="gradient-card border-primary/30 p-6 md:p-8 mt-12 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left max-w-3xl">
              <div className="h-14 w-14 rounded-full gradient-cyan flex items-center justify-center shrink-0 font-display font-extrabold text-primary-foreground text-lg">OM</div>
              <div className="flex-1">
                <div className="font-display font-bold">Office Management</div>
                <p className="text-sm text-muted-foreground">Cabinet conseil RH & formation à Pointe-Noire.</p>
              </div>
              <Button asChild className="gradient-cyan text-primary-foreground font-semibold hover:opacity-90">
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
                    <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group flex gap-3">
                      <img src={p.img} alt="" className="h-16 w-20 rounded-lg object-cover shrink-0" loading="lazy" />
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-primary mb-1">{p.c}</div>
                        <div className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{p.t}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            <Card className="gradient-card border-primary/30 p-6 text-center">
              <div className="font-display font-bold mb-2">Besoin d'un accompagnement RH ?</div>
              <p className="text-sm text-muted-foreground mb-4">Nos experts répondent à vos enjeux capital humain.</p>
              <Button asChild className="w-full gradient-cyan text-primary-foreground font-semibold hover:opacity-90">
                <Link to="/devis">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
