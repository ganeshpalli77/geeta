/**
 * Translations Index
 * Central export for all language translations
 */

import { en, Translation } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { ta } from './ta';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  'hindi',
  'english',
  'marathi',
  'telugu',
  'kannada',
  'tamil',
  'malayalam',
  'gujarati',
  'bengali',
  'odia',
  'nepali',
  'assamese',
  'sindhi',
  'manipuri',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Language metadata
export const LANGUAGE_CONFIG: Record<SupportedLanguage, {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}> = {
  hindi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  english: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇬🇧',
  },
  marathi: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  telugu: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  kannada: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  tamil: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  malayalam: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  gujarati: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  bengali: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  odia: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  nepali: {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    direction: 'ltr',
    flag: '🇳🇵',
  },
  assamese: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  sindhi: {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    direction: 'rtl',
    flag: '🇵🇰',
  },
  manipuri: {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    direction: 'ltr',
    flag: '🇮🇳',
  },
};

// Translation map
// Note: For languages without full translations yet, fallback to English
export const translations: Record<SupportedLanguage, Translation> = {
  hindi: hi,
  english: en,
  marathi: mr, // TODO: Add Marathi translations
  telugu: en, // TODO: Add Telugu translations
  kannada: en, // TODO: Add Kannada translations
  tamil: ta, // TODO: Add Tamil translations
  malayalam: en, // TODO: Add Malayalam translations
  gujarati: en, // TODO: Add Gujarati translations
  bengali: en, // TODO: Add Bengali translations
  odia: en, // TODO: Add Odia translations
  nepali: en, // TODO: Add Nepali translations
  assamese: en, // TODO: Add Assamese translations
  sindhi: en, // TODO: Add Sindhi translations
  manipuri: en, // TODO: Add Manipuri translations
};

// Get translation for a language
export function getTranslation(language: SupportedLanguage): Translation {
  return translations[language] || translations.english;
}

// Map language code to SupportedLanguage
export function getLanguageFromCode(code: string): SupportedLanguage {
  const entry = Object.entries(LANGUAGE_CONFIG).find(([_, config]) => config.code === code);
  return (entry?.[0] as SupportedLanguage) || 'english';
}

// Map SupportedLanguage to code
export function getCodeFromLanguage(language: SupportedLanguage): string {
  return LANGUAGE_CONFIG[language]?.code || 'en';
}

export type { Translation };
export { en, hi, mr, ta };