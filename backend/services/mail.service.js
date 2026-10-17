const { mail, isProduction } = require("../config/env");
const { isConfigured: mailConfigured } = require("./mailer");
const Setting = require("../models/Setting");
const { DEFAULTS } = require("../controllers/setting.controller");
const { sendMailInBackground } = require("./mailer");
const { layout, detailsTable, button, escapeHtml } = require("./email-templates");

/**
 * Emails déclenchés par les dépôts du site public.
 *
 * Chaque dépôt produit deux messages : un accusé de réception au visiteur et
 * une notification à l'équipe (avec `replyTo` sur l'adresse du visiteur, pour
 * répondre en un clic). Les envois partent en arrière-plan : la réponse HTTP
 * n'attend jamais le serveur de messagerie.
 */

const SIGNATURE =
  "L'équipe Office Management<br />Songolo, BP 97116, Pointe-Noire — Congo";

/**
 * Destinataire des notifications internes : la variable EMAIL_ADMIN si elle est
 * renseignée, sinon l'adresse de contact saisie dans les paramètres du site,
 * sinon le compte SMTP lui-même.
 */
async function adminRecipient() {
  if (mail.adminRecipient) return mail.adminRecipient;

  try {
    const setting = await Setting.findOne({ key: "contact" });
    const email = setting?.value?.email;
    if (email) return email;
  } catch {
    /* Base indisponible : on retombe sur le compte SMTP. */
  }

  return DEFAULTS.contact.email || mail.user;
}

const frDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

const TIME_SLOTS = { matin: "Matin (8h – 12h)", "apres-midi": "Après-midi (13h – 17h)" };

const REQUEST_TYPES = {
  recrutement: "Recrutement",
  formation: "Formation",
  audit_rh: "Audit RH",
  autre: "Autre",
};

/**
 * Description d'un dépôt : de quoi construire les deux emails.
 * Un seul endroit à modifier pour ajouter un formulaire.
 */
const SUBMISSIONS = {
  quote: (doc) => ({
    subject: "demande de devis",
    visitorEmail: doc.email,
    visitorName: doc.name,
    adminSubject: `Nouvelle demande de devis — ${doc.pole}`,
    rows: [
      ["Pôle", doc.pole],
      ["Nom", doc.name],
      ["Entreprise", doc.company],
      ["Email", doc.email],
      ["Téléphone", doc.phone],
      ["Budget", doc.budget],
      ["Échéance", doc.deadline],
      ["Message", doc.message],
    ],
    promise: "Notre équipe étudie votre demande et revient vers vous sous 48 h ouvrées.",
  }),

  preRegistration: (doc) => ({
    subject: "pré-inscription",
    visitorEmail: doc.email,
    visitorName: doc.fullName,
    adminSubject: `Nouvelle pré-inscription — ${doc.training}`,
    rows: [
      ["Formation", doc.training],
      ["Durée", doc.duration],
      ["Début souhaité", frDate(doc.startDate)],
      ["Candidat", doc.fullName],
      ["Email", doc.email],
      ["Téléphone", doc.phone],
      ["Profession", doc.profession],
      ["Financement", doc.financingType],
      ["Pièce d'identité", `${doc.idDocumentType} — ${doc.idDocumentNumber}`],
    ],
    promise:
      "Votre dossier de pré-inscription est enregistré. Nous vous recontactons pour finaliser votre inscription.",
  }),

  businessRequest: (doc) => ({
    subject: "demande",
    visitorEmail: doc.contactEmail,
    visitorName: doc.contactName,
    adminSubject: `Nouvelle demande ${REQUEST_TYPES[doc.type] ?? doc.type} — ${doc.companyName}`,
    rows: [
      ["Type", REQUEST_TYPES[doc.type] ?? doc.type],
      ["Titre", doc.title],
      ["Entreprise", doc.companyName],
      ["Contact", doc.contactName],
      ["Email", doc.contactEmail],
      ["Téléphone", doc.contactPhone],
      ["Priorité", doc.priority],
      ["Budget", doc.budget],
      ["Échéance", frDate(doc.deadline)],
      ["Description", doc.description],
    ],
    promise: "Notre équipe analyse votre besoin et vous recontacte sous 48 h ouvrées.",
  }),

  application: (doc) => ({
    subject: "candidature",
    visitorEmail: doc.email,
    visitorName: doc.fullName,
    adminSubject: `Nouvelle candidature — ${doc.fullName}`,
    rows: [
      ["Candidat", doc.fullName],
      ["Email", doc.email],
      ["Téléphone", doc.phone],
      ["CV", doc.cvUrl],
      ["Message", doc.coverLetter],
    ],
    promise:
      "Votre candidature est bien enregistrée. Si votre profil correspond à un poste, nous vous contacterons.",
  }),

  contact: (doc) => ({
    subject: "message",
    visitorEmail: doc.email,
    visitorName: doc.name,
    adminSubject: `Message de contact — ${doc.subject || doc.name}`,
    rows: [
      ["Nom", doc.name],
      ["Email", doc.email],
      ["Téléphone", doc.phone],
      ["Sujet", doc.subject],
      ["Message", doc.message],
    ],
    promise: "Nous avons bien reçu votre message et vous répondons rapidement.",
  }),

  appointment: (doc) => ({
    subject: "demande de rendez-vous",
    visitorEmail: doc.email,
    visitorName: doc.name,
    adminSubject: `Demande de rendez-vous — ${doc.name} (${frDate(doc.preferredDate)})`,
    rows: [
      ["Motif", doc.reason],
      ["Date souhaitée", frDate(doc.preferredDate)],
      ["Créneau", TIME_SLOTS[doc.timeSlot] ?? doc.timeSlot],
      ["Nom", doc.name],
      ["Email", doc.email],
      ["Téléphone", doc.phone],
      ["Précisions", doc.message],
    ],
    promise:
      "Votre demande de rendez-vous est enregistrée. Nous confirmons le créneau sous 48 h ouvrées.",
  }),
};

