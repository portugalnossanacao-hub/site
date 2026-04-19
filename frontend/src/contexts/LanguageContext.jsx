import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "fr";
    const stored = window.localStorage.getItem("hardtek.lang");
    if (stored && translations[stored]) return stored;
    return "fr";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("hardtek.lang", lang);
      document.documentElement.setAttribute("lang", lang);
    } catch (err) {
      console.warn("Failed to persist language:", err?.message || err);
    }
  }, [lang]);

  const value = useMemo(() => {
    return {
      lang,
      setLang,
      t: translations[lang] || translations.fr,
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
