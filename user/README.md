# Site public Office Management

TanStack Start (React 19, Vite 7), rendu côté serveur, déployé sur Cloudflare
Workers.

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
