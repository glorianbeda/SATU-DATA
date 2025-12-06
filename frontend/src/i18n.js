import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationID from "./locales/id.json";
import translationEN from "./locales/en.json";

const resources = {
  id: {
    translation: translationID,
  },
  en: {
    translation: translationEN,
  },
};

// Check if user has a language preference saved
const savedLang = localStorage.getItem("i18nextLng");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Use saved language, or default to Indonesian
    lng: savedLang || "id",
    fallbackLng: "id",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Helper function to change language (can be used in components)
export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("i18nextLng", lang);
};

export default i18n;
