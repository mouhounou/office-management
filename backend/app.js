const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { corsOrigins } = require("./config/env");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, cb) {
      // Requêtes sans Origin (curl, server-to-server depuis Next) autorisées.
      if (!origin || corsOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origine non autorisée : ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
