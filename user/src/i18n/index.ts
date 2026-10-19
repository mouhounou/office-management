import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";

/**
 * Le site est entièrement en français : les libellés partagés (navigation,
 * pied de page) restent centralisés dans locales/fr.json.
 */
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { fr: { translation: fr } },
    lng: "fr",
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
