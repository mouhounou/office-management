import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import logo from "@/assets/logo.png";
import { AuthScene } from "@/components/account/AuthScene";

const BENEFITS = [
  "Suivez vos devis, pré-inscriptions et candidatures",
  "Retrouvez l'historique de chaque demande",
  "Vos coordonnées pré-remplies dans les formulaires",
];

/**
 * Écran d'accès en deux panneaux. Sur grand écran, le panneau gauche (navy,
 * constellation 3D) reste fixe et seul le panneau droit, blanc, défile.
 * `compact` réduit le texte de gauche pour les formulaires longs
 * (inscription).
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
  compact = false,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      <aside className="theme-dark relative hidden h-screen flex-col justify-between overflow-hidden bg-navy-deep p-12 lg:flex">
        <AuthScene className="absolute inset-0" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-deep/90 to-transparent" />

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
          {compact ? (
            <>
              <h2 className="text-3xl leading-tight font-bold text-white">
                Rejoignez l'espace client.
              </h2>
              <p className="mt-3 text-white/70">
                Un compte, toutes vos démarches RH suivies au même endroit.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
          <p className="mt-10 text-xs text-white/40">Songolo, Pointe-Noire — Congo</p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col bg-white px-6 py-8 lg:h-screen lg:min-h-0 lg:overflow-y-auto">
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
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="mt-1 mb-8 text-sm text-muted-foreground">{description}</p>
            )}
            {children}
            {footer && (
              <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
