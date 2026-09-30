"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import thDict from "@/i18n/th.json";
import enDict from "@/i18n/en.json";

type Locale = "th" | "en";
type TranslationDict = typeof thDict;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    const saved = localStorage.getItem("omr_locale") as Locale;
    if (saved === "th" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("omr_locale", newLocale);
  };

  const toggleLocale = () => {
    const next = locale === "th" ? "en" : "th";
    setLocale(next);
  };

  const t = locale === "th" ? thDict : enDict;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
