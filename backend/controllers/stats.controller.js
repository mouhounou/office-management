const BusinessRequest = require("../models/BusinessRequest");
const QuoteRequest = require("../models/QuoteRequest");
const PreRegistration = require("../models/PreRegistration");
const Application = require("../models/Application");
const Offer = require("../models/Offer");
const Formation = require("../models/Formation");
const Post = require("../models/Post");
const Subscriber = require("../models/Subscriber");
const Media = require("../models/Media");
const User = require("../models/User");
const Message = require("../models/Message");
const asyncHandler = require("../utils/asyncHandler");

/** { new: 3, completed: 1 } à partir d'un $group Mongo. */
function toStatusMap(rows) {
  return rows.reduce((acc, row) => ({ ...acc, [row._id ?? "inconnu"]: row.count }), {});
}

const groupByStatus = (model) =>
  model.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

/** Agrégats du tableau de bord : compteurs, répartitions et derniers arrivages.
 *  Huit éléments par flux : la liste du tableau de bord est bornée en hauteur et
 *  défile, autant y mettre de la matière. */
/** Dépôts des 30 derniers jours et des 30 précédents, pour afficher une tendance. */
async function trend(model) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const [current, previous] = await Promise.all([
    model.countDocuments({ createdAt: { $gte: new Date(now - 30 * day) } }),
    model.countDocuments({ createdAt: { $gte: new Date(now - 60 * day), $lt: new Date(now - 30 * day) } }),
  ]);
  return { current, previous };
}

/** Demandes business encore ouvertes, par personne assignée. */
async function teamWorkload() {
  const open = await BusinessRequest.find({
    status: { $in: ["new", "in_review", "in_progress"] },
    assignedTo: { $ne: null },
  })
    .sort({ updatedAt: -1 })
    .select("title status assignedTo")
    .populate("assignedTo", "fullName email role")
    .lean();

  const byUser = new Map();
  for (const request of open) {
    if (!request.assignedTo) continue;
    const key = String(request.assignedTo._id);
    if (!byUser.has(key)) {
      byUser.set(key, {
        id: key,
        fullName: request.assignedTo.fullName,
        email: request.assignedTo.email,
        open: 0,
        // La plus récemment mise à jour : ce sur quoi la personne travaille.
        current: { id: String(request._id), title: request.title, status: request.status },
      });
    }
    byUser.get(key).open += 1;
  }
  return [...byUser.values()].sort((a, b) => b.open - a.open).slice(0, 6);
}

