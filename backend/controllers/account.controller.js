const Member = require("../models/Member");
const QuoteRequest = require("../models/QuoteRequest");
const PreRegistration = require("../models/PreRegistration");
const BusinessRequest = require("../models/BusinessRequest");
const RequestEvent = require("../models/RequestEvent");
const Application = require("../models/Application");
const Message = require("../models/Message");
const Subscriber = require("../models/Subscriber");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signMemberToken } = require("../utils/token");
const { isProduction, publicSiteUrl } = require("../config/env");
const { MEMBER_COOKIE } = require("../middlewares/memberAuth");
const { sendEmailVerification, sendPasswordReset, sendPasswordChanged } = require("../services/mail.service");

/**
 * Espace client du site public : compte, profil et suivi des demandes.
 *
 * Seuls des champs « visiteur » sortent d'ici : ni notes internes, ni
 * commentaires de l'équipe, ni assignation.
 */

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const VERIFY_TTL_MINUTES = 48 * 60;
const RESET_TTL_MINUTES = 60;

function issueSession(res, member) {
  const token = signMemberToken(member);
  res.cookie(MEMBER_COOKIE, token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return { token, member: member.toJSON() };
}

const link = (path, token) => `${publicSiteUrl}${path}?token=${token}`;

// --- Demandes rattachées ----------------------------------------------------

/**
 * Chaque type de demande : son modèle, le champ email à rapprocher, les champs
 * visibles par le client et la façon de la résumer dans une liste.
 */
const KINDS = {
  "business-requests": {
    model: BusinessRequest,
    emailField: "contactEmail",
    label: "Business Center",
    fields: "title type status priority companyName contactName contactEmail contactPhone budget deadline description details createdAt updatedAt",
    summary: (d) => ({ title: d.title, subtitle: d.companyName }),
  },
  quotes: {
    model: QuoteRequest,
    emailField: "email",
    label: "Devis",
    fields: "pole name company email phone budget deadline message status createdAt updatedAt",
    summary: (d) => ({ title: `Devis — ${d.pole}`, subtitle: d.company ?? d.name }),
  },
  "pre-registrations": {
    model: PreRegistration,
    emailField: "email",
    label: "Pré-inscription",
    fields: "training duration startDate fullName email phone financingType status createdAt updatedAt",
    summary: (d) => ({ title: d.training, subtitle: `Début souhaité : ${new Date(d.startDate).toLocaleDateString("fr-FR")}` }),
  },
  applications: {
    model: Application,
    emailField: "email",
    label: "Candidature",
    fields: "offer fullName email phone coverLetter cvUrl status createdAt updatedAt",
    populate: { path: "offer", select: "title contractType location" },
    summary: (d) => ({ title: d.offer?.title ? `Candidature — ${d.offer.title}` : "Candidature spontanée", subtitle: d.email }),
  },
  messages: {
    model: Message,
    emailField: "email",
    label: "Message",
    fields: "kind name email phone subject message reason preferredDate timeSlot status createdAt updatedAt",
    summary: (d) =>
      d.kind === "rendez-vous"
        ? { title: `Rendez-vous — ${d.reason}`, subtitle: d.preferredDate ? new Date(d.preferredDate).toLocaleDateString("fr-FR") : "" }
        : { title: d.subject || "Message", subtitle: "Contact" },
  },
};

const OPEN_STATUSES = ["new", "in_review", "in_progress", "submitted", "reviewed", "shortlisted"];

/**
 * Rattache au compte les demandes envoyées avec son adresse avant l'inscription.
 * Uniquement après vérification de l'email : sinon, s'inscrire avec l'adresse
 * d'un autre suffirait à lire ses demandes.
 */
async function linkPastSubmissions(member) {
  const results = await Promise.all(
    Object.values(KINDS).map(({ model, emailField }) =>
      model.updateMany({ member: null, [emailField]: member.email }, { $set: { member: member._id } }),
    ),
  );
  return results.reduce((sum, r) => sum + (r.modifiedCount ?? 0), 0);
}

async function markVerified(member) {
  member.emailVerified = true;
  member.emailVerificationToken = null;
  member.emailVerificationExpires = null;
  await member.save({ validateBeforeSave: false });
  return linkPastSubmissions(member);
}

/** Inscription à la newsletter suivant la case du profil. */
async function syncNewsletter(member) {
  if (member.newsletter) {
    await Subscriber.findOneAndUpdate(
      { email: member.email },
      { $set: { active: true, unsubscribedAt: null }, $setOnInsert: { source: "espace-client" } },
      { upsert: true },
    );
  } else {
    await Subscriber.updateOne({ email: member.email, active: true }, { $set: { active: false, unsubscribedAt: new Date() } });
  }
}

// --- Compte -----------------------------------------------------------------

const register = asyncHandler(async (req, res) => {
  if (await Member.exists({ email: req.body.email })) {
    throw ApiError.conflict("Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.");
  }
  const member = new Member({ ...req.body, lastLoginAt: new Date() });
  const token = member.issueToken("emailVerification", VERIFY_TTL_MINUTES);
  await member.save();
  if (member.newsletter) await syncNewsletter(member);

  sendEmailVerification(member, link("/verifier-email", token));
  res.status(201).json(issueSession(res, member));
});

const login = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ email: req.body.email }).select("+password");
  if (!member || !(await member.comparePassword(req.body.password))) {
    throw ApiError.unauthorized("Email ou mot de passe incorrect");
  }
  if (!member.active) throw ApiError.forbidden("Ce compte a été désactivé. Contactez-nous.");

  member.lastLoginAt = new Date();
  await member.save({ validateBeforeSave: false });
  res.json(issueSession(res, member));
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(MEMBER_COOKIE, { path: "/" });
  res.status(204).end();
});

