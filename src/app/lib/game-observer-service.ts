// lib/game-observer-service.ts
// Simple service for handling game observer and scoreboard APIs (no auth required)

import { WayPoint } from "../types";

export interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  success: boolean;
  error?: string;
}

export interface GameByCodeResponse {
  default_map_style?: string;
  promoted?: boolean;
  publish_share_with_users?: any;
  icon?: string;
  id?: number;
  project?: number;
  alias?: string;
  author?: any;
  media?: any;
  last_updated?: string;
  status?: any;
  archtype?: any | string;
  tour_archtype_name?: string;
  thumb_file_url?: string;
  template?: number;
  content?: any;
  needs_login?: boolean;
  login_disclaim?: any;
  background_location_service?: boolean;
  auto_calculated_location?: boolean;
  location_detection_method?: string;
  disable_location_detection?: boolean;
  location_detection_after_intro?: boolean;
  local_server_address?: any;
  local_server_apikey?: any;
  publisher?: string;
  readonly?: boolean;
  use_timer?: boolean;
  show_map_marker?: boolean;
  max_number_of_teams?: number;
  play_intro_audio_in_tour?: boolean;
  path_color?: string;
  allow_preview?: boolean;
  publish_expire_time?: number;
  publish_hide_team_positions?: boolean;
  publish_include_osm?: boolean;
  game_type?: any;
  team_mode?: string;
  publish_price?: string;
  publish_price_currency?: string;
  publish_store_product_id?: string;
  publish_show_in_catalog?: boolean;
  languages?: any[];
  waypoints?: any[];
  coupons?: any[];
  info?: WayPoint;
  sponsors?: number[];
  routes?: any[];
  paths?: any[];
  category?: number;
  product_id?: string;
  tour_map?: any;
  revision?: number;
  time_minutes?: number;
  distance_meters?: number;
  game_over_title?: any;
  game_over_subtitle?: any;
  auto_order_waypoint?: boolean;
  travel_type?: number;
  can_play_backwards?: boolean;
  needs_charger?: boolean;
  use_online_scoreboard?: boolean;
  default_destination_pin?: number;
  default_hint_pin?: any;
  default_treasure_pin?: any;
  publish_game_teams?: string[];
  edit?: boolean;
  finish_time?: Date;
  start_time?: Date;
  is_lite_tour?: boolean;
  display_type?: any;
  custom_pin?: number;
  template_tour_id?: number;
  activation_method?: string;
  // Add other game properties as needed
}
export interface ObserverData {
  is_game_master?: boolean;
  treasures_found?: Treasuresfound[];
  id?: number;
  author_first_name?: string;
  author_last_name?: string;
  name?: string;
  create_time?: string;
  start_time?: string;
  is_started?: boolean;
  is_test?: boolean;
  finish_time?: string;
  schedule_start_time?: null;
  game_code_hash?: string;
  game_key?: string;
  game_organizer?: null;
  game_duration?: number;
  allow_create_team?: boolean;
  use_first_player_as_organizer?: boolean;
  use_timer?: boolean;
  number_of_teams?: number;
  invitation_message?: string;
  team_mode?: string;
  tour?: number;
  author?: number;
  sale_log?: null;
}

interface Treasuresfound {
  id?: number;
  name?: string;
  found_by?: Foundby[];
}

interface Foundby {
  id?: number;
  name?: string;
  time?: string;
}


export interface ChallengePicture {
  file_path: string;
  upload_time: string;
  url: string;
}

export interface TreasuresFoundResponse {
  time: string;
  log_error: boolean;
  alias: string;
  found_waypoint: number;
  found_station: number | null;
  score_earned: number;
  challenges: Challenge[];
}

export interface Challenge {
  time: string;
  log_type: number;
  log_error: boolean;
  waypoint_challenge: number;
  found_game_instance_item: number | null;
  score_earned: number;
  score_adjustment: number;
  description: string | null;
  time_penalty: number;
  score_penalty: number;
  other: string;
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
   * Get challenge pictures for a specific game instance and team
   * Endpoint: /observer/get_challenge_pictures?game_instance_id={gameInstanceId}&team_id={teamId}
   */
  async getChallengePictures(gameInstanceId: number, teamId: number): Promise<ApiResponse<ChallengePicture[]>> {
    return this.makeRequest<ChallengePicture[]>(`/observer/get_challenge_pictures?game_instance_id=${gameInstanceId}&team_id=${teamId}`);
  }

  /**
   * Get treasures found data for a specific game code and team
   * Endpoint: /apis/observer/{gameCode}/scoreboard/{teamId}/treasures_found
   */
  async getTreasuresFound(gameCode: string, teamId: number): Promise<ApiResponse<TreasuresFoundResponse[]>> {
    return this.makeRequest<TreasuresFoundResponse[]>(`/apis/observer/${gameCode}/scoreboard/${teamId}/treasures_found`);
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
        // Silently continue polling
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