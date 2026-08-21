import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = ["fr", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = "om_lang";
const DEFAULT_LANGUAGE: Language = "fr";

/**
 * Le site est rendu côté serveur : la langue du premier rendu doit être la
 * même des deux côtés, sinon React signale une différence d'hydratation et
 * reconstruit toute la page.
 *
 * On démarre donc toujours en français (serveur comme navigateur), puis on
 * applique la préférence du visiteur après l'hydratation (voir
 * `applyPreferredLanguage`, appelée depuis la racine).
 */
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
  });
}

function isSupported(value: string | null | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

/** Langue mémorisée, sinon celle du navigateur, sinon le français. */
function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    /* localStorage indisponible (navigation privée) : on ignore. */
  }

  const navigatorLanguage = navigator.language?.slice(0, 2);
  return isSupported(navigatorLanguage) ? navigatorLanguage : DEFAULT_LANGUAGE;
}

/** À appeler une fois côté navigateur, après l'hydratation. */
export function applyPreferredLanguage(): void {
  if (typeof window === "undefined") return;

  const language = detectLanguage();
  if (language !== i18n.language) i18n.changeLanguage(language);
  document.documentElement.lang = language;
}

/** Changement de langue depuis l'interface : applique et mémorise. */
export function setLanguage(language: Language): void {
  i18n.changeLanguage(language);
  if (typeof document !== "undefined") document.documentElement.lang = language;
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    /* Préférence non mémorisable : le changement reste valable pour la visite. */
  }
}

export default i18n;
