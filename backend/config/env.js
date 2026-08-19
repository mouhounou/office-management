require("dotenv").config();

const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(
    `Variables d'environnement manquantes : ${missing.join(", ")}. Copiez .env.example vers .env.`,
  );
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  // Plusieurs origines possibles, séparées par des virgules (admin, site user…).
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
