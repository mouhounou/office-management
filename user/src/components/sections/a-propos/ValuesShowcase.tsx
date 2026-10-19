import { useState } from "react";
import type { LucideIcon } from "lucide-react";

import { Orbit } from "@/components/Orbit";
import { cn } from "@/lib/utils";

const STEP_MS = 5000;

/**
 * Valeurs : une roue où chaque valeur gravite, synchronisée avec une liste
 * qui avance seule (barre de progression, pause au survol). Un clic sur la
 * roue ou dans la liste choisit une valeur.
 */
export function ValuesShowcase({ values }: { values: { i: LucideIcon; t: string; d: string }[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = values[active];

  return (
    <div
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-md" data-reveal="left">
        <Orbit
          items={values.map((v) => ({ icon: v.i, label: v.t }))}
          active={active}
          onSelect={setActive}
          showLabels={false}
          duration={80}
          center={
            <div
              key={active}
              className="flex h-full w-full animate-fade-in-up flex-col items-center justify-center rounded-full gradient-cyan p-4 text-center text-white shadow-2xl ring-8 ring-primary/15"
            >
              <current.i className="mb-2 h-8 w-8" />
              <span className="font-display text-sm font-bold sm:text-base">{current.t}</span>
            </div>
          }
        />
      </div>

      <ol className="space-y-2" data-reveal-stagger>
        {values.map((v, index) => {
          const isActive = index === active;
          return (
            <li key={v.t}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={isActive}
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition duration-300",
                  isActive
                    ? "border-primary/30 bg-card shadow-card"
                    : "border-transparent hover:border-border hover:bg-card/60",
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-display text-sm font-bold tabular-nums",
                      isActive ? "text-brand-strong" : "text-muted-foreground/60",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-bold">{v.t}</span>
                </div>
                <div
                  className={cn(
                    "grid transition-all duration-500",
                    isActive ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <p className="overflow-hidden pl-9 text-sm leading-relaxed text-muted-foreground">
                    {v.d}
                  </p>
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
                    onAnimationEnd={() => setActive((i) => (i + 1) % values.length)}
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
