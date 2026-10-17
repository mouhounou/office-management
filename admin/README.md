# Back-office Office Management

Vite + React 19 + TypeScript, Tailwind 4, React Query, React Router. Il pilote
l'API du dossier `backend/`.

## Démarrage

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

L'API doit tourner et autoriser `http://localhost:5173` dans `CORS_ORIGIN`
(valeur par défaut). Sur une base vide, l'écran de connexion propose de créer
le premier compte, qui devient administrateur.

| Variable | Rôle |
| --- | --- |
| `VITE_API_URL` | URL de l'API, avec `/api` |
| `VITE_SITE_URL` | lien « Voir le site » de la barre latérale (défaut `http://localhost:8080`) |

```bash
npm run typecheck
npm run build            # dist/ statique, à servir avec un repli SPA vers index.html
```

## Écrans

| Écran | Chemin | Contenu |
| --- | --- | --- |
| Tableau de bord | `/` | dossiers à traiter, dépôts par semaine, suivi du Business Center, derniers dépôts, état des contenus |
| Business Center | `/business-requests` | statut, priorité, assignation (email de suivi au contact), journal et commentaires, pièces jointes |
| Devis, pré-inscriptions, candidatures, messages | `/quotes`… | fiche en lecture, statut et notes internes |
| Offres, formations, blog, entreprises, newsletter | `/offers`… | création et édition, export CSV pour la newsletter |
| Médiathèque | `/media` | téléversement (glisser-déposer), texte alternatif, copie d'URL |
| Notifications | `/notifications` | lu / non lu, message à l'équipe |
| Utilisateurs | `/users` | comptes et rôles (admin uniquement) |
| Paramètres | `/settings` | coordonnées, mentions légales, réseaux, signature, lus par le site public |

Les droits suivent les rôles de l'API : `viewer` consulte, `editor` traite et
publie, `admin` gère en plus les comptes, les paramètres et les suppressions.

## Organisation

```
src/lib/resources.tsx   description des ressources (colonnes, filtres, champs) — pendant de backend/routes/resource-definitions.js
src/lib/constants.ts    valeurs métier, identiques à backend/models/constants.js
src/lib/api.ts          client axios, jeton, erreurs normalisées
src/lib/queries.ts      hooks React Query génériques (liste, fiche, création…)
src/pages/              écrans ; ResourceListPage / ResourceDetailPage servent toutes les ressources simples
src/components/         layout (barre latérale, notifications) et composants d'interface
```

Ajouter une ressource simple : la déclarer côté API, puis l'ajouter à
`RESOURCES` dans `src/lib/resources.tsx` et à la barre latérale
(`components/layout/AppLayout.tsx`). Les écrans de liste et de fiche suivent.
