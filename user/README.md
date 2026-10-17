# Site public Office Management

TanStack Start (React 19, Vite 7), publié en **site statique** : chaque page est
pré-générée en HTML au build, puis l'application prend le relais dans le
navigateur.

## Démarrage

```bash
npm install
npm run dev     # http://localhost:8080 (8081 si le port est pris)
```

L'API (`../backend`) doit tourner : le site y lit ses contenus et y dépose ses
formulaires.

```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

## Build et mise en ligne

```bash
npm install --legacy-peer-deps
npm run build       # produit dist/
```

`dist/` est le site complet, à déposer tel quel chez n'importe quel hébergeur
statique (cPanel, Netlify, Nginx, Apache…) :

- une page `index.html` par adresse (`/`, `/blog/…`, `/formations`, `/contact`…) ;
- `_shell.html` (et sa copie `404.html`) : la coquille de l'application, servie
  pour les adresses non pré-générées — article publié après le build, détail
  d'une demande, liens de vérification et de réinitialisation ;
- `.htaccess` (Apache / cPanel) et `_redirects` (Netlify, Cloudflare Pages)
  font déjà ce renvoi vers `_shell.html`. Avec Nginx :
  `try_files $uri $uri/ /_shell.html;`.

Points à connaître :

- **`VITE_API_URL` est figée au build** : pointez-la vers l'API de production
  avant `npm run build`, et déclarez l'adresse du site dans `CORS_ORIGIN` côté API.
- **L'API doit répondre pendant le build** pour que les articles du blog et les
  formations soient pré-générés (sinon les pages sont générées vides et se
  remplissent dans le navigateur).
- Les contenus sont relus auprès de l'API à chaque visite : un article publié
  ou des coordonnées modifiées dans l'admin apparaissent sans nouveau build.
  Un nouveau build reste utile pour le référencement des nouveaux articles.

## Connexion à l'API

Tout passe par `/api/public`, la partie ouverte de l'API — aucun jeton n'est
manipulé côté site.

| Module | Fichier | Rôle |
| --- | --- | --- |
| Client HTTP | [src/lib/api.ts](src/lib/api.ts) | instance axios, erreurs normalisées (`ApiError`), message clair sur 429 et API injoignable |
| Contenus | [src/lib/content.ts](src/lib/content.ts) | formations, articles, offres, paramètres du site |
| Formulaires | [src/lib/submissions.ts](src/lib/submissions.ts) | devis, pré-inscription, demande business, candidature, contact, rendez-vous, newsletter |

**Contenus administrés** : le catalogue de formations, les articles du blog et
les coordonnées du pied de page viennent de l'API. Ce qui est dépublié dans le
back-office disparaît du site. Les images restent locales tant qu'aucune n'est
renseignée en administration (repli par catégorie, voir
[src/lib/content-images.ts](src/lib/content-images.ts)).

**Validation** : les formulaires vérifient la saisie côté navigateur, puis l'API
revalide et renvoie ses erreurs par champ, réaffichées telles quelles.

## Espace client

Les visiteurs peuvent créer un compte (candidat ou entreprise) et suivre leurs
demandes. Même design que le back-office, sans l'en-tête ni le pied du site.

| Page | Chemin |
| --- | --- |
| Connexion · inscription | `/connexion`, `/inscription` |
| Compte perdu | `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe?token=…` |
| Confirmation de l'email | `/verifier-email?token=…` |
| Tableau de bord | `/espace` |
| Mes demandes (liste, détail et suivi) | `/espace/demandes`, `/espace/demandes/:type/:id` |
| Nouvelle demande · profil · sécurité | `/espace/nouvelle-demande`, `/espace/profil`, `/espace/securite` |

- Session : [src/lib/account-context.tsx](src/lib/account-context.tsx) ; appels :
  [src/lib/account.ts](src/lib/account.ts). Le jeton est gardé dans le
  navigateur et lu après l'hydratation (le rendu serveur ne connaît pas le
  visiteur).
- Un visiteur connecté voit ses coordonnées pré-remplies dans les formulaires
  (devis, pré-inscription, contact, rendez-vous, recrutement, Business Center)
  et ses dépôts sont rattachés à son compte.
- L'en-tête du site affiche « Mon espace » ou « Connexion ».

## Points d'attention

- Le rendu serveur impose que le premier rendu soit identique des deux côtés :
  l'interface démarre donc toujours en français, et la langue du visiteur est
  appliquée après l'hydratation ([src/i18n/index.ts](src/i18n/index.ts)).
- En développement, la console affiche un écart d'attributs `data-tsd-source` :
  il vient du marqueur de composants de Lovable et n'existe pas en production.