const dashboard = asyncHandler(async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    businessTotal,
    businessNew,
    businessRecent,
    businessByStatus,
    quotesTotal,
    quotesNew,
    quotesByStatus,
    preTotal,
    preNew,
    preByStatus,
    applicationsTotal,
    applicationsNew,
    applicationsByStatus,
    offersTotal,
    offersPublished,
    formationsTotal,
    formationsPublished,
    postsTotal,
    postsPublished,
    subscribersTotal,
    subscribersRecent,
    mediaTotal,
    usersTotal,
    latestBusiness,
    latestQuotes,
    latestPreRegistrations,
    latestApplications,
    messagesTotal,
    messagesNew,
    latestMessages,
    businessTrend,
    quotesTrend,
    preTrend,
    applicationsTrend,
    messagesTrend,
    nextAppointment,
    team,
  ] = await Promise.all([
    BusinessRequest.countDocuments(),
    BusinessRequest.countDocuments({ status: "new" }),
    BusinessRequest.countDocuments({ createdAt: { $gte: since } }),
    groupByStatus(BusinessRequest),
    QuoteRequest.countDocuments(),
    QuoteRequest.countDocuments({ status: "new" }),
    groupByStatus(QuoteRequest),
    PreRegistration.countDocuments(),
    PreRegistration.countDocuments({ status: "new" }),
    groupByStatus(PreRegistration),
    Application.countDocuments(),
    Application.countDocuments({ status: "submitted" }),
    groupByStatus(Application),
    Offer.countDocuments(),
    Offer.countDocuments({ published: true }),
    Formation.countDocuments(),
    Formation.countDocuments({ published: true }),
    Post.countDocuments(),
    Post.countDocuments({ published: true }),
    Subscriber.countDocuments({ active: true }),
    Subscriber.countDocuments({ createdAt: { $gte: since } }),
    Media.countDocuments(),
    User.countDocuments({ active: true }),
    BusinessRequest.find().sort({ createdAt: -1 }).limit(8).select("title companyName type status createdAt"),
    QuoteRequest.find().sort({ createdAt: -1 }).limit(8).select("name company pole status createdAt"),
    PreRegistration.find().sort({ createdAt: -1 }).limit(8).select("fullName training status createdAt"),
    Application.find().sort({ createdAt: -1 }).limit(8).select("fullName email status createdAt"),
    Message.countDocuments(),
    Message.countDocuments({ status: "new" }),
    Message.find().sort({ createdAt: -1 }).limit(8).select("name kind subject reason status createdAt"),
    trend(BusinessRequest),
    trend(QuoteRequest),
    trend(PreRegistration),
    trend(Application),
    trend(Message),
    Message.findOne({
      kind: "rendez-vous",
      preferredDate: { $gte: startOfToday },
      status: { $nin: ["completed", "cancelled"] },
    })
      .sort({ preferredDate: 1 })
      .select("name email phone reason preferredDate timeSlot status"),
    teamWorkload(),
  ]);

  res.json({
    counts: {
      businessRequests: { total: businessTotal, pending: businessNew, last30Days: businessRecent },
      quotes: { total: quotesTotal, pending: quotesNew },
      preRegistrations: { total: preTotal, pending: preNew },
      applications: { total: applicationsTotal, pending: applicationsNew },
      offers: { total: offersTotal, published: offersPublished },
      formations: { total: formationsTotal, published: formationsPublished },
      posts: { total: postsTotal, published: postsPublished },
      subscribers: { total: subscribersTotal, last30Days: subscribersRecent },
      media: { total: mediaTotal },
      users: { total: usersTotal },
      messages: { total: messagesTotal, pending: messagesNew },
    },
    byStatus: {
      businessRequests: toStatusMap(businessByStatus),
      quotes: toStatusMap(quotesByStatus),
      preRegistrations: toStatusMap(preByStatus),
      applications: toStatusMap(applicationsByStatus),
    },
    latest: {
      businessRequests: latestBusiness,
      quotes: latestQuotes,
      preRegistrations: latestPreRegistrations,
      applications: latestApplications,
      messages: latestMessages,
    },
    trends: {
      businessRequests: businessTrend,
      quotes: quotesTrend,
      preRegistrations: preTrend,
      applications: applicationsTrend,
      messages: messagesTrend,
    },
    nextAppointment,
    team,
  });
});

/**
 * Activité hebdomadaire des dépôts, pour le graphique du tableau de bord.
 *
 * Le regroupement est fait en JavaScript sur les seules dates de création :
 * les volumes sont faibles et cela évite de dépendre de `$dateTrunc`, absent
 * des versions de MongoDB antérieures à la 5.0.
 */
const activity = asyncHandler(async (req, res) => {
  const weeks = Math.min(26, Math.max(4, Number(req.query.weeks) || 12));

  // Semaines commençant le lundi.
  const startOfWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d;
  };

  const firstWeek = startOfWeek(new Date());
  firstWeek.setDate(firstWeek.getDate() - (weeks - 1) * 7);

  const buckets = Array.from({ length: weeks }, (_, index) => {
    const start = new Date(firstWeek);
    start.setDate(start.getDate() + index * 7);
    return {
      week: start.toISOString().slice(0, 10),
      businessRequests: 0,
      quotes: 0,
      preRegistrations: 0,
      applications: 0,
    };
  });

  const indexOfWeek = (date) => {
    const diff = startOfWeek(date).getTime() - firstWeek.getTime();
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  };

  const since = { createdAt: { $gte: firstWeek } };
  const [business, quotes, preRegistrations, applications] = await Promise.all([
    BusinessRequest.find(since).select("createdAt").lean(),
    QuoteRequest.find(since).select("createdAt").lean(),
    PreRegistration.find(since).select("createdAt").lean(),
    Application.find(since).select("createdAt").lean(),
  ]);

  const fill = (rows, key) => {
    for (const row of rows) {
      const index = indexOfWeek(row.createdAt);
      if (index >= 0 && index < buckets.length) buckets[index][key] += 1;
    }
  };

  fill(business, "businessRequests");
  fill(quotes, "quotes");
  fill(preRegistrations, "preRegistrations");
  fill(applications, "applications");

  res.json({ weeks: buckets, from: firstWeek.toISOString() });
});

module.exports = { dashboard, activity };
