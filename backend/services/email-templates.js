/**
 * Gabarits d'emails.
 *
 * Style volontairement sobre et en tableaux : les clients de messagerie
 * (Outlook en tête) ignorent flexbox, grid et les variables CSS. Les couleurs
 * reprennent la charte du site (navy et cyan) en hexadécimal.
 */

const COLORS = {
  navy: "#0d1b2e",
  navyLight: "#152539",
  cyan: "#38bdf8",
  text: "#1f2933",
  muted: "#6b7280",
  border: "#e5e7eb",
  background: "#f4f6f8",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Coquille commune : en-tête sombre, contenu blanc, pied de page discret. */
function layout({ title, intro, contentHtml, footerNote }) {
  return `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:24px 12px;background:${COLORS.background};font-family:Segoe UI,Helvetica,Arial,sans-serif;color:${COLORS.text};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${COLORS.border};">
      <tr>
        <td style="background:${COLORS.navy};padding:24px 28px;">
          <div style="color:${COLORS.cyan};font-size:16px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Office Management</div>
          <div style="color:#9aa5b1;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Human Resources Consulting</div>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <h1 style="margin:0 0 12px;font-size:20px;color:${COLORS.navy};">${escapeHtml(title)}</h1>
          ${intro ? `<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${COLORS.text};">${intro}</p>` : ""}
          ${contentHtml ?? ""}
        </td>
      </tr>
      <tr>
        <td style="padding:18px 28px;background:${COLORS.navyLight};color:#9aa5b1;font-size:11px;line-height:1.6;">
          ${footerNote ?? "Office Management — Songolo, BP 97116, Pointe-Noire, Congo"}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Tableau « libellé / valeur », utilisé pour récapituler une demande. */
function detailsTable(rows) {
  const lines = rows
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;font-size:13px;color:${COLORS.muted};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:13px;color:${COLORS.text};white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${COLORS.border};margin-top:8px;">${lines}</table>`;
}

function button(label, href) {
  return `<p style="margin:24px 0 0;">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:${COLORS.cyan};color:${COLORS.navy};text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;">${escapeHtml(label)}</a>
  </p>`;
}

module.exports = { layout, detailsTable, button, escapeHtml, COLORS };
