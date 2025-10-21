'use client';

import { useI18nContext } from '../contexts/I18nContext';

interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string>) => string;
  locale: string;
  isLoading: boolean;
  changeLocale: (locale: string) => void;
  supportedLocales: string[];
}

/**
 * Custom hook for accessing translations in components
 * Provides translation function with parameter interpolation and error handling
 */
export function useTranslation(): UseTranslationReturn {
  const { t, locale, isLoading, changeLocale, supportedLocales } = useI18nContext();

  return {
    t,
    locale,
    isLoading,
    changeLocale,
    supportedLocales,
  };
}

/**
 * Utility function for validating translation keys at development time
 * This helps catch missing or invalid translation keys early
 */
export function validateTranslationKey(key: string): boolean {
  if (!key || typeof key !== 'string') {
    console.error('Translation key must be a non-empty string');
    return false;
  }

  // Check for valid dot notation format
  const keyParts = key.split('.');
  if (keyParts.some(part => !part.trim())) {
    console.error(`Invalid translation key format: ${key}. Keys cannot have empty segments.`);
    return false;
  }

  return true;
}

/**
 * Enhanced translation function with validation
 * Use this in development to catch translation key issues early
 */
export function useTranslationWithValidation(): UseTranslationReturn & {
  tSafe: (key: string, params?: Record<string, string>) => string;
} {
  const translation = useTranslation();

  const tSafe = (key: string, params?: Record<string, string>): string => {
    if (process.env.NODE_ENV === 'development') {
      if (!validateTranslationKey(key)) {
        return `[Invalid Key: ${key}]`;
      }
    }

    return translation.t(key, params);
  };

  return {
    ...translation,
    tSafe,
  };
}

/**
 * Hook for getting formatted numbers according to locale
 */
export function useLocaleFormatting() {
  const { locale } = useTranslation();

  const formatNumber = (
    number: number, 
    options?: Intl.NumberFormatOptions
  ): string => {
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      console.error(`Error formatting number for locale ${locale}:`, error);
      return number.toString();
    }
  };

  const formatDate = (
    date: Date, 
    options?: Intl.DateTimeFormatOptions
  ): string => {
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.error(`Error formatting date for locale ${locale}:`, error);
      return date.toISOString();
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    formatNumber,
    formatDate,
    formatTime,
    locale,
  };
}