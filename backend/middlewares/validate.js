const ApiError = require("../utils/ApiError");

// Valide req.body avec un schéma Zod et remplace le body par la version parsée.
module.exports = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return next(ApiError.badRequest(details[0]?.message || "Données invalides", details));
  }
  req.body = result.data;
  next();
};
