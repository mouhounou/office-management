import { z } from "zod";

/**
 * Messages de validation par défaut en français, pour les règles des
 * formulaires qui n'ont pas de message personnalisé (longueurs, types…).
 */
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: issue.received === "undefined" ? "Champ obligatoire" : "Valeur invalide" };
    case z.ZodIssueCode.too_small:
      return {
        message:
          issue.type === "string"
            ? Number(issue.minimum) <= 1
              ? "Champ obligatoire"
              : `${issue.minimum} caractères minimum`
            : `Valeur trop petite (minimum ${issue.minimum})`,
      };
    case z.ZodIssueCode.too_big:
      return {
        message:
          issue.type === "string"
            ? `${issue.maximum} caractères maximum`
            : `Valeur trop grande (maximum ${issue.maximum})`,
      };
    case z.ZodIssueCode.invalid_string:
      return { message: issue.validation === "email" ? "Email invalide" : "Format invalide" };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Choix invalide" };
    default:
      return { message: ctx.defaultError === "Required" ? "Champ obligatoire" : "Valeur invalide" };
  }
});
