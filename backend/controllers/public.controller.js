const Formation = require("../models/Formation");
const Post = require("../models/Post");
const Offer = require("../models/Offer");
const QuoteRequest = require("../models/QuoteRequest");
const PreRegistration = require("../models/PreRegistration");
const BusinessRequest = require("../models/BusinessRequest");
const RequestEvent = require("../models/RequestEvent");
const Application = require("../models/Application");
const Subscriber = require("../models/Subscriber");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination } = require("../utils/pagination");
const settingCtrl = require("./setting.controller");
const { notifySubmission, welcomeSubscriber } = require("../services/mail.service");
const Setting = require("../models/Setting");
const { notifyTeam } = require("../services/notification.service");

/**
 * Endpoints consommés par le site public (user/), sans authentification.
 *
 * Lecture : uniquement ce qui est publié, avec une sélection de champs — les
 * notes internes et les données de traitement ne sortent jamais d'ici.
 * Écriture : uniquement des dépôts (devis, pré-inscription…), créés au statut
 * initial « new ».
 */

// Champs exposés publiquement, ressource par ressource.
const FORMATION_FIELDS = "title slug category description program duration level price certifying imageUrl order";
const POST_FIELDS = "title slug category excerpt content imageUrl readTime featured publishedAt createdAt";
const OFFER_FIELDS = "title description location contractType sector duration requirements expiresAt createdAt";

const listFormations = asyncHandler(async (req, res) => {
  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;

  const items = await Formation.find(filter).select(FORMATION_FIELDS).sort({ order: 1, title: 1 });
  res.json({ items });
});

const getFormation = asyncHandler(async (req, res) => {
  const item = await Formation.findOne({ slug: req.params.slug, published: true }).select(FORMATION_FIELDS);
  if (!item) throw ApiError.notFound("Formation introuvable");
  res.json({ item });
});

const listPosts = asyncHandler(async (req, res) => {
  const { limit, skip } = parsePagination(req.query);
  const filter = { published: true };
  if (req.query.category && req.query.category !== "Tous") filter.category = req.query.category;

  const [items, total] = await Promise.all([
    Post.find(filter).select(POST_FIELDS).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments(filter),
  ]);

  res.json({ items, total });
});

const getPost = asyncHandler(async (req, res) => {
  const item = await Post.findOne({ slug: req.params.slug, published: true }).select(POST_FIELDS);
  if (!item) throw ApiError.notFound("Article introuvable");
  res.json({ item });
});

// Une offre expirée disparaît du site sans qu'on ait à la dépublier à la main.
const listOffers = asyncHandler(async (_req, res) => {
  const items = await Offer.find({
    published: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
  })
    .select(OFFER_FIELDS)
    .sort({ createdAt: -1 });

  res.json({ items });
});

const getOffer = asyncHandler(async (req, res) => {
  const item = await Offer.findOne({ _id: req.params.id, published: true }).select(OFFER_FIELDS);
  if (!item) throw ApiError.notFound("Offre introuvable");
  res.json({ item });
});

/** Coordonnées, mentions légales, réseaux sociaux et signature du dirigeant. */
const getSettings = asyncHandler(async (_req, res) => {
  const rows = await Setting.find();
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  const settings = Object.fromEntries(
    Object.entries(settingCtrl.DEFAULTS).map(([key, value]) => [
      key,
      { ...value, ...(stored[key] ?? {}) },
    ]),
  );

  res.json({ settings });
});

// --- Dépôts ----------------------------------------------------------------

const created = (res, item) => res.status(201).json({ item });

/** Corps du dépôt, rattaché au compte client connecté s'il y en a un. */
const withMember = (req, extra = {}) => ({ ...req.body, ...extra, member: req.member?._id ?? null });

/** Emails (visiteur + équipe) et notification dans le back-office. */
async function afterSubmit(kind, doc) {
  await Promise.all([notifySubmission(kind, doc), notifyTeam(kind, doc)]);
}

const submitQuote = asyncHandler(async (req, res) => {
  const doc = await QuoteRequest.create(withMember(req));
  await afterSubmit("quote", doc);
  created(res, doc);
});

const submitPreRegistration = asyncHandler(async (req, res) => {
  const doc = await PreRegistration.create(withMember(req));
  await afterSubmit("preRegistration", doc);
  created(res, doc);
});

const submitBusinessRequest = asyncHandler(async (req, res) => {
  const doc = await BusinessRequest.create(withMember(req));
  // Même journal que côté back-office : la demande commence son cycle de vie.
  await RequestEvent.create({
    request: doc._id,
    eventType: "created",
    toStatus: doc.status,
    actorName: "Site public",
  });
  await afterSubmit("businessRequest", doc);
  created(res, doc);
});

const submitApplication = asyncHandler(async (req, res) => {
  const doc = await Application.create(withMember(req));
  await afterSubmit("application", doc);
  created(res, doc);
});

/**
 * Inscription newsletter. Une adresse déjà inscrite renvoie 200 (et non 409) :
 * répondre « déjà inscrit » à un visiteur suffit, et cela évite de transformer
 * le formulaire en outil de vérification d'adresses.
 */
const subscribe = asyncHandler(async (req, res) => {
  const { email, source } = req.body;
  const existing = await Subscriber.findOne({ email });

  if (existing) {
    if (!existing.active) {
      existing.active = true;
      existing.unsubscribedAt = null;
      await existing.save();
    }
    return res.json({ alreadySubscribed: true });
  }

  await Subscriber.create({ email, source: source || "site" });
  welcomeSubscriber(email);
  res.status(201).json({ alreadySubscribed: false });
});

const submitContact = asyncHandler(async (req, res) => {
  const doc = await Message.create(withMember(req, { kind: "contact" }));
  await afterSubmit("contact", doc);
  created(res, doc);
});

const submitAppointment = asyncHandler(async (req, res) => {
  const doc = await Message.create(withMember(req, { kind: "rendez-vous" }));
  await afterSubmit("appointment", doc);
  created(res, doc);
});

module.exports = {
  listFormations,
  getFormation,
  listPosts,
  getPost,
  listOffers,
  getOffer,
  getSettings,
  submitQuote,
  submitPreRegistration,
  submitBusinessRequest,
  submitApplication,
  subscribe,
  submitContact,
  submitAppointment,
};
