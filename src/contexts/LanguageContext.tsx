import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, getTranslation, Translation, LANGUAGE_CONFIG } from '../locales';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translation;
  languageConfig: typeof LANGUAGE_CONFIG[SupportedLanguage];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && saved in LANGUAGE_CONFIG) {
      return saved as SupportedLanguage;
    }
    // Default to English
    return 'english';
  });

  const [t, setT] = useState<Translation>(() => getTranslation(language));

  useEffect(() => {
    // Update translations when language changes
    setT(getTranslation(language));
    // Save to localStorage
    localStorage.setItem('preferredLanguage', language);
    // Set HTML lang attribute
    document.documentElement.lang = LANGUAGE_CONFIG[language].code;
    // Set direction for RTL languages
    document.documentElement.dir = LANGUAGE_CONFIG[language].direction;
  }, [language]);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languageConfig: LANGUAGE_CONFIG[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook to just get translations
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
