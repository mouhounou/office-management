import { useState } from "react";
import { Building2, GraduationCap, Handshake, Quote, TrendingUp, UserSearch } from "lucide-react";

import logo from "@/assets/logo.png";
import { Orbit } from "@/components/Orbit";
import { cn } from "@/lib/utils";

import { Section, SectionTitle } from "@/components/Section";

/** Ce que la marque inspire à chacun de ses publics (ex-pages « Notre histoire » et « Écosystème »). */
const AUDIENCES = [
  {
    icon: Building2,
    title: "Pour un dirigeant d'entreprise",
    quote:
      "« Ce cabinet est capable d'accompagner la transformation de notre organisation et de renforcer notre capital humain. »",
  },
  {
    icon: GraduationCap,
    title: "Pour un candidat",
    quote:
      "« Ici, je peux développer mes compétences, trouver des opportunités professionnelles et construire ma carrière. »",
  },
  {
    icon: Handshake,
    title: "Pour un partenaire ou une institution",
    quote:
      "« Office Management est une organisation structurée, crédible, innovante et tournée vers l'excellence. »",
  },
];

const PUBLICS = [
  { icon: Building2, title: "Les entreprises", text: "Pour recruter les meilleurs talents." },
  { icon: GraduationCap, title: "Les étudiants", text: "Pour apprendre et se certifier." },
  {
    icon: UserSearch,
    title: "Les candidats",
    text: "Pour trouver un emploi à la hauteur de leurs ambitions.",
  },
  { icon: Handshake, title: "Les partenaires", text: "Pour collaborer et co-construire." },
  { icon: TrendingUp, title: "Les investisseurs", text: "Pour faire confiance à la marque." },
];

/** Citations qui se succèdent en fondu (pause au survol), puces cliquables. */
function QuoteCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card md:p-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-reveal
    >
      <Quote className="pointer-events-none absolute -top-2 right-6 h-28 w-28 text-primary/10" />
      <div className="relative grid min-h-[12rem] sm:min-h-[9rem] md:min-h-[7.5rem]">
        {AUDIENCES.map((a, index) => (
          <figure
            key={a.title}
            aria-hidden={index !== active}
            className={cn(
              "col-start-1 row-start-1 transition duration-700 ease-out",
              index === active
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0",
            )}
          >
            <blockquote className="max-w-3xl font-display text-xl leading-snug font-semibold md:text-2xl">
              {a.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-sm font-semibold text-brand-strong">
              <span className="flex h-10 w-10 items-center justify-center rounded-full gradient-cyan text-white">
                <a.icon className="h-5 w-5" />
              </span>
              {a.title}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="relative mt-8 flex items-center gap-2">
        {AUDIENCES.map((a, index) => (
          <button
            key={a.title}
            type="button"
            onClick={() => setActive(index)}
            aria-label={a.title}
            aria-current={index === active}
            className={cn(
              "relative h-1.5 overflow-hidden rounded-full bg-primary/15 transition-all duration-500",
              index === active ? "w-16" : "w-6 hover:bg-primary/30",
            )}
          >
            {index === active && (
              <span
                key={active}
                className="absolute inset-0 origin-left gradient-cyan"
                style={{
                  animation: "progress-fill 6s linear both",
                  animationPlayState: paused ? "paused" : "running",
                }}
                onAnimationEnd={() => setActive((current) => (current + 1) % AUDIENCES.length)}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AboutHistory() {
  return (
    <Section id="histoire" className="scroll-mt-24">
      <SectionTitle
        eyebrow="Notre histoire"
        title="Trois regards, une même conviction"
        subtitle="Plus qu'un centre de formation ou un cabinet RH : une plateforme au service de tous les acteurs du monde du travail."
      />
      <QuoteCarousel />

      {/* Écosystème : les cinq publics en orbite autour d'Office Management. */}
      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="eyebrow mb-3" data-reveal>
            Une plateforme, cinq publics
          </div>
          <h3 className="font-display text-2xl font-bold md:text-3xl" data-reveal>
            Un écosystème complet
          </h3>
          <p className="mt-3 max-w-md text-muted-foreground" data-reveal>
            Une plateforme nationale de développement des compétences, de recrutement et de
            performance organisationnelle.
          </p>
          <ul className="mt-6 space-y-3" data-reveal-stagger>
            {PUBLICS.map((p) => (
              <li key={p.title} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                  <p.icon className="h-4 w-4" />
                </span>
                <span className="text-sm">
                  <span className="font-semibold">{p.title}</span>{" "}
                  <span className="text-muted-foreground">— {p.text.toLowerCase()}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md" data-reveal>
          <Orbit
            items={PUBLICS.map((p) => ({ icon: p.icon, label: p.title.replace(/^Les /, "") }))}
            center={
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-navy-deep p-4 text-center shadow-2xl ring-8 ring-primary/10">
                <img
                  src={logo}
                  alt=""
                  className="mb-2 h-12 w-12 rounded-xl bg-white p-1"
                  width={48}
                  height={48}
                />
                <span className="font-display text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
                  Office Management
                </span>
              </div>
            }
          />
        </div>
      </div>
    </Section>
  );
}
