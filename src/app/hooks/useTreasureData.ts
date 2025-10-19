// hooks/useTreasureData.ts
// Hook for formatting treasure/checkpoint data for the mobile UI

import { useMemo } from 'react';

interface TreasureApiData {
  waypoint_challenge: number;
  score_earned: number;
  description: string;
  time: string;
}

export interface GameData {
  waypoints?: Array<{
    id: number;
    title: string;
    description: string;
    thumb_image?: string;
    score: number;
  }>;
}

interface FormattedTreasure {
  id: number;
  image?: string;
  icon: string;
  score: number;
  name: string;
  foundAt?: string;
}

// Treasure icon mapping based on description/type
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

export function useTreasureData(
  treasureApiData: TreasureApiData[] = [],
  gameData?: GameData | null
) {
  const formattedTreasures = useMemo(() => {
    const treasures: FormattedTreasure[] = [];

    // Process API treasure data
    treasureApiData.forEach((treasure, index) => {
      // Find corresponding waypoint data
      const waypoint = gameData?.waypoints?.find(w => w.id === treasure.waypoint_challenge);
      
      const formattedTreasure: FormattedTreasure = {
        id: treasure.waypoint_challenge || index + 1,
        image: waypoint?.thumb_image,
        icon: getTreasureIcon(treasure.description, treasure.waypoint_challenge),
        score: treasure.score_earned || 0,
        name: waypoint?.title || treasure.description || `Treasure ${index + 1}`,
        foundAt: treasure.time
      };

      treasures.push(formattedTreasure);
    });

    // Sort by score (highest first) or by time found
    return treasures.sort((a, b) => {
      if (a.foundAt && b.foundAt) {
        return new Date(b.foundAt).getTime() - new Date(a.foundAt).getTime();
      }
      return b.score - a.score;
    });
  }, [treasureApiData, gameData]);

  const totalScore = useMemo(() => {
    return formattedTreasures.reduce((sum, treasure) => sum + treasure.score, 0);
  }, [formattedTreasures]);

  const treasureCount = formattedTreasures.length;

  return {
    treasures: formattedTreasures,
    totalScore,
    treasureCount,
    isEmpty: treasureCount === 0
  };
}

// Hook for team-specific treasure data
export function useTeamTreasures(
  teamId: number,
  allTreasures: TreasureApiData[] = [],
  gameData?: GameData
) {
  // Filter treasures for specific team (if your API provides team-specific data)
  // For now, we'll use all treasures as the API might not separate by team
  const teamTreasures = useMemo(() => {
    // If your API provides team-specific treasure data, filter here
    // return allTreasures.filter(treasure => treasure.teamId === teamId);
    return allTreasures;
  }, [allTreasures, teamId]);

  return useTreasureData(teamTreasures, gameData);
}

// Helper function to get treasure summary
export function getTreasureSummary(treasures: FormattedTreasure[]) {
  const total = treasures.length;
  const totalScore = treasures.reduce((sum, t) => sum + t.score, 0);
  const averageScore = total > 0 ? Math.round(totalScore / total) : 0;
  
  return {
    total,
    totalScore,
    averageScore,
    highestScore: total > 0 ? Math.max(...treasures.map(t => t.score)) : 0,
    mostRecentTreasure: treasures.find(t => t.foundAt) || null
  };
}