const { protect, authorize } = require("./auth");

/**
 * Trois niveaux d'accès, réutilisés par toutes les routes :
 *  - canView  : tout compte connecté (viewer inclus) — lecture seule
 *  - canEdit  : editor et admin — création / mise à jour du contenu et des demandes
 *  - adminOnly: admin — suppressions, utilisateurs, paramètres du site
 */
const canView = [protect];
const canEdit = [protect, authorize("admin", "editor")];
const adminOnly = [protect, authorize("admin")];

module.exports = { canView, canEdit, adminOnly };
