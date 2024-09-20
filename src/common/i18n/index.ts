/** @format */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ScopeKey, ScopeValue } from "../../models/enum";
import translationEN from "./locales/en.json";
import translationVIE from "./locales/vi.json";

const resources = {
  [ScopeValue.ENG]: {
    translation: translationEN,
  },
  [ScopeValue.VIE]: {
    translation: translationVIE,
  },
};

let lang = localStorage.getItem(ScopeKey.LANG);
if (!lang) lang = ScopeValue.VIE;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: lang,
    keySeparator: false, // we do not use keys in form messages.welcome
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
