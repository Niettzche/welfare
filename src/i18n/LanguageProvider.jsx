import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SUPPORTED_LANGUAGES, translations } from './translations';
import { LanguageContext } from './context';

const STORAGE_KEY = 'welfare_language';

const getPathValue = (obj, path) => {
  if (!obj) return undefined;
  const parts = String(path).split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, part)) cur = cur[part];
    else return undefined;
  }
  return cur;
};

const interpolate = (value, vars) => {
  if (typeof value !== 'string') return value;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? `{${k}}` : String(vars[k])));
};

const normalizeLanguage = (lang) => {
  if (!lang) return null;
  const candidate = String(lang).toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(candidate) ? candidate : null;
};

const getInitialLanguage = (defaultLanguage) => {
  try {
    const stored = normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // ignore
  }

  const explicitDefault = normalizeLanguage(defaultLanguage);
  if (explicitDefault) return explicitDefault;

  const browser = normalizeLanguage(typeof navigator !== 'undefined' ? navigator.language : null);
  return browser || 'es';
};

export const LanguageProvider = ({ children, defaultLanguage }) => {
  const [language, setLanguage] = useState(() => getInitialLanguage(defaultLanguage));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') document.documentElement.lang = language;
  }, [language]);

  const setLanguageSafe = useCallback((next) => {
    const normalized = normalizeLanguage(next);
    if (normalized) setLanguage(normalized);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (key, vars) => {
      const direct = getPathValue(translations[language], key);
      const fallbackEs = getPathValue(translations.es, key);
      const fallbackEn = getPathValue(translations.en, key);
      const chosen = direct ?? fallbackEs ?? fallbackEn ?? key;
      return interpolate(chosen, vars);
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage: setLanguageSafe, toggleLanguage, t }),
    [language, setLanguageSafe, toggleLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
