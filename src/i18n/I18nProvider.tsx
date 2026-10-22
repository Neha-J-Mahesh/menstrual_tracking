import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type StringKey } from './translations';
import type { Language } from '../data/types';
import { AsyncStorage } from '../storage/AsyncStorage';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: StringKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const LANG_KEY = '@app_language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Load saved language on mount
  useState(() => {
    AsyncStorage.getItem<Language>(LANG_KEY).then((saved) => {
      if (saved) setLangState(saved);
    });
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    AsyncStorage.setItem(LANG_KEY, newLang);
  }, []);

  const t = useCallback(
    (key: StringKey) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang]
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
