const publicSchemas = require("../validators/public");
const C = require("../models/constants");

/**
 * Chemins ouverts consommés par le site public. Séparés du reste car ils ne
 * suivent pas le patron CRUD : lecture filtrée sur le contenu publié d'un côté,
 * dépôts de formulaires de l'autre.
 */
function buildPublicPaths(jsonSchema) {
  const item = { type: "object", additionalProperties: true };
  const list = { type: "object", properties: { items: { type: "array", items: item } } };
  const json = (schema) => ({ content: { "application/json": { schema } } });

  const submit = (summary, description, schema) => ({
    tags: ["Site public"],
    summary,
    description,
    security: [],
    requestBody: { required: true, content: { "application/json": { schema: jsonSchema(schema) } } },
    responses: {
      201: { description: "Dépôt enregistré", ...json({ type: "object", properties: { item } }) },
      400: { description: "Données invalides", ...json({ $ref: "#/components/schemas/Error" }) },
      429: {
        description: "Trop de dépôts depuis cette adresse (20 par quart d'heure)",
        ...json({ $ref: "#/components/schemas/Error" }),
      },
    },
  });

  const read = (summary, description, schema, parameters = []) => ({
    tags: ["Site public"],
    summary,
    description,
    security: [],
    parameters,
    responses: { 200: { description: "Contenu publié", ...json(schema) } },
  });

  const slugParam = {
    name: "slug",
    in: "path",
    required: true,
    schema: { type: "string" },
    example: "reussir-entretien-embauche",
  };
  const notFound = { description: "Introuvable ou non publié", ...json({ $ref: "#/components/schemas/Error" }) };

  return {
    "/public/formations": {
      get: read(
        "Catalogue de formations publiées",
        "Triées par ordre d'affichage. Les brouillons ne sortent jamais d'ici.",
        list,
        [{ name: "category", in: "query", schema: { type: "string", enum: C.FORMATION_CATEGORIES } }],
      ),
    },
    "/public/formations/{slug}": {
      get: {
        ...read("Détail d'une formation publiée", undefined, { type: "object", properties: { item } }, [slugParam]),
        responses: {
          200: { description: "Formation", ...json({ type: "object", properties: { item } }) },
          404: notFound,
        },
      },
    },
    "/public/posts": {
      get: read("Articles de blog publiés", "Du plus récent au plus ancien.", {
        type: "object",
        properties: { items: { type: "array", items: item }, total: { type: "integer" } },
      }, [
        { name: "category", in: "query", schema: { type: "string", enum: C.BLOG_CATEGORIES } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
      ]),
    },
    "/public/posts/{slug}": {
      get: {
        ...read("Détail d'un article publié", undefined, { type: "object", properties: { item } }, [slugParam]),
        responses: {
          200: { description: "Article", ...json({ type: "object", properties: { item } }) },
          404: notFound,
        },
      },
    },
    "/public/offers": {
      get: read(
        "Offres d'emploi et de stage en ligne",
        "Uniquement les offres publiées et non expirées.",
        list,
      ),
    },
    "/public/offers/{id}": {
      get: {
        ...read("Détail d'une offre", undefined, { type: "object", properties: { item } }, [
          { name: "id", in: "path", required: true, schema: { type: "string", pattern: "^[0-9a-f]{24}$" } },
        ]),
        responses: {
          200: { description: "Offre", ...json({ type: "object", properties: { item } }) },
          404: notFound,
        },
      },
    },
    "/public/settings": {
      get: read(
        "Coordonnées et informations du site",
        "Contact, mentions légales, réseaux sociaux et signature du dirigeant.",
        { type: "object", properties: { settings: item } },
      ),
    },
    "/public/quotes": {
      post: submit("Déposer une demande de devis", "Formulaire /devis du site.", publicSchemas.quotePublic),
    },
    "/public/pre-registrations": {
      post: submit(
        "Déposer une pré-inscription",
        "Formulaire /pre-inscription du site.",
        publicSchemas.preRegistrationPublic,
      ),
    },
    "/public/business-requests": {
      post: submit(
        "Déposer une demande business",
        "Formulaires du Business Center. Un événement « created » est ajouté au journal de la demande.",
        publicSchemas.businessRequestPublic,
      ),
    },
    "/public/applications": {
      post: submit(
        "Déposer une candidature",
        "Candidature spontanée ou rattachée à une offre via le champ `offer`.",
        publicSchemas.applicationPublic,
      ),
    },
    "/public/messages": {
      post: submit("Envoyer un message de contact", "Formulaire /contact du site.", publicSchemas.contactMessagePublic),
    },
    "/public/appointments": {
      post: submit(
        "Demander un rendez-vous",
        "Formulaire /rendez-vous du site.",
        publicSchemas.appointmentPublic,
      ),
    },
    "/public/subscribers": {
      post: {
        tags: ["Site public"],
        summary: "S'inscrire à la newsletter",
        description:
          "Répond 200 avec `alreadySubscribed: true` si l'adresse est déjà connue — volontairement, pour ne pas transformer le formulaire en outil de vérification d'adresses. Une adresse désinscrite est réactivée.",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: jsonSchema(publicSchemas.subscriberPublic) } },
        },
        responses: {
          201: { description: "Inscription enregistrée", ...json({ type: "object", properties: { alreadySubscribed: { type: "boolean", const: false } } }) },
          200: { description: "Adresse déjà inscrite", ...json({ type: "object", properties: { alreadySubscribed: { type: "boolean", const: true } } }) },
          400: { description: "Email invalide", ...json({ $ref: "#/components/schemas/Error" }) },
          429: { description: "Trop de dépôts depuis cette adresse", ...json({ $ref: "#/components/schemas/Error" }) },
        },
      },
    },
  };
}

module.exports = { buildPublicPaths };
