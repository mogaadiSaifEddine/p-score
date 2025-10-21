export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: {
    locale: string;
    options?: Intl.NumberFormatOptions;
  };
}

export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: { locale: 'en-US' }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { locale: 'fr-FR' }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { locale: 'es-ES' }
  },
  is: {
    code: 'is',
    name: 'Icelandic',
    nativeName: 'Íslenska',
    direction: 'ltr',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: { locale: 'is-IS' }
  }
};

export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALE_CODES = Object.keys(SUPPORTED_LOCALES);

export interface TranslationFile {
  gameStatus: {
    inProgress: string;
    finished: string;
    notStarted: string;
  };
  scoreboard: {
    totalScore: string;
    time: string;
    treasuresDiscovered: string;
    noTreasures: string;
    endGame: string;
  };
  errors: {
    invalidUrl: string;
    teamNotFound: string;
    noGameData: string;
    apiError: string;
    tryAgain: string;
  };
  loading: {
    loadingGame: string;
    loading: string;
  };
  languages: {
    en: string;
    fr: string;
    es: string;
    is: string;
    switchLanguage: string;
  };
  themes: {
    light: string;
    dark: string;
    system: string;
    switchTheme: string;
  };
}

/**
 * Validates if a locale code is supported
 */
export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALE_CODES.includes(locale);
}

/**
 * Gets the locale configuration for a given locale code
 */
export function getLocaleConfig(locale: string): LocaleConfig {
  return SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES[DEFAULT_LOCALE];
}

/**
 * Loads translation file for a given locale
 */
export async function loadTranslations(locale: string): Promise<TranslationFile> {
  try {
    const response = await fetch(`/locales/${locale}/common.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, falling back to ${DEFAULT_LOCALE}`, error);
    
    // Fallback to default locale if current locale fails
    if (locale !== DEFAULT_LOCALE) {
      const fallbackResponse = await fetch(`/locales/${DEFAULT_LOCALE}/common.json`);
      return await fallbackResponse.json();
    }
    
    throw error;
  }
}

/**
 * Detects user's preferred language from browser settings
 */
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const lang of browserLanguages) {
    // Check exact match first
    if (isValidLocale(lang)) {
      return lang;
    }
    
    // Check language code without region (e.g., 'en-US' -> 'en')
    const langCode = lang.split('-')[0];
    if (isValidLocale(langCode)) {
      return langCode;
    }
  }
  
  return DEFAULT_LOCALE;
}