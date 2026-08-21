// Valeurs métier reprises telles quelles du site public (user/) et de l'ancien
// schéma Supabase, pour que l'admin et le site parlent le même langage.

const REQUEST_TYPES = ["recrutement", "formation", "audit_rh", "autre"];
const REQUEST_STATUSES = ["new", "in_review", "in_progress", "completed", "cancelled"];
const PRIORITIES = ["low", "normal", "high", "urgent"];
const DOCUMENT_TYPES = ["facture", "devis", "contrat", "rapport", "cv", "autre"];
const APPLICATION_STATUSES = ["submitted", "reviewed", "shortlisted", "accepted", "rejected", "placed"];
const SIMPLE_STATUSES = ["new", "in_review", "in_progress", "completed", "cancelled"];
const CONTRACT_TYPES = ["stage", "cdd", "cdi", "interim", "consultance", "alternance"];
const NOTIFICATION_TYPES = ["info", "success", "warning", "error"];

const POLES = [
  "Formation professionnelle",
  "Mise à disposition de personnel",
  "Prestations techniques",
  "Conseil RH",
  "Services additionnels",
  "Excel & SAGE 100 i7",
];

const TRAININGS = [
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

const FINANCING_TYPES = ["Personnel", "Employeur", "Organisme / Bourse", "Autre"];
const ID_DOCUMENT_TYPES = ["CNI", "Passeport", "Permis de conduire", "Carte consulaire", "Autre"];

const FORMATION_CATEGORIES = [
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

const BLOG_CATEGORIES = [
  "Conseils candidats",
  "Tendances",
  "Management",
  "Conseils RH",
  "Externalisation",
  "QHSE",
  "Formation",
  "Recrutement",
];

module.exports = {
  REQUEST_TYPES,
  REQUEST_STATUSES,
  PRIORITIES,
  DOCUMENT_TYPES,
  APPLICATION_STATUSES,
  SIMPLE_STATUSES,
  CONTRACT_TYPES,
  NOTIFICATION_TYPES,
  POLES,
  TRAININGS,
  FINANCING_TYPES,
  ID_DOCUMENT_TYPES,
  FORMATION_CATEGORIES,
  BLOG_CATEGORIES,
};
