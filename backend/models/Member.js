const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { toJSONPlugin } = require("./plugins");

// Comptes du site public (candidats et entreprises). Distincts des comptes du
// back-office (User) : un client ne peut jamais accéder à l'admin, et ses
// jetons sont refusés par le middleware `protect`.
const ACCOUNT_TYPES = ["candidat", "entreprise"];

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    accountType: { type: String, enum: ACCOUNT_TYPES, default: "candidat", index: true },
    phone: { type: String, trim: true, maxlength: 40, default: null },
    companyName: { type: String, trim: true, maxlength: 180, default: null },
    city: { type: String, trim: true, maxlength: 120, default: null },
    avatarUrl: { type: String, default: null },
    newsletter: { type: Boolean, default: false },

    active: { type: Boolean, default: true, index: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
    tokensValidFrom: { type: Date, default: Date.now },

    // Jetons à usage unique : seule leur empreinte SHA-256 est stockée.
    emailVerificationToken: { type: String, select: false, default: null },
    emailVerificationExpires: { type: Date, select: false, default: null },
    passwordResetToken: { type: String, select: false, default: null },
    passwordResetExpires: { type: Date, select: false, default: null },
  },
  { timestamps: true },
);

memberSchema.plugin(toJSONPlugin, {
  hidden: [
    "password",
    "tokensValidFrom",
    "emailVerificationToken",
    "emailVerificationExpires",
    "passwordResetToken",
    "passwordResetExpires",
  ],
});

memberSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.tokensValidFrom = new Date();
});

memberSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

memberSchema.methods.isTokenStale = function isTokenStale(issuedAtSeconds) {
  if (!this.tokensValidFrom) return false;
  return issuedAtSeconds * 1000 < this.tokensValidFrom.getTime() - 1000;
};

const hash = (token) => crypto.createHash("sha256").update(token).digest("hex");

/**
 * Crée un jeton à usage unique (`kind` : "emailVerification" ou "passwordReset")
 * et renvoie sa valeur en clair, à transmettre par email uniquement.
 */
memberSchema.methods.issueToken = function issueToken(kind, ttlMinutes) {
  const token = crypto.randomBytes(32).toString("hex");
  this[`${kind}Token`] = hash(token);
  this[`${kind}Expires`] = new Date(Date.now() + ttlMinutes * 60 * 1000);
  return token;
};

/** Retrouve le compte associé à un jeton encore valide. */
memberSchema.statics.findByToken = function findByToken(kind, token) {
  return this.findOne({
    [`${kind}Token`]: hash(String(token)),
    [`${kind}Expires`]: { $gt: new Date() },
  }).select(`+${kind}Token +${kind}Expires`);
};

module.exports = mongoose.model("Member", memberSchema);
module.exports.ACCOUNT_TYPES = ACCOUNT_TYPES;
