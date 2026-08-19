const express = require("express");
const ctrl = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.get("/bootstrap-status", ctrl.bootstrapStatus);
router.post("/register", validate(ctrl.schemas.registerSchema), ctrl.register);
router.post("/login", validate(ctrl.schemas.loginSchema), ctrl.login);
router.post("/logout", ctrl.logout);

router.get("/me", protect, ctrl.me);
router.patch("/me", protect, validate(ctrl.schemas.updateMeSchema), ctrl.updateMe);
router.post("/change-password", protect, validate(ctrl.schemas.changePasswordSchema), ctrl.changePassword);

module.exports = router;
