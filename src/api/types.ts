import { GameDifficulty } from '../types/game';

/**
 * Standard API Response Envelope
 */
export interface ApiResponse<T> {
  status: number | string;
  success?: boolean;
  message?: string;
  data: T;
}

/**
 * User Login Request & Response Payloads
 * POST /api/login
 */
export interface LoginRequest {
  mobile?: string;
  identity?: string;
  password: string;
  country_code?: string;
}

export interface UserProfileData {
  id: number;
  token?: string;
  login_token?: string;
  username: string;
  mobile: string;
  email: string | null;
  u_id: string;
  wallet: number;
  winning_wallet: number;
  third_party_wallet?: number;
  total_wallet: number;
  recharge?: number;
  status?: string;
  type?: string;
}

export interface LoginResponse {
  message: string;
  status: string | number;
  id?: number;
  token: string;
  login_token?: string;
  token_type?: string;
  wallet?: number;
  winning_wallet?: number;
  total_wallet?: number;
  data: UserProfileData;
}

/**
 * Difficulty Configuration returned from API
 */
export interface DifficultyApiConfig {
  angular_speed: number;
  max_swing_angle: number;
  max_safe_offset: number;
  multiplier_step: number;
}

/**
 * Stack Tower Configuration Payload from GET /api/stack-tower/config
 */
export interface StackTowerConfigData {
  game_name: string;
  min_bet: number;
  max_bet: number;
  quick_bets: number[];
  difficulties: Record<GameDifficulty, DifficultyApiConfig>;
}

export type StackTowerConfigResponse = ApiResponse<StackTowerConfigData>;

/**
 * 1. Place Bet / Start Game Request & Response
 * POST /api/stack-tower/bet
 */
export interface PlaceBetRequest {
  amount: number;
  difficulty: GameDifficulty;
  userid?: string | number;
}

export interface PlaceBetData {
  round_id: string;
  bet_amount: number;
  difficulty: GameDifficulty;
  current_level: number;
  multiplier: number;
  wallet_balance: number;
  status: string;
}

export type PlaceBetResponse = ApiResponse<PlaceBetData>;

/**
 * 2. Cash Out Request & Response
 * POST /api/stack-tower/cashout
 */
export interface CashOutRequest {
  round_id: string;
  level: number;
  multiplier: number;
  userid?: string | number;
}

export interface CashOutData {
  round_id: string;
  bet_amount: number;
  level: number;
  multiplier: number;
  win_amount: number;
  profit: number;
  wallet_balance: number;
  status: 'CASHED_OUT' | string;
}

export type CashOutResponse = ApiResponse<CashOutData>;

/**
 * 3. Game Over Request & Response
 * POST /api/stack-tower/game-over
 */
export interface GameOverRequest {
  round_id: string;
  final_level: number;
  final_multiplier: number;
  userid?: string | number;
}

export interface GameOverData {
  round_id: string;
  level: number;
  multiplier: number;
  payout: number;
  status: 'LOST' | string;
  wallet_balance?: number;
}

export type GameOverResponse = ApiResponse<GameOverData>;

/**
 * 4. Bet History Request & Response
 * GET /api/stack-tower/history
 */
export interface BetHistoryItemData {
  id: string;
  timestamp: number;
  betAmount: number;
  difficulty: GameDifficulty;
  level: number;
  multiplier: number;
  payout: number;
  profit: number;
  status: 'CASHED_OUT' | 'WON' | 'LOST';
}

export type BetHistoryResponse = ApiResponse<BetHistoryItemData[]>;

/**
 * 5. User Stats & Tower Build Data
 * GET / POST /api/stack-tower/user-stats
 */
export interface ModeStatsData {
  mode: GameDifficulty;
  total_bets: number;
  total_wagered: number;
  total_won: number;
  net_profit: number;
  highest_tower_built: number;
  avg_tower_height: number;
  cashed_out: number;
  lost: number;
  win_rate: string;
}

export interface UserStatsData {
  user_id: number | string;
  total_bets: number;
  total_wagered: number;
  total_won: number;
  net_profit: number;
  highest_tower_built: number;
  total_towers_built: number;
  average_tower_height: number;
  win_rate: string;
  modes: Record<GameDifficulty, ModeStatsData>;
}

export type UserStatsResponse = ApiResponse<UserStatsData>;

/**
 * Socket.IO Real-time Obstacle Drop Event Data
 * Triggered when admin force stops / drops obstacle on tower
 */
export interface ObstacleDroppedData {
  round_id: string;
  user_id?: number | string;
  obstacle_dropped: boolean;
  obstacle_type: 'WRECKING_BALL' | 'METEOR' | 'ANVIL' | 'ROCK' | 'BIRD' | string;
  level_dropped: number;
  status: 'OBSTACLE_DROPPED' | string;
  payout: number;
}

/**
 * Socket.IO Join Round Payload
 */
export interface JoinRoundPayload {
  round_id: string;
  userid?: number | string;
}

/**
 * Socket.IO Stack Block Payload
 */
export interface StackBlockPayload {
  round_id: string;
  level: number;
  multiplier: number;
}



