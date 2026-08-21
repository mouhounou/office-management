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
const asyncHandler = require("../utils/asyncHandler");

/** { new: 3, completed: 1 } à partir d'un $group Mongo. */
function toStatusMap(rows) {
  return rows.reduce((acc, row) => ({ ...acc, [row._id ?? "inconnu"]: row.count }), {});
}

const groupByStatus = (model) =>
  model.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

/** Agrégats du tableau de bord : compteurs, répartitions et derniers arrivages. */
const dashboard = asyncHandler(async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);

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
    BusinessRequest.find().sort({ createdAt: -1 }).limit(5).select("title companyName type status createdAt"),
    QuoteRequest.find().sort({ createdAt: -1 }).limit(5).select("name company pole status createdAt"),
    PreRegistration.find().sort({ createdAt: -1 }).limit(5).select("fullName training status createdAt"),
    Application.find().sort({ createdAt: -1 }).limit(5).select("fullName email status createdAt"),
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
    },
  });
});

module.exports = { dashboard };
