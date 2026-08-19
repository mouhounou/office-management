const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Rôles du back-office. Le premier compte créé devient automatiquement "admin"
// (équivalent du trigger grant_first_user_admin de l'ancien schéma Supabase).
const ROLES = ["admin", "editor", "viewer"];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Le nom complet est requis"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "viewer",
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    avatarUrl: { type: String, default: null },
    lastLoginAt: { type: Date, default: null },
    // Invalide tous les JWT émis avant cette date (changement de mot de passe,
    // désactivation…). Comparé à l'`iat` du token dans le middleware protect.
    tokensValidFrom: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

// Hook asynchrone : Mongoose 9 ne passe pas de callback `next` aux fonctions async.
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.tokensValidFrom = new Date();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// `iat` JWT est en secondes ; on tolère 1s d'écart avec la date Mongo.
userSchema.methods.isTokenStale = function isTokenStale(issuedAtSeconds) {
  if (!this.tokensValidFrom) return false;
  return issuedAtSeconds * 1000 < this.tokensValidFrom.getTime() - 1000;
};

userSchema.statics.ROLES = ROLES;

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