/** Accusé de réception au visiteur + notification à l'équipe. */
async function notifySubmission(kind, doc) {
  const build = SUBMISSIONS[kind];
  if (!build) return;

  const info = build(doc);
  const recipient = await adminRecipient();

  sendMailInBackground({
    to: info.visitorEmail,
    subject: `Votre ${info.subject} a bien été reçue — Office Management`,
    html: layout({
      title: `Merci ${info.visitorName ?? ""}`.trim(),
      intro: info.promise,
      contentHtml: `
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Récapitulatif de votre ${info.subject} :</p>
        ${detailsTable(info.rows)}
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;">${SIGNATURE}</p>`,
      footerNote:
        "Cet email confirme la réception de votre demande. Vous pouvez y répondre directement.",
    }),
  });

  sendMailInBackground({
    to: recipient,
    replyTo: info.visitorEmail,
    subject: info.adminSubject,
    html: layout({
      title: info.adminSubject,
      intro: "Un nouveau dépôt vient d'arriver depuis le site public.",
      contentHtml: `${detailsTable(info.rows)}
        <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">Répondre à cet email écrit directement au visiteur.</p>`,
      footerNote: "Notification automatique du site Office Management",
    }),
  });
}

/** Message de bienvenue après inscription à la newsletter. */
function welcomeSubscriber(email) {
  sendMailInBackground({
    to: email,
    subject: "Bienvenue dans la newsletter Office Management",
    html: layout({
      title: "Merci pour votre inscription",
      intro:
        "Vous recevrez nos offres d'emploi, nos sessions de formation et nos conseils RH, sans excès.",
      contentHtml: `<p style="margin:0;font-size:14px;line-height:1.6;">${SIGNATURE}</p>`,
      footerNote:
        "Vous recevez cet email car cette adresse a été inscrite sur officemanagement.cg. Répondez à ce message pour vous désinscrire.",
    }),
  });
}

/** Prévient le contact d'une demande business que son dossier a changé d'état. */
function notifyStatusChange(request, status, statusLabel) {
  if (!request?.contactEmail) return;

  sendMailInBackground({
    to: request.contactEmail,
    subject: `Votre demande « ${request.title} » : ${statusLabel}`,
    html: layout({
      title: "Suivi de votre demande",
      intro: `L'état de votre demande <strong>${escapeHtml(request.title)}</strong> est désormais : <strong>${escapeHtml(statusLabel)}</strong>.`,
      contentHtml: `${detailsTable([
        ["Demande", request.title],
        ["Entreprise", request.companyName],
        ["Nouvel état", statusLabel],
      ])}
      <p style="margin:24px 0 0;font-size:14px;line-height:1.6;">${SIGNATURE}</p>`,
    }),
  });
}

/**
 * En développement sans SMTP, le lien est écrit dans la console : on peut
 * tester l'inscription et la réinitialisation sans serveur de messagerie.
 */
function logLinkIfNoMail(label, link) {
  if (!mailConfigured && !isProduction) console.log(`[mail] ${label} : ${link}`);
}

/** Lien de vérification de l'adresse, envoyé à l'inscription et sur demande. */
function sendEmailVerification(member, link) {
  logLinkIfNoMail("lien de vérification", link);
  sendMailInBackground({
    to: member.email,
    subject: "Confirmez votre adresse email — Office Management",
    html: layout({
      title: `Bienvenue ${member.fullName}`,
      intro:
        "Votre espace client est créé. Confirmez votre adresse pour retrouver toutes vos demandes, y compris celles envoyées avant la création du compte.",
      contentHtml: `${button("Confirmer mon adresse", link)}
        <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">Ce lien est valable 48 heures. Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.</p>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;">${SIGNATURE}</p>`,
    }),
  });
}

/** Lien de réinitialisation du mot de passe (compte perdu). */
function sendPasswordReset(member, link) {
  logLinkIfNoMail("lien de réinitialisation", link);
  sendMailInBackground({
    to: member.email,
    subject: "Réinitialisation de votre mot de passe — Office Management",
    html: layout({
      title: "Réinitialiser votre mot de passe",
      intro: "Une réinitialisation du mot de passe de votre espace client a été demandée.",
      contentHtml: `${button("Choisir un nouveau mot de passe", link)}
        <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">Ce lien est valable 1 heure et ne sert qu'une fois. Si vous n'avez rien demandé, ignorez cet email : votre mot de passe reste inchangé.</p>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;">${SIGNATURE}</p>`,
    }),
  });
}

/** Alerte de sécurité après un changement de mot de passe. */
function sendPasswordChanged(member) {
  sendMailInBackground({
    to: member.email,
    subject: "Votre mot de passe a été modifié — Office Management",
    html: layout({
      title: "Mot de passe modifié",
      intro:
        "Le mot de passe de votre espace client vient d'être modifié et vos autres sessions ont été déconnectées. Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.",
      contentHtml: `<p style="margin:0;font-size:14px;line-height:1.6;">${SIGNATURE}</p>`,
    }),
  });
}

module.exports = {
  notifySubmission,
  welcomeSubscriber,
  notifyStatusChange,
  adminRecipient,
  button,
  sendEmailVerification,
  sendPasswordReset,
  sendPasswordChanged,
};
