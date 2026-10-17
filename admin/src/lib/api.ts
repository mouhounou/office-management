import axios, { AxiosError } from "axios";

/**
 * Client HTTP du back-office.
 *
 * Le jeton renvoyé par /auth/login est gardé en localStorage et envoyé en
 * Bearer ; le cookie httpOnly posé par l'API sert de repli (withCredentials).
 * Le Bearer reste nécessaire quand l'admin et l'API sont sur des domaines
 * différents et que le navigateur bloque les cookies tiers.
 */

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const TOKEN_KEY = "om_admin_token";

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* stockage indisponible : la session tiendra par le cookie */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* rien à nettoyer */
    }
  },
};

export const api = axios.create({ baseURL: API_URL, timeout: 20000, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type FieldErrors = Record<string, string>;

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

type ErrorPayload = { error?: { message?: string; details?: { field: string; message: string }[] } };

/** Appelé quand la session expire : AuthProvider s'y abonne pour revenir au login. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      return Promise.reject(new ApiError("Erreur inattendue.", 0));
    }
    if (!error.response) {
      return Promise.reject(new ApiError("API injoignable. Vérifiez qu'elle est démarrée.", 0));
    }
    const { status, data } = error.response;
    const payload = (data ?? {}) as ErrorPayload;
    const fieldErrors = Object.fromEntries(
      (payload.error?.details ?? []).map((detail) => [detail.field, detail.message]),
    );
    const isLogin = error.config?.url?.includes("/auth/login");
    if (status === 401 && !isLogin) onUnauthorized?.();
    return Promise.reject(
      new ApiError(payload.error?.message ?? "La requête a échoué.", status, fieldErrors),
    );
  },
);

export function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Une erreur est survenue.";
}

export function fieldErrorsOf(error: unknown): FieldErrors {
  return error instanceof ApiError ? error.fieldErrors : {};
}

// --- Types partagés ----------------------------------------------------------

export type Role = "admin" | "editor" | "viewer";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type AnyRecord = Record<string, any> & { id: string };
