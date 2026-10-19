import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ShowcaseService = {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
  to: string;
  hash?: string;
};

/** Durée d'affichage de chaque service avant de passer au suivant. */
const STEP_MS = 6000;

/**
 * Vitrine des services de l'accueil : une liste à gauche, une grande image à
 * droite qui change en fondu. Défilement automatique (barre de progression),
 * mis en pause au survol ; un clic choisit directement un service.
 */
export function ServicesShowcase({ services }: { services: ShowcaseService[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      data-reveal
    >
      {/* Image et texte du service actif, en fondu enchaîné. */}
      <div className="relative order-first min-h-[360px] overflow-hidden rounded-3xl bg-navy-deep shadow-card sm:min-h-[440px] lg:order-last lg:min-h-[520px]">
        {services.map((service, index) => {
          const isActive = index === active;
          return (
            <div
              key={service.title}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <img
                src={service.image}
                alt=""
                className="h-full w-full object-cover"
                style={
                  isActive
                    ? { animation: `ken-burns ${STEP_MS + 1500}ms ease-out both` }
                    : undefined
                }
                loading={index === 0 ? "eager" : "lazy"}
                width={960}
                height={720}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 p-6 text-white transition duration-700 sm:p-8",
                  isActive ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0",
                )}
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-cyan">
                  <service.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">{service.title}</h3>
                <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">{service.desc}</p>
                <Link
                  to={service.to}
                  hash={service.hash}
                  tabIndex={isActive ? 0 : -1}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-deep transition hover:bg-cyan-glow"
                >
                  Découvrir <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Liste des services : sélection et progression. */}
      <ol className="flex flex-col gap-2" aria-label="Nos services">
        {services.map((service, index) => {
          const isActive = index === active;
          return (
            <li key={service.title}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={isActive}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition duration-300",
                  isActive
                    ? "border-primary/30 bg-card shadow-card"
                    : "border-transparent hover:border-border hover:bg-card/60",
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-display text-sm font-bold tabular-nums transition-colors",
                      isActive ? "text-brand-strong" : "text-muted-foreground/60",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-300",
                      isActive
                        ? "gradient-cyan text-white"
                        : "bg-accent text-primary group-hover:scale-110",
                    )}
                  >
                    <service.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display font-bold">{service.title}</span>
                  <ArrowRight
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0 transition duration-300",
                      isActive
                        ? "translate-x-0 text-primary opacity-100"
                        : "-translate-x-2 opacity-0",
                    )}
                  />
                </div>
                {isActive && (
                  <span
                    key={active}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left gradient-cyan"
                    style={{
                      animation: `progress-fill ${STEP_MS}ms linear both`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={() => setActive((current) => (current + 1) % services.length)}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
