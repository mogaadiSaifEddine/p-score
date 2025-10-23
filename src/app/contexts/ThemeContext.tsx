'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Theme,
  ResolvedTheme,
  DEFAULT_THEME,
  detectSystemTheme,
  resolveTheme,
  isValidTheme,
  getStoredTheme,
  storeTheme,
  applyThemeToDocument,
  setupSystemThemeListener
} from '../lib/theme';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme || DEFAULT_THEME);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      let initialThemeValue: Theme;

      if (initialTheme) {
        initialThemeValue = initialTheme;
      } else {
        // Try to get stored theme, fallback to default
        const storedTheme = getStoredTheme();
        initialThemeValue = storedTheme || DEFAULT_THEME;
      }

      // Validate the theme
      if (!isValidTheme(initialThemeValue)) {
        initialThemeValue = DEFAULT_THEME;
      }

      setThemeState(initialThemeValue);
      const resolved = resolveTheme(initialThemeValue);
      setResolvedTheme(resolved);
      applyThemeToDocument(resolved);
      setIsInitialized(true);
    };

    initializeTheme();
  }, [initialTheme]);

  // Set up system theme listener when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const cleanup = setupSystemThemeListener((systemTheme: ResolvedTheme) => {
      setResolvedTheme(systemTheme);
      applyThemeToDocument(systemTheme);
    });

    return cleanup;
  }, [theme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyThemeToDocument(resolved);
  }, [theme, isInitialized]);

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    if (!isValidTheme(newTheme)) {
      return;
    }

    setThemeState(newTheme);
    storeTheme(newTheme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently system, toggle to the opposite of current resolved theme
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}