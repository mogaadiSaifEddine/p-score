// hooks/useGameObserver-final.ts
// Final fix for team data parsing from team-specific API

import { useState, useEffect, useCallback } from 'react';
import {
  gameObserverService,
  GameByCodeResponse,
  ObserverData,
  ScoreboardData,
} from '../lib/game-observer-service';

interface UseGameObserverState {
  game: GameByCodeResponse | null;
  observer: ObserverData | null;
  scoreboard: ScoreboardData | null;
  teamScoreboard: any;
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
      if (teamId) {
        teamScoreboardResponse = await gameObserverService.getScoreboardByTeam(gameCode, teamId);

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
      const promises = [gameObserverService.getScoreboard(gameCode)];

      if (teamId) {
        promises.push(gameObserverService.getScoreboardByTeam(gameCode, teamId));
      }

      const responses = await Promise.all(promises);
      const [scoreboardResponse, teamScoreboardResponse] = responses;

      setState((prev) => ({
        ...prev,
        scoreboard: scoreboardResponse.success ? scoreboardResponse.data : prev.scoreboard,
        teamScoreboard: teamScoreboardResponse?.success
          ? teamScoreboardResponse.data
          : prev.teamScoreboard,
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



    // Get team-specific treasures/progress if available
    getTeamTreasures: () => {
      if (state.teamScoreboard) {
        // Try different possible structures for treasures
        const teamData = state.teamScoreboard as any;
        return (
          teamData.treasures_found ||
          teamData.treasures ||
          teamData.waypoints_completed ||
          teamData.progress ||
          []
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
