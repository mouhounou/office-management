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
import imgRecruitment from "@/assets/recruitment.jpg";

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

/**
 * Formations : plusieurs photos par domaine, pour que les cartes d'un même
 * domaine ne se ressemblent pas toutes ; le choix dépend du slug, donc reste
 * le même d'une visite et d'un rendu à l'autre.
 */
const FORMATION_IMAGES: Record<string, string[]> = {
  "Ressources Humaines & Administration": [imgConseil, imgRecrutement, imgCouloir, imgTeam],
  "Comptabilité & Gestion": [imgSage, imgSage2, imgManagement],
  "Informatique & Bureautique": [imgSage2, imgSage, imgFormation],
  "Commerce & Marketing": [imgTeam, imgRecruitment, imgManagement],
  "Logistique & Transit": [imgTechnique, imgCouloir],
  "QHSE & Industrie": [imgCouloir, imgTechnique],
  "Langues & Communication": [imgManagement, imgFormation, imgTeam],
  "Digital & Innovation": [imgHero, imgSage2],
  Entrepreneuriat: [imgFormation, imgRecruitment, imgConseil],
  "Formations Techniques": [imgTechnique, imgCouloir],
};

/** Petit hachage stable d'une chaîne (choix d'image de repli). */
function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

export function postImage(imageUrl?: string | null, category?: string): string {
  return imageUrl || BLOG_IMAGES[category ?? ""] || imgHero;
}

export function formationImage(imageUrl?: string | null, category?: string, seed?: string): string {
  if (imageUrl) return imageUrl;
  const pool = FORMATION_IMAGES[category ?? ""];
  if (!pool) return imgFormation;
  return seed ? pool[hash(seed) % pool.length] : pool[0];
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
