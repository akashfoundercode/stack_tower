import { PlacementResult } from '../types/game';

// Configuration
export const BASE_BLOCK_WIDTH = 140; // standard obstacle width in px
export const BLOCK_HEIGHT = 70; // height of each stacked level
export const PERFECT_TOLERANCE_PX = 4; // pixel tolerance to qualify as PERFECT
export const MAX_SAFE_ALIGNMENT_OFFSET = 20; // Strict: if offset > 20px, house is outside foundation -> LOOSE!

export const COLOR_THEMES = [
  {
    primary: '#1d4ed8', // 1win style deep royal blue
    secondary: '#2563eb',
    trim: '#93c5fd',
    roof: '#1e40af',
    windowGlow: '#fef08a',
    hasAwning: true,
    styleType: 'shop' as const,
    shapeType: 'rectangular' as const,
  },
  {
    primary: '#ea580c', // Warm Terracotta Italian Building (arch windows & roof cornice)
    secondary: '#f97316',
    trim: '#fed7aa',
    roof: '#c2410c',
    windowGlow: '#fef08a',
    hasAwning: false,
    styleType: 'apartments' as const,
    shapeType: 'arched' as const,
  },
  {
    primary: '#059669', // Emerald boutique with terrace railing
    secondary: '#10b981',
    trim: '#a7f3d0',
    roof: '#047857',
    windowGlow: '#fef08a',
    hasAwning: true,
    styleType: 'shop' as const,
    shapeType: 'terrace-stepped' as const,
  },
  {
    primary: '#d97706', // Sunny amber building with neoclassical pediment peak
    secondary: '#f59e0b',
    trim: '#fef3c7',
    roof: '#b45309',
    windowGlow: '#ffffff',
    hasAwning: false,
    styleType: 'apartments' as const,
    shapeType: 'pediment' as const,
  },
  {
    primary: '#7c3aed', // Purple Victorian facade with classical columns
    secondary: '#8b5cf6',
    trim: '#ddd6fe',
    roof: '#6d28d9',
    windowGlow: '#fef08a',
    hasAwning: true,
    styleType: 'terrace' as const,
    shapeType: 'columned' as const,
  },
  {
    primary: '#db2777', // Rose boutique with mansard/sloped dormer roof
    secondary: '#ec4899',
    trim: '#fbcfe8',
    roof: '#be185d',
    windowGlow: '#ffffff',
    hasAwning: true,
    styleType: 'shop' as const,
    shapeType: 'sloped-roof' as const,
  },
  {
    primary: '#0891b2', // Cyan modern luxury penthouse
    secondary: '#06b6d4',
    trim: '#cffafe',
    roof: '#0e7490',
    windowGlow: '#fef08a',
    hasAwning: false,
    styleType: 'apartments' as const,
    shapeType: 'terrace-stepped' as const,
  },
  {
    primary: '#e11d48', // Red brick clocktower with crown battlement
    secondary: '#f43f5e',
    trim: '#ffe4e6',
    roof: '#9f1239',
    windowGlow: '#fef08a',
    hasAwning: false,
    styleType: 'clocktower' as const,
    shapeType: 'pediment' as const,
  },
];

/**
 * Multiplier progression table:
 * Level 1: 1.20x
 * Level 2: 1.50x
 * Level 3: 1.90x
 * Level 4: 2.40x
 * Level 5: 3.10x
 * Exponential scaling upwards for risk/reward thrill!
 */
export function calculateMultiplier(level: number): number {
  if (level <= 0) return 1.0;
  if (level === 1) return 1.25;
  if (level === 2) return 1.60;
  if (level === 3) return 2.10;
  if (level === 4) return 2.75;
  if (level === 5) return 3.60;
  if (level === 6) return 4.80;
  if (level === 7) return 6.50;
  if (level === 8) return 9.00;
  if (level === 9) return 12.50;
  if (level >= 10) {
    // 15x + 3.5x per additional floor
    return Number((15 + (level - 10) * 4.5).toFixed(2));
  }
  return Number((1 + level * 0.35).toFixed(2));
}

/**
 * Speed progression based on level (pixels per second)
 * Kept intentionally smooth and relaxed ("slowly latkega properly smoothly")
 */
export function calculateSpeed(level: number): number {
  // Relaxed, graceful speed starting around 130px/s, gently increasing up to ~240px/s
  const baseSpeed = 135; 
  const maxSpeed = 245;
  const speed = baseSpeed + Math.min(level * 9, maxSpeed - baseSpeed);
  return speed;
}

/**
 * Stable Width for upcoming box:
 * Width stays consistent and never shrinks, ensuring zero gaps!
 */
export function calculateNextWidth(_level: number): number {
  return BASE_BLOCK_WIDTH;
}

/**
 * Strict Alignment Placement Physics:
 * "Ye poora game alignment ka hai - agar zara house bahar hua to loose ho jaega!"
 * 
 * - If dropped offset > MAX_SAFE_ALIGNMENT_OFFSET (20px) -> MISS (house topples off edge, game over!)
 * - If within 4px of center -> PERFECT! (Dead center alignment +0.75x bonus)
 * - If within 12px -> GREAT DROP! (+0.50x bonus)
 * - If within 20px -> BALANCED! (+0.25x bonus)
 */
export function calculatePlacement(
  movingX: number,
  movingWidth: number,
  targetX: number,
  _targetWidth: number,
  tolerance = PERFECT_TOLERANCE_PX
): PlacementResult {
  const diff = movingX - targetX;
  const absDiff = Math.abs(diff);

  // Strict alignment check:
  // If the house is even slightly outside the foundation edge (> 20px offset) -> LOOSE!
  if (absDiff > MAX_SAFE_ALIGNMENT_OFFSET) {
    return {
      status: 'MISS',
      overlapWidth: movingWidth,
      overlapX: movingX,
      cutWidth: 0,
      cutX: 0,
      cutSide: diff > 0 ? 'right' : 'left',
      bonusPoints: 0,
      accuracy: 0,
      multiplierGain: 0,
      feedbackLabel: 'MISSED!',
    };
  }

  // 1. PERFECT LANDING (Exact center within tolerance <= 4px)
  if (absDiff <= tolerance) {
    return {
      status: 'PERFECT',
      overlapWidth: movingWidth,
      overlapX: targetX, // Clean center snap
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 100,
      accuracy: 1.0,
      multiplierGain: 0.75, // Huge multiplier boost for dead center!
      feedbackLabel: 'PERFECT!',
    };
  }

  // 2. GREAT DROP (Close alignment <= 12px)
  if (absDiff <= 12) {
    return {
      status: 'GREAT',
      overlapWidth: movingWidth,
      overlapX: Math.round(movingX * 10) / 10,
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 70,
      accuracy: Math.max(0.7, 1 - absDiff / MAX_SAFE_ALIGNMENT_OFFSET),
      multiplierGain: 0.50,
      feedbackLabel: 'GREAT DROP!',
    };
  }

  // 3. BALANCED / GOOD (Within safe boundary <= 20px)
  return {
    status: 'GOOD',
    overlapWidth: movingWidth,
    overlapX: Math.round(movingX * 10) / 10,
    cutWidth: 0,
    cutX: 0,
    cutSide: 'none',
    bonusPoints: 40,
    accuracy: Math.max(0.2, 1 - absDiff / MAX_SAFE_ALIGNMENT_OFFSET),
    multiplierGain: 0.25,
    feedbackLabel: 'NICE STACK!',
  };
}

