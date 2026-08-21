const express = require("express");

const validate = require("../middlewares/validate");
const { canView, canEdit, adminOnly } = require("../middlewares/guards");
const { crudController } = require("../controllers/crud.factory");
const { RESOURCES } = require("./resource-definitions");
const Subscriber = require("../models/Subscriber");

/**
 * Monte un CRUD complet à partir d'une définition de ressource :
 *   GET /  ·  GET /:id  ·  POST /  ·  PATCH /:id  ·  DELETE /:id
 * Lecture pour tout compte connecté, écriture pour editor/admin, suppression
 * selon `deleteRole`.
 */
function resourceRouter(definition) {
  const { createSchema, updateSchema, deleteRole, filters, extraRoutes } = definition;
  const router = express.Router();

  const ctrl = crudController({
    model: definition.model,
    searchFields: definition.searchFields,
    filterFields: (filters ?? []).map((filter) => filter.name),
    sortFields: definition.sortFields,
    populate: definition.populate,
    beforeCreate: definition.beforeCreate,
    afterUpdate: definition.afterUpdate,
  });

  // Enregistrées avant `/:id`, sinon "/export/csv" serait pris pour un id.
  if (extraRoutes) extraRoutes(router);

  router.get("/", canView, ctrl.list);
  router.get("/:id", canView, ctrl.getOne);
  router.post("/", canEdit, validate(createSchema), ctrl.create);
  router.patch("/:id", canEdit, validate(updateSchema), ctrl.update);
  router.delete("/:id", deleteRole === "editor" ? canEdit : adminOnly, ctrl.remove);

  return router;
}

/** Export CSV de la liste de diffusion (bouton « Exporter » de l'admin). */
function subscribersCsv(router) {
  router.get("/export/csv", canView, async (req, res, next) => {
    try {
      const filter = req.query.active === "false" ? {} : { active: true };
      const rows = await Subscriber.find(filter).sort({ createdAt: -1 });
      const csv = [
        "email,source,actif,inscrit_le",
        ...rows.map((r) =>
          [
            r.email,
            r.source ?? "",
            r.active ? "oui" : "non",
            r.createdAt.toISOString().slice(0, 10),
          ].join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="abonnes-newsletter.csv"');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  });
}

const EXTRA_ROUTES = { subscribers: subscribersCsv };

/** Monte toutes les ressources déclarées sur le routeur parent. */
function mountResources(parent) {
  for (const definition of RESOURCES) {
    parent.use(
      `/${definition.path}`,
      resourceRouter({ ...definition, extraRoutes: EXTRA_ROUTES[definition.path] }),
    );
  }
}

module.exports = { mountResources };
