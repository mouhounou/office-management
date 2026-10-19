import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type OrbitItem = { icon: LucideIcon; label: string };

/**
 * Pastilles disposées en cercle sur un anneau qui tourne lentement (pause au
 * survol), avec un contenu libre au centre. `active` met une pastille en
 * avant ; `onSelect` rend les pastilles cliquables.
 */
export function Orbit({
  items,
  center,
  active,
  onSelect,
  showLabels = true,
  duration = 60,
  className,
}: {
  items: OrbitItem[];
  center: ReactNode;
  active?: number;
  onSelect?: (index: number) => void;
  showLabels?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    // En tournant, la boîte carrée de l'anneau déborde en diagonale : on la
    // rogne, avec une marge pour les étiquettes des pastilles.
    <div
      className={cn("orbit relative aspect-square w-full", className)}
      style={{ overflow: "clip", overflowClipMargin: "1rem" }}
    >
      {/* Cercles décoratifs */}
      <div className="absolute inset-[12%] rounded-full border border-dashed border-primary/30" />
      <div className="absolute inset-[28%] rounded-full border border-primary/10" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 flex aspect-square w-[44%] items-center justify-center">
          {center}
        </div>
      </div>

      <div
        className="orbit-ring absolute inset-[12%]"
        style={{ ["--orbit-duration" as string]: `${duration}s` }}
      >
        {items.map((item, index) => {
          const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
          const x = 50 + 50 * Math.cos(angle);
          const y = 50 + 50 * Math.sin(angle);
          const isActive = index === active;
          const Tag = onSelect ? "button" : "div";
          return (
            <div
              key={item.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <Tag
                {...(onSelect ? { type: "button" as const, onClick: () => onSelect(index) } : {})}
                aria-label={item.label}
                aria-current={onSelect ? isActive : undefined}
                className={cn(
                  "orbit-node flex flex-col items-center gap-1.5 transition duration-300",
                  onSelect && "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition duration-300 sm:h-14 sm:w-14",
                    isActive
                      ? "scale-110 gradient-cyan text-white ring-4 ring-primary/25"
                      : "border border-border bg-card text-primary",
                  )}
                >
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                {showLabels && (
                  <span className="rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap shadow-sm backdrop-blur sm:text-xs">
                    {item.label}
                  </span>
                )}
              </Tag>
            </div>
          );
        })}
      </div>
    </div>
  );
}
