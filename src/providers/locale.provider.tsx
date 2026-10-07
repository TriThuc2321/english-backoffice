import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

import { type Locale } from '@/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [locale, setLocaleState] = useState<Locale>(
    (i18n.language as Locale) ?? 'en',
  );

  const setLocale = useCallback(
    (next: Locale) => {
      i18n.changeLanguage(next);
      setLocaleState(next);
    },
    [i18n],
  );

  const toggleLocale = useCallback(() => {
    const next = locale === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(next);
    setLocaleState(next);
  }, [locale, i18n]);

  return (
    <LocaleContext value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
