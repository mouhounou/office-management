import type { ReactNode } from "react";

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`container mx-auto px-4 py-20 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? "text-center mx-auto max-w-2xl" : ""}`}>
      {eyebrow && <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">{eyebrow}</div>}
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>}
    </div>
  );
}
