// lib/game-observer-service.ts
// Simple service for handling game observer and scoreboard APIs (no auth required)

export interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  success: boolean;
  error?: string;
}

export interface GameByCodeResponse {
  id: number;
  name: string;
  game_code_hash: string;
  game_key: string;
  is_started: boolean;
  finish_time?: string;
  start_time?: string;
  // Add other game properties as needed
}

export interface ObserverData {
  game_id: number;
  game_code: string;
  teams: any[];
  current_status: string;
  // Add other observer properties as needed
}

export interface ScoreboardData {
  teams: Array<{
    game_team_id: number;
    name: string;
    score: number;
    players: any[];
    has_finished: boolean;
  }>;
  treasures_found: any[];
  game_status: string;
  // Add other scoreboard properties as needed
}

class GameObserverService {
  private baseUrl: string;

  constructor() {
    // Use your Next.js app URL for proxy calls
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  }

  private async makeRequest<T>(apiPath: string, method: string = 'GET', data?: any): Promise<ApiResponse<T>> {
    try {
      // Remove leading slash if present to avoid double slashes
      const cleanPath = apiPath.startsWith('/') ? apiPath.slice(1) : apiPath;
      const proxyUrl = `${this.baseUrl}/api/${cleanPath}`;
      
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(data);
      }

      console.log(`Making ${method} request to: ${apiPath} via proxy: ${proxyUrl}`);

      const response = await fetch(proxyUrl, requestOptions);

      // Try to parse as JSON, fallback to text
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
      }

      return {
        data: responseData,
        status: response.status,
        success: response.ok,
        error: response.ok ? undefined : responseData.error || 'Request failed'
      };

    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null,
        status: 500,
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Get game information by game code
   * Endpoint: /game/apis/games/by_code/{gameCode}
   */
  async getGameByCode(gameCode: string): Promise<ApiResponse<GameByCodeResponse>> {
    return this.makeRequest<GameByCodeResponse>(`/game/apis/games/by_code/${gameCode}`);
  }

  /**
   * Get observer data for a specific game code
   * Endpoint: /apis/observer/{gameCode}
   */
  async getObserverData(gameCode: string): Promise<ApiResponse<ObserverData>> {
    return this.makeRequest<ObserverData>(`/apis/observer/${gameCode}`);
  }

  /**
   * Get scoreboard data for a specific game code
   * Endpoint: /apis/observer/{gameCode}/scoreboard
   */
  async getScoreboard(gameCode: string): Promise<ApiResponse<ScoreboardData>> {
    return this.makeRequest<ScoreboardData>(`/apis/observer/${gameCode}/scoreboard`);
  }

  /**
   * Get specific scoreboard data with team ID
   * Endpoint: /apis/observer/{gameCode}/scoreboard/{teamId}
   */
  async getScoreboardByTeam(gameCode: string, teamId: number): Promise<ApiResponse<ScoreboardData>> {
    return this.makeRequest<ScoreboardData>(`/apis/observer/${gameCode}/scoreboard/${teamId}`);
  }

  /**
   * Get all data needed for a game observer view
   * This method combines multiple API calls for convenience
   */
  async getCompleteGameData(gameCode: string): Promise<{
    game: ApiResponse<GameByCodeResponse>;
    observer: ApiResponse<ObserverData>;
    scoreboard: ApiResponse<ScoreboardData>;
  }> {
    console.log(`Loading complete game data for: ${gameCode}`);

    // Make all requests in parallel
    const [gameResponse, observerResponse, scoreboardResponse] = await Promise.all([
      this.getGameByCode(gameCode),
      this.getObserverData(gameCode),
      this.getScoreboard(gameCode)
    ]);

    return {
      game: gameResponse,
      observer: observerResponse,
      scoreboard: scoreboardResponse
    };
  }

  /**
   * Poll for real-time updates
   * Useful for live scoreboard updates
   */
  async startPolling(
    gameCode: string, 
    callback: (data: ScoreboardData) => void, 
    intervalMs: number = 5000
  ): Promise<() => void> {
    let isPolling = true;

    const poll = async () => {
      if (!isPolling) return;

      try {
        const response = await this.getScoreboard(gameCode);
        if (response.success&& response.data) {
          callback(response.data );
        }
      } catch (error) {
        console.error('Polling error:', error);
      }

      if (isPolling) {
        setTimeout(poll, intervalMs);
      }
    };

    // Start polling
    poll();

    // Return stop function
    return () => {
      isPolling = false;
    };
  }
}

// Export singleton instance
export const gameObserverService = new GameObserverService();