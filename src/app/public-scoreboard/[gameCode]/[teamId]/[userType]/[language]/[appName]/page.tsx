// app/public-scoreboard/[gameCode]/[teamId]/[userType]/[language]/[appName]/page-final-fix.tsx
// Final fix with better team detection and error handling

'use client';

import MobileScoreboard from '@/app/components/MobileScoreboard';
import { useGameObserver } from '@/app/hooks/useGameObserver';
import { usePublicScoreboardData } from '@/app/hooks/useRouteParams';
import { GameData, useTreasureData } from '@/app/hooks/useTreasureData';
import ScoreboardProviders from '@/app/components/ScoreboardProviders';
import React from 'react';

// Team icon configurations
const teamIconConfigs: Record<string, { color: string; shapes: ('circle' | 'triangle' | 'square')[] }> = {
  'kids': { color: '#FFB347', shapes: ['circle', 'triangle', 'square'] },
  'lbb': { color: '#FF6B6B', shapes: ['circle', 'triangle', 'square'] },
  'team1': { color: '#4ECDC4', shapes: ['circle', 'triangle', 'square'] },
  'team2': { color: '#45B7D1', shapes: ['circle', 'triangle', 'square'] },
  'players': { color: '#9B59B6', shapes: ['circle', 'triangle', 'square'] },
  'hunters': { color: '#E67E22', shapes: ['circle', 'triangle', 'square'] },
  'default': { color: '#95A5A6', shapes: ['circle', 'triangle', 'square'] }
};

