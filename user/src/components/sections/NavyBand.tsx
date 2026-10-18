import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Bandeau navy pleine largeur (fond du pied de page) qui rythme les pages
 * claires ; son contenu passe automatiquement en thème sombre.
 */
export function NavyBand({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "theme-dark relative scroll-mt-24 overflow-hidden bg-navy-deep py-20",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
      <div className="relative container mx-auto px-4">{children}</div>
    </section>
  );
}
