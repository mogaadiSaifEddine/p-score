'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_LOCALES } from '../lib/i18n';
import { Theme } from '../lib/theme';
import './LocaleSwitcher.css';

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className = '' }: LocaleSwitcherProps) {
  const { t, locale, changeLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle language change with URL update
  const handleLanguageChange = (newLocale: string) => {
    // Update the locale in context
    changeLocale(newLocale);
    
    // Update URL by replacing the language parameter
    const pathSegments = pathname.split('/');
    const languageIndex = pathSegments.findIndex((segment, index) => {
      // Look for the language parameter in the expected position
      // Format: /public-scoreboard/[gameCode]/[teamId]/[userType]/[language]/[appName]
      return index === 5 && Object.keys(SUPPORTED_LOCALES).includes(segment);
    });
    
    if (languageIndex !== -1) {
      pathSegments[languageIndex] = newLocale;
      const newPath = pathSegments.join('/');
      router.push(newPath);
    }
    
    setIsLanguageDropdownOpen(false);
  };

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsThemeDropdownOpen(false);
  };

  // Get theme icon based on current theme
  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  // Get language flag emoji (simple representation)
  const getLanguageFlag = (localeCode: string) => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      fr: '🇫🇷',
      es: '🇪🇸',
      is: '🇮🇸'
    };
    return flags[localeCode] || '🌐';
  };

  const currentLocaleConfig = SUPPORTED_LOCALES[locale];
  const themes: Theme[] = ['light', 'dark', 'system'];

  return (
    <div className={`locale-switcher ${className}`}>
      {/* Language Switcher */}
      <div className="relative" ref={languageDropdownRef}>
        <button
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className={`locale-switcher-button ${isLanguageDropdownOpen ? 'locale-switcher-dropdown-open' : ''}`}
          aria-label={t('languages.switchLanguage', { current: currentLocaleConfig.nativeName })}
        >
          <span className="locale-switcher-flag">{getLanguageFlag(locale)}</span>
          <span className="locale-switcher-text">{currentLocaleConfig.nativeName}</span>
          <svg className="locale-switcher-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isLanguageDropdownOpen && (
          <div className="locale-switcher-dropdown" style={{ width: '12rem' }}>
            <div className="py-1">
              {Object.values(SUPPORTED_LOCALES).map((localeConfig) => (
                <button
                  key={localeConfig.code}
                  onClick={() => handleLanguageChange(localeConfig.code)}
                  className={`locale-switcher-dropdown-item ${
                    locale === localeConfig.code ? 'active' : ''
                  }`}
                >
                  <span className="locale-switcher-flag">{getLanguageFlag(localeConfig.code)}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{localeConfig.nativeName}</span>
                    <span className="text-xs opacity-75">{localeConfig.name}</span>
                  </div>
                  {locale === localeConfig.code && (
                    <svg className="locale-switcher-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme Switcher */}
      <div className="relative" ref={themeDropdownRef}>
        <button
          onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
          className={`locale-switcher-button ${isThemeDropdownOpen ? 'locale-switcher-dropdown-open' : ''}`}
          aria-label={t('themes.switchTheme', { current: t(`themes.${theme}`) })}
        >
          <span className="locale-switcher-icon">{getThemeIcon(theme)}</span>
          <span className="locale-switcher-text">{t(`themes.${theme}`)}</span>
          <svg className="locale-switcher-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isThemeDropdownOpen && (
          <div className="locale-switcher-dropdown" style={{ width: '10rem' }}>
            <div className="py-1">
              {themes.map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`locale-switcher-dropdown-item ${
                    theme === themeOption ? 'active' : ''
                  }`}
                >
                  <span className="locale-switcher-icon">{getThemeIcon(themeOption)}</span>
                  <span className="font-medium">{t(`themes.${themeOption}`)}</span>
                  {theme === themeOption && (
                    <svg className="locale-switcher-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}