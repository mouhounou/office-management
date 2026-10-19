import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Signal,
  Tag,
  UserCheck,
  Wallet,
} from "lucide-react";

import { Section } from "@/components/Section";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { FormationCard } from "@/components/formations/FormationCard";
import { fetchFormation, fetchFormations, type Formation } from "@/lib/content";
import { formationImage } from "@/lib/content-images";

export const Route = createFileRoute("/formations_/$slug")({
  loader: async ({ params }) => {
    const formation = await fetchFormation(params.slug).catch(() => null);
    if (!formation) throw notFound();
    const others = await fetchFormations().catch(() => [] as Formation[]);
    return { formation, others };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.formation.title} — Formations Office Management` },
          { name: "description", content: summary(loaderData.formation, 160) },
          { property: "og:title", content: loaderData.formation.title },
          { property: "og:description", content: summary(loaderData.formation, 200) },
          {
            property: "og:image",
            content: formationImage(
              loaderData.formation.imageUrl,
              loaderData.formation.category,
              loaderData.formation.slug,
            ),
          },
        ]
      : [],
  }),
  component: FormationPage,
});

/** Premier paragraphe de la description, raccourci. */
function summary(formation: Formation, max: number) {
  const text =
    formation.description?.split(/\n\s*\n/)[0]?.trim() ||
    `Formation ${formation.title} — ${formation.category}, par Office Management à Pointe-Noire.`;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

const BENEFITS = [
  {
    icon: UserCheck,
    title: "Formateurs experts",
    text: "Des professionnels du métier, qui enseignent à partir de cas réels.",
  },
  {
    icon: Briefcase,
    title: "100 % pratique",
    text: "Mises en situation, études de cas et outils utilisés en entreprise.",
  },
  {
    icon: GraduationCap,
    title: "Suivi personnalisé",
    text: "Un accompagnement individuel jusqu'à l'insertion professionnelle.",
  },
];

function FormationPage() {
  const { formation, others } = Route.useLoaderData();
  const paragraphs = (formation.description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const sameCategory = others.filter(
    (f) => f.slug !== formation.slug && f.category === formation.category,
  );
  const related = (
    sameCategory.length > 0 ? sameCategory : others.filter((f) => f.slug !== formation.slug)
  ).slice(0, 3);
  const preRegistration = {
    formation: formation.title,
    categorie: formation.category,
    ...(formation.duration ? { duree: formation.duration } : {}),
  };
  const facts = [
    formation.duration && { icon: Clock, label: "Durée", value: formation.duration },
    formation.level && { icon: Signal, label: "Niveau", value: formation.level },
    formation.price && { icon: Wallet, label: "Tarif", value: formation.price },
    {
      icon: Award,
      label: "Validation",
      value: formation.certifying ? "Certificat reconnu" : "Attestation de formation",
    },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
    <>
      {/* HÉROS : l'image de la formation en fond, titre en surimpression. */}
      <section className="theme-dark relative isolate flex min-h-[70vh] items-end overflow-hidden bg-navy-deep md:min-h-[78vh]">
        <img
          src={formationImage(formation.imageUrl, formation.category, formation.slug)}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{ animation: "ken-burns 14s ease-out both" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep via-navy-deep/45 to-navy-deep/5" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/60 via-navy-deep/10 to-transparent" />

        <div className="container mx-auto px-4 pt-24 pb-14 md:pb-20">
          <Link
            to="/formations"
            hash="catalogue"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> Toutes les formations
          </Link>
          <div className="animate-fade-in-up">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full gradient-cyan px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase">
                <Tag className="h-3 w-3" /> {formation.category}
              </span>
              {formation.certifying && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <BadgeCheck className="h-3.5 w-3.5" /> Certifiante
                </span>
              )}
            </div>
            <h1 className="max-w-4xl font-display text-3xl leading-[1.08] font-extrabold text-white md:text-5xl lg:text-6xl">
              {formation.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">
              {summary(formation, 240)}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              {facts.slice(0, 3).map((f) => (
                <span key={f.label} className="flex items-center gap-1.5">
                  <f.icon className="h-4 w-4 text-cyan-glow" /> {f.value}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/pre-inscription"
                search={preRegistration}
                className="inline-flex h-12 items-center gap-2 rounded-full gradient-cyan px-6 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                Je me pré-inscris <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/devis"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Former mon équipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section className="pt-14!">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-14">
          <div className="min-w-0 space-y-12">
            {/* Présentation */}
            <div data-reveal>
              <div className="eyebrow mb-4">Présentation</div>
              <div className="max-w-3xl space-y-4 text-foreground/85 leading-relaxed">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p) => <p key={p}>{p}</p>)
                ) : (
                  <p>
                    Une formation {formation.certifying ? "certifiante " : ""}du domaine «{" "}
                    {formation.category} », conçue pour être immédiatement utile en entreprise.
                    Contactez-nous pour recevoir le programme détaillé et les prochaines dates.
                  </p>
                )}
              </div>
            </div>

            {/* Programme */}
            {formation.program.length > 0 && (
              <div>
                <div className="eyebrow mb-4" data-reveal>
                  Programme
                </div>
                <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl" data-reveal>
                  Ce que vous allez apprendre
                </h2>
                <ol
                  className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-5 before:w-px before:bg-border"
                  data-reveal-stagger
                >
                  {formation.program.map((item, index) => (
                    <li key={item} className="relative flex gap-4">
                      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-cyan font-display text-sm font-bold text-white shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-medium shadow-card">
                        {item}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Atouts */}
            <div>
              <div className="eyebrow mb-4" data-reveal>
                Nos atouts
              </div>
              <FeatureCards items={BENEFITS} columns={3} />
            </div>
          </div>

          {/* Récapitulatif */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="theme-dark relative overflow-hidden bg-navy-deep px-6 py-5">
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan/30 blur-2xl" />
                <div className="relative text-xs font-semibold tracking-widest text-cyan-glow uppercase">
                  En bref
                </div>
                <div className="relative mt-1 font-display text-lg font-bold text-white">
                  {formation.title}
                </div>
              </div>
              <dl className="divide-y divide-border px-6">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 py-3.5">
                    <f.icon className="h-4 w-4 shrink-0 text-primary" />
                    <dt className="text-sm text-muted-foreground">{f.label}</dt>
                    <dd className="ml-auto text-right text-sm font-semibold">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="space-y-2.5 p-6 pt-2">
                <Link
                  to="/pre-inscription"
                  search={preRegistration}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full gradient-cyan text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Je me pré-inscris <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  search={{ sujet: `Formation : ${formation.title}` }}
                  hash="message"
                  className="flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
                >
                  Poser une question
                </Link>
              </div>
            </div>

            {sameCategory.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="mb-4 font-display text-base font-bold">Dans le même domaine</h2>
                <ul className="space-y-2.5">
                  {sameCategory.map((f) => (
                    <li key={f.slug}>
                      <Link
                        to="/formations/$slug"
                        params={{ slug: f.slug }}
                        className="group flex items-start gap-2 text-sm text-foreground/80 transition hover:text-primary"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="group-hover:underline">{f.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="pt-0!">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal>
            <div>
              <div className="eyebrow mb-3">À découvrir aussi</div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Formations similaires</h2>
            </div>
            <Link
              to="/formations"
              hash="catalogue"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
            >
              Tout le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {related.map((f) => (
              <FormationCard key={f.id} formation={f} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
