export interface WayPoint {
  id?: number;
  alias?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  waypoint_archtype?: any;
  thumb_image?: string;
  location_name?: any;
  start_point?: boolean;
  major?: number;
  minor?: number;
  uuid?: string;
  location_detection_method?: string;
  proximity?: string;
  beacons?: any[];
  title?: any;
  description?: any;
  audio_url?: any;
  title_2?: any;
  description_2?: any;
  audio_url_2?: any;
  auto_play_audio?: boolean;
  auto_popup_content?: boolean;
  auto_close_content?: boolean;
  show_in_preview?: boolean;
  ar_asset?: any;
  ar_asset_scale?: number;
  custom_pin?: any;
  radius_meters?: number;
  score?: number;
  puzzle_piece?: any;
  content?: any;
  challenges?: Challenge[];
  order?: number;
  penalty_score_for_missed?: number;
  game_over_subtitle?: any;
  game_over_title?: any;
  selected?: boolean;
  hide_pin_before_found?: boolean;
  activate_manually?: boolean;
  hovred?: boolean;
}

export interface Challenge {
  id?: number;
  name?: string;
  description?: string;
  points?: number;
}

export interface IScoreboard {
  selected?: boolean;
  tour_id?: number;
  publisher_name?: string;
  game_team_id?: number;
  name?: string;
  email?: any;
  metadata?: any;
  score?: number;
  coupons_acquired?: number;
  game_instance_id?: number;
  players?: Player[];
  score_adjustment?: number;
  has_finished?: boolean;
  start_time?: any;
  game_duration?: number;
  playing_solo?: boolean;
  time_penalty?: number;
  challenges_in_certificate?: any;
  pictures_deleted?: boolean;
  new_adjusted_score?: number;
}

export interface IGameDetails {
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
  schedule_start_time?: any;
  game_code_hash?: string;
  game_key?: string;
  game_organizer?: string;
  game_duration?: number;
  allow_create_team?: boolean;
  number_of_teams?: number;
  invitation_message?: string;
  tour?: number;
  author?: number;
  sale_log?: any;
}

interface Treasuresfound {
  id: number;
  name: string;
  found_by: Foundby[];
}

interface Foundby {
  id: number;
  name: string;
  time: string;
}

export interface Player {
  device_serial?: string;
  nick_name?: string;
  email?: string | any;
  user_id?: any;
}

export interface Game {
  id: number;
  alias: string;
  last_updated: string;
  archtype: string;
  thumb_file_url: string;
  publisher: string;
  waypoints: WayPoint[];
  floors: any[];
  title: any;
  description: any;
  login_disclaim: any;
  needs_login: boolean;
  use_timer: boolean;
  total_score: number;
}

export interface ITreasure {
  time: string;
  log_type: number;
  log_error: boolean;
  waypoint_challenge: number;
  found_game_instance_item: null;
  score_earned: number;
  score_adjustment: number;
  description: string;
  time_penalty: number;
  score_penalty: number;
  other: string;
}