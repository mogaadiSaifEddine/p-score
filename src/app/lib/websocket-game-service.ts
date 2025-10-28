// lib/websocket-game-service.ts
// WebSocket service for real-time game status updates

import * as plist from 'plist';

export interface HeartbeatMessage {
  type: 'heartbeat';
  timestamp: number;
}

export interface GameStatusMessage {
  event: 'game_status_update';
  data: string; // plist XML string
}

export interface ParsedGameStatus {
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

export type WebSocketMessage = HeartbeatMessage | GameStatusMessage;

export interface GameStatusUpdateCallback {
  (status: ParsedGameStatus): void;
}

export interface WebSocketOptions {
  heartbeatInterval?: number; // milliseconds
  reconnectInterval?: number; // milliseconds
  maxReconnectAttempts?: number;
}

class WebSocketGameService {
  private ws: WebSocket | null = null;
  private gameInstanceId: string | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private isConnecting = false;
  private isManuallyDisconnected = false;

  private callbacks: Set<GameStatusUpdateCallback> = new Set();
  private options: Required<WebSocketOptions>;

  constructor(options: WebSocketOptions = {}) {
    this.options = {
      heartbeatInterval: 30000, // 30 seconds
      reconnectInterval: 5000, // 5 seconds
      maxReconnectAttempts: 10,
      ...options,
    };
  }

  /**
   * Connect to the WebSocket for a specific game instance
   */
  connect(gameInstanceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        reject(new Error('Already connecting'));
        return;
      }

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.gameInstanceId = gameInstanceId;
      this.isConnecting = true;
      this.isManuallyDisconnected = false;

      const wsUrl = `wss://cms.locatify.com/ws/game/${gameInstanceId}`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected to game:', gameInstanceId);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.cleanup();

          if (
            !this.isManuallyDisconnected &&
            this.reconnectAttempts < this.options.maxReconnectAttempts
          ) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;

          if (this.reconnectAttempts === 0) {
            reject(new Error('Failed to connect to WebSocket'));
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the WebSocket
   */
  disconnect(): void {
    this.isManuallyDisconnected = true;
    this.cleanup();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Subscribe to game status updates
   */
  subscribe(callback: GameStatusUpdateCallback): () => void {
    console.log('WebSocket: Adding subscriber, total callbacks:', this.callbacks.size + 1);
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      console.log('WebSocket: Removing subscriber, remaining callbacks:', this.callbacks.size - 1);
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get current game instance ID
   */
  get currentGameInstanceId(): string | null {
    return this.gameInstanceId;
  }

  private handleMessage(data: string): void {
    console.log('WebSocket: Received raw message:', data);

    try {
      const message: WebSocketMessage = JSON.parse(data);
      console.log('WebSocket: Parsed message:', message);

      if ('type' in message && message.type === 'heartbeat') {
        // Handle heartbeat - just log for now
        console.log('WebSocket: Received heartbeat:', message.timestamp);
        return;
      }

      if ('event' in message && message.event === 'game_status_update') {
        console.log(
          'WebSocket: Handling game status update, callbacks count:',
          this.callbacks.size
        );
        this.handleGameStatusUpdate(message);
      } else {
        console.log('WebSocket: Unknown message type or event:', message);
      }
    } catch (error) {
      console.error('WebSocket: Failed to parse message:', error, 'Raw data:', data);
    }
  }

  private handleGameStatusUpdate(message: GameStatusMessage): void {
    console.log(
      'WebSocket: Processing game status update, plist data length:',
      message.data.length
    );

    try {
      // Parse the plist XML data
      const parsedData = plist.parse(message.data) as unknown as ParsedGameStatus;
      console.log('WebSocket: Parsed plist data:', parsedData);

      // Notify all subscribers
      console.log('WebSocket: Notifying', this.callbacks.size, 'subscribers');
      let subscriberIndex = 0;
      this.callbacks.forEach((callback) => {
        try {
          subscriberIndex++;
          console.log('WebSocket: Calling subscriber', subscriberIndex);
          callback(parsedData);
        } catch (error) {
          console.error('WebSocket: Error in game status callback:', error);
        }
      });
    } catch (error) {
      console.error('WebSocket: Failed to parse plist data:', error, 'Raw plist:', message.data);
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const heartbeat: HeartbeatMessage = {
          type: 'heartbeat',
          timestamp: Date.now(),
        };

        try {
          this.ws.send(JSON.stringify(heartbeat));
        } catch (error) {
          console.error('Failed to send heartbeat:', error);
        }
      }
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts}`
    );

    this.reconnectTimer = setTimeout(() => {
      if (this.gameInstanceId && !this.isManuallyDisconnected) {
        this.connect(this.gameInstanceId).catch((error) => {
          console.error('Reconnect failed:', error);
        });
      }
    }, this.options.reconnectInterval);
  }

  private cleanup(): void {
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.isConnecting = false;
  }
}

// Export singleton instance
export const webSocketGameService = new WebSocketGameService();
