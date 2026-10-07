import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import vi from './locales/vi';

export type Locale = 'en' | 'vi';

export const LOCALES: Locale[] = ['en', 'vi'];

const STORAGE_KEY = 'locale';

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === 'en' || stored === 'vi') return stored;
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'vi') return 'vi';
  } catch {
    // localStorage unavailable
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: resolveInitialLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    try {
      localStorage.setItem(STORAGE_KEY, lng);
      document.documentElement.setAttribute('lang', lng);
    } catch {
      // ignore
    }
  });

  document.documentElement.setAttribute('lang', i18n.language);
}

export default i18n;
