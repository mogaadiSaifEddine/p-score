// components/ExactMobileScoreboard.tsx
// Exact replica of the mobile scoreboard UI from the screenshot

'use client';

import React from 'react';

export interface TeamIconProps {
  color?: string;
  shapes?: ('circle' | 'triangle' | 'square')[];
  size?: 'small' | 'large';
}

export const TeamIcon: React.FC<TeamIconProps> = ({ 
  color = '#FFB347', 
  shapes = ['circle', 'triangle', 'square'],
  size = 'large'
}) => {
  const isLarge = size === 'large';
  const iconSize = isLarge ? 64 : 48; // 64px for large, 48px for small
  const shapeSize = isLarge ? 12 : 8; // 12px for large, 8px for small
  
  return (
    <div 
      className="rounded-full flex items-center justify-center relative"
      style={{ 
        backgroundColor: color,
        width: `${iconSize}px`,
        height: `${iconSize}px`
      }}
    >
      {/* Teal circle in top-left corner */}
      {shapes.includes('circle') && (
        <div 
          className="absolute rounded-full"
          style={{
            backgroundColor: '#14B8A6', // Exact teal color
            width: `${shapeSize}px`,
            height: `${shapeSize}px`,
            top: '4px',
            left: '4px'
          }}
        />
      )}
      
      {/* Dark triangle in top-right corner */}
      {shapes.includes('triangle') && (
        <div 
          className="absolute"
          style={{
            top: '4px',
            right: '4px'
          }}
        >
          <div 
            className="w-0 h-0"
            style={{
              borderLeft: `${shapeSize/2}px solid transparent`,
              borderRight: `${shapeSize/2}px solid transparent`,
              borderBottom: `${shapeSize}px solid #1F2937` // Exact dark gray color
            }}
          />
        </div>
      )}
      
      {/* Pink square in bottom-left corner */}
      {shapes.includes('square') && (
        <div 
          className="absolute"
          style={{
            backgroundColor: '#F472B6', // Exact pink color
            width: `${shapeSize}px`,
            height: `${shapeSize}px`,
            bottom: '4px',
            left: '4px'
          }}
        />
      )}
    </div>
  );
};

export const TreasureItem: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Treasure image placeholder */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
              <div className="w-8 h-6 bg-orange-400 rounded-sm"></div>
            </div>
          </div>
          {/* Mango emoji */}
          <span className="text-xl">🥭</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">6</span>
        </div>
      </div>
    </div>
  );
};

export interface ExactMobileScoreboardProps {
  gameStatus?: 'in_progress' | 'finished' | 'not_started';
  teamName?: string;
  score?: number;
  onEndGame?: () => void;
  showEndGameButton?: boolean;
}

export  function ExactMobileScoreboard({
  gameStatus = 'in_progress',
  teamName = 'Kids',
  score = 6,
  onEndGame,
  showEndGameButton = true
}: ExactMobileScoreboardProps) {
  const [isLoading, setIsLoading] = React.useState(false);

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
      <div className="px-6 py-6 text-center">
        <p className="text-gray-400 text-base">{getGameStatusText()}</p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Score and Team Section */}
        <div className="flex items-center justify-between mb-12">
          {/* Total Score */}
          <div>
            <p className="text-blue-600 font-medium mb-3 text-base">Total Score</p>
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 flex items-center justify-center bg-white">
              <span className="text-3xl font-bold text-blue-600">{score}</span>
            </div>
          </div>

          {/* Team Info */}
          <div className="text-center flex flex-col items-center">
            <TeamIcon size="large" />
            <p className="mt-4 text-gray-700 font-medium text-lg">{teamName}</p>
          </div>
        </div>

        {/* Treasures Discovered Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-medium text-base">Treasures Discovered</h3>
            <h3 className="text-gray-400 font-medium text-base">Score</h3>
          </div>
          
          <div>
            <TreasureItem />
          </div>
        </div>

        {/* Empty space to match the screenshot */}
        <div className="h-32"></div>

      
      </div>

      {/* Bottom indicator bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-black">
        <div className="w-32 h-1 bg-white mx-auto"></div>
      </div>
    </div>
  );
}