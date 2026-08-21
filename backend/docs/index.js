const swaggerUi = require("swagger-ui-express");

const { buildOpenApiDocument } = require("./openapi");

/**
 * Documentation interactive Swagger UI.
 *   - /api/docs       interface d'essai
 *   - /api/docs.json  document OpenAPI brut (import Postman, génération de client…)
 *
 * Le document est construit une fois au démarrage : il dépend uniquement du code
 * (définitions de ressources + schémas Zod), pas de l'état de la base.
 */
function mountDocs(app) {
  const document = buildOpenApiDocument();

  app.get("/api/docs.json", (_req, res) => res.json(document));

  app.use(
    "/api/docs",
    // Sert les fichiers statiques de Swagger UI, puis la page configurée.
    swaggerUi.serveFiles(document, {}),
    swaggerUi.setup(document, {
      customSiteTitle: "API Office Management",
      swaggerOptions: {
        // Garde le jeton saisi dans « Authorize » d'un rechargement à l'autre.
        persistAuthorization: true,
        // Sections dépliées, opérations repliées : on voit tout de suite le sommaire.
        docExpansion: "list",
        filter: true,
        tagsSorter: "alpha",
      },
    }),
  );
}

module.exports = { mountDocs };
