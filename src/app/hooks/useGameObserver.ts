// hooks/useGameObserver-final.ts
// Final fix for team data parsing from team-specific API

import { useState, useEffect, useCallback } from 'react';
import {
  gameObserverService,
  GameByCodeResponse,
  ObserverData,
  ScoreboardData,
  TreasuresFoundResponse,
} from '../lib/game-observer-service';

interface UseGameObserverState {
  game: GameByCodeResponse | null;
  observer: ObserverData | null;
  scoreboard: ScoreboardData | null;
  teamScoreboard: any;
  treasuresFound: any[] | null;
  loading: boolean;
  error: string | null;
}

interface UseGameObserverOptions {
  gameCode: string;
  teamId?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useGameObserver({
  gameCode,
  teamId,
  autoRefresh = false,
  refreshInterval = 5000,
}: UseGameObserverOptions) {
  const [state, setState] = useState<UseGameObserverState>({
    game: null,
    observer: null,
    scoreboard: null,
    teamScoreboard: null,
    treasuresFound: null,
    loading: true,
    error: null,
  });

  // Load initial data
  const loadData = useCallback(async () => {
    if (!gameCode) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));


      // Always load general game data
      const [gameResponse, observerResponse, scoreboardResponse] = await Promise.all([
        gameObserverService.getGameByCode(gameCode),
        gameObserverService.getObserverData(gameCode),
        gameObserverService.getScoreboard(gameCode),
      ]);

      
      // Load team-specific data if teamId is provided
      let teamScoreboardResponse = null;
      let treasuresFoundResponse = null;
      if (teamId) {
        teamScoreboardResponse = await gameObserverService.getScoreboardByTeam(gameCode, teamId);
        treasuresFoundResponse = await gameObserverService.getTreasuresFound(gameCode, teamId);
      }

      // Update state with successful responses
      setState((prev) => ({
        ...prev,
        game: gameResponse.success ? gameResponse.data : prev.game,
        observer: observerResponse.success ? observerResponse.data : prev.observer,
        scoreboard: scoreboardResponse.success ? scoreboardResponse.data : prev.scoreboard,
        teamScoreboard: teamScoreboardResponse?.success
          ? teamScoreboardResponse.data
          : prev.teamScoreboard,
        treasuresFound: treasuresFoundResponse?.success
          ? treasuresFoundResponse.data
          : prev.treasuresFound,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      }));
    }
  }, [gameCode, teamId]);

  // Refresh scoreboard data
  const refreshScoreboard = useCallback(async () => {
    if (!gameCode) return;

    try {
      const scoreboardResponse = await gameObserverService.getScoreboard(gameCode);
      
      let teamScoreboardResponse = null;
      let treasuresFoundResponse = null;
      
      if (teamId) {
        [teamScoreboardResponse, treasuresFoundResponse] = await Promise.all([
          gameObserverService.getScoreboardByTeam(gameCode, teamId),
          gameObserverService.getTreasuresFound(gameCode, teamId)
        ]);
      }

      setState((prev) => ({
        ...prev,
        scoreboard: scoreboardResponse.success ? scoreboardResponse.data : prev.scoreboard,
        teamScoreboard: teamScoreboardResponse?.success
          ? teamScoreboardResponse.data
          : prev.teamScoreboard,
        treasuresFound: treasuresFoundResponse?.success
          ? treasuresFoundResponse.data
          : prev.treasuresFound,
      }));
    } catch (error) {
      // Silently fail
    }
  }, [gameCode, teamId]);

  // Load data when gameCode or teamId changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up auto-refresh for scoreboard
  useEffect(() => {
    if (!autoRefresh || !gameCode) return;

    const interval = setInterval(refreshScoreboard, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshScoreboard, gameCode]);

  // Enhanced team finder that handles multiple API response structures
  const getTeamById = useCallback(
    (targetTeamId: number) => {
    

      // Strategy 1: Check team-specific API response first
      if (state.teamScoreboard) {

        // Case 1: API returns array of teams
        if (state.teamScoreboard.teams && Array.isArray(state.teamScoreboard.teams)) {
          const team = state.teamScoreboard.teams.find(
            (team) => team.game_team_id === targetTeamId
          );
          if (team) {
            return team;
          }
        }

        // Case 2: API returns single team object directly in teams property
        if (state.teamScoreboard.teams && !Array.isArray(state.teamScoreboard.teams)) {
          const singleTeam = state.teamScoreboard.teams as any;
          if (singleTeam.game_team_id === targetTeamId) {
            return singleTeam;
          }
        }

        // Case 3: API returns team data at root level
        if (state.teamScoreboard.game_team_id === targetTeamId) {
          return state.teamScoreboard as any;
        }

        // Case 4: Check if team data is nested differently
        const teamScoreboardAny = state.teamScoreboard as any;
        if (teamScoreboardAny.team && teamScoreboardAny.team.game_team_id === targetTeamId) {
          return teamScoreboardAny.team;
        }

        // Case 5: Sometimes the API might return team info in a different structure
        if (teamScoreboardAny.name || teamScoreboardAny.score !== undefined) {
          // This might be team data directly, let's create a standard team object
          const directTeam = {
            game_team_id: targetTeamId,
            name: teamScoreboardAny.name || teamScoreboardAny.team_name || `Team ${targetTeamId}`,
            score: teamScoreboardAny.score || teamScoreboardAny.total_score || 0,
            players: teamScoreboardAny.players || [],
            has_finished: teamScoreboardAny.has_finished || teamScoreboardAny.finished || false,
          };
          return directTeam;
        }
      }

      // Strategy 2: Fall back to general scoreboard
      if (state.scoreboard?.teams && Array.isArray(state.scoreboard.teams)) {
        const team = state.scoreboard.teams.find((team) => team.game_team_id === targetTeamId);
        if (team) {
          return team;
        }
      }

      return null;
    },
    [state.scoreboard, state.teamScoreboard]
  );

  return {
    // Data
    game: state.game,
    observer: state.observer,
    scoreboard: state.scoreboard,
    teamScoreboard: state.teamScoreboard,
    treasuresFound: state.treasuresFound,

    // State
    loading: state.loading,
    error: state.error,

    // Actions
    reload: loadData,
    refreshScoreboard,

    // Computed values
    isGameStarted: state.observer?.is_started || false,
    isGameFinished: !!state.observer?.finish_time,
    teamsCount: state.scoreboard?.teams?.length || 0,

    // Helper methods
    getTeamById,

    getTopTeams: (limit: number = 5) =>
      state.scoreboard?.teams?.sort((a, b) => (b.score || 0) - (a.score || 0))?.slice(0, limit) ||
      [],

    // Team-specific helpers
    getCurrentTeamData: () => (teamId ? getTeamById(teamId) : null),
    hasTeamData: () => !!state.teamScoreboard,

    // Calculate discovered score from treasures found API
    getDiscoveredScore: () => {
      if (!state.treasuresFound || !Array.isArray(state.treasuresFound)) {
        console.log('No treasures found data available');
        return 0;
      }

      const totalScore = state.treasuresFound.reduce((totalScore, treasure) => {
        // Add the point score
        const pointScore = treasure.score_earned || 0;
        
        // Add all challenge scores
        const challengeScore = treasure.challenges?.reduce((challengeSum: number, challenge: any) => {
          return challengeSum + (challenge.score_earned || 0);
        }, 0) || 0;

        const treasureTotal = pointScore + challengeScore;
        console.log(`Treasure ${treasure.alias}: point=${pointScore}, challenges=${challengeScore}, total=${treasureTotal}`);
        
        return totalScore + treasureTotal;
      }, 0);

      console.log(`Total discovered score: ${totalScore}`);
      return totalScore;
    },

    // Get formatted treasures from treasures found API
    getDiscoveredTreasures: () => {
      if (!state.treasuresFound || !Array.isArray(state.treasuresFound)) {
        console.log('No treasures found data available for treasures list');
        return [];
      }

      return state.treasuresFound.map((treasure, index) => {
        // Calculate total score for this treasure (point + challenges)
        const pointScore = treasure.score_earned || 0;
        const challengeScore = treasure.challenges?.reduce((challengeSum: number, challenge: any) => {
          return challengeSum + (challenge.score_earned || 0);
        }, 0) || 0;
        const totalTreasureScore = pointScore + challengeScore;

        return {
          id: treasure.found_waypoint || index + 1,
          icon: '', // Will be handled by TreasureImage component
          name: treasure.alias || `Treasure ${index + 1}`,
          score: totalTreasureScore,
          foundAt: treasure.time
        };
      });
    },



    // Get team-specific treasures/progress if available
    getTeamTreasures: () => {
  console.log(state);
  
  if (state.observer && state.teamScoreboard) {
    const teamId = state.teamScoreboard.game_team_id;
    const treasuresFound = state.observer.treasures_found || [];
    console.log('treasuresFound',treasuresFound.filter((treasure: any) => 
      treasure.found_by?.some((finder: any) => finder.id === teamId)
    ));
    
    // Filter treasures where the current team is in the found_by array
    return treasuresFound.filter((treasure: any) => 
      treasure.found_by?.some((finder: any) => finder.id === teamId)
    );
  }
  
  return [];
},

    // Get team-specific coupons/rewards if available
    getTeamCoupons: () => {
      if (state.teamScoreboard) {
        // Try different possible structures for coupons
        const teamData = state.teamScoreboard as any;
        return (
          teamData.coupons ||
          teamData.rewards ||
          teamData.earned_coupons ||
          teamData.team_coupons ||
          []
        );
      }
      return [];
    },
  };
}
