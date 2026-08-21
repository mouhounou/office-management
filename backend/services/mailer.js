const nodemailer = require("nodemailer");

const { mail, isProduction } = require("../config/env");

/**
 * Transport SMTP (nodemailer).
 *
 * L'envoi d'un email ne doit jamais faire échouer la requête qui l'a déclenché :
 * un visiteur qui dépose un devis reçoit sa confirmation d'enregistrement même
 * si le serveur de messagerie est momentanément injoignable. Les échecs sont
 * donc journalisés, pas propagés.
 */

const isConfigured = Boolean(mail.host && mail.user && mail.password);

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.secure, // true pour le port 465 (SSL implicite)
    requireTLS: !mail.secure && mail.requireTls,
    auth: { user: mail.user, pass: mail.password },
    // Une file d'attente bloquée ne doit pas retenir le processus.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  return transporter;
}

/** Vérifie la connexion SMTP sans envoyer de message. */
async function verifyConnection() {
  if (!isConfigured) return { ok: false, reason: "Configuration SMTP absente (.env)" };
  try {
    await getTransporter().verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

/**
 * Envoie un email. Renvoie `{ sent: boolean }` — jamais d'exception.
 * `replyTo` permet de répondre directement au visiteur depuis la boîte de
 * l'équipe.
 */
async function sendMail({ to, subject, html, text, replyTo }) {
  if (!isConfigured) {
    console.warn(`[mail] non configuré, message ignoré : « ${subject} » -> ${to}`);
    return { sent: false, reason: "not_configured" };
  }
  if (!to) {
    console.warn(`[mail] destinataire absent pour « ${subject} »`);
    return { sent: false, reason: "no_recipient" };
  }

  try {
    const info = await getTransporter().sendMail({
      from: `"${mail.fromName}" <${mail.from}>`,
      to,
      subject,
      html,
      text: text ?? htmlToText(html),
      ...(replyTo ? { replyTo } : {}),
    });

    if (!isProduction) console.log(`[mail] envoyé « ${subject} » -> ${to} (${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[mail] échec « ${subject} » -> ${to} :`, error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Déclenche l'envoi sans attendre : la réponse HTTP part immédiatement, le
 * message suit. Toute erreur est déjà absorbée par sendMail.
 */
function sendMailInBackground(message) {
  void sendMail(message);
}

/** Version texte brut, pour les clients de messagerie qui n'affichent pas le HTML. */
function htmlToText(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

module.exports = { sendMail, sendMailInBackground, verifyConnection, isConfigured, htmlToText };
