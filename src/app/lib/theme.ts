'use client';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeConfig {
  name: string;
  cssClass: string;
  variables: Record<string, string>;
}

export const THEME_CONFIGS: Record<ResolvedTheme, ThemeConfig> = {
  light: {
    name: 'Light',
    cssClass: 'theme-light',
    variables: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--text-primary': '#1e293b',
      '--text-secondary': '#64748b',
      '--border-color': '#e2e8f0',
      '--accent-color': '#3b82f6',
      '--success-color': '#10b981',
      '--warning-color': '#f59e0b',
      '--error-color': '#ef4444',
      '--shadow-color': 'rgba(0, 0, 0, 0.1)',
    },
  },
  dark: {
    name: 'Dark',
    cssClass: 'theme-dark',
    variables: {
      '--bg-primary': '#0a0a0a',
      '--bg-secondary': '#1a1a1a',
      '--text-primary': '#f5f5f5',
      '--text-secondary': '#a3a3a3',
      '--border-color': '#2a2a2a',
      '--accent-color': '#60a5fa',
      '--success-color': '#34d399',
      '--warning-color': '#fbbf24',
      '--error-color': '#f87171',
      '--shadow-color': 'rgba(0, 0, 0, 0.3)',
    },
  },
};

export const DEFAULT_THEME: Theme = 'system';
export const THEME_STORAGE_KEY = 'charge-tn-theme';

/**
 * Detects the system theme preference
 */
export function detectSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'; // Default for SSR
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system theme:', error);
    return 'light';
  }
}

/**
 * Resolves a theme to its actual value (converts 'system' to 'light' or 'dark')
 */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return detectSystemTheme();
  }
  return theme;
}

/**
 * Validates if a theme value is valid
 */
export function isValidTheme(theme: string): theme is Theme {
  return ['light', 'dark', 'system'].includes(theme);
}

/**
 * Gets the stored theme from localStorage
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidTheme(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return null;
}

/**
 * Stores the theme in localStorage
 */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error);
  }
}

/**
 * Applies theme CSS variables to the document root
 */
export function applyThemeToDocument(resolvedTheme: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

  const config = THEME_CONFIGS[resolvedTheme];
  const root = document.documentElement;

  // Remove existing theme classes
  Object.values(THEME_CONFIGS).forEach((themeConfig) => {
    root.classList.remove(themeConfig.cssClass);
  });

  // Add new theme class
  root.classList.add(config.cssClass);

  // Apply CSS variables
  Object.entries(config.variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Sets up system theme change listener
 */
export function setupSystemThemeListener(callback: (theme: ResolvedTheme) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light');
    };

    // Use addEventListener if available (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  } catch (error) {
    console.warn('Failed to setup system theme listener:', error);
  }

  return () => {};
}
