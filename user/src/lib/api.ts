import axios, { AxiosError } from "axios";

/**
 * Client HTTP du site public.
 *
 * Il ne parle qu'aux routes ouvertes de l'API (`/api/public`) : lecture des
 * contenus publiés et dépôt des formulaires. Aucun jeton n'est manipulé ici —
 * l'administration vit dans son propre back-office.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const api = axios.create({
  baseURL: `${BASE_URL}/public`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

type ApiErrorPayload = {
  error?: { message?: string; details?: { field: string; message: string }[] };
};

export type FieldErrors = Record<string, string>;

/** Erreur normalisée : message lisible + erreurs par champ renvoyées par l'API. */
export class ApiError extends Error {
  status: number;
  fieldErrors: FieldErrors;

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function toApiError(error: unknown): ApiError {
  if (!(error instanceof AxiosError)) {
    return new ApiError("Une erreur inattendue est survenue.", 0);
  }

  if (!error.response) {
    return new ApiError(
      "Service momentanément indisponible. Vérifiez votre connexion et réessayez.",
      0,
    );
  }

  const { status, data } = error.response;
  const payload = (data ?? {}) as ApiErrorPayload;
  const fieldErrors = Object.fromEntries(
    (payload.error?.details ?? []).map((detail) => [detail.field, detail.message]),
  );

  // 429 : le garde-fou anti-spam de l'API, à expliquer plutôt qu'à masquer.
  const fallback =
    status === 429
      ? "Trop de demandes envoyées. Réessayez dans quelques minutes."
      : "L'envoi a échoué. Réessayez dans un instant.";

  return new ApiError(payload.error?.message ?? fallback, status, fieldErrors);
}

// Toutes les erreurs remontent sous la forme d'une ApiError exploitable.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);

/** Message à afficher à l'utilisateur pour une erreur quelconque. */
export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Une erreur est survenue. Réessayez.";
}

export function fieldErrorsOf(error: unknown): FieldErrors {
  return error instanceof ApiError ? error.fieldErrors : {};
}
