// examples/websocket-integration-example.tsx
// Example showing how to integrate WebSocket updates into existing components

'use client';

import React from 'react';
import { useGameObserver } from '../hooks/useGameObserver';
import { GameStatusWebSocket } from '../components/GameStatusWebSocket';

interface WebSocketIntegrationExampleProps {
  gameCode: string;
  gameInstanceId: string;
  teamId?: number;
}

export function WebSocketIntegrationExample({
  gameCode,
  gameInstanceId,
  teamId
}: WebSocketIntegrationExampleProps) {
  
  // Use the enhanced game observer with WebSocket support
  const {
    // Regular data
    game,
    observer,
    scoreboard,
    teamScoreboard,
    loading,
    error,
    
    // WebSocket specific
    webSocketConnected,
    webSocketError,
    lastWebSocketUpdate,
    connectWebSocket,
    disconnectWebSocket,
    
    // Helper methods
    getTeamById,
    getTopTeams,
    getCurrentTeamData
  } = useGameObserver({
    gameCode,
    teamId,
    useWebSocket: true,
    gameInstanceId,
    autoRefresh: false // Disable polling since we're using WebSocket
  });

  const currentTeam = getCurrentTeamData();
  const topTeams = getTopTeams(3);

  if (loading) {
    return <div className="p-4">Loading game data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="websocket-integration-example p-4 space-y-6">
      <h1 className="text-2xl font-bold">WebSocket Game Integration Example</h1>
      
      {/* Game Info */}
      <div className="game-info p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Game Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Game Code: <span className="font-medium">{gameCode}</span></div>
          <div>Instance ID: <span className="font-medium">{gameInstanceId}</span></div>
          <div>Started: <span className="font-medium">{observer?.is_started ? 'Yes' : 'No'}</span></div>
          <div>Teams: <span className="font-medium">{scoreboard?.teams?.length || 0}</span></div>
        </div>
      </div>

      {/* WebSocket Status */}
      <div className="websocket-status p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">WebSocket Status</h2>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${webSocketConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{webSocketConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {lastWebSocketUpdate && (
            <span className="text-sm text-gray-600">
              Last update: {lastWebSocketUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {webSocketError && (
          <div className="text-red-600 text-sm mb-2">
            WebSocket Error: {webSocketError}
          </div>
        )}
        
        <div className="flex gap-2">
          <button 
            onClick={connectWebSocket}
            disabled={webSocketConnected}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Connect
          </button>
          <button 
            onClick={disconnectWebSocket}
            disabled={!webSocketConnected}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Current Team (if specified) */}
      {teamId && currentTeam && (
        <div className="current-team p-4 border rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">Your Team</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Name: <span className="font-medium">{currentTeam.name}</span></div>
            <div>Score: <span className="font-medium">{currentTeam.score}</span></div>
            <div>Finished: <span className="font-medium">{currentTeam.has_finished ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
      )}

      {/* Top Teams */}
      {topTeams.length > 0 && (
        <div className="top-teams p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Top Teams</h2>
          <div className="space-y-2">
            {topTeams.map((team, index) => (
              <div 
                key={team.game_team_id}
                className={`flex justify-between items-center p-2 rounded ${
                  team.game_team_id === teamId ? 'bg-blue-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">#{index + 1}</span>
                  <span>{team.name}</span>
                  {team.has_finished && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      Finished
                    </span>
                  )}
                </div>
                <span className="font-medium">{team.score} points</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed WebSocket Component */}
      <GameStatusWebSocket 
        gameInstanceId={gameInstanceId}
        teamId={teamId}
        className="border rounded-lg p-4"
      />
    </div>
  );
}

// Usage in a page component:
export function ExamplePage() {
  return (
    <WebSocketIntegrationExample
      gameCode="GAME123"
      gameInstanceId="your-game-instance-id"
      teamId={1}
    />
  );
}