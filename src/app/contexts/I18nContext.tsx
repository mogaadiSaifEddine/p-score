'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TranslationFile, 
  loadTranslations, 
  isValidLocale, 
  DEFAULT_LOCALE, 
  SUPPORTED_LOCALE_CODES,
  detectBrowserLanguage,
  ensureValidLocale,
  loadTranslationsWithFallback
} from '../lib/i18n';

interface I18nContextType {
  locale: string;
  translations: TranslationFile | null;
  t: (key: string, params?: Record<string, string>) => string;
  changeLocale: (locale: string) => void;
  isLoading: boolean;
  supportedLocales: string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: string;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocale] = useState<string>(initialLocale || DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<TranslationFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Translation function with parameter interpolation and fallback
  const t = (key: string, params?: Record<string, string>): string => {
    if (!translations) {
      return key;
    }

    try {
      // Navigate through nested object using dot notation
      const keys = key.split('.');
      let value: any = translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Key not found, return key with warning prefix
          console.warn(`Translation key not found: ${key} for locale: ${locale}`);
          return `[Missing: ${key}]`;
        }
      }

      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key} for locale: ${locale}`);
        return `[Invalid: ${key}]`;
      }

      // Handle parameter interpolation
      if (params) {
        return Object.entries(params).reduce((text, [param, replacement]) => {
          return text.replace(new RegExp(`{{${param}}}`, 'g'), replacement);
        }, value);
      }

      return value;
    } catch (error) {
      console.error(`Error accessing translation key: ${key}`, error);
      return `[Error: ${key}]`;
    }
  };

  // Load translations for the current locale with enhanced fallback
  const loadLocaleTranslations = async (localeCode: string) => {
    setIsLoading(true);
    try {
      const { translations: translationData, actualLocale, hadFallback } = await loadTranslationsWithFallback(localeCode);
      setTranslations(translationData);
      
      // Update locale if fallback was used
      if (hadFallback && actualLocale !== localeCode) {
        console.info(`Locale changed from '${localeCode}' to '${actualLocale}' due to fallback`);
        setLocale(actualLocale);
      }
    } catch (error) {
      console.error(`Critical error loading translations for locale: ${localeCode}`, error);
      setTranslations(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Change locale function with validation
  const changeLocale = (newLocale: string) => {
    const validLocale = ensureValidLocale(newLocale);
    
    if (validLocale !== locale) {
      setLocale(validLocale);
    }
  };

  // Load translations when locale changes
  useEffect(() => {
    loadLocaleTranslations(locale);
  }, [locale]);

  // Initialize locale on mount if not provided
  useEffect(() => {
    if (!initialLocale) {
      const detectedLocale = detectBrowserLanguage();
      if (detectedLocale !== locale) {
        setLocale(detectedLocale);
      }
    }
  }, [initialLocale, locale]);

  const contextValue: I18nContextType = {
    locale,
    translations,
    t,
    changeLocale,
    isLoading,
    supportedLocales: SUPPORTED_LOCALE_CODES,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
}