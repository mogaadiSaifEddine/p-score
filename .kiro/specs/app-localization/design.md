# Design Document

## Overview

This design implements a comprehensive internationalization (i18n) and theming system for the Charge-TN scoreboard application using Next.js 14 with App Router. The solution leverages React Context for state management, dynamic imports for translation loading, and CSS custom properties for theme switching.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
├─────────────────────────────────────────────────────────────┤
│  Route: /public-scoreboard/[gameCode]/[teamId]/[userType]/  │
│         [language]/[gameType]/page.tsx                      │
├─────────────────────────────────────────────────────────────┤
│                   I18n Provider Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Language Context │  │  Theme Context  │                  │
│  │   - Translations │  │  - Dark/Light   │                  │
│  │   - Locale State │  │  - Persistence  │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                    Component Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ MobileScoreboard│  │ LocaleSwitcher  │                  │
│  │   - Localized   │  │  - Lang Select  │                  │
│  │   - Themed      │  │  - Theme Toggle │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │Translation Loader│  │  Theme Manager  │                  │
│  │  - JSON Files   │  │  - CSS Variables│                  │
│  │  - Fallbacks    │  │  - LocalStorage │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── app/
│   ├── contexts/
│   │   ├── I18nContext.tsx
│   │   └── ThemeContext.tsx
│   ├── components/
│   │   ├── LocaleSwitcher.tsx
│   │   └── MobileScoreboard.tsx (updated)
│   ├── hooks/
│   │   ├── useTranslation.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── i18n.ts
│   │   └── theme.ts
│   └── public-scoreboard/[...]/page.tsx (updated)
├── public/
│   └── locales/
│       ├── en/
│       │   └── common.json
│       ├── fr/
│       │   └── common.json
│       ├── es/
│       │   └── common.json
│       └── is/
│           └── common.json
└── styles/
    ├── globals.css (updated with theme variables)
    └── themes.css
```

## Components and Interfaces

### I18n Context Interface

```typescript
interface I18nContextType {
  locale: string;
  translations: Record<string, string>;
  t: (key: string, params?: Record<string, string>) => string;
  changeLocale: (locale: string) => void;
  isLoading: boolean;
  supportedLocales: string[];
}
```

### Theme Context Interface

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}
```

### Translation File Structure

```typescript
interface TranslationFile {
  // Game Status
  gameStatus: {
    inProgress: string;
    finished: string;
    notStarted: string;
  };
  
  // Scoreboard
  scoreboard: {
    totalScore: string;
    time: string;
    treasuresDiscovered: string;
    noTreasures: string;
    endGame: string;
  };
  
  // Errors
  errors: {
    invalidUrl: string;
    teamNotFound: string;
    noGameData: string;
    apiError: string;
    tryAgain: string;
  };
  
  // Loading
  loading: {
    loadingGame: string;
    loading: string;
  };
  
  // Languages
  languages: {
    en: string;
    fr: string;
    es: string;
    is: string;
  };
  
  // Themes
  themes: {
    light: string;
    dark: string;
    system: string;
  };
}
```

## Data Models

### Locale Configuration

```typescript
interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
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
```

### Theme Configuration

```typescript
interface ThemeConfig {
  name: string;
  cssClass: string;
  variables: Record<string, string>;
}

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  light: {
    name: 'Light',
    cssClass: 'theme-light',
    variables: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--text-primary': '#1e293b',
      '--text-secondary': '#64748b',
      '--border-color': '#e2e8f0',
      '--accent-color': '#3b82f6'
    }
  },
  dark: {
    name: 'Dark',
    cssClass: 'theme-dark',
    variables: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#94a3b8',
      '--border-color': '#334155',
      '--accent-color': '#60a5fa'
    }
  }
};
```

## Error Handling

### Translation Loading Errors

1. **Missing Translation Files**: Fall back to English translations
2. **Network Errors**: Use cached translations or show error message
3. **Invalid JSON**: Log error and use fallback translations
4. **Missing Keys**: Return the key itself with a warning prefix

### Theme Application Errors

1. **Invalid Theme Values**: Fall back to system theme
2. **CSS Variable Errors**: Apply default theme variables
3. **LocalStorage Errors**: Use in-memory theme state

### Language Detection Errors

1. **Invalid URL Language**: Redirect to English version
2. **Unsupported Browser Language**: Default to English
3. **Missing Language Parameter**: Detect from browser or default to English

## Testing Strategy

### Unit Tests

1. **Translation Hook Tests**
   - Test translation key resolution
   - Test parameter interpolation
   - Test fallback behavior
   - Test locale switching

2. **Theme Hook Tests**
   - Test theme switching
   - Test persistence
   - Test system theme detection
   - Test CSS variable application

3. **Context Provider Tests**
   - Test provider initialization
   - Test state updates
   - Test error handling

### Integration Tests

1. **Component Integration**
   - Test MobileScoreboard with different locales
   - Test LocaleSwitcher functionality
   - Test theme application across components

2. **Route Integration**
   - Test language parameter parsing
   - Test locale-based redirects
   - Test URL updates on language change

### End-to-End Tests

1. **User Workflows**
   - Complete language switching flow
   - Theme persistence across sessions
   - Error handling scenarios

2. **Performance Tests**
   - Translation loading performance
   - Theme switching responsiveness
   - Memory usage with multiple locales

## Implementation Notes

### Performance Considerations

1. **Lazy Loading**: Load translations only when needed
2. **Caching**: Cache loaded translations in memory
3. **Bundle Splitting**: Separate translation files by locale
4. **CSS Optimization**: Use CSS custom properties for efficient theme switching

### Accessibility

1. **Screen Readers**: Provide proper ARIA labels for language/theme controls
2. **Keyboard Navigation**: Ensure all controls are keyboard accessible
3. **Color Contrast**: Maintain WCAG compliance in both themes
4. **Language Direction**: Support RTL languages if needed in future

### SEO Considerations

1. **URL Structure**: Maintain existing URL structure with language parameter
2. **Meta Tags**: Add appropriate lang attributes
3. **Alternate Links**: Consider adding hreflang tags for SEO
4. **Content Indexing**: Ensure search engines can index localized content