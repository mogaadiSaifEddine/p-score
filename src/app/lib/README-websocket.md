# WebSocket Game Status Service

This service provides real-time game status updates via WebSocket connection to `wss://cms.locatify.com/ws/game/{gameInstanceId}`.

## Features

- **Real-time Updates**: Receives live game status updates via WebSocket
- **Heartbeat Management**: Automatically sends heartbeat messages every 30 seconds
- **Auto Reconnection**: Automatically reconnects on connection loss (up to 10 attempts)
- **Plist Parsing**: Parses Apple plist XML responses into JavaScript objects
- **React Integration**: Provides React hooks for easy component integration

## Quick Start

### 1. Basic WebSocket Service Usage

```typescript
import { webSocketGameService } from './lib/websocket-game-service';

// Connect to a game instance
await webSocketGameService.connect('your-game-instance-id');

// Subscribe to status updates
const unsubscribe = webSocketGameService.subscribe((status) => {
  console.log('Game status updated:', status);
});

// Disconnect when done
webSocketGameService.disconnect();
unsubscribe();
```

### 2. React Hook Usage

```typescript
import { useWebSocketGameStatus } from './hooks/useWebSocketGameStatus';

function GameComponent({ gameInstanceId, teamId }) {
  const {
    isConnected,
    gameStatus,
    getTeamInfo,
    connect,
    disconnect
  } = useWebSocketGameStatus({
    gameInstanceId,
    autoConnect: true,
    onStatusUpdate: (status) => {
      console.log('Status updated:', status);
    }
  });

  const teamInfo = getTeamInfo(teamId);

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {teamInfo && (
        <div>
          <h3>{teamInfo.name}</h3>
          <p>Score: {teamInfo.score}</p>
          <p>Treasures: {teamInfo.found_treasures.length}</p>
        </div>
      )}
    </div>
  );
}
```

### 3. Enhanced Game Observer Integration

```typescript
import { useGameObserver } from './hooks/useGameObserver';

function EnhancedGameComponent({ gameCode, gameInstanceId, teamId }) {
  const {
    scoreboard,
    webSocketConnected,
    lastWebSocketUpdate,
    getCurrentTeamData
  } = useGameObserver({
    gameCode,
    teamId,
    useWebSocket: true,
    gameInstanceId,
    autoRefresh: false // Disable polling since WebSocket provides real-time updates
  });

  return (
    <div>
      <div>WebSocket: {webSocketConnected ? '🟢' : '🔴'}</div>
      {lastWebSocketUpdate && (
        <div>Last update: {lastWebSocketUpdate.toLocaleTimeString()}</div>
      )}
      {/* Your existing scoreboard UI */}
    </div>
  );
}
```

## Message Types

### Heartbeat Message
```typescript
interface HeartbeatMessage {
  type: 'heartbeat';
  timestamp: number;
}
```

### Game Status Update
```typescript
interface GameStatusMessage {
  event: 'game_status_update';
  data: string; // Apple plist XML
}
```

### Parsed Game Status
```typescript
interface ParsedGameStatus {
  status_code: string;
  team_id: number;
  teams_info: Array<{
    challenge_penalty: any[];
    found_treasures: Array<{ id: number }>;
    game_duration: number;
    has_finished: string;
    id: string;
    is_in_game: boolean;
    latitude: string | null;
    longitude: string | null;
    name: string;
    score: string;
    score_adjustment: string;
    start_time: string;
    time_penalty: number;
  }>;
}
```

## Configuration Options

### WebSocket Service Options
```typescript
interface WebSocketOptions {
  heartbeatInterval?: number; // Default: 30000ms (30 seconds)
  reconnectInterval?: number; // Default: 5000ms (5 seconds)
  maxReconnectAttempts?: number; // Default: 10
}
```

### Hook Options
```typescript
interface UseWebSocketGameStatusOptions {
  gameInstanceId: string;
  autoConnect?: boolean; // Default: true
  onStatusUpdate?: (status: ParsedGameStatus) => void;
  onConnectionChange?: (connected: boolean) => void;
}
```

## Error Handling

The service includes comprehensive error handling:

- **Connection Errors**: Automatically retry connection with exponential backoff
- **Parse Errors**: Log parsing errors without breaking the connection
- **Callback Errors**: Isolate callback errors to prevent service disruption

## Dependencies

- `plist`: For parsing Apple plist XML responses
- `@types/plist`: TypeScript definitions for plist

Install with:
```bash
npm install plist
npm install --save-dev @types/plist
```

## Example Response

The WebSocket receives responses like this:

```json
{
  "event": "game_status_update",
  "data": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n\t<key>status_code</key>\n\t<string>ONGOING</string>\n\t<key>team_id</key>\n\t<integer>1</integer>\n\t<key>teams_info</key>\n\t<array>\n\t\t<dict>\n\t\t\t<key>found_treasures</key>\n\t\t\t<array>\n\t\t\t\t<dict>\n\t\t\t\t\t<key>id</key>\n\t\t\t\t\t<integer>332225</integer>\n\t\t\t\t</dict>\n\t\t\t</array>\n\t\t\t<key>name</key>\n\t\t\t<string>Team Name</string>\n\t\t\t<key>score</key>\n\t\t\t<string>3</string>\n\t\t</dict>\n\t</array>\n</dict>\n</plist>\n"
}
```

Which gets parsed into:

```javascript
{
  status_code: "ONGOING",
  team_id: 1,
  teams_info: [{
    found_treasures: [{ id: 332225 }],
    name: "Team Name",
    score: "3",
    // ... other team properties
  }]
}
```