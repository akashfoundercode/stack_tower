export type GameState = 'IDLE' | 'PLAYING' | 'CASHED_OUT' | 'GAME_OVER';

export interface BlockLayer {
  id: number;
  level: number;
  x: number; // Center offset relative to scene center
  width: number;
  height: number;
  colorTheme: BlockColorTheme;
  isPerfect?: boolean;
  tilt?: number; // Tilt angle in degrees for natural physics stack
}

export interface BlockColorTheme {
  primary: string;
  secondary: string;
  trim: string;
  roof: string;
  windowGlow: string;
  hasAwning?: boolean;
  styleType: 'shop' | 'apartments' | 'terrace' | 'penthouse' | 'clocktower' | 'victorian' | 'villa' | 'pagoda' | 'balcony';
  shapeType?: 'rectangular' | 'arched' | 'pediment' | 'terrace-stepped' | 'sloped-roof' | 'columned';
}

export interface FallingDebris {
  id: string;
  x: number;
  bottom?: number;
  y?: number;
  width: number;
  height: number;
  direction: 'left' | 'right';
  rotation?: number;
  velocity?: number;
  colorTheme?: BlockColorTheme;
  image?: string;
}

export interface BetHistoryItem {
  id: string;
  timestamp: number;
  betAmount: number;
  level: number;
  multiplier: number;
  payout: number;
  profit: number;
  status: 'WON' | 'LOST' | 'CASHED_OUT';
}

export interface SoundSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface PlacementResult {
  status: 'PERFECT' | 'GREAT' | 'GOOD' | 'OKAY' | 'MISS';
  overlapWidth: number;
  overlapX: number;
  cutWidth: number;
  cutX: number;
  cutSide: 'left' | 'right' | 'none';
  bonusPoints: number;
  accuracy: number; // 0 to 1
  multiplierGain: number; // how much multiplier is added this drop
  feedbackLabel: string; // e.g. "PERFECT!", "GREAT!", "GOOD!"
}

