const accountSchemas = require("../validators/account");
const schemas = require("../validators");

/**
 * Espace client du site public (/account) et gestion de ces comptes depuis
 * l'admin (/members). Les jetons clients sont distincts de ceux de l'équipe :
 * ils sont refusés partout ailleurs que sous /account.
 */
function buildAccountPaths(jsonSchema) {
  const item = { type: "object", additionalProperties: true };
  const json = (schema) => ({ content: { "application/json": { schema } } });
  const body = (schema) => ({ required: true, content: { "application/json": { schema: jsonSchema(schema) } } });
  const error = (description) => ({ description, ...json({ $ref: "#/components/schemas/Error" }) });
  const session = { description: "Session ouverte", ...json({ type: "object", properties: { token: { type: "string" }, member: item } }) };
  const member = [{ memberBearer: [] }, { memberCookie: [] }];
  const tags = ["Espace client"];
  const open = (summary, description, schema, responses) => ({
    tags,
    summary,
    description,
    security: [],
    requestBody: body(schema),
    responses: { ...responses, 400: error("Données invalides"), 429: error("Trop de tentatives") },
  });
  const auth = (summary, extra = {}) => ({ tags, summary, security: member, ...extra, responses: { 200: { description: "OK", ...json(item) }, 401: error("Non connecté"), ...(extra.responses ?? {}) } });
  const idParam = { name: "id", in: "path", required: true, schema: { type: "string" } };

  return {
    "/account/register": {
      post: open(
        "Créer un compte client",
        "Ouvre la session et envoie un email de vérification. Une fois l'adresse vérifiée, les demandes déjà envoyées avec cet email sont rattachées au compte.",
        accountSchemas.register,
        { 201: session, 409: error("Un compte existe déjà avec cet email") },
      ),
    },
    "/account/login": {
      post: open("Se connecter", undefined, accountSchemas.login, { 200: session, 401: error("Identifiants incorrects"), 403: error("Compte désactivé") }),
    },
    "/account/logout": {
      post: { tags, summary: "Se déconnecter", security: [], responses: { 204: { description: "Cookie effacé" } } },
    },
    "/account/forgot-password": {
      post: open(
        "Mot de passe oublié",
        "Envoie un lien de réinitialisation valable 1 heure. Réponse identique que l'adresse ait un compte ou non.",
        accountSchemas.forgotPassword,
        { 200: { description: "Demande prise en compte", ...json({ type: "object", properties: { ok: { type: "boolean" } } }) } },
      ),
    },
    "/account/reset-password": {
      post: open(
        "Réinitialiser le mot de passe",
        "Avec le jeton reçu par email. Invalide les autres sessions et ouvre une nouvelle session.",
        accountSchemas.resetPassword,
        { 200: session },
      ),
    },
    "/account/verify-email": {
      post: open("Vérifier l'adresse email", "Avec le jeton reçu par email. Renvoie le nombre de demandes rattachées (`linked`).", accountSchemas.verifyEmail, {
        200: { description: "Adresse vérifiée", ...json({ type: "object", properties: { member: item, linked: { type: "integer" } } }) },
      }),
    },
    "/account/me": {
      get: auth("Mon compte"),
      patch: auth("Modifier mon profil", { requestBody: body(accountSchemas.updateProfile) }),
      delete: {
        tags,
        summary: "Supprimer mon compte",
        description: "Confirmé par le mot de passe. Les demandes restent enregistrées mais ne sont plus rattachées au compte.",
        security: member,
        requestBody: body(accountSchemas.deleteAccount),
        responses: { 204: { description: "Compte supprimé" }, 400: error("Mot de passe incorrect"), 401: error("Non connecté") },
      },
    },
    "/account/change-password": {
      post: auth("Changer mon mot de passe", { requestBody: body(accountSchemas.changePassword) }),
    },
    "/account/resend-verification": {
      post: auth("Renvoyer l'email de vérification"),
    },
    "/account/overview": {
      get: auth("Vue d'ensemble de mon espace", { description: "Nombre de demandes (total, en cours, abouties, par type), dernières demandes et complétude du profil." }),
    },
    "/account/requests": {
      get: auth("Mes demandes", {
        description: "Devis, pré-inscriptions, demandes Business Center, candidatures et messages rattachés au compte.",
        parameters: [
          { name: "kind", in: "query", schema: { type: "string", enum: ["business-requests", "quotes", "pre-registrations", "applications", "messages"] } },
          { name: "state", in: "query", schema: { type: "string", enum: ["open", "closed"] } },
        ],
      }),
    },
    "/account/requests/{kind}/{id}": {
      get: auth("Détail d'une de mes demandes", {
        description: "Avec l'historique visible du client (création et changements de statut, sans les commentaires internes).",
        parameters: [{ name: "kind", in: "path", required: true, schema: { type: "string" } }, idParam],
        responses: { 404: error("Introuvable ou appartenant à un autre compte") },
      }),
    },

    // --- Depuis l'admin ---
    "/members": {
      get: {
        tags: ["Comptes clients"],
        summary: "Lister les comptes clients",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "accountType", in: "query", schema: { type: "string", enum: ["candidat", "entreprise"] } },
          { name: "active", in: "query", schema: { type: "string", enum: ["true", "false"] } },
          { name: "emailVerified", in: "query", schema: { type: "string", enum: ["true", "false"] } },
        ],
        responses: { 200: { description: "Liste paginée", ...json(item) }, 401: error("Non connecté") },
      },
    },
    "/members/{id}": {
      get: { tags: ["Comptes clients"], summary: "Détail d'un compte client", parameters: [idParam], responses: { 200: { description: "Compte", ...json(item) }, 404: error("Introuvable") } },
      patch: {
        tags: ["Comptes clients"],
        summary: "Modifier ou désactiver un compte client",
        parameters: [idParam],
        requestBody: body(schemas.memberAdminUpdate),
        responses: { 200: { description: "Mis à jour", ...json(item) }, 403: error("Éditeur requis"), 404: error("Introuvable") },
      },
      delete: { tags: ["Comptes clients"], summary: "Supprimer un compte client", parameters: [idParam], responses: { 204: { description: "Supprimé" }, 403: error("Admin requis"), 404: error("Introuvable") } },
    },
  };
}

module.exports = { buildAccountPaths };
