'use client';

import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import ScoreboardProviders from '../components/ScoreboardProviders';
import { useTranslation } from '../hooks/useTranslation';

export default function TestLocalePage() {
  return (
    <ScoreboardProviders initialLocale="en">
      <TestContent />
    </ScoreboardProviders>
  );
}

function TestContent() {
  const { t, locale } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Theme Toggle Test Page</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Localization Status</h2>
          <p className="text-blue-700">Current Language: <strong>{locale}</strong></p>
          <p className="text-blue-700">Game Status (translated): <strong>{t('gameStatus.inProgress')}</strong></p>
          <p className="text-blue-700">Total Score (translated): <strong>{t('scoreboard.totalScore')}</strong></p>
        </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Theme Toggle Component</h2>
            <p className="text-gray-600 mb-4">
              This page demonstrates the theme toggle button. Language is auto-detected from the URL.
            </p>
            
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Theme switching (light/dark/system) with single button</li>
              <li>Circular button design matching the provided mockup</li>
              <li>Smooth animations and hover effects</li>
              <li>Language auto-detected from URL parameter</li>
              <li>Responsive design</li>
              <li>Accessibility support</li>
            </ul>
        </div>
      </div>
    </div>
  );
}