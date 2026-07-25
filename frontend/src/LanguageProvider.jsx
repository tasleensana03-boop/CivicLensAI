import { createContext, useContext, useEffect, useState } from "react";
import { LOCALES } from "./i18n";

const LanguageContext = createContext({
  language: LOCALES.EN,
  setLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return LOCALES.EN;
    return window.localStorage.getItem("civicLensLanguage") || LOCALES.EN;
  });

  useEffect(() => {
    window.localStorage.setItem("civicLensLanguage", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
