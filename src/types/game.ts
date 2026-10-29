export type GameState = 'IDLE' | 'PLAYING' | 'CASHED_OUT' | 'GAME_OVER';

export interface BlockLayer {
  id: number;
  level: number;
  x: number; // Left coordinate relative to scene center (0 is center of scene: -width/2 to +width/2)
  width: number;
  height: number;
  colorTheme: BlockColorTheme;
  isPerfect?: boolean;
}

export interface BlockColorTheme {
  primary: string;
  secondary: string;
  trim: string;
  roof: string;
  windowGlow: string;
  hasAwning?: boolean;
  styleType: 'shop' | 'apartments' | 'terrace' | 'penthouse' | 'clocktower';
}

export interface FallingDebris {
  id: string;
  x: number;
  width: number;
  height: number;
  y: number; // visual Y offset
  colorTheme: BlockColorTheme;
  direction: 'left' | 'right';
  rotation: number;
  velocity: number;
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
  status: 'PERFECT' | 'SUCCESS' | 'MISS';
  overlapWidth: number;
  overlapX: number;
  cutWidth: number;
  cutX: number;
  cutSide: 'left' | 'right' | 'none';
  bonusPoints: number;
}
