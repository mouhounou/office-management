import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import "@/i18n";
import "@/lib/zod-fr";
import { fetchSettings, type SiteSettings } from "@/lib/content";
import legacyRedirects from "@/lib/legacy-redirects.json";

function NotFoundComponent() {
  // Ancienne page regroupée dans une section : l'hébergeur redirige
  // normalement (_redirects, .htaccess) ; à défaut, on redirige ici.
  const { pathname } = useLocation();
  const target = (legacyRedirects as Record<string, string>)[pathname.replace(/\/+$/, "")];
  useEffect(() => {
    if (target) window.location.replace(target);
  }, [target]);
  if (target) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-24">
        <div className="max-w-md text-center">
          <span className="eyebrow">Erreur 404</span>
          <h1 className="mt-4 font-display text-7xl font-extrabold text-gradient-cyan">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center rounded-full gradient-cyan px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Retour à l'accueil
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue de notre côté. Réessayez ou revenez à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async (): Promise<{ settings: SiteSettings | null }> => ({
    settings: await fetchSettings().catch(() => null),
  }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Office Management — HR Consulting & Formation Professionnelle" },
      {
        name: "description",
        content:
          "Cabinet conseil RH à Pointe-Noire : formation professionnelle, mise à disposition de personnel, prestations techniques et conseil RH.",
      },
      { name: "author", content: "Office Management" },
      {
        property: "og:title",
        content: "Office Management — HR Consulting & Formation Professionnelle",
      },
      {
        property: "og:description",
        content:
          "Cabinet conseil RH à Pointe-Noire : formation professionnelle, mise à disposition de personnel, prestations techniques et conseil RH.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      {
        name: "twitter:title",
        content: "Office Management — HR Consulting & Formation Professionnelle",
      },
      {
        name: "twitter:description",
        content:
          "Cabinet conseil RH à Pointe-Noire : formation professionnelle, mise à disposition de personnel, prestations techniques et conseil RH.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/XoN8ePfAbBeo6raNw03pC6tbY7W2/social-images/social-1778366559215-EC7456EE-222F-4157-AE27-17C94E750054.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/XoN8ePfAbBeo6raNw03pC6tbY7W2/social-images/social-1778366559215-EC7456EE-222F-4157-AE27-17C94E750054.webp",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { AccountProvider } from "@/lib/account-context";

declare global {
  interface Window {
    /** Posé par scripts/postbuild.mjs dans _shell.html et 404.html. */
    __OM_SHELL__?: boolean;
  }
}

// Espace client et pages d'accès : plein écran, sans l'en-tête ni le pied du site.
const APP_PATHS = [
  "/espace",
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
  "/verifier-email",
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Le rendu serveur est toujours en français : on bascule sur la langue du
  // visiteur après l'hydratation, sans provoquer d'écart serveur/client.
  const router = useRouter();
  useEffect(() => {
    // Site statique : les pages sont pré-générées au build. On relit les
    // données de l'API (coordonnées, blog, formations) pour afficher l'état
    // à jour, sans attendre le prochain build.
    void router.invalidate();
  }, [router]);

  const { pathname } = useLocation();
  // Page servie par la coquille (_shell.html, générée depuis /espace) : le
  // premier rendu doit reproduire celui de la coquille, sans en-tête ni pied,
  // sinon React signale un écart d'hydratation. La vraie mise en page suit.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const fromShell = typeof window !== "undefined" && window.__OM_SHELL__ === true;
  const appLayout =
    (fromShell && !hydrated) ||
    APP_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <QueryClientProvider client={queryClient}>
      <AccountProvider>
        {appLayout ? (
          <Outlet />
        ) : (
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        )}
        <Toaster richColors position="top-right" />
      </AccountProvider>
    </QueryClientProvider>
  );
}
