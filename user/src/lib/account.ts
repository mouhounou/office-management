import axios from "axios";

import { BASE_URL, memberToken, toApiError } from "@/lib/api";

/**
 * Espace client du site : comptes candidats et entreprises (`/api/account`).
 * Distinct du back-office : un compte client ne donne jamais accès à l'admin.
 */

export const accountApi = axios.create({
  baseURL: `${BASE_URL}/account`,
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

accountApi.interceptors.request.use((config) => {
  const token = memberToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Appelé quand la session expire : le fournisseur de compte s'y abonne. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

accountApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const url: string = error?.config?.url ?? "";
    const isAuthCall = ["/login", "/register", "/reset-password", "/verify-email"].some((p) =>
      url.startsWith(p),
    );
    if (apiError.status === 401 && !isAuthCall) onUnauthorized?.();
    return Promise.reject(apiError);
  },
);

// --- Types ------------------------------------------------------------------

export type AccountType = "candidat" | "entreprise";

export type Member = {
  id: string;
  fullName: string;
  email: string;
  accountType: AccountType;
  phone?: string | null;
  companyName?: string | null;
  city?: string | null;
  avatarUrl?: string | null;
  newsletter: boolean;
  emailVerified: boolean;
  active: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
};

export type Session = { token: string; member: Member };

export type RequestKind =
  "business-requests" | "quotes" | "pre-registrations" | "applications" | "messages";

export type RequestSummary = {
  id: string;
  kind: RequestKind;
  kindLabel: string;
  title: string;
  subtitle?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Overview = {
  total: number;
  open: number;
  completed: number;
  byKind: Record<RequestKind, number>;
  latest: RequestSummary[];
  profileCompletion: number;
};

export type TimelineEvent = {
  type: "created" | "status_change" | "updated";
  fromStatus?: string | null;
  toStatus?: string | null;
  at: string;
};

// --- Libellés ---------------------------------------------------------------

export type Tone = "neutral" | "info" | "warning" | "progress" | "success" | "danger";

/** Statuts formulés pour le client (le back-office emploie les mêmes valeurs). */
export const STATUS: Record<string, { label: string; tone: Tone }> = {
  new: { label: "Reçue", tone: "info" },
  in_review: { label: "En étude", tone: "warning" },
  in_progress: { label: "En cours", tone: "progress" },
  completed: { label: "Terminée", tone: "success" },
  cancelled: { label: "Annulée", tone: "neutral" },
  submitted: { label: "Reçue", tone: "info" },
  reviewed: { label: "Examinée", tone: "warning" },
  shortlisted: { label: "Présélectionnée", tone: "progress" },
  accepted: { label: "Acceptée", tone: "success" },
  rejected: { label: "Non retenue", tone: "danger" },
  placed: { label: "Placée", tone: "success" },
};

export const KIND_LABELS: Record<RequestKind, string> = {
  "business-requests": "Business Center",
  quotes: "Devis",
  "pre-registrations": "Pré-inscriptions",
  applications: "Candidatures",
  messages: "Messages",
};

// --- Appels -----------------------------------------------------------------

export const account = {
  async login(email: string, password: string) {
    return (await accountApi.post<Session>("/login", { email, password })).data;
  },
  async register(body: {
    fullName: string;
    email: string;
    password: string;
    accountType: AccountType;
    companyName?: string;
    phone?: string;
    newsletter?: boolean;
  }) {
    return (await accountApi.post<Session>("/register", body)).data;
  },
  async logout() {
    await accountApi.post("/logout");
  },
  async me() {
    return (await accountApi.get<{ member: Member }>("/me")).data.member;
  },
  async updateProfile(
    body: Partial<
      Pick<Member, "fullName" | "accountType" | "phone" | "companyName" | "city" | "newsletter">
    >,
  ) {
    return (await accountApi.patch<{ member: Member }>("/me", body)).data.member;
  },
  async changePassword(currentPassword: string, newPassword: string) {
    return (await accountApi.post<Session>("/change-password", { currentPassword, newPassword }))
      .data;
  },
  async forgotPassword(email: string) {
    await accountApi.post("/forgot-password", { email });
  },
  async resetPassword(token: string, password: string) {
    return (await accountApi.post<Session>("/reset-password", { token, password })).data;
  },
  async verifyEmail(token: string) {
    return (await accountApi.post<{ member: Member; linked: number }>("/verify-email", { token }))
      .data;
  },
  async resendVerification() {
    await accountApi.post("/resend-verification");
  },
  async deleteAccount(password: string) {
    await accountApi.delete("/me", { data: { password } });
  },
  async overview() {
    return (await accountApi.get<Overview>("/overview")).data;
  },
  async requests(params: { kind?: string; state?: string } = {}) {
    return (
      await accountApi.get<{ items: RequestSummary[]; total: number }>("/requests", { params })
    ).data;
  },
  async request(kind: string, id: string) {
    return (
      await accountApi.get<{
        item: Record<string, unknown> & RequestSummary;
        timeline: TimelineEvent[];
      }>(`/requests/${kind}/${id}`)
    ).data;
  },
};