const me = asyncHandler(async (req, res) => {
  res.json({ member: req.member.toJSON() });
});

const updateMe = asyncHandler(async (req, res) => {
  const newsletterChanged = req.body.newsletter !== undefined && req.body.newsletter !== req.member.newsletter;
  Object.assign(req.member, req.body);
  // Le nom de l'entreprise n'a de sens que pour un compte entreprise.
  if (req.member.accountType === "candidat") req.member.companyName = null;
  await req.member.save();
  if (newsletterChanged) await syncNewsletter(req.member);
  res.json({ member: req.member.toJSON() });
});

const changePassword = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.member._id).select("+password");
  if (!(await member.comparePassword(req.body.currentPassword))) {
    throw ApiError.badRequest("Mot de passe actuel incorrect", [{ field: "currentPassword", message: "Mot de passe actuel incorrect" }]);
  }
  member.password = req.body.newPassword;
  await member.save();
  sendPasswordChanged(member);
  // Les anciens jetons sont invalidés : on ré-émet une session pour ce navigateur.
  res.json(issueSession(res, member));
});

/** Toujours la même réponse : le formulaire ne révèle pas quelles adresses ont un compte. */
const forgotPassword = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ email: req.body.email, active: true });
  if (member) {
    const token = member.issueToken("passwordReset", RESET_TTL_MINUTES);
    await member.save({ validateBeforeSave: false });
    sendPasswordReset(member, link("/reinitialiser-mot-de-passe", token));
  }
  res.json({ ok: true });
});

const resetPassword = asyncHandler(async (req, res) => {
  const member = await Member.findByToken("passwordReset", req.body.token);
  if (!member) throw ApiError.badRequest("Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.");
  if (!member.active) throw ApiError.forbidden("Ce compte a été désactivé. Contactez-nous.");

  member.password = req.body.password;
  member.passwordResetToken = null;
  member.passwordResetExpires = null;
  member.lastLoginAt = new Date();
  await member.save();
  // Le lien reçu par email prouve aussi la possession de l'adresse.
  if (!member.emailVerified) await markVerified(member);
  sendPasswordChanged(member);
  res.json(issueSession(res, member));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const member = await Member.findByToken("emailVerification", req.body.token);
  if (!member) throw ApiError.badRequest("Ce lien a expiré ou a déjà servi. Demandez-en un nouveau depuis votre espace.");
  const linked = await markVerified(member);
  res.json({ member: member.toJSON(), linked });
});

const resendVerification = asyncHandler(async (req, res) => {
  if (req.member.emailVerified) return res.json({ ok: true, alreadyVerified: true });
  const member = await Member.findById(req.member._id);
  const token = member.issueToken("emailVerification", VERIFY_TTL_MINUTES);
  await member.save({ validateBeforeSave: false });
  sendEmailVerification(member, link("/verifier-email", token));
  res.json({ ok: true });
});

