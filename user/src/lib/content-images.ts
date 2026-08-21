import imgRecrutement from "@/assets/entretien-recrutement.jpg";
import imgFormation from "@/assets/training.jpg";
import imgManagement from "@/assets/reunion-conseil.jpg";
import imgConseil from "@/assets/consultant-rh.jpg";
import imgTechnique from "@/assets/technical.jpg";
import imgTeam from "@/assets/team.jpg";
import imgCouloir from "@/assets/equipe-couloir.jpg";
import imgHero from "@/assets/hero.jpg";
import imgSage from "@/assets/formation-sage-1.jpg";
import imgSage2 from "@/assets/formation-sage-2.jpg";

/**
 * Illustrations de repli.
 *
 * Un article ou une formation peut être créé depuis le back-office sans image :
 * plutôt qu'un cadre vide, on retombe sur une photo de la banque locale choisie
 * d'après la catégorie. Dès qu'une image est renseignée dans l'admin, c'est
 * elle qui s'affiche.
 */

const BLOG_IMAGES: Record<string, string> = {
  "Conseils candidats": imgRecrutement,
  Recrutement: imgTeam,
  Tendances: imgHero,
  Management: imgCouloir,
  "Conseils RH": imgConseil,
  Externalisation: imgManagement,
  QHSE: imgTechnique,
  Formation: imgFormation,
};

const FORMATION_IMAGES: Record<string, string> = {
  "Ressources Humaines & Administration": imgConseil,
  "Comptabilité & Gestion": imgSage,
  "Informatique & Bureautique": imgSage2,
  "Commerce & Marketing": imgTeam,
  "Logistique & Transit": imgTechnique,
  "QHSE & Industrie": imgCouloir,
  "Langues & Communication": imgManagement,
  "Digital & Innovation": imgHero,
  Entrepreneuriat: imgFormation,
  "Formations Techniques": imgTechnique,
};

export function postImage(imageUrl?: string | null, category?: string): string {
  return imageUrl || BLOG_IMAGES[category ?? ""] || imgHero;
}

export function formationImage(imageUrl?: string | null, category?: string): string {
  return imageUrl || FORMATION_IMAGES[category ?? ""] || imgFormation;
}

/** "12 mai 2026" à partir d'une date ISO. */
export function formatFrenchDate(value?: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
