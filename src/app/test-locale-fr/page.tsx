'use client';

import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import ScoreboardProviders from '../components/ScoreboardProviders';
import { useTranslation } from '../hooks/useTranslation';

export default function TestLocaleFrPage() {
  return (
    <ScoreboardProviders initialLocale="fr">
      <TestContent />
    </ScoreboardProviders>
  );
}

function TestContent() {
  const { t, locale } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Test de Localisation (Français)</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">État de la Localisation</h2>
          <p className="text-blue-700">Langue Actuelle: <strong>{locale}</strong></p>
          <p className="text-blue-700">Statut du Jeu (traduit): <strong>{t('gameStatus.inProgress')}</strong></p>
          <p className="text-blue-700">Score Total (traduit): <strong>{t('scoreboard.totalScore')}</strong></p>
          <p className="text-blue-700">Thème (traduit): <strong>{t('themes.light')}</strong></p>
        </div>
          
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Bouton de Thème</h2>
          <p className="text-gray-600 mb-4">
            Cette page démontre le bouton de changement de thème en français.
          </p>
          
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}