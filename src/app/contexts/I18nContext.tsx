'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TranslationFile, 
  loadTranslations, 
  isValidLocale, 
  DEFAULT_LOCALE, 
  SUPPORTED_LOCALE_CODES,
  detectBrowserLanguage 
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

  // Load translations for the current locale
  const loadLocaleTranslations = async (localeCode: string) => {
    setIsLoading(true);
    try {
      const translationData = await loadTranslations(localeCode);
      setTranslations(translationData);
    } catch (error) {
      console.error(`Failed to load translations for locale: ${localeCode}`, error);
      
      // If we failed to load the requested locale and it's not the default,
      // try to load the default locale as fallback
      if (localeCode !== DEFAULT_LOCALE) {
        try {
          const fallbackTranslations = await loadTranslations(DEFAULT_LOCALE);
          setTranslations(fallbackTranslations);
          console.warn(`Loaded fallback translations (${DEFAULT_LOCALE}) for failed locale: ${localeCode}`);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations', fallbackError);
          setTranslations(null);
        }
      } else {
        setTranslations(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Change locale function
  const changeLocale = (newLocale: string) => {
    if (!isValidLocale(newLocale)) {
      console.warn(`Invalid locale: ${newLocale}, falling back to ${DEFAULT_LOCALE}`);
      newLocale = DEFAULT_LOCALE;
    }
    
    if (newLocale !== locale) {
      setLocale(newLocale);
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