/**
 * Suppression du compte (droit à l'effacement). Les demandes restent
 * enregistrées pour leur traitement, mais ne sont plus rattachées au compte.
 */
const deleteMe = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.member._id).select("+password");
  if (!(await member.comparePassword(req.body.password))) {
    throw ApiError.badRequest("Mot de passe incorrect", [{ field: "password", message: "Mot de passe incorrect" }]);
  }
  await Promise.all(Object.values(KINDS).map(({ model }) => model.updateMany({ member: member._id }, { $set: { member: null } })));
  await member.deleteOne();
  res.clearCookie(MEMBER_COOKIE, { path: "/" });
  res.status(204).end();
});

// --- Suivi des demandes -----------------------------------------------------

async function collectRequests(member) {
  const lists = await Promise.all(
    Object.entries(KINDS).map(async ([kind, def]) => {
      let query = def.model.find({ member: member._id }).select(def.fields).sort({ createdAt: -1 });
      if (def.populate) query = query.populate(def.populate);
      const docs = await query.lean({ virtuals: false });
      return docs.map((doc) => ({
        id: String(doc._id),
        kind,
        kindLabel: def.label,
        ...def.summary(doc),
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));
    }),
  );
  return lists.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

const listRequests = asyncHandler(async (req, res) => {
  let items = await collectRequests(req.member);
  if (req.query.kind && KINDS[req.query.kind]) items = items.filter((i) => i.kind === req.query.kind);
  if (req.query.state === "open") items = items.filter((i) => OPEN_STATUSES.includes(i.status));
  if (req.query.state === "closed") items = items.filter((i) => !OPEN_STATUSES.includes(i.status));
  res.json({ items, total: items.length });
});

const getRequest = asyncHandler(async (req, res) => {
  const def = KINDS[req.params.kind];
  if (!def) throw ApiError.notFound("Type de demande inconnu");

  let query = def.model.findOne({ _id: req.params.id, member: req.member._id }).select(def.fields);
  if (def.populate) query = query.populate(def.populate);
  const doc = await query;
  if (!doc) throw ApiError.notFound("Demande introuvable");

  // Historique visible du client : création et changements de statut, sans
  // les commentaires internes ni le nom des membres de l'équipe.
  let timeline = [];
  if (req.params.kind === "business-requests") {
    const events = await RequestEvent.find({ request: doc._id, eventType: { $in: ["created", "status_change"] } })
      .sort({ createdAt: 1 })
      .select("eventType fromStatus toStatus createdAt");
    timeline = events.map((e) => ({ type: e.eventType, fromStatus: e.fromStatus, toStatus: e.toStatus, at: e.createdAt }));
  } else {
    timeline = [{ type: "created", toStatus: null, at: doc.createdAt }];
    if (doc.updatedAt && doc.updatedAt.getTime() - doc.createdAt.getTime() > 1000) {
      timeline.push({ type: "updated", toStatus: doc.status, at: doc.updatedAt });
    }
  }

  res.json({ item: { ...doc.toJSON(), kind: req.params.kind, kindLabel: def.label, ...def.summary(doc) }, timeline });
});

/** Vue d'ensemble pour l'accueil de l'espace client. */
const overview = asyncHandler(async (req, res) => {
  const items = await collectRequests(req.member);
  const byKind = Object.fromEntries(Object.keys(KINDS).map((kind) => [kind, items.filter((i) => i.kind === kind).length]));
  const open = items.filter((i) => OPEN_STATUSES.includes(i.status)).length;
  const completed = items.filter((i) => ["completed", "accepted", "placed"].includes(i.status)).length;

  const m = req.member;
  const checks = [Boolean(m.fullName), Boolean(m.phone), Boolean(m.city), m.emailVerified, m.accountType !== "entreprise" || Boolean(m.companyName)];
  const profileCompletion = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  res.json({
    total: items.length,
    open,
    completed,
    byKind,
    latest: items.slice(0, 5),
    profileCompletion,
  });
});

module.exports = {
  register,
  login,
  logout,
  me,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  deleteMe,
  listRequests,
  getRequest,
  overview,
  KINDS,
};
