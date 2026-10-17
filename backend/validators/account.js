const { z } = require("zod");

const { email, optionalText, bool } = require("./common");
const { ACCOUNT_TYPES } = require("../models/Member");

/** Schémas de l'espace client du site public. */

const password = z.string().min(8, "8 caractères minimum").max(200);
const fullName = z.string().trim().min(2, "Nom trop court").max(120);
const accountType = z.enum(ACCOUNT_TYPES, { message: "Type de compte invalide" });

const register = z.object({
  fullName,
  email,
  password,
  accountType: accountType.default("candidat"),
  phone: optionalText(40),
  companyName: optionalText(180),
  newsletter: bool.optional(),
});

const login = z.object({ email, password: z.string().min(1, "Mot de passe requis") });

const updateProfile = z.object({
  fullName: fullName.optional(),
  accountType: accountType.optional(),
  phone: optionalText(40),
  companyName: optionalText(180),
  city: optionalText(120),
  avatarUrl: optionalText(500),
  newsletter: bool.optional(),
});

const changePassword = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: password,
});

const forgotPassword = z.object({ email });

const resetPassword = z.object({
  token: z.string().trim().min(10, "Lien invalide"),
  password,
});

const verifyEmail = z.object({ token: z.string().trim().min(10, "Lien invalide") });

const deleteAccount = z.object({ password: z.string().min(1, "Mot de passe requis") });

module.exports = {
  register,
  login,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteAccount,
};
