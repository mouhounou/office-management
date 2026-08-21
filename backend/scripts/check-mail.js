/**
 * Vérifie la configuration des emails.
 *
 *   node scripts/check-mail.js                  teste la connexion SMTP (sans rien envoyer)
 *   node scripts/check-mail.js --preview        écrit un aperçu HTML de chaque email dans tmp/
 *   node scripts/check-mail.js --send you@ex.cg envoie un message de test réel
 */
require("../config/env");

const fs = require("node:fs");
const path = require("node:path");

const { mail } = require("../config/env");
const { verifyConnection, sendMail, isConfigured } = require("../services/mailer");
const { layout, detailsTable } = require("../services/email-templates");

const args = process.argv.slice(2);
const sendIndex = args.indexOf("--send");
const recipient = sendIndex !== -1 ? args[sendIndex + 1] : null;

// Jeux d'exemple pour l'aperçu : aucune donnée réelle n'est touchée.
const SAMPLES = {
  "devis-visiteur": layout({
    title: "Merci Prisca Loubaki",
    intro: "Notre équipe étudie votre demande et revient vers vous sous 48 h ouvrées.",
    contentHtml: detailsTable([
      ["Pôle", "Formation professionnelle"],
      ["Nom", "Prisca Loubaki"],
      ["Entreprise", "Ateliers du Kouilou"],
      ["Email", "prisca@exemple.cg"],
      ["Message", "Nous souhaitons former six agents à la comptabilité sur Sage 100 i7."],
    ]),
  }),
  "devis-equipe": layout({
    title: "Nouvelle demande de devis — Formation professionnelle",
    intro: "Un nouveau dépôt vient d'arriver depuis le site public.",
    contentHtml: detailsTable([
      ["Nom", "Prisca Loubaki"],
      ["Téléphone", "+242 06 200 30 40"],
      ["Budget", "2 000 000 FCFA"],
    ]),
  }),
  "suivi-demande": layout({
    title: "Suivi de votre demande",
    intro:
      "L'état de votre demande <strong>Formation Excel avancé</strong> est désormais : <strong>En cours de traitement</strong>.",
    contentHtml: detailsTable([["Entreprise", "Sud Logistique SARL"], ["Nouvel état", "En cours de traitement"]]),
  }),
};

async function run() {
  console.log(`SMTP : ${mail.host}:${mail.port} (secure=${mail.secure}) — compte ${mail.user ?? "(absent)"}`);

  if (args.includes("--preview")) {
    const dir = path.join(__dirname, "..", "tmp");
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, html] of Object.entries(SAMPLES)) {
      const file = path.join(dir, `email-${name}.html`);
      fs.writeFileSync(file, html);
      console.log("aperçu écrit :", file);
    }
    return;
  }

  if (!isConfigured) {
    console.error("Configuration incomplète : renseignez EMAIL_HOST, EMAIL_HOST_USER et EMAIL_HOST_PASSWORD.");
    process.exit(1);
  }

  const result = await verifyConnection();
  console.log(result.ok ? "Connexion SMTP établie." : `Connexion refusée : ${result.reason}`);
  if (!result.ok) process.exit(1);

  if (recipient) {
    const { sent, reason } = await sendMail({
      to: recipient,
      subject: "Test d'envoi — API Office Management",
      html: layout({
        title: "Test d'envoi réussi",
        intro: "Si vous lisez ce message, la configuration nodemailer de l'API fonctionne.",
        contentHtml: detailsTable([
          ["Serveur", `${mail.host}:${mail.port}`],
          ["Expéditeur", mail.from],
          ["Envoyé le", new Date().toLocaleString("fr-FR")],
        ]),
      }),
    });
    console.log(sent ? `Message de test envoyé à ${recipient}.` : `Échec de l'envoi : ${reason}`);
    process.exit(sent ? 0 : 1);
  }

  console.log("Aucun envoi effectué. Ajoutez --send adresse@exemple.cg pour un test réel.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
