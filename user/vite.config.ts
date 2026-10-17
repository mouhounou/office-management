// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Build statique : `npm run build` produit dist/, à déposer tel quel chez
// n'importe quel hébergeur (cPanel, Netlify, Nginx, Apache…).
// - prerender : chaque page trouvée en suivant les liens devient un index.html ;
// - spa : _shell.html sert les pages non pré-générées (article de blog,
//   détail d'une demande, liens à jeton), voir public/.htaccess et _redirects.
// src/server.ts (rendu avec gestion d'erreur) sert à la pré-génération.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoSubfolderIndex: true,
      // Pages à jeton (?token=…) : leur contenu dépend du lien, on les laisse
      // à la coquille plutôt que de figer l'écran « lien incomplet ».
      filter: ({ path }: { path: string }) =>
        !["/reinitialiser-mot-de-passe", "/verifier-email"].includes(path),
    },
    // La coquille (_shell.html) est générée depuis /espace, page rendue de
    // toute façon dans le navigateur. Avec "/" (défaut), elle prendrait la
    // place de la page d'accueil ; une adresse inexistante répondrait 404.
    spa: { enabled: true, maskPath: "/espace" },
  },
  // Pas de serveur à déployer : TanStack Start pré-génère lui-même les pages.
  nitro: false,
  // Le serveur d'aperçu utilisé pour la pré-génération écoute en IPv4 : la
  // configuration Lovable impose "::" (IPv6), absent de certains environnements.
  vite: {
    preview: { host: "127.0.0.1" },
    // dist/ = le site à mettre en ligne ; le rendu serveur, utilisé seulement
    // pour pré-générer les pages, reste à part.
    environments: {
      client: { build: { outDir: "dist" } },
      ssr: { build: { outDir: ".tanstack/build-ssr" } },
    },
  },
});
