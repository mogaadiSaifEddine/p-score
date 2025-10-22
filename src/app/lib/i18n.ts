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
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: { locale: 'de-DE' }
  },
  fi: {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    direction: 'ltr',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: { locale: 'fi-FI' }
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
    de: string;
    fi: string;
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

/**
 * Ensures a locale is valid, falling back to default if not
 */
export function ensureValidLocale(locale: string): string {
  if (!locale || typeof locale !== 'string') {
    console.warn(`Invalid locale provided: ${locale}, falling back to ${DEFAULT_LOCALE}`);
    return DEFAULT_LOCALE;
  }

  const normalizedLocale = locale.toLowerCase().trim();
  
  if (isValidLocale(normalizedLocale)) {
    return normalizedLocale;
  }

  // Try to extract language code from region-specific locale (e.g., 'en-US' -> 'en')
  const langCode = normalizedLocale.split('-')[0];
  if (isValidLocale(langCode)) {
    console.info(`Using language code '${langCode}' from locale '${locale}'`);
    return langCode;
  }

  console.warn(`Unsupported locale: ${locale}, falling back to ${DEFAULT_LOCALE}`);
  return DEFAULT_LOCALE;
}

/**
 * Loads translation with enhanced fallback mechanism
 */
export async function loadTranslationsWithFallback(locale: string): Promise<{
  translations: TranslationFile;
  actualLocale: string;
  hadFallback: boolean;
}> {
  const validLocale = ensureValidLocale(locale);
  const hadFallback = validLocale !== locale;

  try {
    const translations = await loadTranslations(validLocale);
    return {
      translations,
      actualLocale: validLocale,
      hadFallback
    };
  } catch (error) {
    // If we're already trying the default locale and it fails, this is a critical error
    if (validLocale === DEFAULT_LOCALE) {
      console.error('Failed to load default locale translations. This is a critical error.', error);
      throw new Error(`Critical: Cannot load default locale (${DEFAULT_LOCALE}) translations`);
    }

    // Try default locale as final fallback
    console.warn(`Failed to load ${validLocale} translations, falling back to ${DEFAULT_LOCALE}`, error);
    try {
      const fallbackTranslations = await loadTranslations(DEFAULT_LOCALE);
      return {
        translations: fallbackTranslations,
        actualLocale: DEFAULT_LOCALE,
        hadFallback: true
      };
    } catch (fallbackError) {
      console.error('Failed to load fallback translations', fallbackError);
      throw new Error(`Critical: Cannot load any translations (tried ${validLocale} and ${DEFAULT_LOCALE})`);
    }
  }
}