export default function PublicScoreboardFinalFixPage() {
  // Parse route parameters
  const {
    isValidRoute,
    error: routeError,
    parsedData,
    isPlayerView,
    hasValidationErrors,
    getValidationErrorsFormatted
  } = usePublicScoreboardData();

  // Handle language fallback redirect
  React.useEffect(() => {
    if (parsedData && 'shouldRedirect' in parsedData && parsedData.shouldRedirect && parsedData.redirectUrl) {
      window.location.replace(parsedData.redirectUrl);
    }
  }, [parsedData]);

  // Load game data with team-specific calls
  const {
    game,
    observer,
    scoreboard,
    teamScoreboard,
    loading: gameLoading,
    error: gameError,
    reload,
    isGameStarted,
    isGameFinished,
    getCurrentTeamData,
    hasTeamData,
    getTeamTreasures,
    getTeamCoupons
  } = useGameObserver({
    gameCode: parsedData?.gameCode || '',
    teamId: parsedData?.teamId,
    autoRefresh: false,
    refreshInterval: 5000
  });
  // Get current team data
  const currentTeam = getCurrentTeamData();
console.log('gamEEEE0' , game);

  // Get treasure data from team-specific API
  const teamTreasures = getTeamTreasures();

  // Get coupons data from team-specific API
  const teamCoupons = getTeamCoupons();

  // Format treasure data for the mobile UI
  const treasureApiData = React.useMemo(() => {
    if (teamTreasures.length > 0) {
      return teamTreasures.map((treasure: any, index: number) => ({
        waypoint_challenge: treasure.waypoint_id || treasure.id || treasure.challenge_id || index + 1,
        score_earned: treasure.score || treasure.points || treasure.score_earned || treasure.value || 0,
        description: treasure.name || treasure.description || treasure.title || treasure.type || `Treasure ${index + 1}`,
        time: treasure.found_at || treasure.time || treasure.discovered_at || treasure.completed_at || new Date().toISOString()
      }));
    }

    // Fallback: create treasure data based on team score if no specific treasure data
    if (currentTeam?.score && currentTeam.score > 0) {
      return [{
        waypoint_challenge: 1,
        score_earned: currentTeam.score,
        description: 'Points earned',
        time: new Date().toISOString()
      }];
    }

    return [];
  }, [teamTreasures, currentTeam]);
  // Create proper GameData structure for useTreasureData hook
  const gameData: GameData | null = React.useMemo(() => {
    // Check if we have waypoint data in observer or game data
    const observerAny = observer as any;
    const gameAny = game as any;
    const waypoints = observerAny?.waypoints || gameAny?.waypoints || [];

    if (waypoints.length > 0) {
      return {
        waypoints: waypoints.map((wp: any) => ({
          id: wp.id || wp.waypoint_id || wp.challenge_id,
          title: wp.title || wp.name || wp.description || `Waypoint ${wp.id}`,
          description: wp.description || wp.title || wp.name || '',
          thumb_image: wp.thumb_image || wp.image || wp.thumbnail,
          score: wp.score || wp.points || wp.value || 0
        }))
      };
    }

    return null;
  }, [observer, game]);

  // Use treasure data hook to format for UI
  const { treasures, totalScore } = useTreasureData(treasureApiData, gameData);

  // Format coupons data for the mobile UI
  const couponsData = React.useMemo(() => {
    if (teamCoupons.length > 0) {
      return teamCoupons
        .filter((coupon: any) => coupon) // Only show acquired coupons
        .map((coupon: any) => ({
          id: coupon.id,
          name: coupon.title || `Coupon ${coupon.id}`,
          description: coupon.subtitle || undefined
        }));
    }

    return [];
  }, [teamCoupons]);

  // Extract app name from GameByCodeResponse
  const gameType = observer?.number_of_teams > 1 ? 'CMS' : '';

  // Format teams data for MobileScoreboard - create distinct teams based on players
  // This ensures each unique team composition (based on players) appears only once
  const allTeamsData = React.useMemo(() => {
    // Handle both scoreboard.teams array and direct scoreboard array structures
    // Some APIs return { teams: [...] } while others return [...] directly
    const teamsArray = Array.isArray(scoreboard?.teams)
      ? scoreboard.teams
      : Array.isArray(scoreboard)
        ? scoreboard
        : [];

    if (!teamsArray || teamsArray.length === 0) {
      return [];
    }

    // Create a map to track unique teams by their distinct player combinations
    const uniqueTeamsMap = new Map();

    teamsArray.forEach((team: any) => {
      const teamId = team.game_team_id || team.id;
      const teamName = team.name || `Team ${teamId}`;
      const players = team.players || [];

      // Create a unique key based on sorted player IDs to identify distinct teams
      // Handle cases where players might not have IDs by using multiple fallback properties
      const playerIds = players
        .map((player: any) =>
          player.user_id ||
          player.device_serial ||
          player.nick_name ||
          player.email ||
          player.id ||
          'unknown'
        )
        .filter(id => id !== 'unknown') // Remove unknown players
        .sort();

      // Use team name and player composition to create unique key
      // If no players, use just team ID to ensure uniqueness
      const teamKey = playerIds.length > 0
        ? `${teamName}_${playerIds.join('_')}`
        : `${teamName}_${teamId}`;

      // Only add if this exact team composition doesn't exist
      if (!uniqueTeamsMap.has(teamKey)) {
        uniqueTeamsMap.set(teamKey, {
          id: teamId,
          name: teamName,
          score: team.score || 0,
          color: teamIconConfigs[teamName.toLowerCase()]?.color || teamIconConfigs.default.color,
          players: players,
          has_finished: team.has_finished || false
        });
      } else {
        // If team exists, update score if current score is higher
        const existingTeam = uniqueTeamsMap.get(teamKey);
        if ((team.score || 0) > existingTeam.score) {
          existingTeam.score = team.score || 0;
          existingTeam.has_finished = team.has_finished || false;
        }
      }
    });

    // Convert map values back to array
    return Array.from(uniqueTeamsMap.values());
  }, [scoreboard]);



  // Loading state for route parsing
  if (!isValidRoute && !routeError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Route validation errors
  if (!isValidRoute || hasValidationErrors()) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Invalid URL</h1>
          </div>
          <div className="space-y-2 mb-4">
            {routeError && <p className="text-red-700 text-sm">• {routeError}</p>}
            {hasValidationErrors() && (
              <p className="text-red-700 text-sm">• {getValidationErrorsFormatted()}</p>
            )}
          </div>
          <div className="p-3 bg-gray-100 rounded text-xs">
            <p className="font-medium mb-1">Expected format:</p>
            <code>/public-scoreboard/BQTHUT/1/player/en/turf_hunt</code>
          </div>
        </div>
      </div>
    );
  }

  // Game data loading
  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Game Data</p>
          <p className="text-sm text-gray-500">{parsedData!.gameCode} - Team {parsedData!.teamId}</p>

        </div>
      </div>
    );
  }

  // Game data error
  if (gameError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">API Error</h1>
          </div>
          <p className="text-red-700 mb-4 text-sm text-center">{gameError}</p>
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <p>Failed API: /apis/observer/{parsedData!.gameCode}/scoreboard/{parsedData!.teamId}</p>
          </div>
          <button
            onClick={reload}
            className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if we have team data but couldn't find the specific team
  const hasApiData = hasTeamData() ||
    (scoreboard?.teams && scoreboard.teams.length > 0) ||
    (Array.isArray(scoreboard) && scoreboard.length > 0);

  if (!currentTeam && isPlayerView() && hasApiData) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-yellow-600 mb-2">Team Not Found</h1>
          </div>
          <p className="text-yellow-700 text-sm text-center mb-2">
            Team #{parsedData!.teamId} not found in game {parsedData!.gameCode}
          </p>

          <button
            onClick={reload}
            className="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 font-medium"
          >
            Refresh Game
          </button>
        </div>
      </div>
    );
  }

  // If we're in player view but have no API data at all, show a different error
  if (!currentTeam && isPlayerView() && !hasApiData) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">No Game Data</h1>
          </div>
          <p className="text-red-700 text-sm text-center mb-4">
            Could not load data for game {parsedData!.gameCode}
          </p>
          <button
            onClick={reload}
            className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare team data for mobile component
  const teamData = currentTeam ? {
    name: currentTeam.name,
    score: currentTeam.score || totalScore || 0,
    color: teamIconConfigs[currentTeam.name.toLowerCase()]?.color || teamIconConfigs.default.color,
    shapes: teamIconConfigs[currentTeam.name.toLowerCase()]?.shapes || teamIconConfigs.default.shapes
  } : {
    name: `Team ${parsedData!.teamId}`,
    score: totalScore || 0,
    color: teamIconConfigs.default.color,
    shapes: teamIconConfigs.default.shapes
  };

  // Determine game status
  const gameStatus = isGameFinished ? 'finished' : isGameStarted ? 'in_progress' : 'not_started';


  console.log(allTeamsData);

  return (
    <ScoreboardProviders initialLocale={parsedData?.language}>
      <MobileScoreboard
        gameStatus={gameStatus}
        treasures={treasures}
        coupons={couponsData}
        teamName={teamData.name}
        useTimer={observer?.use_timer || false}
        gameType={gameType}
        allTeams={allTeamsData}
        gameInstanceId={observer?.id}
        teamId={parsedData?.teamId}
        appName={parsedData?.appName}
        gameProject={game?.project}
      />
    </ScoreboardProviders>
  );
}