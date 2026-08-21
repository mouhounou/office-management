const express = require("express");

const validate = require("../middlewares/validate");
const { canView, canEdit, adminOnly } = require("../middlewares/guards");
const schemas = require("../validators");
const { uploadImage, uploadDocument } = require("../config/upload");

const authRoutes = require("./auth.routes");
const publicRoutes = require("./public.routes");
const { mountResources } = require("./resources.routes");
const businessCtrl = require("../controllers/businessRequest.controller");
const mediaCtrl = require("../controllers/media.controller");
const userCtrl = require("../controllers/user.controller");
const settingCtrl = require("../controllers/setting.controller");
const statsCtrl = require("../controllers/stats.controller");
const Notification = require("../models/Notification");
const { crudController } = require("../controllers/crud.factory");

const router = express.Router();

router.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));
router.use("/auth", authRoutes);
// Site public : lecture des contenus publiés et dépôt des formulaires.
router.use("/public", publicRoutes);
router.get("/stats/dashboard", canView, statsCtrl.dashboard);

// --- Demandes business (CRUD + journal + pièces jointes) --------------------
const business = express.Router();
business.get("/", canView, businessCtrl.list);
business.post("/", canEdit, validate(schemas.businessRequestCreate), businessCtrl.create);
business.get("/:id", canView, businessCtrl.getOne);
business.patch("/:id", canEdit, validate(schemas.businessRequestUpdate), businessCtrl.update);
business.delete("/:id", adminOnly, businessCtrl.remove);
business.get("/:id/events", canView, businessCtrl.listEvents);
business.post("/:id/events", canEdit, validate(schemas.requestEventCreate), businessCtrl.addEvent);
business.get("/:id/documents", canView, businessCtrl.listDocuments);
business.post("/:id/documents", canEdit, uploadDocument.single("file"), mediaCtrl.uploadRequestDocument);
business.delete("/:id/documents/:docId", canEdit, mediaCtrl.removeRequestDocument);
router.use("/business-requests", business);

// --- Médiathèque -----------------------------------------------------------
const media = express.Router();
media.get("/", canView, mediaCtrl.list);
media.post("/", canEdit, uploadImage.array("files", 10), mediaCtrl.upload);
media.get("/:id", canView, mediaCtrl.getOne);
media.patch("/:id", canEdit, validate(schemas.mediaUpdate), mediaCtrl.update);
media.delete("/:id", canEdit, mediaCtrl.remove);
router.use("/media", media);

// --- Notifications internes ------------------------------------------------
const notificationCrud = crudController({
  model: Notification,
  searchFields: ["title", "message"],
  filterFields: ["type", "user"],
  sortFields: ["createdAt"],
  populate: { path: "user", select: "fullName email" },
});
const notifications = express.Router();
notifications.get("/", canView, notificationCrud.list);
notifications.post(
  "/",
  canEdit,
  validate(schemas.notificationCreate),
  (req, _res, next) => {
    req.body.createdBy = req.user._id;
    next();
  },
  notificationCrud.create,
);
notifications.delete("/:id", canEdit, notificationCrud.remove);
router.use("/notifications", notifications);

// --- Utilisateurs (réservé aux admins, sauf la liste d'assignation) ---------
const users = express.Router();
users.get("/assignable", canView, userCtrl.assignable);
users.get("/", adminOnly, userCtrl.list);
users.post("/", adminOnly, validate(schemas.userCreate), userCtrl.create);
users.get("/:id", adminOnly, userCtrl.getOne);
users.patch("/:id", adminOnly, validate(schemas.userUpdate), userCtrl.update);
users.delete("/:id", adminOnly, userCtrl.remove);
router.use("/users", users);

// --- Paramètres du site ----------------------------------------------------
const settings = express.Router();
settings.get("/", canView, settingCtrl.list);
settings.put("/:key", adminOnly, validate(schemas.settingUpsert), settingCtrl.upsert);
router.use("/settings", settings);

// --- Ressources CRUD génériques (voir routes/resource-definitions.js) -------
mountResources(router);

module.exports = router;
