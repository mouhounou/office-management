const { z } = require("zod");

const { trimmed, email, phone, optionalText, dateString, optionalDate, bool } = require("./common");
const C = require("../models/constants");

const enumOf = (values, message) => z.enum(values, { message });
const optionalEmail = email.optional().or(z.literal("")).transform((v) => v || undefined);

// --- Entreprises ------------------------------------------------------------
const companyCreate = z.object({
  name: trimmed(180).min(2, "Nom requis"),
  rccm: optionalText(80),
  niu: optionalText(80),
  sector: optionalText(120),
  size: optionalText(60),
  contactName: optionalText(120),
  contactEmail: optionalEmail,
  contactPhone: optionalText(40),
  address: optionalText(240),
  city: optionalText(120),
  country: optionalText(120),
  notes: optionalText(4000),
});

// --- Demandes business ------------------------------------------------------
const businessRequestCreate = z.object({
  company: z.string().nullish(),
  companyName: trimmed(180).min(2, "Entreprise requise"),
  contactName: trimmed(120).min(2, "Nom requis"),
  contactEmail: email,
  contactPhone: phone,
  type: enumOf(C.REQUEST_TYPES, "Type de demande invalide"),
  title: trimmed(180).min(4, "Titre trop court"),
  description: trimmed(8000).min(20, "Description trop courte (20 caractères minimum)"),
  status: enumOf(C.REQUEST_STATUSES).optional(),
  priority: enumOf(C.PRIORITIES).optional(),
  budget: optionalText(80),
  deadline: optionalDate,
  assignedTo: z.string().nullish(),
  adminNotes: optionalText(4000),
});

const requestEventCreate = z.object({
  eventType: trimmed(60).default("comment"),
  comment: trimmed(4000).min(1, "Commentaire requis"),
});

// --- Devis ------------------------------------------------------------------
const quoteCreate = z.object({
  pole: enumOf(C.POLES, "Pôle invalide"),
  name: trimmed(120).min(2, "Nom requis"),
  company: optionalText(180),
  email,
  phone,
  budget: optionalText(60),
  deadline: optionalText(60),
  message: trimmed(4000).min(10, "Message trop court"),
  status: enumOf(C.SIMPLE_STATUSES).optional(),
  adminNotes: optionalText(4000),
});

// --- Pré-inscriptions -------------------------------------------------------
const preRegistrationCreate = z.object({
  fullName: trimmed(120).min(2, "Nom requis"),
  email,
  phone,
  dateOfBirth: dateString,
  placeOfBirth: trimmed(120).min(2, "Lieu requis"),
  neighborhood: trimmed(120).min(2, "Quartier requis"),
  profession: trimmed(120).min(2, "Profession requise"),
  financingType: enumOf(C.FINANCING_TYPES, "Financement invalide"),
  idDocumentType: enumOf(C.ID_DOCUMENT_TYPES, "Type de pièce invalide"),
  idDocumentNumber: trimmed(60).min(3, "Numéro requis"),
  training: enumOf(C.TRAININGS, "Formation invalide"),
  duration: trimmed(60).min(1, "Durée requise"),
  startDate: dateString,
  status: enumOf(C.SIMPLE_STATUSES).optional(),
  adminNotes: optionalText(4000),
});

// --- Offres -----------------------------------------------------------------
const offerCreate = z.object({
  title: trimmed(180).min(4, "Titre trop court"),
  description: trimmed(8000).min(20, "Description trop courte"),
  location: optionalText(120),
  contractType: enumOf(C.CONTRACT_TYPES, "Type de contrat invalide").default("stage"),
  sector: optionalText(120),
  duration: optionalText(60),
  requirements: optionalText(4000),
  published: bool.optional(),
  expiresAt: optionalDate,
});

// --- Candidatures -----------------------------------------------------------
const applicationCreate = z.object({
  offer: z.string().nullish(),
  fullName: trimmed(120).min(2, "Nom requis"),
  email,
  phone: optionalText(40),
  coverLetter: optionalText(8000),
  cvUrl: optionalText(500),
  status: enumOf(C.APPLICATION_STATUSES).optional(),
  adminNotes: optionalText(4000),
});

