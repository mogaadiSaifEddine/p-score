// components/MobileScoreboard.tsx
// Mobile-first scoreboard component matching the screenshot design

'use client';

import React, { useState } from 'react';

interface TeamIconProps {
  color: string;
  shapes: ('circle' | 'triangle' | 'square')[];
}

const TeamIcon: React.FC<TeamIconProps> = ({ color, shapes }) => {
  return (
    <div 
      className="w-16 h-16 rounded-full flex items-center justify-center relative"
      style={{ backgroundColor: color }}
    >
      {shapes.map((shape, index) => {
        const positions = [
          'top-2 left-2',
          'top-2 right-2', 
          'bottom-2 left-2',
          'bottom-2 right-2'
        ];
        
        return (
          <div
            key={index}
            className={`absolute ${positions[index] || ''}`}
          >
            {shape === 'circle' && (
              <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
            )}
            {shape === 'triangle' && (
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-800"></div>
            )}
            {shape === 'square' && (
              <div className="w-3 h-3 bg-pink-400 rounded-sm"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface TreasureItemProps {
  image?: string;
  icon: string;
  score: number;
}

const TreasureItem: React.FC<TreasureItemProps> = ({ image, icon, score }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt="treasure" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{icon}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {icon && <span className="text-xl">{icon}</span>}
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
    </div>
  );
};

interface MobileScoreboardProps {
  gameStatus?: 'in_progress' | 'finished' | 'not_started';
  currentTeam?: {
    name: string;
    score: number;
    color: string;
    shapes: ('circle' | 'triangle' | 'square')[];
  };
  treasures?: Array<{
    id: number;
    image?: string;
    icon: string;
    score: number;
  }>;
  onEndGame?: () => void;
  showEndGameButton?: boolean;
}

export default function MobileScoreboard({
  gameStatus = 'in_progress',
  currentTeam = {
    name: 'Kids',
    score: 6,
    color: '#FFB347',
    shapes: ['circle', 'triangle', 'square']
  },
  treasures = [
    {
      id: 1,
      image: '/treasure1.jpg',
      icon: '🥭',
      score: 6
    }
  ],
  onEndGame,
  showEndGameButton = true
}: MobileScoreboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getGameStatusText = () => {
    switch (gameStatus) {
      case 'in_progress':
        return 'Game in progress';
      case 'finished':
        return 'Game over';
      case 'not_started':
        return 'Game not started';
      default:
        return 'Game in progress';
    }
  };

  const handleEndGame = async () => {
    if (onEndGame) {
      setIsLoading(true);
      try {
        await onEndGame();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button className="mr-4 text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Scoreboard</h1>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="px-6 py-4 text-center">
        <p className="text-gray-500 text-sm">{getGameStatusText()}</p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Current Team Section */}
        <div className="flex items-center justify-between mb-8">
          {/* Total Score */}
          <div>
            <p className="text-blue-600 font-medium mb-2 text-sm">Total Score</p>
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 flex items-center justify-center bg-white">
              <span className="text-3xl font-bold text-blue-600">{currentTeam.score}</span>
            </div>
          </div>

          {/* Team Info */}
          <div className="text-center">
            <TeamIcon 
              color={currentTeam.color} 
              shapes={currentTeam.shapes}
            />
            <p className="mt-3 text-gray-700 font-medium text-lg">{currentTeam.name}</p>
          </div>
        </div>

        {/* Treasures Discovered Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium">Treasures Discovered</h3>
            <h3 className="text-gray-500 font-medium">Score</h3>
          </div>
          
          <div>
            {treasures.map((treasure) => (
              <TreasureItem
                key={treasure.id}
                image={treasure.image}
                icon={treasure.icon}
                score={treasure.score}
              />
            ))}
          </div>
        </div>

        {/* End Game Button */}
        {showEndGameButton && gameStatus === 'in_progress' && (
          <div className="mt-8">
            <button
              onClick={handleEndGame}
              disabled={isLoading}
              className="w-full bg-red-400 hover:bg-red-500 disabled:bg-red-300 text-white font-medium py-4 px-4 rounded-2xl transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Ending Game...
                </div>
              ) : (
                'End Game'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-6"></div>
    </div>
  );
}