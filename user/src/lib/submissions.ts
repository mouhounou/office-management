import { api } from "@/lib/api";

/**
 * Dépôts des formulaires du site vers l'API. Chaque fonction correspond à un
 * formulaire ; la validation de fond est faite par l'API, qui renvoie ses
 * erreurs par champ (voir ApiError dans lib/api).
 */

export type QuotePayload = {
  pole: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  budget?: string;
  deadline?: string;
  message: string;
};

export type PreRegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  neighborhood: string;
  profession: string;
  financingType: string;
  idDocumentType: string;
  idDocumentNumber: string;
  training: string;
  duration: string;
  startDate: string;
};

export type BusinessRequestPayload = {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  type: "recrutement" | "formation" | "audit_rh" | "autre";
  title: string;
  description: string;
  priority?: string;
  budget?: string;
  deadline?: string;
  details?: Record<string, string>;
};

export type ApplicationPayload = {
  offer?: string | null;
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type AppointmentPayload = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  preferredDate: string;
  timeSlot: "matin" | "apres-midi";
  message?: string;
};

export async function submitQuote(payload: QuotePayload) {
  const { data } = await api.post("/quotes", payload);
  return data;
}

export async function submitPreRegistration(payload: PreRegistrationPayload) {
  const { data } = await api.post("/pre-registrations", payload);
  return data;
}

export async function submitBusinessRequest(payload: BusinessRequestPayload) {
  const { data } = await api.post("/business-requests", payload);
  return data;
}

export async function submitApplication(payload: ApplicationPayload) {
  const { data } = await api.post("/applications", payload);
  return data;
}

export async function submitContactMessage(payload: ContactPayload) {
  const { data } = await api.post("/messages", payload);
  return data;
}

export async function submitAppointment(payload: AppointmentPayload) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

/** Renvoie `true` si l'adresse était déjà inscrite (l'API ne le traite pas en erreur). */
export async function subscribeToNewsletter(email: string, source = "site"): Promise<boolean> {
  const { data } = await api.post<{ alreadySubscribed: boolean }>("/subscribers", {
    email,
    source,
  });
  return data.alreadySubscribed;
}
