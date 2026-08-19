const { z } = require("zod");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/token");
const { isProduction } = require("../config/env");

const email = z.string().trim().toLowerCase().email("Email invalide").max(180);
const password = z.string().min(8, "8 caractères minimum").max(200);

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Nom trop court").max(120),
  email,
  password,
});

const loginSchema = z.object({ email, password: z.string().min(1, "Mot de passe requis") });

const updateMeSchema = z.object({
  fullName: z.string().trim().min(2, "Nom trop court").max(120).optional(),
  avatarUrl: z.string().url("URL invalide").max(500).nullable().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: password,
});

const COOKIE_NAME = "om_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function issueSession(res, user) {
  const token = signToken(user);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return { token, user: user.toJSON() };
}

// Indique à l'admin s'il faut proposer la création du premier compte.
const bootstrapStatus = asyncHandler(async (_req, res) => {
  const count = await User.estimatedDocumentCount();
  res.json({ needsBootstrap: count === 0 });
});

// Ouvert uniquement tant qu'aucun compte n'existe : le premier inscrit est admin.
// Ensuite, la création passe par la gestion des utilisateurs (réservée aux admins).
const register = asyncHandler(async (req, res) => {
  const count = await User.estimatedDocumentCount();
  if (count > 0) {
    throw ApiError.forbidden("L'inscription est fermée. Demandez à un administrateur de créer votre compte.");
  }

  const user = await User.create({ ...req.body, role: "admin", lastLoginAt: new Date() });
  res.status(201).json(issueSession(res, user));
});

const login = asyncHandler(async (req, res) => {
  const { email: mail, password: pwd } = req.body;
  const user = await User.findOne({ email: mail }).select("+password");

  // Message unique volontairement : ne pas révéler si l'email existe.
  if (!user || !(await user.comparePassword(pwd))) {
    throw ApiError.unauthorized("Email ou mot de passe incorrect");
  }
  if (!user.active) throw ApiError.forbidden("Ce compte a été désactivé");

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json(issueSession(res, user));
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(204).end();
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

const updateMe = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ user: req.user.toJSON() });
});

// Le hook pre-save met à jour tokensValidFrom : les anciens JWT sont invalidés,
// on ré-émet donc une session pour ne pas déconnecter l'utilisateur courant.
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw ApiError.badRequest("Mot de passe actuel incorrect");
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json(issueSession(res, user));
});

module.exports = {
  schemas: { registerSchema, loginSchema, updateMeSchema, changePasswordSchema },
  bootstrapStatus,
  register,
  login,
  logout,
  me,
  updateMe,
  changePassword,
};
