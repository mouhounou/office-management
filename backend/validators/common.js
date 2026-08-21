const { z } = require("zod");

/**
 * Messages par défaut en français. Sans cela, un champ absent renvoie le texte
 * anglais de Zod (« Invalid input: expected string, received undefined »), qui
 * finirait affiché tel quel sous le formulaire d'un visiteur du site.
 * Les messages posés explicitement sur un champ restent prioritaires.
 */
z.config({
  customError: (issue) => {
    if (issue.input === undefined) return "Champ requis";
    if (issue.code === "invalid_type") return "Format invalide";
    return undefined;
  },
});

const trimmed = (max) => z.string().trim().max(max);
const email = z.string().trim().toLowerCase().email("Email invalide").max(255);
const phone = z.string().trim().min(6, "Téléphone invalide").max(40);

// Champ optionnel de formulaire : une chaîne vide est traitée comme absente.
const optionalText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v));

const dateString = z
  .string()
  .min(1, "Date requise")
  .transform((v) => new Date(v));

const optionalDate = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => (v ? new Date(v) : null));

// Les cases à cocher HTML envoient "on" ; l'API accepte aussi true/"true".
const bool = z
  .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("on"), z.literal("")])
  .transform((v) => v === true || v === "true" || v === "on");

module.exports = { trimmed, email, phone, optionalText, dateString, optionalDate, bool };
