const express = require("express");
const { rateLimit } = require("express-rate-limit");
const ctrl = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Freine le test de mots de passe en rafale ; les connexions réussies ne comptent pas.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: { message: "Trop de tentatives de connexion. Réessayez dans quelques minutes." },
  },
});

router.get("/bootstrap-status", ctrl.bootstrapStatus);
router.post("/register", validate(ctrl.schemas.registerSchema), ctrl.register);
router.post("/login", loginLimiter, validate(ctrl.schemas.loginSchema), ctrl.login);
router.post("/logout", ctrl.logout);

router.get("/me", protect, ctrl.me);
router.patch("/me", protect, validate(ctrl.schemas.updateMeSchema), ctrl.updateMe);
router.post("/change-password", protect, validate(ctrl.schemas.changePasswordSchema), ctrl.changePassword);

module.exports = router;
