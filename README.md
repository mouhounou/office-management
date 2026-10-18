# Office Management

Trois applications reliées à une même API et une même base MongoDB :

| Dossier | Rôle | Technologie | Port local |
| --- | --- | --- | --- |
| `backend/` | API REST, documentation Swagger | Express 5, Mongoose | 5000 |
| `admin/` | Back-office (contenus, demandes, candidatures, comptes) | Vite, React | 5173 |
| `user/` | Site public et espace client, exporté en site statique | TanStack Start | 8080 |

```
 user/ (site + espace client) ──┐
                                ├──► backend/ (/api) ──► MongoDB
 admin/ (back-office) ──────────┘
```

## 1. Base MongoDB

Au choix :

- **MongoDB local** : `mongodb://127.0.0.1:27017/office_management`
- **MongoDB Atlas** : créez un cluster, un utilisateur de base de données, autorisez
  l'adresse IP du serveur (Network Access), puis copiez l'URI « Drivers » :
  `mongodb+srv://UTILISATEUR:MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`.
  Sans nom de base dans l'URI, l'API utilise `MONGODB_DB` (`office_management`).

Les collections et index sont créés automatiquement au premier démarrage.

## 2. API (`backend/`)

```bash
cd backend
cp .env.example .env      # renseignez MONGODB_URI et JWT_SECRET (longue chaîne aléatoire)
npm install
npm run dev               # http://localhost:5000
npm run seed:content      # facultatif : importe les formations et articles du site
```

- `CORS_ORIGIN` doit lister les adresses du site et de l'admin
  (ex. `http://localhost:8080,http://localhost:5173`), sinon le navigateur bloque les appels.
- `PUBLIC_SITE_URL` sert aux liens des emails (vérification, mot de passe oublié).
- Cloudinary (médias, pièces jointes) et SMTP (emails) sont facultatifs en local.

Vérifications :

- **http://localhost:5000/api/health** : `{"status":"ok","database":"connecté"}` quand MongoDB répond.
- **http://localhost:5000/api/docs** : documentation **Swagger** interactive (aussi accessible
  depuis `http://localhost:5000/`). Connectez-vous avec `POST /auth/login`, cliquez sur
  « Authorize » avec le jeton, puis essayez les routes. Document brut : `/api/docs.json`.

## 3. Back-office (`admin/`)

```bash
cd admin
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```

Au premier lancement, base vide : l'écran de connexion propose de **créer le premier
compte administrateur** (l'inscription se ferme ensuite ; les autres comptes se créent
depuis « Utilisateurs »). Le menu du compte donne accès à la documentation API.

## 4. Site public (`user/`)

```bash
cd user
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:8080
npm run build             # site statique dans dist/
```

Ce que le site lit et écrit dans l'API :

| Site | API |
| --- | --- |
| Formations, articles du blog, offres d'emploi, coordonnées du pied de page | `GET /api/public/formations`, `/posts`, `/offers`, `/settings` |
| Devis, pré-inscription, candidature, demandes Business Center, contact, rendez-vous, newsletter | `POST /api/public/...` |
| Espace client (inscription, connexion, mes demandes, profil) | `/api/account/...` |

Tout ce qui est publié depuis l'admin apparaît sur le site sans rebuild : les pages
pré-générées rechargent leurs données au chargement. Un rebuild n'est utile que pour
mettre à jour le référencement (HTML pré-généré) ou après une modification du code.

`VITE_API_URL` est lue **au build** : construisez le site avec l'adresse publique de l'API.

## Mise en production

1. **API** sur un hébergeur Node (Render, Railway, VPS…) : variables de `backend/.env.example`
   avec `NODE_ENV=production`, `TRUST_PROXY=1` derrière un proxy, `CORS_ORIGIN` et
   `PUBLIC_SITE_URL` aux adresses publiques, `MONGODB_URI` vers Atlas.
2. **Admin** : `npm run build` avec `VITE_API_URL=https://api.exemple.cg/api`, puis servir `admin/dist/`
   en application monopage (toute adresse inconnue renvoie `index.html`).
3. **Site** : `npm run build` avec la même `VITE_API_URL`, puis déposer `user/dist/` sur
   l'hébergement statique ; `.htaccess` (Apache) et `_redirects` (Netlify, Cloudflare Pages)
   sont fournis, y compris les redirections des anciennes adresses.
