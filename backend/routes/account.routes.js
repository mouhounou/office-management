const express = require("express");
const { rateLimit } = require("express-rate-limit");

const ctrl = require("../controllers/account.controller");
const validate = require("../middlewares/validate");
const { protectMember } = require("../middlewares/memberAuth");
const schemas = require("../validators/account");

/**
 * Espace client du site public (/api/account). Comptes distincts de ceux du
 * back-office : voir models/Member.js.
 */
const router = express.Router();

const limiter = (limit, message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: { message } },
  });

const authLimiter = limiter(20, "Trop de tentatives. Réessayez dans quelques minutes.");
// L'envoi d'emails coûte : limite plus stricte sur les liens de récupération.
const mailLimiter = limiter(5, "Trop de demandes d'email. Réessayez dans quelques minutes.");

// --- Accès ------------------------------------------------------------------
router.post("/register", authLimiter, validate(schemas.register), ctrl.register);
router.post("/login", authLimiter, validate(schemas.login), ctrl.login);
router.post("/logout", ctrl.logout);
router.post("/forgot-password", mailLimiter, validate(schemas.forgotPassword), ctrl.forgotPassword);
router.post("/reset-password", authLimiter, validate(schemas.resetPassword), ctrl.resetPassword);
router.post("/verify-email", authLimiter, validate(schemas.verifyEmail), ctrl.verifyEmail);

// --- Compte connecté --------------------------------------------------------
router.get("/me", protectMember, ctrl.me);
router.patch("/me", protectMember, validate(schemas.updateProfile), ctrl.updateMe);
router.delete("/me", protectMember, validate(schemas.deleteAccount), ctrl.deleteMe);
router.post("/change-password", protectMember, validate(schemas.changePassword), ctrl.changePassword);
router.post("/resend-verification", protectMember, mailLimiter, ctrl.resendVerification);

// --- Suivi des demandes -----------------------------------------------------
router.get("/overview", protectMember, ctrl.overview);
router.get("/requests", protectMember, ctrl.listRequests);
router.get("/requests/:kind/:id", protectMember, ctrl.getRequest);

module.exports = router;
