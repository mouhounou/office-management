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
  mail: {
    host: process.env.EMAIL_HOST,
    // Le port 465 impose SSL dès la connexion ; 587 passe par STARTTLS.
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    requireTls: String(process.env.EMAIL_USE_TLS).toLowerCase() === "true",
    user: process.env.EMAIL_HOST_USER,
    password: process.env.EMAIL_HOST_PASSWORD,
    // Expéditeur affiché ; à défaut, le compte SMTP lui-même.
    from: process.env.EMAIL_FROM || process.env.EMAIL_HOST_USER,
    fromName: process.env.EMAIL_FROM_NAME || "Office Management",
    // Destinataire des notifications internes ; à défaut, l'email de contact
    // renseigné dans les paramètres du site (voir services/mail.service.js).
    adminRecipient: process.env.EMAIL_ADMIN,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  // Derrière un proxy (Render, Railway, Nginx…), nombre de sauts à croire pour
  // l'IP du visiteur : indispensable au bon fonctionnement des limites de débit.
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
