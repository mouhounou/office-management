const schemas = require("../validators");
const { uniqueSlug } = require("../utils/slug");

const Company = require("../models/Company");
const QuoteRequest = require("../models/QuoteRequest");
const PreRegistration = require("../models/PreRegistration");
const Offer = require("../models/Offer");
const Application = require("../models/Application");
const Formation = require("../models/Formation");
const Post = require("../models/Post");
const Subscriber = require("../models/Subscriber");
const Message = require("../models/Message");
const C = require("../models/constants");

/**
 * Description unique de chaque ressource CRUD.
 *
 * Sert à la fois à monter les routes (routes/resources.routes.js) et à générer
 * la documentation OpenAPI (docs/openapi.js) : impossible que les deux dérivent
 * l'une de l'autre.
 *
 * - `filters` documente ET active les filtres d'égalité (?status=new)
 * - `deleteRole` : "admin" par défaut, "editor" quand la suppression est un
 *   geste courant (newsletter)
 */
const RESOURCES = [
  {
    path: "companies",
    tag: "Entreprises",
    singular: "entreprise",
    description: "Fiches des entreprises clientes.",
    model: Company,
    createSchema: schemas.companyCreate,
    updateSchema: schemas.companyUpdate,
    searchFields: ["name", "sector", "city", "contactName", "contactEmail"],
    filters: [
      { name: "sector", description: "Secteur d'activité" },
      { name: "city", description: "Ville" },
    ],
    sortFields: ["createdAt", "name"],
  },
  {
    path: "quotes",
    tag: "Devis",
    singular: "demande de devis",
    description: "Demandes déposées par le formulaire « Demander un devis » du site.",
    model: QuoteRequest,
    createSchema: schemas.quoteCreate,
    updateSchema: schemas.quoteUpdate,
    searchFields: ["name", "company", "email", "message"],
    filters: [
      { name: "status", description: "Statut de traitement", enum: C.SIMPLE_STATUSES },
      { name: "pole", description: "Pôle de services concerné", enum: C.POLES },
    ],
    sortFields: ["createdAt", "status", "pole"],
  },
  {
    path: "pre-registrations",
    tag: "Pré-inscriptions",
    singular: "pré-inscription",
    description: "Dossiers de pré-inscription aux formations.",
    model: PreRegistration,
    createSchema: schemas.preRegistrationCreate,
    updateSchema: schemas.preRegistrationUpdate,
    searchFields: ["fullName", "email", "phone", "profession"],
    filters: [
      { name: "status", description: "Statut du dossier", enum: C.SIMPLE_STATUSES },
      { name: "training", description: "Formation visée", enum: C.TRAININGS },
      { name: "financingType", description: "Mode de financement", enum: C.FINANCING_TYPES },
    ],
    sortFields: ["createdAt", "startDate", "status", "training"],
  },
  {
    path: "offers",
    tag: "Offres",
    singular: "offre",
    description: "Offres d'emploi et de stage publiées sur le site.",
    model: Offer,
    createSchema: schemas.offerCreate,
    updateSchema: schemas.offerUpdate,
    searchFields: ["title", "description", "location", "sector"],
    filters: [
      { name: "published", description: "Publiée sur le site", type: "boolean" },
      { name: "contractType", description: "Type de contrat", enum: C.CONTRACT_TYPES },
      { name: "sector", description: "Secteur" },
    ],
    sortFields: ["createdAt", "title", "expiresAt"],
    beforeCreate: (body, req) => ({ ...body, createdBy: req.user._id }),
  },
  {
    path: "applications",
    tag: "Candidatures",
    singular: "candidature",
    description: "Candidatures reçues sur les offres.",
    model: Application,
    createSchema: schemas.applicationCreate,
    updateSchema: schemas.applicationUpdate,
    searchFields: ["fullName", "email", "phone"],
    filters: [
      { name: "status", description: "Étape de sélection", enum: C.APPLICATION_STATUSES },
      { name: "offer", description: "Identifiant de l'offre" },
    ],
    sortFields: ["createdAt", "status", "fullName"],
    populate: { path: "offer", select: "title contractType" },
  },
  {
    path: "formations",
    tag: "Formations",
    singular: "formation",
    description: "Catalogue de formations affiché sur le site.",
    model: Formation,
    createSchema: schemas.formationCreate,
    updateSchema: schemas.formationUpdate,
    searchFields: ["title", "description", "category"],
    filters: [
      { name: "published", description: "Publiée sur le site", type: "boolean" },
      { name: "category", description: "Catégorie", enum: C.FORMATION_CATEGORIES },
      { name: "certifying", description: "Formation certifiante", type: "boolean" },
    ],
    sortFields: ["createdAt", "title", "order", "category"],
    beforeCreate: async (body) => ({
      ...body,
      slug: body.slug || (await uniqueSlug(Formation, body.title)),
    }),
  },
  {
    path: "posts",
    tag: "Blog",
    singular: "article",
    description: "Articles du blog.",
    model: Post,
    createSchema: schemas.postCreate,
    updateSchema: schemas.postUpdate,
    searchFields: ["title", "excerpt", "content", "category"],
    filters: [
      { name: "published", description: "Publié sur le site", type: "boolean" },
      { name: "category", description: "Catégorie", enum: C.BLOG_CATEGORIES },
      { name: "featured", description: "Mis à la une", type: "boolean" },
    ],
    sortFields: ["createdAt", "publishedAt", "title"],
    populate: { path: "author", select: "fullName" },
    beforeCreate: async (body, req) => ({
      ...body,
      slug: body.slug || (await uniqueSlug(Post, body.title)),
      author: req.user._id,
      publishedAt: body.published ? new Date() : null,
    }),
  },
  {
    path: "messages",
    tag: "Messages",
    singular: "message",
    description: "Messages de contact et demandes de rendez-vous déposés sur le site.",
    model: Message,
    createSchema: schemas.messageCreate,
    updateSchema: schemas.messageUpdate,
    searchFields: ["name", "email", "subject", "message", "reason"],
    filters: [
      { name: "status", description: "Statut de traitement", enum: C.SIMPLE_STATUSES },
      { name: "kind", description: "Type de message", enum: ["contact", "rendez-vous"] },
    ],
    sortFields: ["createdAt", "status", "preferredDate"],
  },
  {
    path: "subscribers",
    tag: "Newsletter",
    singular: "abonné",
    description: "Liste de diffusion de la newsletter.",
    model: Subscriber,
    createSchema: schemas.subscriberCreate,
    updateSchema: schemas.subscriberUpdate,
    searchFields: ["email", "source"],
    filters: [
      { name: "active", description: "Abonnement actif", type: "boolean" },
      { name: "source", description: "Origine de l'inscription" },
    ],
    sortFields: ["createdAt", "email"],
    // La liste de diffusion se gère au quotidien : pas besoin d'être admin.
    deleteRole: "editor",
  },
];

module.exports = { RESOURCES };
