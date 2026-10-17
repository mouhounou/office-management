/**
 * Valeurs métier, identiques à backend/models/constants.js. Toute nouvelle
 * valeur doit être ajoutée des deux côtés : l'API rejette ce qu'elle ne connaît pas.
 */

export type Tone = "neutral" | "info" | "progress" | "success" | "danger" | "warning";

export type StatusDef = { label: string; tone: Tone };

export const SIMPLE_STATUSES: Record<string, StatusDef> = {
  new: { label: "Nouveau", tone: "info" },
  in_review: { label: "En analyse", tone: "warning" },
  in_progress: { label: "En cours", tone: "progress" },
  completed: { label: "Terminé", tone: "success" },
  cancelled: { label: "Annulé", tone: "neutral" },
};

export const APPLICATION_STATUSES: Record<string, StatusDef> = {
  submitted: { label: "Reçue", tone: "info" },
  reviewed: { label: "Examinée", tone: "warning" },
  shortlisted: { label: "Présélectionnée", tone: "progress" },
  accepted: { label: "Acceptée", tone: "success" },
  rejected: { label: "Refusée", tone: "danger" },
  placed: { label: "Placée", tone: "success" },
};

export const PRIORITIES: Record<string, StatusDef> = {
  low: { label: "Basse", tone: "neutral" },
  normal: { label: "Normale", tone: "info" },
  high: { label: "Haute", tone: "warning" },
  urgent: { label: "Urgente", tone: "danger" },
};

export const REQUEST_TYPES: Record<string, string> = {
  recrutement: "Recrutement",
  formation: "Formation",
  audit_rh: "Audit RH",
  autre: "Autre",
};

export const DOCUMENT_TYPES: Record<string, string> = {
  facture: "Facture",
  devis: "Devis",
  contrat: "Contrat",
  rapport: "Rapport",
  cv: "CV",
  autre: "Autre",
};

export const CONTRACT_TYPES: Record<string, string> = {
  stage: "Stage",
  cdd: "CDD",
  cdi: "CDI",
  interim: "Intérim",
  consultance: "Consultance",
  alternance: "Alternance",
};

export const MESSAGE_KINDS: Record<string, string> = {
  contact: "Contact",
  "rendez-vous": "Rendez-vous",
};

export const TIME_SLOTS: Record<string, string> = {
  matin: "Matin (8h – 12h)",
  "apres-midi": "Après-midi (13h – 17h)",
};

export const ROLES: Record<string, StatusDef> = {
  admin: { label: "Administrateur", tone: "danger" },
  editor: { label: "Éditeur", tone: "progress" },
  viewer: { label: "Lecteur", tone: "neutral" },
};

export const POLES = [
  "Formation professionnelle",
  "Mise à disposition de personnel",
  "Prestations techniques",
  "Conseil RH",
  "Services additionnels",
  "Excel & SAGE 100 i7",
];

export const TRAININGS = [
  "Assistant Comptable",
  "Secrétariat Bureautique",
  "Gestion des Ressources Humaines",
  "Informatique Bureautique",
  "QHSE",
  "Logistique",
  "Management",
  "Entrepreneuriat",
  "Anglais Professionnel",
  "SAGE 100 i7",
  "Excel Avancé",
  "Formations Techniques",
];

export const FINANCING_TYPES = ["Personnel", "Employeur", "Organisme / Bourse", "Autre"];
export const ID_DOCUMENT_TYPES = ["CNI", "Passeport", "Permis de conduire", "Carte consulaire", "Autre"];

export const FORMATION_CATEGORIES = [
  "Ressources Humaines & Administration",
  "Comptabilité & Gestion",
  "Informatique & Bureautique",
  "Commerce & Marketing",
  "Logistique & Transit",
  "QHSE & Industrie",
  "Langues & Communication",
  "Digital & Innovation",
  "Entrepreneuriat",
  "Formations Techniques",
];

export const BLOG_CATEGORIES = [
  "Conseils candidats",
  "Tendances",
  "Management",
  "Conseils RH",
  "Externalisation",
  "QHSE",
  "Formation",
  "Recrutement",
];

/** Liste d'options `<select>` à partir d'un tableau ou d'un dictionnaire de libellés. */
export function optionsOf(source: string[] | Record<string, string | StatusDef>) {
  if (Array.isArray(source)) return source.map((value) => ({ value, label: value }));
  return Object.entries(source).map(([value, label]) => ({
    value,
    label: typeof label === "string" ? label : label.label,
  }));
}
