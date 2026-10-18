const mongoose = require("mongoose");
const { mongoUri, mongoDbName } = require("./env");

mongoose.set("strictQuery", true);

/** Vrai si l'URI désigne déjà une base (« mongodb://hôte/ma_base »). */
function uriHasDatabase(uri) {
  const path = uri.replace(/^mongodb(\+srv)?:\/\//, "").split("?")[0];
  const slash = path.indexOf("/");
  return slash !== -1 && path.slice(slash + 1).length > 0;
}

/**
 * Connexion MongoDB : base locale, Atlas (mongodb+srv://) ou tout service
 * compatible. Sans nom de base dans l'URI, MONGODB_DB (office_management par
 * défaut) évite d'écrire dans la base « test » de MongoDB.
 */
async function connectDB() {
  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
    ...(uriHasDatabase(mongoUri) ? {} : { dbName: mongoDbName }),
  });
  console.log(`MongoDB connecté : ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

/** État lisible de la connexion, exposé par /api/health. */
function databaseState() {
  return ["déconnecté", "connecté", "connexion", "déconnexion"][mongoose.connection.readyState] ?? "inconnu";
}

module.exports = { connectDB, databaseState };
