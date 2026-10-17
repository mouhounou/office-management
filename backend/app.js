const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { corsOrigins } = require("./config/env");
const routes = require("./routes");
const { mountDocs } = require("./docs");
const { notFound, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, cb) {
      // Requêtes sans Origin (curl, appels serveur à serveur depuis Next) autorisées.
      // Une origine inconnue ne reçoit simplement pas d'en-tête CORS : le
      // navigateur bloque de lui-même, sans transformer cela en erreur 500.
      cb(null, !origin || corsOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Le cookie de session part en SameSite=None en production : sans ce contrôle,
// un formulaire posté depuis un autre site agirait au nom d'un admin connecté
// (CSRF). Les navigateurs joignent toujours Origin à un POST cross-site.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
app.use((req, _res, next) => {
  const { origin } = req.headers;
  if (SAFE_METHODS.has(req.method) || !origin || corsOrigins.includes(origin)) return next();
  next(ApiError.forbidden("Origine non autorisée"));
});

// Documentation interactive : /api/docs (et /api/docs.json).
mountDocs(app);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
