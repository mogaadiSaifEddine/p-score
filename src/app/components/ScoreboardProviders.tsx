'use client';

import React from 'react';
import { I18nProvider } from '../contexts/I18nContext';
import { ThemeProvider } from '../contexts/ThemeContext';

interface ScoreboardProvidersProps {
  children: React.ReactNode;
  initialLocale?: string;
  initialTheme?: 'light' | 'dark' | 'system';
}

export default function ScoreboardProviders({ 
  children, 
  initialLocale,
  initialTheme 
}: ScoreboardProvidersProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <I18nProvider initialLocale={initialLocale}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}