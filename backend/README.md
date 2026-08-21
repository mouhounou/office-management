# API Office Management

API Express 5 + MongoDB (Mongoose) qui alimente le back-office (`admin/`) et, à terme,
le site public (`user/`).

## Démarrage

```bash
cp .env.example .env   # puis ajustez MONGODB_URI et JWT_SECRET
pnpm install
pnpm dev               # nodemon, http://localhost:5000
```

MongoDB doit tourner localement (`mongodb://127.0.0.1:27017/office_management` par défaut).

## Authentification

Le JWT est renvoyé dans le corps de la réponse **et** posé en cookie httpOnly `om_token`.
L'admin Next stocke le token dans son propre cookie et l'envoie en `Authorization: Bearer`.

| Méthode | Route | Accès | Rôle |
| --- | --- | --- | --- |
| GET | `/api/health` | public | — |
| GET | `/api/auth/bootstrap-status` | public | indique s'il faut créer le premier compte |
| POST | `/api/auth/register` | public **tant qu'aucun compte n'existe** | crée le premier administrateur |
| POST | `/api/auth/login` | public | `{ email, password }` |
| POST | `/api/auth/logout` | public | efface le cookie |
| GET | `/api/auth/me` | authentifié | profil courant |
| PATCH | `/api/auth/me` | authentifié | `fullName`, `avatarUrl` |
| POST | `/api/auth/change-password` | authentifié | invalide les anciens tokens et en réémet un |

Rôles : `admin` > `editor` > `viewer`. Le premier compte créé est automatiquement `admin`,
puis l'inscription publique se ferme.

Sécurité : mot de passe haché en bcrypt (coût 12), jamais renvoyé ; `tokensValidFrom`
invalide tous les JWT antérieurs à un changement de mot de passe ; message de connexion
volontairement identique que l'email existe ou non.

## Documentation

- **http://localhost:5000/api/docs** — Swagger UI. Appelez `POST /auth/login`,
  copiez le `token`, cliquez sur « Authorize », puis essayez n'importe quelle
  route directement depuis le navigateur (le jeton est conservé d'une visite à
  l'autre).
- **http://localhost:5000/api/docs.json** — document OpenAPI 3.1 brut, à importer
  dans Postman/Insomnia ou à donner à un générateur de client.

Le document n'est pas écrit à la main : il est construit au démarrage à partir
des définitions de ressources (`routes/resource-definitions.js`) et des schémas
Zod de validation, convertis en JSON Schema. Ajouter un champ à un schéma ou une
ressource à la liste le fait apparaître dans la documentation sans autre geste.

```bash
pnpm docs:check   # l'API doit tourner
```

Ce contrôle interroge l'API réelle : il vérifie que chacune des opérations
documentées existe bien et qu'elle refuse les appels anonymes lorsqu'elle est
annoncée comme protégée. Les requêtes sont inoffensives (identifiants
inexistants, corps vides) et le script sort en code 1 au moindre écart.

## Ressources

Toutes les listes acceptent `?q=` (recherche), `?page=` / `?limit=` (pagination,
100 max), `?sort=champ` ou `?sort=-champ`, plus les filtres propres à chaque
ressource. Elles répondent `{ items, page, limit, total, pages }` ; une fiche
répond `{ item }`.

| Ressource | Chemin | Filtres | Écriture |
| --- | --- | --- | --- |
| Demandes business | `/api/business-requests` | status, type, priority, assignedTo | éditeur |
| Journal d'une demande | `/api/business-requests/:id/events` | — | éditeur |
| Pièces jointes | `/api/business-requests/:id/documents` | — | éditeur |
| Devis | `/api/quotes` | status, pole | éditeur |
| Pré-inscriptions | `/api/pre-registrations` | status, training, financingType | éditeur |
| Offres & stages | `/api/offers` | published, contractType, sector | éditeur |
| Candidatures | `/api/applications` | status, offer | éditeur |
| Formations | `/api/formations` | published, category, certifying | éditeur |
| Blog | `/api/posts` | published, category, featured | éditeur |
| Médiathèque | `/api/media` | folder, mimeType | éditeur |
| Entreprises | `/api/companies` | sector, city | éditeur |
| Newsletter | `/api/subscribers` (+ `/export/csv`) | active, source | éditeur |
| Notifications | `/api/notifications` | type, user | éditeur |
| Utilisateurs | `/api/users` (+ `/assignable`) | role, active | admin |
| Paramètres | `/api/settings`, `PUT /api/settings/:key` | — | admin |
| Statistiques | `/api/stats/dashboard` | — | lecture |

La suppression est réservée aux admins, sauf pour la newsletter et les
notifications (éditeurs). Un changement de statut ou d'assignation sur une
demande business est automatiquement journalisé dans ses événements.

## Fichiers

Les téléversements passent par multer (en mémoire) puis Cloudinary
(`config/cloudinary.js`), dans le dossier `office-management/`. La suppression
d'un média ou d'une pièce jointe supprime aussi le fichier chez Cloudinary.
Images : 8 Mo max ; documents (PDF, Word, Excel, CSV) : 15 Mo max.

## Jeux de données

```bash
pnpm seed:content        # importe les 44 formations et 9 articles du site public
pnpm seed:demo           # données de démonstration fictives (@exemple.cg)
pnpm seed:demo --reset   # les supprime puis les recrée
```

## Structure

```
config/       env (dotenv + validation) et connexion Mongo
models/       schémas Mongoose
controllers/  logique métier + schémas Zod
routes/       déclaration des endpoints
middlewares/  protect / authorize, validate(zod), gestion d'erreurs
utils/        JWT, ApiError, asyncHandler
app.js        montage Express (cors, json, cookies, routes)
server.js     connexion DB puis écoute
```

Toutes les erreurs sortent au même format : `{ "error": { "message": "…", "details": [...] } }`.
