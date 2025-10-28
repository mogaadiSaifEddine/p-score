// components/GameStatusWebSocket.tsx
// Example component showing WebSocket game status integration

'use client';

import React from 'react';
import { useWebSocketGameStatus } from '../hooks/useWebSocketGameStatus';
import { ParsedGameStatus } from '../lib/websocket-game-service';

interface GameStatusWebSocketProps {
  gameInstanceId: string;
  teamId?: number;
  className?: string;
}

export function GameStatusWebSocket({ 
  gameInstanceId, 
  teamId,
  className = '' 
}: GameStatusWebSocketProps) {
  
  const {
    isConnected,
    isConnecting,
    connectionError,
    gameStatus,
    lastUpdated,
    connect,
    disconnect,
    getTeamInfo,
    getAllTeams
  } = useWebSocketGameStatus({
    gameInstanceId,
    autoConnect: true,
    onStatusUpdate: (status) => {
      console.log('Game status updated:', status);
    },
    onConnectionChange: (connected) => {
      console.log('WebSocket connection changed:', connected);
    }
  });

  const currentTeam = teamId ? getTeamInfo(teamId) : null;
  const allTeams = getAllTeams();

  return (
    <div className={`game-status-websocket ${className}`}>
      {/* Connection Status */}
      <div className="connection-status mb-4 p-3 rounded-lg border">
        <h3 className="font-semibold mb-2">WebSocket Status</h3>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 
              isConnecting ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
          />
          <span>
            {isConnected ? 'Connected' : 
             isConnecting ? 'Connecting...' : 
             'Disconnected'}
          </span>
        </div>
        
        {connectionError && (
          <div className="text-red-600 text-sm mt-1">
            Error: {connectionError}
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-gray-600 text-sm mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          <button 
            onClick={connect}
            disabled={isConnected || isConnecting}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Connect
          </button>
          <button 
            onClick={disconnect}
            disabled={!isConnected}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Game Status */}
      {gameStatus && (
        <div className="game-status mb-4 p-3 rounded-lg border">
          <h3 className="font-semibold mb-2">Game Status</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Status: <span className="font-medium">{gameStatus.status_code}</span></div>
            <div>Current Team: <span className="font-medium">{gameStatus.team_id}</span></div>
          </div>
        </div>
      )}

      {/* Current Team Info */}
      {currentTeam && (
        <div className="current-team mb-4 p-3 rounded-lg border bg-blue-50">
          <h3 className="font-semibold mb-2">Team {teamId} - {currentTeam.name}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Score: <span className="font-medium">{currentTeam.score}</span></div>
            <div>Finished: <span className="font-medium">{currentTeam.has_finished}</span></div>
            <div>Duration: <span className="font-medium">{currentTeam.game_duration} min</span></div>
            <div>Treasures: <span className="font-medium">{currentTeam.found_treasures.length}</span></div>
          </div>
          
          {currentTeam.found_treasures.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium">Found Treasures:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentTeam.found_treasures.map((treasure, index) => (
                  <span 
                    key={treasure.id || index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    #{treasure.id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Teams Summary */}
      {allTeams.length > 0 && (
        <div className="all-teams p-3 rounded-lg border">
          <h3 className="font-semibold mb-2">All Teams ({allTeams.length})</h3>
          <div className="space-y-2">
            {allTeams
              .sort((a, b) => parseInt(b.score) - parseInt(a.score))
              .map((team, index) => (
                <div 
                  key={team.id}
                  className={`flex justify-between items-center p-2 rounded ${
                    team.id === teamId?.toString() ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{index + 1}</span>
                    <span>{team.name}</span>
                    {team.has_finished === 'True' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Finished
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span>Score: {team.score}</span>
                    <span>Treasures: {team.found_treasures.length}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && gameStatus && (
        <details className="mt-4 p-3 rounded-lg border bg-gray-50">
          <summary className="cursor-pointer font-medium">Debug: Raw Game Status</summary>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(gameStatus, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}