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
L'admin (`admin/`, Vite + React) garde le token et l'envoie en `Authorization: Bearer` ; le cookie sert de repli.

Les requêtes d'écriture (POST, PATCH, PUT, DELETE) venant d'une origine absente de
`CORS_ORIGIN` sont refusées (403) : protection CSRF, le cookie étant en `SameSite=None`
en production. `/auth/login` est limité à 10 échecs par quart d'heure et par IP.

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
| Notifications | `/api/notifications` (+ `/unread-count`, `/read-all`, `/:id/read`) | unread | éditeur |
| Utilisateurs | `/api/users` (+ `/assignable`) | role, active | admin |
| Paramètres | `/api/settings`, `PUT /api/settings/:key` | — | admin |
| Statistiques | `/api/stats/dashboard`, `/api/stats/activity` | weeks | lecture |

La suppression est réservée aux admins, sauf pour la newsletter et les
notifications (éditeurs). Un changement de statut ou d'assignation sur une
demande business est automatiquement journalisé dans ses événements.

Les notifications sont vues depuis le compte connecté : celles diffusées à toute
l'équipe et celles qui lui sont adressées, chacune avec un booléen `read`
(lu / non lu par compte). Chaque dépôt du site public en crée une, avec un lien
vers la fiche à traiter dans l'admin.

Dans un `PATCH`, un champ texte facultatif envoyé vide (`""`) est effacé ; un
champ absent reste inchangé.

## Site public

Le site vitrine (`user/`) consomme `/api/public`, ouvert sans authentification.
Deux principes : en lecture, seuls les contenus **publiés** sortent, avec une
sélection de champs (ni notes internes ni données de traitement) ; en écriture,
uniquement des dépôts de formulaires, créés au statut initial `new`.

| Méthode | Route | Rôle |
| --- | --- | --- |
| GET | `/api/public/formations` · `/formations/:slug` | catalogue publié |
| GET | `/api/public/posts` · `/posts/:slug` | articles publiés |
| GET | `/api/public/offers` · `/offers/:id` | offres publiées et non expirées |
| GET | `/api/public/settings` | coordonnées, mentions légales, réseaux, signature |
| POST | `/api/public/quotes` | demande de devis |
| POST | `/api/public/pre-registrations` | pré-inscription formation |
| POST | `/api/public/business-requests` | demande du Business Center |
| POST | `/api/public/applications` | candidature |
| POST | `/api/public/messages` | message de contact |
| POST | `/api/public/appointments` | demande de rendez-vous |
| POST | `/api/public/subscribers` | inscription newsletter |

Les schémas de dépôt dérivent de ceux du back-office **moins** les champs de
traitement (`status`, `adminNotes`, assignation) : un visiteur ne peut pas
créer une demande déjà « terminée » ni écrire dans les notes internes.
Les dépôts sont limités à 20 par quart d'heure et par adresse IP.

Pensez à déclarer l'origine du site et celle de l'admin dans `CORS_ORIGIN` (`.env`) :
une origine inconnue ne reçoit pas d'en-tête CORS et ses écritures sont refusées.

En production derrière un proxy (Render, Railway, Nginx…), réglez `TRUST_PROXY=1` :
sans cela, tous les visiteurs partagent la même IP aux yeux des limites de débit.

## Espace client

Les visiteurs du site peuvent ouvrir un compte (candidat ou entreprise) sous
`/api/account`. Ces comptes (`models/Member.js`) sont **distincts** de ceux du
back-office : leurs jetons portent l'audience `member` et sont refusés par
toutes les routes de l'admin ; à l'inverse, un jeton de l'équipe n'ouvre pas
l'espace client. Cookie : `om_member`.

| Méthode | Route | Rôle |
| --- | --- | --- |
| POST | `/api/account/register` | crée le compte, ouvre la session, envoie l'email de vérification |
| POST | `/api/account/login` · `/logout` | session |
| POST | `/api/account/verify-email` | confirme l'adresse (lien valable 48 h) |
| POST | `/api/account/forgot-password` | lien de réinitialisation (1 h), réponse identique que l'adresse existe ou non |
| POST | `/api/account/reset-password` | nouveau mot de passe, invalide les autres sessions |
| GET · PATCH · DELETE | `/api/account/me` | profil ; suppression confirmée par le mot de passe |
| POST | `/api/account/change-password` · `/resend-verification` | sécurité |
| GET | `/api/account/overview` · `/requests` · `/requests/:kind/:id` | suivi des demandes |

Une demande déposée sur le site par un visiteur connecté est rattachée à son
compte (champ `member`). À la vérification de l'email, les demandes envoyées
auparavant avec la même adresse le sont aussi — jamais avant : sinon il
suffirait de s'inscrire avec l'adresse d'un autre pour lire ses demandes. Le
client ne voit ni les notes internes, ni les commentaires de l'équipe, ni
l'assignation.

Les jetons de vérification et de réinitialisation sont à usage unique et seule
leur empreinte SHA-256 est stockée. Inscription et connexion : 20 tentatives
par quart d'heure ; emails de récupération : 5. En développement sans SMTP,
les liens sont écrits dans la console de l'API (`[mail] lien de …`).

`PUBLIC_SITE_URL` (`.env`) donne la base des liens envoyés par email.

Depuis l'admin, `/api/members` liste les comptes clients et permet de les
désactiver (la session en cours est coupée) ou de les supprimer ; les demandes
restent enregistrées, simplement détachées du compte.

## Fichiers

Les téléversements passent par multer (en mémoire) puis Cloudinary
(`config/cloudinary.js`), dans le dossier `office-management/`. La suppression
d'un média ou d'une pièce jointe supprime aussi le fichier chez Cloudinary.
Images : 8 Mo max ; documents (PDF, Word, Excel, CSV) : 15 Mo max.

## Emails

Envoi via **nodemailer** (`services/mailer.js`), configuré dans `.env` :

```
EMAIL_HOST=smtp.exemple.com
EMAIL_PORT=465          # 465 = SSL implicite, 587 = STARTTLS
EMAIL_USE_TLS=true
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_FROM=             # facultatif, sinon EMAIL_HOST_USER
EMAIL_FROM_NAME=Office Management
EMAIL_ADMIN=            # destinataire des notifications internes
```

Sans `EMAIL_ADMIN`, les notifications partent vers l'email de contact des
paramètres du site : le changer dans le back-office suffit à rediriger les
alertes.

Chaque dépôt du site déclenche deux messages : un **accusé de réception** au
visiteur et une **notification à l'équipe**, dont le `Reply-To` est l'adresse du
visiteur — répondre à l'alerte écrit directement au client. S'y ajoutent le mot
de bienvenue à l'inscription newsletter et un email de suivi au contact quand
une demande business change d'état.

Un envoi qui échoue **ne fait jamais échouer la requête** : le visiteur voit sa
demande enregistrée même si le serveur de messagerie est injoignable, et l'échec
est journalisé (`[mail] échec …`). Les messages partent en arrière-plan, la
réponse HTTP ne les attend pas.

```bash
pnpm mail:check                      # teste la connexion SMTP, sans rien envoyer
pnpm mail:check --preview            # écrit un aperçu HTML de chaque email dans tmp/
pnpm mail:check --send vous@ex.cg    # envoi de test réel
```

Les gabarits (`services/email-templates.js`) sont en tableaux HTML et couleurs
hexadécimales : Outlook ignore flexbox, grid et les variables CSS.

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
