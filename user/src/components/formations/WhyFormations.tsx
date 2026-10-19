import { Award, BadgeCheck, MonitorPlay, Rocket, Sparkles, UserCheck } from "lucide-react";

import { Section } from "@/components/Section";

const ADVANTAGES = [
  { icon: BadgeCheck, t: "Formations pratiques et professionnelles" },
  { icon: UserCheck, t: "Encadrement par des experts" },
  { icon: Award, t: "Certificats et diplômes reconnus" },
  { icon: Rocket, t: "Stages et accompagnement professionnel" },
  { icon: MonitorPlay, t: "Disponibles en présentiel et en ligne" },
  { icon: Sparkles, t: "Programmes actualisés selon le marché" },
];

/** Salle de classe animée : la formatrice présente, un apprenant lève la main. */
function ClassroomScene() {
  const skin = "fill-[oklch(0.42_0.06_50)]";
  return (
    <svg viewBox="0 0 260 200" className="doc-scene h-full w-full" aria-hidden>
      {/* Tableau */}
      <rect x="96" y="18" width="140" height="86" rx="6" className="fill-white" />
      <rect x="110" y="30" width="44" height="6" rx="3" className="fill-navy/30" />
      <polyline
        points="112,90 136,72 158,80 182,54 220,40"
        className="ds-line fill-none stroke-cyan"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="220" cy="40" r="5" className="ds-twinkle fill-cyan-glow" />
      {/* Formatrice */}
      <g className="ds-float">
        <path
          d="M42 52 q14 -24 28 0 q2 14 -4 20 q-10 -16 -20 0 q-6 -6 -4 -20"
          className="fill-navy-deep"
        />
        <circle cx="56" cy="52" r="13" className={skin} />
        <path d="M44 48 q12 -12 24 0 q-4 -8 -12 -8 q-8 0 -12 8" className="fill-navy-deep" />
        <path d="M36 122 q0 -44 20 -48 q20 4 20 48 Z" className="fill-cyan" />
        <g className="ds-point">
          <path d="M68 84 L98 64" className="stroke-cyan" strokeWidth="8" strokeLinecap="round" />
          <circle cx="100" cy="63" r="5" className={skin} />
        </g>
      </g>
      {/* Apprenants, vus de dos */}
      {[70, 130, 190].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x - 26} 200 q0 -34 26 -38 q26 4 26 38 Z`}
            className={i === 1 ? "fill-navy" : "fill-navy/80"}
          />
          <circle cx={x} cy={150} r="14" className="fill-navy-deep" />
          {i === 2 && (
            <g className="ds-raise">
              <path
                d={`M${x + 20} 170 L${x + 30} 128`}
                className="stroke-navy"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <circle cx={x + 31} cy={124} r="5" className={skin} />
            </g>
          )}
        </g>
      ))}
      {/* Idée */}
      <g className="ds-pop">
        <circle cx="236" cy="128" r="12" className="fill-cyan-glow" />
        <path d="M232 142 h8" className="stroke-white" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * « Pourquoi nous choisir » : une scène animée et une liste dont les points se
 * cochent l'un après l'autre au défilement (au lieu d'une grille de cartes).
 */
export function WhyFormations() {
  return (
    <Section className="pt-0!">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className="theme-dark relative order-last overflow-hidden rounded-3xl bg-gradient-to-br from-navy-deep via-navy to-[oklch(0.34_0.08_235)] p-6 shadow-card lg:order-first"
          data-reveal="left"
        >
          <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-cyan/25 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative aspect-[13/10]">
            <ClassroomScene />
          </div>
          <div className="relative mt-2 flex flex-wrap gap-2">
            {["Cas réels", "Formateurs experts", "Suivi individuel"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow mb-4" data-reveal>
            Pourquoi nous choisir
          </div>
          <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl" data-reveal>
            Des formations pensées pour <span className="text-gradient-cyan">l'emploi</span>
          </h2>
          <ul className="mt-8 space-y-3" data-reveal-stagger>
            {ADVANTAGES.map((a) => (
              <li
                key={a.t}
                className="group flex items-center gap-4 rounded-2xl border border-transparent px-3 py-2.5 transition hover:border-border hover:bg-card hover:shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong transition group-hover:bg-primary group-hover:text-white">
                  <a.icon className="h-5 w-5" />
                </span>
                <span className="flex-1 font-medium">{a.t}</span>
                <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden>
                  <circle cx="12" cy="12" r="11" className="fill-primary/10" />
                  <path
                    d="M7 12.5l3.2 3.2L17 9"
                    className="why-check fill-none stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
