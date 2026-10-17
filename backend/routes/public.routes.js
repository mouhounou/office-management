const express = require("express");
const { rateLimit } = require("express-rate-limit");

const ctrl = require("../controllers/public.controller");
const validate = require("../middlewares/validate");
const publicSchemas = require("../validators/public");
const { optionalMember } = require("../middlewares/memberAuth");

/**
 * Routes ouvertes, consommées par le site public (user/).
 * Aucune authentification : d'où la sélection stricte des champs exposés côté
 * contrôleur et la limitation de débit sur les dépôts.
 */
const router = express.Router();

// Un visiteur légitime remplit quelques formulaires, pas trente.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: { message: "Trop de demandes envoyées. Réessayez dans quelques minutes." },
  },
});

// --- Lecture ---------------------------------------------------------------
router.get("/formations", ctrl.listFormations);
router.get("/formations/:slug", ctrl.getFormation);
router.get("/posts", ctrl.listPosts);
router.get("/posts/:slug", ctrl.getPost);
router.get("/offers", ctrl.listOffers);
router.get("/offers/:id", ctrl.getOffer);
router.get("/settings", ctrl.getSettings);

// --- Dépôts ----------------------------------------------------------------
// Un visiteur connecté à son espace client voit ses dépôts rattachés à son compte.
router.use(["/quotes", "/pre-registrations", "/business-requests", "/applications", "/messages", "/appointments"], optionalMember);
router.post("/quotes", submitLimiter, validate(publicSchemas.quotePublic), ctrl.submitQuote);
router.post(
  "/pre-registrations",
  submitLimiter,
  validate(publicSchemas.preRegistrationPublic),
  ctrl.submitPreRegistration,
);
router.post(
  "/business-requests",
  submitLimiter,
  validate(publicSchemas.businessRequestPublic),
  ctrl.submitBusinessRequest,
);
router.post(
  "/applications",
  submitLimiter,
  validate(publicSchemas.applicationPublic),
  ctrl.submitApplication,
);
router.post("/subscribers", submitLimiter, validate(publicSchemas.subscriberPublic), ctrl.subscribe);
router.post("/messages", submitLimiter, validate(publicSchemas.contactMessagePublic), ctrl.submitContact);
router.post(
  "/appointments",
  submitLimiter,
  validate(publicSchemas.appointmentPublic),
  ctrl.submitAppointment,
);

module.exports = router;
