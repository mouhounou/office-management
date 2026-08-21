const { z } = require("zod");

const { RESOURCES } = require("../routes/resource-definitions");
const schemas = require("../validators");
const C = require("../models/constants");
const { port } = require("../config/env");
const { buildPublicPaths } = require("./public-paths");

/**
 * Document OpenAPI 3.1 construit à partir des mêmes sources que l'API :
 * les définitions de ressources (routes/resource-definitions.js) et les schémas
 * Zod de validation. Aucune annotation à maintenir en parallèle : ajouter un
 * champ à un schéma Zod le fait apparaître ici automatiquement.
 */

/**
 * Zod → JSON Schema en mode "input" : c'est ce que le client envoie, avant les
 * transformations (dates converties, cases à cocher normalisées…).
 * `unrepresentable: "any"` évite de faire échouer la génération sur un
 * transform que JSON Schema ne sait pas décrire.
 */
function jsonSchema(schema) {
  const generated = z.toJSONSchema(schema, { io: "input", unrepresentable: "any" });
  delete generated.$schema;
  return generated;
}

const ERROR_SCHEMA = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        message: { type: "string", example: "Données invalides" },
        details: {
          type: "array",
          description: "Erreurs par champ, renvoyées par la validation.",
          items: {
            type: "object",
            properties: {
              field: { type: "string", example: "email" },
              message: { type: "string", example: "Email invalide" },
            },
          },
        },
      },
    },
  },
};

const USER_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", example: "6a84cba2d676f25187985aa3" },
    fullName: { type: "string" },
    email: { type: "string", format: "email" },
    role: { type: "string", enum: ["admin", "editor", "viewer"] },
    active: { type: "boolean" },
    avatarUrl: { type: ["string", "null"] },
    lastLoginAt: { type: ["string", "null"], format: "date-time" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

/** Enveloppe de liste paginée, commune à toutes les ressources. */
function listSchema(itemRef) {
  return {
    type: "object",
    properties: {
      items: { type: "array", items: itemRef },
      page: { type: "integer", example: 1 },
      limit: { type: "integer", example: 20 },
      total: { type: "integer", example: 42 },
      pages: { type: "integer", example: 3 },
    },
  };
}

const COMMON_QUERY = [
  {
    name: "q",
    in: "query",
    description: "Recherche plein texte sur les champs principaux de la ressource.",
    schema: { type: "string" },
  },
  { name: "page", in: "query", description: "Page (à partir de 1).", schema: { type: "integer", minimum: 1, default: 1 } },
  {
    name: "limit",
    in: "query",
    description: "Éléments par page (100 maximum).",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
  },
];

function sortParam(sortFields) {
  return {
    name: "sort",
    in: "query",
    description: "Champ de tri ; préfixer par `-` pour décroissant.",
    schema: {
      type: "string",
      enum: sortFields.flatMap((field) => [field, `-${field}`]),
      default: "-createdAt",
    },
  };
}

function filterParams(filters = []) {
  return filters.map((filter) => ({
    name: filter.name,
    in: "query",
    description: filter.description,
    schema:
      filter.type === "boolean"
        ? { type: "string", enum: ["true", "false"] }
        : { type: "string", ...(filter.enum ? { enum: filter.enum } : {}) },
  }));
}

const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "Identifiant MongoDB (24 caractères hexadécimaux).",
  schema: { type: "string", pattern: "^[0-9a-f]{24}$" },
};

