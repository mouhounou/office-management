import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Classes communes des cartes blanches de la page Services. */
export const CARD = "rounded-2xl border border-border bg-card shadow-card";

/** Bloc « texte + image » utilisé pour présenter un pôle. */
export function ServiceHero({
  id,
  eyebrow,
  title,
  desc,
  image,
  reverse,
  bullets,
  cta = { to: "/devis", label: "Demander un devis" },
}: {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  reverse?: boolean;
  bullets: string[];
  cta?: { to: "/devis" | "/contact"; label: string };
}) {
  return (
    <section id={id} className="container mx-auto scroll-mt-24 overflow-x-clip px-4 py-16 md:py-20">
      <div
        className={`grid items-center gap-12 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <div>
          <div className="eyebrow mb-3">{eyebrow}</div>
          <h2 className="mb-5 font-display text-3xl font-bold md:text-5xl">{title}</h2>
          <p className="mb-6 text-muted-foreground">{desc}</p>
          <ul className="mb-8 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="gradient-cyan text-primary-foreground glow-cyan">
            <Link to={cta.to}>
              {cta.label} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-primary/15 blur-3xl" />
          <img
            src={image}
            alt={title}
            className="relative w-full rounded-2xl shadow-elegant"
            loading="lazy"
            width={1280}
            height={800}
          />
        </div>
      </div>
    </section>
  );
}
