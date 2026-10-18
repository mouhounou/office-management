import {
  Briefcase,
  CalendarClock,
  GraduationCap,
  Handshake,
  MessageCircle,
  Receipt,
  type LucideIcon,
} from "lucide-react";

/** Démarches proposées depuis l'espace client ; `audience` filtre selon le type de compte. */
export const QUICK_ACTIONS: {
  to: string;
  hash?: string;
  label: string;
  description: string;
  icon: LucideIcon;
  audience?: "candidat" | "entreprise";
}[] = [
  {
    to: "/devis",
    label: "Demander un devis",
    description: "Formation, personnel, conseil RH",
    icon: Receipt,
    audience: "entreprise",
  },
  {
    to: "/business-center",
    label: "Business Center",
    description: "Recrutement, formation, audit RH",
    icon: Handshake,
    audience: "entreprise",
  },
  {
    to: "/pre-inscription",
    label: "Pré-inscription",
    description: "S'inscrire à une formation",
    icon: GraduationCap,
    audience: "candidat",
  },
  {
    to: "/recrutement",
    hash: "carrieres",
    label: "Offres d'emploi",
    description: "Postuler à une offre",
    icon: Briefcase,
    audience: "candidat",
  },
  {
    to: "/contact",
    hash: "rendez-vous",
    label: "Prendre rendez-vous",
    description: "Rencontrer un conseiller",
    icon: CalendarClock,
  },
  {
    to: "/contact",
    label: "Nous écrire",
    description: "Une question, une précision",
    icon: MessageCircle,
  },
];
