import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import type { Post } from "@/lib/content";
import { formatFrenchDate, postImage } from "@/lib/content-images";

/** Jour et mois abrégé pour le badge de date (« 17 » / « oct. »). */
function dateBadge(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: date.toLocaleDateString("fr-FR", { day: "2-digit" }),
    month: date.toLocaleDateString("fr-FR", { month: "short" }),
  };
}

/**
 * Carte d'article du blog : image (zoom au survol), catégorie, badge de
 * date, temps de lecture, titre, extrait et lien de lecture animé.
 */
export function PostCard({ post }: { post: Post }) {
  const published = post.publishedAt ?? post.createdAt;
  const badge = dateBadge(published);

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_48px_-20px_oklch(0.56_0.12_228/0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={postImage(post.imageUrl, post.category)}
          alt=""
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          width={640}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent opacity-80 transition group-hover:opacity-100" />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-strong backdrop-blur">
          {post.category}
        </span>
        {badge && (
          <span className="absolute bottom-4 left-4 flex flex-col items-center rounded-xl gradient-cyan px-3 py-1.5 leading-none text-white shadow-lg">
            <span className="font-display text-lg font-extrabold">{badge.day}</span>
            <span className="text-[10px] font-semibold uppercase">{badge.month}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" /> {formatFrenchDate(published)}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> {post.readTime} de lecture
            </span>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 font-display text-lg leading-snug font-bold transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="relative">
            Lire l'article
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