// --- Formations -------------------------------------------------------------
const formationCreate = z.object({
  title: trimmed(180).min(3, "Titre trop court"),
  slug: optionalText(200),
  category: enumOf(C.FORMATION_CATEGORIES, "Catégorie invalide"),
  description: optionalText(8000),
  // Le formulaire envoie un textarea : une ligne = un module du programme.
  program: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) =>
      Array.isArray(v)
        ? v
        : String(v ?? "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
    ),
  duration: optionalText(60),
  level: optionalText(60),
  price: optionalText(60),
  certifying: bool.optional(),
  imageUrl: optionalText(500),
  published: bool.optional(),
  order: z.coerce.number().int().min(0).max(9999).optional(),
});

// --- Blog -------------------------------------------------------------------
const postCreate = z.object({
  title: trimmed(200).min(4, "Titre trop court"),
  slug: optionalText(220),
  category: enumOf(C.BLOG_CATEGORIES, "Catégorie invalide"),
  excerpt: trimmed(600).min(20, "Résumé trop court"),
  content: trimmed(40000).min(50, "Contenu trop court"),
  imageUrl: optionalText(500),
  readTime: optionalText(20),
  featured: bool.optional(),
  published: bool.optional(),
});

// --- Newsletter -------------------------------------------------------------
const subscriberCreate = z.object({
  email,
  source: optionalText(80),
  active: bool.optional(),
});

// --- Messages (contact et rendez-vous) --------------------------------------
const messageCreate = z.object({
  kind: enumOf(["contact", "rendez-vous"], "Type de message invalide"),
  name: trimmed(120).min(2, "Nom requis"),
  email,
  phone: optionalText(40),
  subject: optionalText(180),
  message: optionalText(4000),
  reason: optionalText(180),
  preferredDate: optionalDate,
  timeSlot: z.enum(["matin", "apres-midi"]).nullish(),
  status: enumOf(C.SIMPLE_STATUSES).optional(),
  adminNotes: optionalText(4000),
});

// --- Notifications ----------------------------------------------------------
const notificationCreate = z.object({
  user: z.string().nullish(),
  type: enumOf(C.NOTIFICATION_TYPES).default("info"),
  title: trimmed(200).min(3, "Titre requis"),
  message: optionalText(2000),
  link: optionalText(500),
});

// --- Médias -----------------------------------------------------------------
const mediaUpdate = z.object({
  name: trimmed(200).min(1).optional(),
  alt: optionalText(240),
  folder: optionalText(80),
});

// --- Utilisateurs -----------------------------------------------------------
const ROLES = ["admin", "editor", "viewer"];

const userCreate = z.object({
  fullName: trimmed(120).min(2, "Nom trop court"),
  email,
  password: z.string().min(8, "8 caractères minimum").max(200),
  role: enumOf(ROLES, "Rôle invalide").default("viewer"),
  active: bool.optional(),
});

const userUpdate = z.object({
  fullName: trimmed(120).min(2, "Nom trop court").optional(),
  email: email.optional(),
  role: enumOf(ROLES, "Rôle invalide").optional(),
  active: bool.optional(),
  // Chaîne vide = mot de passe inchangé.
  password: z.string().min(8, "8 caractères minimum").max(200).optional().or(z.literal("")),
});

// --- Paramètres -------------------------------------------------------------
const settingUpsert = z.object({
  value: z.record(z.string(), z.any()),
});

module.exports = {
  companyCreate,
  companyUpdate: companyCreate.partial(),
  businessRequestCreate,
  businessRequestUpdate: businessRequestCreate.partial(),
  requestEventCreate,
  quoteCreate,
  quoteUpdate: quoteCreate.partial(),
  preRegistrationCreate,
  preRegistrationUpdate: preRegistrationCreate.partial(),
  offerCreate,
  offerUpdate: offerCreate.partial(),
  applicationCreate,
  applicationUpdate: applicationCreate.partial(),
  formationCreate,
  formationUpdate: formationCreate.partial(),
  postCreate,
  postUpdate: postCreate.partial(),
  subscriberCreate,
  subscriberUpdate: subscriberCreate.partial(),
  messageCreate,
  messageUpdate: messageCreate.partial(),
  notificationCreate,
  mediaUpdate,
  userCreate,
  userUpdate,
  settingUpsert,
};
