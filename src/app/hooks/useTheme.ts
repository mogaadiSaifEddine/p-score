'use client';

import { useThemeContext } from '../contexts/ThemeContext';
import { Theme, ResolvedTheme } from '../lib/theme';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

/**
 * Custom hook for accessing theme functionality in components
 * Provides theme state management and utility functions
 */
export function useTheme(): UseThemeReturn {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  };
}

/**
 * Hook for getting theme-aware CSS classes
 */
export function useThemeClasses() {
  const { resolvedTheme } = useTheme();

  const getThemeClass = (lightClass: string, darkClass: string): string => {
    return resolvedTheme === 'dark' ? darkClass : lightClass;
  };

  const getConditionalClass = (condition: boolean, trueClass: string, falseClass: string = ''): string => {
    return condition ? trueClass : falseClass;
  };

  return {
    resolvedTheme,
    getThemeClass,
    getConditionalClass,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  };
}

/**
 * Hook for theme-aware styling utilities
 */
export function useThemeStyles() {
  const { resolvedTheme } = useTheme();

  const getThemeValue = <T>(lightValue: T, darkValue: T): T => {
    return resolvedTheme === 'dark' ? darkValue : lightValue;
  };

  const getThemeStyle = (property: string, lightValue: string, darkValue: string): React.CSSProperties => {
    return {
      [property]: resolvedTheme === 'dark' ? darkValue : lightValue,
    };
  };

  return {
    resolvedTheme,
    getThemeValue,
    getThemeStyle,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  };
}