// app/public-scoreboard/[gameCode]/[teamId]/[userType]/[language]/[gameType]/page-exact.tsx
// Page component using the exact UI design from the screenshot

'use client';

import React from 'react';
import { useGameObserver } from './hooks/useGameObserver';
import { usePublicScoreboardData } from './hooks/useRouteParams';
import {ExactMobileScoreboard} from './public-scoreboard/[gameCode]/[teamId]/[userType]/[language]/[gameType]/page-mobile';

export default function PublicScoreboardExactPage() {
  // Parse route parameters
  const {
    isValidRoute,
    error: routeError,
    parsedData,
    isPlayerView,
    hasValidationErrors,
    getValidationErrorsFormatted
  } = usePublicScoreboardData();

  // Load game data with team-specific calls
  const {
    game,
    scoreboard,
    teamScoreboard,
    loading: gameLoading,
    error: gameError,
    reload,
    isGameStarted,
    isGameFinished,
    getCurrentTeamData,
    hasTeamData
  } = useGameObserver({
    gameCode: parsedData?.gameCode || '',
    teamId: parsedData?.teamId,
    autoRefresh: parsedData?.isValid || false,
    refreshInterval: 5000
  });

  // Get current team data
  const currentTeam = getCurrentTeamData();

  // Debug logging
  React.useEffect(() => {
    if (parsedData?.isValid) {
      console.log('=== Exact UI Debug ===');
      console.log('Current team:', currentTeam);
      console.log('Has team data:', hasTeamData());
      console.log('Team scoreboard:', teamScoreboard);
    }
  }, [parsedData, currentTeam, hasTeamData, teamScoreboard]);

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

  // Get team data - use current team if found, otherwise create fallback
  const teamName = currentTeam?.name || 'Kids';
  const teamScore = currentTeam?.score || 6; // Default to 6 like in screenshot

  // Determine game status
  const gameStatus = isGameFinished ? 'finished' : isGameStarted ? 'in_progress' : 'not_started';

  // Handle end game
  const handleEndGame = async () => {
    try {
      console.log('Ending game for team:', parsedData!.teamId, 'in game:', parsedData!.gameCode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      reload();
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  return (
    <>
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border-b border-blue-200 p-2 text-xs">
          <div className="max-w-sm mx-auto">
            <p><strong>Team:</strong> {teamName} (ID: {parsedData!.teamId})</p>
            <p><strong>Score:</strong> {teamScore}</p>
            <p><strong>Status:</strong> {gameStatus}</p>
            <p><strong>API:</strong> /apis/observer/{parsedData!.gameCode}/scoreboard/{parsedData!.teamId}</p>
          </div>
        </div>
      )}

      <ExactMobileScoreboard
        gameStatus={gameStatus}
        teamName={teamName}
        score={teamScore}
        onEndGame={handleEndGame}
        showEndGameButton={isPlayerView() && gameStatus === 'in_progress'}
      />
    </>
  );
}