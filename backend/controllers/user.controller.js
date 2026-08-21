const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, parseSort, buildSearch } = require("../utils/pagination");

const SEARCH_FIELDS = ["fullName", "email"];

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const sort = parseSort(req.query, ["createdAt", "fullName", "email", "role", "lastLoginAt"]);

  const filter = {};
  if (req.query.role && req.query.role !== "all") filter.role = req.query.role;
  if (req.query.active === "true" || req.query.active === "false") {
    filter.active = req.query.active === "true";
  }
  const search = buildSearch(req.query, SEARCH_FIELDS);

  const finalFilter = search ? { ...filter, ...search } : filter;
  const [items, total] = await Promise.all([
    User.find(finalFilter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(finalFilter),
  ]);

  res.json({ items, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
});

const getOne = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("Utilisateur introuvable");
  res.json({ item: user });
});

const create = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ item: user });
});

const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("Utilisateur introuvable");

  const isSelf = String(user._id) === String(req.user._id);
  const { password, ...rest } = req.body;

  // Un admin ne peut ni se rétrograder ni se désactiver : il se couperait l'accès
  // et le back-office pourrait se retrouver sans aucun administrateur actif.
  if (isSelf && rest.role && rest.role !== user.role) {
    throw ApiError.badRequest("Vous ne pouvez pas modifier votre propre rôle");
  }
  if (isSelf && rest.active === false) {
    throw ApiError.badRequest("Vous ne pouvez pas désactiver votre propre compte");
  }
  if (!isSelf && user.role === "admin" && (rest.role === "editor" || rest.role === "viewer")) {
    await ensureAnotherAdminRemains(user._id);
  }

  Object.assign(user, rest);
  if (password) user.password = password; // le hook pre-save hache et invalide les tokens
  await user.save();

  res.json({ item: user });
});

const remove = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw ApiError.badRequest("Vous ne pouvez pas supprimer votre propre compte");
  }
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("Utilisateur introuvable");
  if (user.role === "admin") await ensureAnotherAdminRemains(user._id);

  await user.deleteOne();
  res.status(204).end();
});

async function ensureAnotherAdminRemains(excludedId) {
  const remaining = await User.countDocuments({
    role: "admin",
    active: true,
    _id: { $ne: excludedId },
  });
  if (remaining === 0) {
    throw ApiError.badRequest("Il doit rester au moins un administrateur actif");
  }
}

/** Liste allégée pour les menus d'assignation des demandes. */
const assignable = asyncHandler(async (_req, res) => {
  const items = await User.find({ active: true, role: { $in: ["admin", "editor"] } })
    .select("fullName email role")
    .sort({ fullName: 1 });
  res.json({ items });
});

module.exports = { list, getOne, create, update, remove, assignable };