const RESPONSES = {
  400: { description: "Données invalides", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
  401: { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
  403: { description: "Accès refusé (rôle insuffisant)", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
  404: { description: "Ressource introuvable", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
  409: { description: "Conflit (valeur déjà utilisée)", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
};

const json = (schema) => ({ content: { "application/json": { schema } } });
const body = (schemaRef, required = true) => ({
  required,
  content: { "application/json": { schema: schemaRef } },
});

/** Génère les deux chemins (collection et élément) d'une ressource CRUD. */
function resourcePaths(definition) {
  const { path, tag, singular, description, filters, sortFields } = definition;
  const createRef = { $ref: `#/components/schemas/${componentName(path, "Create")}` };
  const updateRef = { $ref: `#/components/schemas/${componentName(path, "Update")}` };
  const itemRef = { type: "object", additionalProperties: true };
  const deleteRole = definition.deleteRole === "editor" ? "éditeur ou admin" : "admin";

  return {
    [`/${path}`]: {
      get: {
        tags: [tag],
        summary: `Lister les ${plural(singular)}`,
        description,
        parameters: [...COMMON_QUERY, sortParam(sortFields), ...filterParams(filters)],
        responses: {
          200: { description: "Liste paginée", ...json(listSchema(itemRef)) },
          401: RESPONSES[401],
        },
      },
      post: {
        tags: [tag],
        summary: `Créer une ${singular}`,
        description: "Réservé aux rôles éditeur et administrateur.",
        requestBody: body(createRef),
        responses: {
          201: { description: "Créée", ...json({ type: "object", properties: { item: itemRef } }) },
          400: RESPONSES[400],
          401: RESPONSES[401],
          403: RESPONSES[403],
          409: RESPONSES[409],
        },
      },
    },
    [`/${path}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Détail d'une ${singular}`,
        parameters: [idParam],
        responses: {
          200: { description: "Fiche", ...json({ type: "object", properties: { item: itemRef } }) },
          401: RESPONSES[401],
          404: RESPONSES[404],
        },
      },
      patch: {
        tags: [tag],
        summary: `Modifier une ${singular}`,
        description: "Mise à jour partielle : seuls les champs envoyés sont modifiés.",
        parameters: [idParam],
        requestBody: body(updateRef),
        responses: {
          200: { description: "Mise à jour", ...json({ type: "object", properties: { item: itemRef } }) },
          400: RESPONSES[400],
          401: RESPONSES[401],
          403: RESPONSES[403],
          404: RESPONSES[404],
        },
      },
      delete: {
        tags: [tag],
        summary: `Supprimer une ${singular}`,
        description: `Réservé au rôle ${deleteRole}.`,
        parameters: [idParam],
        responses: {
          204: { description: "Supprimée" },
          401: RESPONSES[401],
          403: RESPONSES[403],
          404: RESPONSES[404],
        },
      },
    },
  };
}

function plural(singular) {
  return singular.endsWith("s") ? singular : `${singular}s`;
}

/** "pre-registrations" + "Create" → "PreRegistrationsCreate" */
function componentName(path, suffix) {
  const base = path
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
  return `${base}${suffix}`;
}

function buildComponents() {
  const resourceSchemas = {};
  for (const definition of RESOURCES) {
    resourceSchemas[componentName(definition.path, "Create")] = jsonSchema(definition.createSchema);
    resourceSchemas[componentName(definition.path, "Update")] = jsonSchema(definition.updateSchema);
  }

  return {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Jeton renvoyé par POST /auth/login. Cliquez sur « Authorize » et collez-le pour essayer les routes protégées.",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "om_token",
        description: "Cookie httpOnly posé par /auth/login, alternative à l'en-tête Bearer.",
      },
    },
    schemas: {
      Error: ERROR_SCHEMA,
      User: USER_SCHEMA,
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", description: "JWT à envoyer en `Authorization: Bearer`." },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      BusinessRequestCreate: jsonSchema(schemas.businessRequestCreate),
      BusinessRequestUpdate: jsonSchema(schemas.businessRequestUpdate),
      RequestEventCreate: jsonSchema(schemas.requestEventCreate),
      NotificationCreate: jsonSchema(schemas.notificationCreate),
      MediaUpdate: jsonSchema(schemas.mediaUpdate),
      UserCreate: jsonSchema(schemas.userCreate),
      UserUpdate: jsonSchema(schemas.userUpdate),
      SettingUpsert: jsonSchema(schemas.settingUpsert),
      ...resourceSchemas,
    },
  };
}

function authPaths() {
  const authResponse = { $ref: "#/components/schemas/AuthResponse" };

  return {
    "/auth/bootstrap-status": {
      get: {
        tags: ["Authentification"],
        summary: "Savoir s'il faut créer le premier compte",
        description: "`needsBootstrap: true` tant qu'aucun utilisateur n'existe en base.",
        security: [],
        responses: {
          200: { description: "État d'amorçage", ...json({ type: "object", properties: { needsBootstrap: { type: "boolean" } } }) },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Authentification"],
        summary: "Créer le premier administrateur",
        description:
          "Ouvert uniquement tant qu'aucun compte n'existe ; le compte créé reçoit le rôle admin. Ensuite, la création passe par POST /users (admin).",
        security: [],
        requestBody: body({
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", minLength: 2, maxLength: 120 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        }),
        responses: {
          201: { description: "Compte créé et session ouverte", ...json(authResponse) },
          400: RESPONSES[400],
          403: { description: "Inscription fermée : un compte existe déjà", ...json({ $ref: "#/components/schemas/Error" }) },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentification"],
        summary: "Se connecter",
        description:
          "Renvoie le JWT dans le corps **et** le pose en cookie httpOnly `om_token`. Le message d'erreur est volontairement identique que l'email existe ou non.",
        security: [],
        requestBody: body({
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@office.cg" },
            password: { type: "string", example: "admin1234" },
          },
        }),
        responses: {
          200: { description: "Session ouverte", ...json(authResponse) },
          401: { description: "Email ou mot de passe incorrect", ...json({ $ref: "#/components/schemas/Error" }) },
          403: { description: "Compte désactivé", ...json({ $ref: "#/components/schemas/Error" }) },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentification"],
        summary: "Se déconnecter",
        description: "Efface le cookie de session. Un JWT déjà émis reste valide jusqu'à expiration.",
        security: [],
        responses: { 204: { description: "Cookie effacé" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Authentification"],
        summary: "Profil du compte connecté",
        responses: {
          200: { description: "Profil", ...json({ type: "object", properties: { user: { $ref: "#/components/schemas/User" } } }) },
          401: RESPONSES[401],
        },
      },
      patch: {
        tags: ["Authentification"],
        summary: "Modifier son profil",
        requestBody: body({
          type: "object",
          properties: {
            fullName: { type: "string", minLength: 2, maxLength: 120 },
            avatarUrl: { type: ["string", "null"], format: "uri" },
          },
        }),
        responses: {
          200: { description: "Profil mis à jour", ...json({ type: "object", properties: { user: { $ref: "#/components/schemas/User" } } }) },
          400: RESPONSES[400],
          401: RESPONSES[401],
        },
      },
    },
    "/auth/change-password": {
      post: {
        tags: ["Authentification"],
        summary: "Changer son mot de passe",
        description:
          "Invalide tous les jetons émis avant l'opération et renvoie une session fraîche pour ne pas déconnecter l'appelant.",
        requestBody: body({
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string" },
            newPassword: { type: "string", minLength: 8 },
          },
        }),
        responses: {
          200: { description: "Mot de passe changé, nouvelle session", ...json(authResponse) },
          400: { description: "Mot de passe actuel incorrect", ...json({ $ref: "#/components/schemas/Error" }) },
          401: RESPONSES[401],
        },
      },
    },
  };
}

function businessRequestPaths() {
  const item = { type: "object", additionalProperties: true };
  const statusEnum = C.REQUEST_STATUSES;

  return {
    "/business-requests": {
      get: {
        tags: ["Demandes business"],
        summary: "Lister les demandes",
        description: "Demandes déposées par les entreprises depuis le Business Center.",
        parameters: [
          ...COMMON_QUERY,
          sortParam(["createdAt", "updatedAt", "deadline", "priority", "status"]),
          { name: "status", in: "query", schema: { type: "string", enum: statusEnum } },
          { name: "type", in: "query", schema: { type: "string", enum: C.REQUEST_TYPES } },
          { name: "priority", in: "query", schema: { type: "string", enum: C.PRIORITIES } },
          { name: "assignedTo", in: "query", description: "Identifiant du membre assigné.", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Liste paginée", ...json(listSchema(item)) }, 401: RESPONSES[401] },
      },
      post: {
        tags: ["Demandes business"],
        summary: "Créer une demande",
        description: "Un événement `created` est automatiquement ajouté au journal.",
        requestBody: body({ $ref: "#/components/schemas/BusinessRequestCreate" }),
        responses: { 201: { description: "Créée", ...json({ type: "object", properties: { item } }) }, 400: RESPONSES[400], 403: RESPONSES[403] },
      },
    },
    "/business-requests/{id}": {
      get: {
        tags: ["Demandes business"],
        summary: "Détail d'une demande",
        parameters: [idParam],
        responses: { 200: { description: "Fiche", ...json({ type: "object", properties: { item } }) }, 404: RESPONSES[404] },
      },
      patch: {
        tags: ["Demandes business"],
        summary: "Modifier une demande",
        description:
          "Tout changement de `status` ou de `assignedTo` est journalisé automatiquement dans les événements.",
        parameters: [idParam],
        requestBody: body({ $ref: "#/components/schemas/BusinessRequestUpdate" }),
        responses: { 200: { description: "Mise à jour", ...json({ type: "object", properties: { item } }) }, 400: RESPONSES[400], 403: RESPONSES[403], 404: RESPONSES[404] },
      },
      delete: {
        tags: ["Demandes business"],
        summary: "Supprimer une demande",
        description: "Réservé au rôle admin.",
        parameters: [idParam],
        responses: { 204: { description: "Supprimée" }, 403: RESPONSES[403], 404: RESPONSES[404] },
      },
    },
    "/business-requests/{id}/events": {
      get: {
        tags: ["Demandes business"],
        summary: "Journal d'une demande",
        description: "Création, changements de statut, assignations et commentaires internes, du plus ancien au plus récent.",
        parameters: [idParam],
        responses: { 200: { description: "Événements", ...json({ type: "object", properties: { items: { type: "array", items: item } } }) }, 404: RESPONSES[404] },
      },
      post: {
        tags: ["Demandes business"],
        summary: "Ajouter un commentaire au journal",
        parameters: [idParam],
        requestBody: body({ $ref: "#/components/schemas/RequestEventCreate" }),
        responses: { 201: { description: "Journal mis à jour", ...json({ type: "object", properties: { items: { type: "array", items: item } } }) }, 400: RESPONSES[400], 403: RESPONSES[403], 404: RESPONSES[404] },
      },
    },
    "/business-requests/{id}/documents": {
      get: {
        tags: ["Demandes business"],
        summary: "Pièces jointes d'une demande",
        parameters: [idParam],
        responses: { 200: { description: "Documents", ...json({ type: "object", properties: { items: { type: "array", items: item } } }) }, 404: RESPONSES[404] },
      },
      post: {
        tags: ["Demandes business"],
        summary: "Téléverser une pièce jointe",
        description: "Envoi `multipart/form-data`. Le fichier part sur Cloudinary. 15 Mo maximum.",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary" },
                  type: { type: "string", enum: C.DOCUMENT_TYPES, default: "autre" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Document ajouté", ...json({ type: "object", properties: { item } }) }, 400: RESPONSES[400], 403: RESPONSES[403], 404: RESPONSES[404] },
      },
    },
    "/business-requests/{id}/documents/{docId}": {
      delete: {
        tags: ["Demandes business"],
        summary: "Supprimer une pièce jointe",
        description: "Supprime aussi le fichier chez Cloudinary.",
        parameters: [idParam, { name: "docId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "Supprimée" }, 403: RESPONSES[403], 404: RESPONSES[404] },
      },
    },
  };
}

function otherPaths() {
  const item = { type: "object", additionalProperties: true };

  return {
    "/health": {
      get: {
        tags: ["Système"],
        summary: "Vérifier que l'API répond",
        security: [],
        responses: { 200: { description: "En ligne", ...json({ type: "object", properties: { status: { type: "string" }, uptime: { type: "number" } } }) } },
      },
    },
    "/stats/activity": {
      get: {
        tags: ["Système"],
        summary: "Activité hebdomadaire des dépôts",
        description:
          "Nombre de demandes, devis, pré-inscriptions et candidatures reçus par semaine (semaines commençant le lundi). Alimente le graphique du tableau de bord.",
        parameters: [
          {
            name: "weeks",
            in: "query",
            description: "Nombre de semaines à couvrir (4 à 26).",
            schema: { type: "integer", minimum: 4, maximum: 26, default: 12 },
          },
        ],
        responses: {
          200: {
            description: "Série hebdomadaire",
            ...json({
              type: "object",
              properties: {
                weeks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      week: { type: "string", format: "date", description: "Lundi de la semaine" },
                      businessRequests: { type: "integer" },
                      quotes: { type: "integer" },
                      preRegistrations: { type: "integer" },
                      applications: { type: "integer" },
                    },
                  },
                },
                from: { type: "string", format: "date-time" },
              },
            }),
          },
          401: RESPONSES[401],
        },
      },
    },
    "/stats/dashboard": {
      get: {
        tags: ["Système"],
        summary: "Statistiques du tableau de bord",
        description: "Compteurs par ressource, répartitions par statut et cinq derniers éléments de chaque flux.",
        responses: { 200: { description: "Agrégats", ...json({ type: "object", properties: { counts: item, byStatus: item, latest: item } }) }, 401: RESPONSES[401] },
      },
    },
    "/media": {
      get: {
        tags: ["Médiathèque"],
        summary: "Lister les fichiers",
        parameters: [
          ...COMMON_QUERY,
          sortParam(["createdAt", "name", "sizeBytes"]),
          { name: "folder", in: "query", schema: { type: "string" } },
          { name: "mimeType", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Liste paginée", ...json(listSchema(item)) }, 401: RESPONSES[401] },
      },
      post: {
        tags: ["Médiathèque"],
        summary: "Téléverser des images",
        description: "Jusqu'à 10 fichiers de 8 Mo, envoyés sur Cloudinary. Champ `files` répété.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["files"],
                properties: {
                  files: { type: "array", items: { type: "string", format: "binary" } },
                  folder: { type: "string", default: "general" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Fichiers ajoutés", ...json({ type: "object", properties: { items: { type: "array", items: item } } }) }, 400: RESPONSES[400], 403: RESPONSES[403] },
      },
    },
    "/media/{id}": {
      get: { tags: ["Médiathèque"], summary: "Détail d'un fichier", parameters: [idParam], responses: { 200: { description: "Fichier", ...json({ type: "object", properties: { item } }) }, 404: RESPONSES[404] } },
      patch: {
        tags: ["Médiathèque"],
        summary: "Renommer / déplacer un fichier",
        parameters: [idParam],
        requestBody: body({ $ref: "#/components/schemas/MediaUpdate" }),
        responses: { 200: { description: "Mis à jour", ...json({ type: "object", properties: { item } }) }, 400: RESPONSES[400], 403: RESPONSES[403], 404: RESPONSES[404] },
      },
      delete: {
        tags: ["Médiathèque"],
        summary: "Supprimer un fichier",
        description: "Supprime l'enregistrement **et** le fichier chez Cloudinary.",
        parameters: [idParam],
        responses: { 204: { description: "Supprimé" }, 403: RESPONSES[403], 404: RESPONSES[404] },
      },
    },
    "/subscribers/export/csv": {
      get: {
        tags: ["Newsletter"],
        summary: "Exporter la liste de diffusion en CSV",
        parameters: [
          {
            name: "active",
            in: "query",
            description: "`false` pour inclure aussi les désinscrits.",
            schema: { type: "string", enum: ["true", "false"], default: "true" },
          },
        ],
        responses: { 200: { description: "Fichier CSV", content: { "text/csv": { schema: { type: "string" } } } }, 401: RESPONSES[401] },
      },
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Lister les notifications internes",
        parameters: [
          ...COMMON_QUERY,
          sortParam(["createdAt"]),
          { name: "type", in: "query", schema: { type: "string", enum: C.NOTIFICATION_TYPES } },
          { name: "user", in: "query", description: "Destinataire ; vide = diffusée à toute l'équipe.", schema: { type: "string" } },
        ],
        responses: { 200: { description: "Liste paginée", ...json(listSchema(item)) }, 401: RESPONSES[401] },
      },
      post: {
        tags: ["Notifications"],
        summary: "Publier une notification",
        requestBody: body({ $ref: "#/components/schemas/NotificationCreate" }),
        responses: { 201: { description: "Publiée", ...json({ type: "object", properties: { item } }) }, 400: RESPONSES[400], 403: RESPONSES[403] },
      },
    },
    "/notifications/{id}": {
      delete: { tags: ["Notifications"], summary: "Supprimer une notification", parameters: [idParam], responses: { 204: { description: "Supprimée" }, 403: RESPONSES[403], 404: RESPONSES[404] } },
    },
    "/users": {
      get: {
        tags: ["Utilisateurs"],
        summary: "Lister les comptes du back-office",
        description: "Réservé aux administrateurs.",
        parameters: [
          ...COMMON_QUERY,
          sortParam(["createdAt", "fullName", "email", "role", "lastLoginAt"]),
          { name: "role", in: "query", schema: { type: "string", enum: ["admin", "editor", "viewer"] } },
          { name: "active", in: "query", schema: { type: "string", enum: ["true", "false"] } },
        ],
        responses: { 200: { description: "Liste paginée", ...json(listSchema({ $ref: "#/components/schemas/User" })) }, 403: RESPONSES[403] },
      },
      post: {
        tags: ["Utilisateurs"],
        summary: "Créer un compte",
        requestBody: body({ $ref: "#/components/schemas/UserCreate" }),
        responses: { 201: { description: "Compte créé", ...json({ type: "object", properties: { item: { $ref: "#/components/schemas/User" } } }) }, 400: RESPONSES[400], 403: RESPONSES[403], 409: RESPONSES[409] },
      },
    },
    "/users/assignable": {
      get: {
        tags: ["Utilisateurs"],
        summary: "Membres pouvant recevoir une demande",
        description: "Comptes actifs de rôle admin ou éditeur, pour les menus d'assignation. Accessible à tout compte connecté.",
        responses: { 200: { description: "Liste courte", ...json({ type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/User" } } } }) }, 401: RESPONSES[401] },
      },
    },
    "/users/{id}": {
      get: { tags: ["Utilisateurs"], summary: "Détail d'un compte", parameters: [idParam], responses: { 200: { description: "Compte", ...json({ type: "object", properties: { item: { $ref: "#/components/schemas/User" } } }) }, 403: RESPONSES[403], 404: RESPONSES[404] } },
      patch: {
        tags: ["Utilisateurs"],
        summary: "Modifier un compte",
        description:
          "Un administrateur ne peut ni changer son propre rôle, ni se désactiver, ni retirer le dernier administrateur actif. Renseigner `password` invalide les sessions en cours de ce compte.",
        parameters: [idParam],
        requestBody: body({ $ref: "#/components/schemas/UserUpdate" }),
        responses: { 200: { description: "Compte mis à jour", ...json({ type: "object", properties: { item: { $ref: "#/components/schemas/User" } } }) }, 400: RESPONSES[400], 403: RESPONSES[403], 404: RESPONSES[404] },
      },
      delete: {
        tags: ["Utilisateurs"],
        summary: "Supprimer un compte",
        description: "Impossible de supprimer son propre compte ou le dernier administrateur actif.",
        parameters: [idParam],
        responses: { 204: { description: "Supprimé" }, 400: RESPONSES[400], 403: RESPONSES[403], 404: RESPONSES[404] },
      },
    },
    "/settings": {
      get: {
        tags: ["Paramètres"],
        summary: "Lire les paramètres du site",
        description: "Les valeurs enregistrées sont fusionnées avec les valeurs par défaut, groupe par groupe.",
        responses: { 200: { description: "Paramètres", ...json({ type: "object", properties: { settings: item } }) }, 401: RESPONSES[401] },
      },
    },
    "/settings/{key}": {
      put: {
        tags: ["Paramètres"],
        summary: "Enregistrer un groupe de paramètres",
        description: "Réservé aux administrateurs. Groupes utilisés par le site : `contact`, `legal`, `social`, `ceo`.",
        parameters: [
          { name: "key", in: "path", required: true, schema: { type: "string", example: "contact" } },
        ],
        requestBody: body({ $ref: "#/components/schemas/SettingUpsert" }),
        responses: { 200: { description: "Enregistré", ...json({ type: "object", properties: { item } }) }, 400: RESPONSES[400], 403: RESPONSES[403] },
      },
    },
  };
}

function buildOpenApiDocument() {
  const resourcePathEntries = RESOURCES.reduce(
    (acc, definition) => ({ ...acc, ...resourcePaths(definition) }),
    {},
  );

  return {
    openapi: "3.1.0",
    info: {
      title: "API Office Management",
      version: "1.0.0",
      description: [
        "API du back-office Office Management : demandes commerciales, dossiers de formation,",
        "contenus du site public, médias et comptes.",
        "",
        "**Authentification** — appelez `POST /auth/login`, copiez le `token` renvoyé, puis",
        "cliquez sur « Authorize » en haut à droite pour essayer les routes protégées.",
        "",
        "**Rôles** — `viewer` lit, `editor` gère contenus et demandes, `admin` ajoute les",
        "suppressions, les utilisateurs et les paramètres du site.",
      ].join("\n"),
    },
    servers: [{ url: `http://localhost:${port}/api`, description: "Développement local" }],
    tags: [
      { name: "Authentification", description: "Connexion, session et profil." },
      { name: "Demandes business", description: "Demandes d'entreprises, journal et pièces jointes." },
      { name: "Devis", description: "Demandes de devis du site public." },
      { name: "Pré-inscriptions", description: "Dossiers de pré-inscription aux formations." },
      { name: "Candidatures", description: "Candidatures sur les offres." },
      { name: "Offres", description: "Offres d'emploi et de stage." },
      { name: "Formations", description: "Catalogue de formations." },
      { name: "Blog", description: "Articles du blog." },
      { name: "Médiathèque", description: "Fichiers hébergés sur Cloudinary." },
      { name: "Entreprises", description: "Fiches entreprises." },
      { name: "Newsletter", description: "Liste de diffusion et export." },
      { name: "Notifications", description: "Messages internes à l'équipe." },
      { name: "Utilisateurs", description: "Comptes du back-office (admin)." },
      { name: "Paramètres", description: "Réglages du site public (admin)." },
      { name: "Système", description: "Santé de l'API et statistiques." },
      {
        name: "Site public",
        description:
          "Routes ouvertes consommées par le site vitrine : lecture des contenus publiés et dépôt des formulaires. Aucune authentification, débit limité sur les dépôts.",
      },
    ],
    // Toutes les routes exigent une session, sauf celles qui déclarent `security: []`.
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    components: buildComponents(),
    paths: {
      ...buildPublicPaths(jsonSchema),
      ...otherPaths(),
      ...authPaths(),
      ...businessRequestPaths(),
      ...resourcePathEntries,
    },
  };
}

module.exports = { buildOpenApiDocument };
