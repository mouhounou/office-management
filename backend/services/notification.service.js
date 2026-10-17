const Notification = require("../models/Notification");

/**
 * Notification interne créée à chaque dépôt du site public : elle alimente la
 * cloche du back-office et pointe vers la fiche à traiter (`link` = chemin de
 * l'admin).
 */
const SUBMISSIONS = {
  quote: (doc) => ({
    title: `Nouvelle demande de devis — ${doc.name}`,
    message: doc.pole,
    link: `/quotes/${doc._id}`,
  }),
  preRegistration: (doc) => ({
    title: `Nouvelle pré-inscription — ${doc.fullName}`,
    message: doc.training,
    link: `/pre-registrations/${doc._id}`,
  }),
  businessRequest: (doc) => ({
    title: `Nouvelle demande business — ${doc.companyName}`,
    message: doc.title,
    link: `/business-requests/${doc._id}`,
  }),
  application: (doc) => ({
    title: `Nouvelle candidature — ${doc.fullName}`,
    message: doc.email,
    link: `/applications/${doc._id}`,
  }),
  contact: (doc) => ({
    title: `Nouveau message — ${doc.name}`,
    message: doc.subject,
    link: `/messages/${doc._id}`,
  }),
  appointment: (doc) => ({
    title: `Demande de rendez-vous — ${doc.name}`,
    message: doc.reason,
    link: `/messages/${doc._id}`,
  }),
};

/** N'échoue jamais : un dépôt reste enregistré même si la notification ne l'est pas. */
async function notifyTeam(kind, doc) {
  const build = SUBMISSIONS[kind];
  if (!build) return;
  try {
    await Notification.create({ type: "info", ...build(doc) });
  } catch (error) {
    console.error("[notification]", error.message);
  }
}

module.exports = { notifyTeam };
