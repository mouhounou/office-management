import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import logo from "@/assets/logo.png";

const BENEFITS = [
  "Suivez vos devis, pré-inscriptions et candidatures",
  "Retrouvez l'historique de chaque demande",
  "Vos coordonnées pré-remplies dans les formulaires",
];

/** Écran d'accès en deux panneaux, comme la connexion du back-office. */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="theme-dark grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-deep p-12 lg:flex">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full border-[28px] border-cyan/10" />
        <Link to="/" className="relative flex items-center gap-3">
          <img
            src={logo}
            alt=""
            className="h-11 w-11 rounded-xl bg-white p-1"
            width={44}
            height={44}
          />
          <div>
            <div className="font-display text-lg font-bold tracking-wider text-cyan uppercase">
              Office Management
            </div>
            <div className="text-xs tracking-[0.25em] text-white/60 uppercase">Espace client</div>
          </div>
        </Link>
        <div className="relative max-w-md">
          <h2 className="text-4xl leading-tight font-bold text-white">
            Toutes vos démarches RH, au même endroit.
          </h2>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan" /> {benefit}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/40">Songolo, Pointe-Noire — Congo</p>
      </div>

      <div className="flex flex-col px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au site
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <img
              src={logo}
              alt=""
              className="mb-8 h-12 w-12 rounded-xl lg:hidden"
              width={48}
              height={48}
            />
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="mt-1 mb-8 text-sm text-muted-foreground">{description}</p>
            )}
            {children}
            {footer && (
              <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
