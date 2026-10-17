const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination } = require("../utils/pagination");

/**
 * Notifications internes, vues depuis le compte connecté : celles diffusées à
 * toute l'équipe (`user: null`) et celles qui lui sont adressées. Chaque
 * notification renvoie un booléen `read` calculé à partir de `readBy`.
 */

const visibleTo = (user) => ({ $or: [{ user: null }, { user: user._id }] });

function serialize(doc, user) {
  const json = doc.toJSON();
  json.read = (doc.readBy ?? []).some((id) => String(id) === String(user._id));
  delete json.readBy;
  return json;
}

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = visibleTo(req.user);
  if (req.query.unread === "true") filter.readBy = { $ne: req.user._id };

  const [items, total, unread] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ ...visibleTo(req.user), readBy: { $ne: req.user._id } }),
  ]);

  res.json({
    items: items.map((doc) => serialize(doc, req.user)),
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
    unread,
  });
});

const unreadCount = asyncHandler(async (req, res) => {
  const unread = await Notification.countDocuments({
    ...visibleTo(req.user),
    readBy: { $ne: req.user._id },
  });
  res.json({ unread });
});

const create = asyncHandler(async (req, res) => {
  const doc = await Notification.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ item: serialize(doc, req.user) });
});

const markRead = asyncHandler(async (req, res) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: req.params.id, ...visibleTo(req.user) },
    { $addToSet: { readBy: req.user._id } },
    { returnDocument: "after" },
  );
  if (!doc) throw ApiError.notFound();
  res.json({ item: serialize(doc, req.user) });
});

const markAllRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { ...visibleTo(req.user), readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } },
  );
  res.json({ updated: result.modifiedCount });
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Notification.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound();
  res.status(204).end();
});

module.exports = { list, unreadCount, create, markRead, markAllRead, remove };
