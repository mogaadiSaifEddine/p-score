// app/websocket-test/page.tsx
// Test page for WebSocket game status functionality

'use client';

import React, { useState } from 'react';
import { GameStatusWebSocket } from '../components/GameStatusWebSocket';
import { WebSocketDebugger } from '../components/WebSocketDebugger';
import { PlistTester } from '../components/PlistTester';
import { ManualWebSocketTest } from '../components/ManualWebSocketTest';
import { useWebSocketGameStatus } from '../hooks/useWebSocketGameStatus';

export default function WebSocketTestPage() {
  const [gameInstanceId, setGameInstanceId] = useState('');
  const [teamId, setTeamId] = useState<number>(1);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">WebSocket Game Status Test</h1>
      
      {/* Configuration */}
      <div className="config-section mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Game Instance ID
            </label>
            <input
              type="text"
              value={gameInstanceId}
              onChange={(e) => setGameInstanceId(e.target.value)}
              placeholder="Enter game instance ID"
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-600 mt-1">
              The game instance ID for WebSocket connection
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Team ID (Optional)
            </label>
            <input
              type="number"
              value={teamId}
              onChange={(e) => setTeamId(parseInt(e.target.value) || 1)}
              placeholder="1"
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-600 mt-1">
              Focus on specific team data
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions mb-8 p-4 border rounded-lg bg-blue-50">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Enter your game instance ID above</li>
          <li>Optionally specify a team ID to focus on</li>
          <li>The WebSocket will connect to: <code className="bg-white px-1 rounded">wss://cms.locatify.com/ws/game/{'{gameInstanceId}'}</code></li>
          <li>Real-time game status updates will appear below</li>
          <li>Heartbeat messages are sent every 30 seconds automatically</li>
        </ol>
      </div>

      {/* Plist Parser Test */}
      <PlistTester />

      {/* WebSocket Tests */}
      {gameInstanceId ? (
        <div className="space-y-6">
          <ManualWebSocketTest gameInstanceId={gameInstanceId} />
          
          <WebSocketDebugger gameInstanceId={gameInstanceId} />
          
          <GameStatusWebSocket 
            gameInstanceId={gameInstanceId}
            teamId={teamId}
            className="mb-8"
          />
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600">Enter a game instance ID to start testing WebSocket connection</p>
        </div>
      )}

      {/* Example Response */}
      <div className="example-response p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Example WebSocket Response</h2>
        <p className="text-sm text-gray-600 mb-2">
          The WebSocket receives plist XML data that gets parsed into JavaScript objects:
        </p>
        <pre className="text-xs bg-white p-3 rounded border overflow-auto">
{`{
  "event": "game_status_update",
  "data": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<!DOCTYPE plist PUBLIC \\"-//Apple//DTD PLIST 1.0//EN\\" \\"http://www.apple.com/DTDs/PropertyList-1.0.dtd\\">\\n<plist version=\\"1.0\\">\\n<dict>\\n\\t<key>status_code</key>\\n\\t<string>ONGOING</string>\\n\\t<key>team_id</key>\\n\\t<integer>1</integer>\\n\\t<key>teams_info</key>\\n\\t<array>\\n\\t\\t<dict>\\n\\t\\t\\t<key>found_treasures</key>\\n\\t\\t\\t<array>\\n\\t\\t\\t\\t<dict>\\n\\t\\t\\t\\t\\t<key>id</key>\\n\\t\\t\\t\\t\\t<integer>332225</integer>\\n\\t\\t\\t\\t</dict>\\n\\t\\t\\t</array>\\n\\t\\t\\t<key>name</key>\\n\\t\\t\\t<string>Team Name</string>\\n\\t\\t\\t<key>score</key>\\n\\t\\t\\t<string>3</string>\\n\\t\\t\\t<key>has_finished</key>\\n\\t\\t\\t<string>True</string>\\n\\t\\t</dict>\\n\\t</array>\\n</dict>\\n</plist>\\n"
}`}
        </pre>
        
        <p className="text-sm text-gray-600 mt-2 mb-2">Gets parsed into:</p>
        <pre className="text-xs bg-white p-3 rounded border overflow-auto">
{`{
  "status_code": "ONGOING",
  "team_id": 1,
  "teams_info": [{
    "found_treasures": [{ "id": 332225 }],
    "name": "Team Name",
    "score": "3",
    "has_finished": "True",
    "game_duration": 6,
    "is_in_game": true,
    "latitude": "None",
    "longitude": "None",
    "score_adjustment": "0",
    "start_time": "1761639609000",
    "time_penalty": 0
  }]
}`}
        </pre>
      </div>
    </div>
  );
}