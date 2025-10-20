'use client';

import React, { useState } from 'react';

const TeamIcon: React.FC<{ color?: string; shapes?: string[] }> = ({ 
  color = '#FFB347', 
  shapes = ['circle', 'triangle', 'square'] 
}) => {
  return (
    <div 
      className="w-16 h-16 rounded-full flex items-center justify-center relative"
      style={{ backgroundColor: color }}
    >
      {/* Dynamic shapes based on props */}
      {shapes.includes('circle') && (
        <div className="absolute top-2 left-2 w-3 h-3 bg-teal-400 rounded-full"></div>
      )}
      
      {shapes.includes('triangle') && (
        <div className="absolute top-2 right-2">
          <div 
            className="w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '8px solid #4A90E2'
            }}
          ></div>
        </div>
      )}
      
      {shapes.includes('square') && (
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-pink-400 rounded-sm"></div>
      )}
    </div>
  );
};

interface TreasureItemProps {
  waypoint?: {
    id: number;
    title?: string;
    description?: string;
    thumb_image?: string;
    score?: number;
  };
  treasure?: {
    waypoint_challenge: number;
    score_earned: number;
    description: string;
    time: string;
  };
  score: number;
  icon: string;
}

const TreasureItem: React.FC<TreasureItemProps> = ({ waypoint, treasure, score, icon }) => {
  // Generate the media manager URL for waypoint thumbnail
  const getWaypointImageUrl = (waypointId: number, thumbImage?: string) => {
    if (!thumbImage) return null;
    const timestamp = Date.now();
    return `/media_manager/api/get_media_file/?app=author&model=waypoint&pk=${waypointId}&field=thumb_image&type=image&size=medium&${thumbImage}&_t=${timestamp}`;
  };

  const imageUrl = waypoint ? getWaypointImageUrl(waypoint.id, waypoint.thumb_image) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Waypoint image or fallback */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={waypoint?.title || treasure?.description || 'Treasure'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
              <div className="w-8 h-6 bg-orange-400 rounded-sm"></div>
            </div>
          </div>
          {/* Treasure emoji icon */}
          <span className="text-xl">{icon}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
    </div>
  );
};

interface ExactMobileScoreboardProps {
  gameStatus?: 'in_progress' | 'finished' | 'not_started';
  teamName?: string;
  teamColor?: string;
  teamShapes?: string[];
  score?: number;
  treasures?: Array<{
    waypoint?: {
      id: number;
      title?: string;
      description?: string;
      thumb_image?: string;
      score?: number;
    };
    treasure?: {
      waypoint_challenge: number;
      score_earned: number;
      description: string;
      time: string;
    };
    score: number;
    icon?: string;
  }>;
  onEndGame?: () => void;
  showEndGameButton?: boolean;
}

// Helper function to get treasure icon based on description
const getTreasureIcon = (description: string, waypointId?: number): string => {
  const desc = description.toLowerCase();
  
  // Map based on description keywords
  if (desc.includes('fruit') || desc.includes('mango') || desc.includes('orange')) return '🥭';
  if (desc.includes('coin') || desc.includes('money')) return '🪙';
  if (desc.includes('gem') || desc.includes('diamond')) return '💎';
  if (desc.includes('star')) return '⭐';
  if (desc.includes('trophy') || desc.includes('cup')) return '🏆';
  if (desc.includes('chest') || desc.includes('box')) return '📦';
  if (desc.includes('key')) return '🗝️';
  if (desc.includes('scroll') || desc.includes('map')) return '📜';
  if (desc.includes('crystal') || desc.includes('magic')) return '🔮';
  if (desc.includes('crown') || desc.includes('royal')) return '👑';
  if (desc.includes('tree') || desc.includes('forest')) return '🌲';
  if (desc.includes('water') || desc.includes('lake') || desc.includes('river')) return '🌊';
  if (desc.includes('mountain') || desc.includes('hill')) return '⛰️';
  if (desc.includes('house') || desc.includes('building')) return '🏠';
  if (desc.includes('temple') || desc.includes('church')) return '🏛️';
  if (desc.includes('bridge')) return '🌉';
  if (desc.includes('lighthouse')) return '🗼';
  if (desc.includes('flag')) return '🚩';
  
  // Fallback based on waypoint ID
  const iconsByNumber = ['💎', '🏆', '⭐', '🪙', '🔮', '👑', '📦', '🗝️', '📜', '🥭'];
  return iconsByNumber[(waypointId || 0) % iconsByNumber.length];
};

export default function ExactMobileScoreboard({
  gameStatus = 'in_progress',
  currentTeam={},
  teamName = 'Team',
  teamColor = '#FFB347',
  teamShapes = ['circle', 'triangle', 'square'],
  score = 0,
  treasures = [],
  onEndGame,
  showEndGameButton = true
}: ExactMobileScoreboardProps) {
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
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button className="mr-4 text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: '600' }}>Scoreboard</h1>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="px-6 py-6 text-center">
        <p className="text-gray-400" style={{ fontSize: '16px', color: '#9CA3AF' }}>{getGameStatusText()}</p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Score and Team Section */}
        <div className="flex items-center justify-between mb-12">
          {/* Total Score */}
          <div>
            <p className="text-blue-600 font-medium mb-3" style={{ fontSize: '16px', fontWeight: '500', color: '#2563EB' }}>Total Score</p>
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 flex items-center justify-center bg-white" style={{ borderColor: '#BFDBFE' }}>
              <span className="text-3xl font-bold text-blue-600" style={{ fontSize: '32px', fontWeight: '700', color: '#2563EB' }}>{score}</span>
            </div>
          </div>

          {/* Team Info */}
          <div className="text-center">
            <TeamIcon color={teamColor} shapes={teamShapes} />
            <p className="mt-4 text-gray-700 font-medium" style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginTop: '16px' }}>{teamName}</p>
          </div>
        </div>

        {/* Treasures Discovered Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-medium" style={{ fontSize: '16px', fontWeight: '500', color: '#9CA3AF' }}>Treasures Discovered</h3>
            <h3 className="text-gray-400 font-medium" style={{ fontSize: '16px', fontWeight: '500', color: '#9CA3AF' }}>Score</h3>
          </div>
          
          <div>
            {treasures.length > 0 ? (
              treasures.map((treasure, index) => (
                <TreasureItem 
                  key={treasure.waypoint?.id || treasure.treasure?.waypoint_challenge || index}
                  waypoint={treasure.waypoint}
                  treasure={treasure.treasure}
                  score={treasure.score}
                  icon={treasure.icon || getTreasureIcon(
                    treasure.treasure?.description || treasure.waypoint?.description || '',
                    treasure.waypoint?.id || treasure.treasure?.waypoint_challenge
                  )}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p style={{ fontSize: '16px', color: '#9CA3AF' }}>No treasures discovered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Empty space to match the screenshot */}
        <div className="h-32"></div>

        {/* End Game Button */}
        {showEndGameButton && (
          <div className="fixed bottom-8 left-6 right-6">
            <button
              onClick={handleEndGame}
              disabled={isLoading}
              className="w-full bg-red-400 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
              style={{ 
                backgroundColor: '#F87171', 
                fontSize: '18px', 
                fontWeight: '600',
                padding: '16px 0',
                borderRadius: '16px'
              }}
            >
              {isLoading ? 'Ending Game...' : 'End Game'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom indicator bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-black">
        <div className="w-32 h-1 bg-white mx-auto" style={{ width: '128px' }}></div>
      </div>
    </div>
  );
}