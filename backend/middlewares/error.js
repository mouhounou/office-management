const { isProduction } = require("../config/env");

function notFound(req, _res, next) {
  next(Object.assign(new Error(`Route introuvable : ${req.method} ${req.originalUrl}`), { status: 404, expected: true }));
}

// eslint-disable-next-line no-unused-vars -- Express identifie le handler d'erreur par son arité (4 args).
function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || "Erreur serveur";
  let details = err.details;

  // Erreurs Mongoose traduites en réponses lisibles.
  if (err.name === "ValidationError") {
    status = 400;
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = details[0]?.message || "Données invalides";
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "champ";
    message = field === "email" ? "Cet email est déjà utilisé" : `Valeur déjà utilisée (${field})`;
  } else if (err.name === "CastError") {
    status = 400;
    message = "Identifiant invalide";
  }

  if (status >= 500) {
    console.error(err);
    if (isProduction) message = "Erreur serveur";
  }

  res.status(status).json({ error: { message, ...(details ? { details } : {}) } });
}

module.exports = { notFound, errorHandler };
