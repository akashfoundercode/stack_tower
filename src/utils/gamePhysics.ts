import { PlacementResult } from '../types/game';

// Configuration
export const BASE_BLOCK_WIDTH = 220; // base starting width in px
export const BLOCK_HEIGHT = 70; // height of each stacked level
export const PERFECT_TOLERANCE_PX = 3.5; // pixel tolerance to qualify as PERFECT
export const MIN_PLAYABLE_WIDTH = 12; // below this, stack is impossibly small -> game over

export const COLOR_THEMES = [
  {
    primary: '#1d4ed8', // 1win style deep royal blue
    secondary: '#2563eb',
    trim: '#93c5fd',
    roof: '#1e40af',
    windowGlow: '#fef08a',
    hasAwning: true,
    styleType: 'shop' as const,
  },
  {
    primary: '#ea580c', // Warm Terracotta Italian Building (like in screenshot)
    secondary: '#f97316',
    trim: '#fed7aa',
    roof: '#c2410c',
    windowGlow: '#fef08a',
    hasAwning: false,
    styleType: 'apartments' as const,
  },
  {
    primary: '#059669', // Emerald boutique
    secondary: '#10b981',
    trim: '#a7f3d0',
    roof: '#047857',
    windowGlow: '#fef08a',
    hasAwning: true,
    styleType: 'shop' as const,
  },
  {
    primary: '#d97706', // Sunny amber building
    secondary: '#f59e0b',
    trim: '#fef3c7',
    roof: '#b45309',
    windowGlow: '#ffffff',
    hasAwning: false,
    styleType: 'apartments' as const,
  },
  {
    primary: '#7c3aed', // Purple Victorian facade
    secondary: '#8b5cf6',
    trim: '#ddd6fe',
    roof: '#6d28d9',
    windowGlow: '#fef08a',
    hasAwning: true,
    styleType: 'terrace' as const,
  },
  {
    primary: '#db2777', // Rose boutique
    secondary: '#ec4899',
    trim: '#fbcfe8',
    roof: '#be185d',
    windowGlow: '#ffffff',
    hasAwning: true,
    styleType: 'shop' as const,
  },
  {
    primary: '#0891b2', // Cyan modern terrace
    secondary: '#06b6d4',
    trim: '#cffafe',
    roof: '#0e7490',
    windowGlow: '#fef08a',
    hasAwning: false,
    styleType: 'apartments' as const,
  },
  {
    primary: '#e11d48', // Red brick townhouse
    secondary: '#f43f5e',
    trim: '#ffe4e6',
    roof: '#9f1239',
    windowGlow: '#fef08a',
    hasAwning: false,
    styleType: 'clocktower' as const,
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
 * Speed progression based on level (pixels per millisecond / sweep speed)
 */
export function calculateSpeed(level: number): number {
  // Starts comfortable, gets faster smoothly
  const baseSpeed = 220; // px per second
  const maxSpeed = 580;
  const speed = baseSpeed + Math.min(level * 25, maxSpeed - baseSpeed);
  return speed;
}

/**
 * Pure function to calculate overlap and debris
 */
export function calculatePlacement(
  movingX: number,
  movingWidth: number,
  targetX: number,
  targetWidth: number,
  tolerance = PERFECT_TOLERANCE_PX
): PlacementResult {
  const diff = movingX - targetX;

  // Perfect landing if within tolerance
  if (Math.abs(diff) <= tolerance) {
    return {
      status: 'PERFECT',
      overlapWidth: targetWidth,
      overlapX: targetX, // snap precisely to target
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 100,
    };
  }

  // Moving block's bounds
  const movingLeft = movingX - movingWidth / 2;
  const movingRight = movingX + movingWidth / 2;

  // Target block's bounds
  const targetLeft = targetX - targetWidth / 2;
  const targetRight = targetX + targetWidth / 2;

  // Overlap bounds
  const overlapLeft = Math.max(movingLeft, targetLeft);
  const overlapRight = Math.min(movingRight, targetRight);
  const overlapWidth = overlapRight - overlapLeft;

  // If no overlap or too tiny
  if (overlapWidth <= MIN_PLAYABLE_WIDTH) {
    return {
      status: 'MISS',
      overlapWidth: 0,
      overlapX: movingX,
      cutWidth: movingWidth,
      cutX: movingX,
      cutSide: diff > 0 ? 'right' : 'left',
      bonusPoints: 0,
    };
  }

  // Calculate cut / overhang
  const overlapCenter = (overlapLeft + overlapRight) / 2;
  let cutWidth = 0;
  let cutCenter = 0;
  let cutSide: 'left' | 'right' = 'right';

  if (movingLeft < targetLeft) {
    // Overhangs on the left
    cutWidth = targetLeft - movingLeft;
    cutCenter = movingLeft + cutWidth / 2;
    cutSide = 'left';
  } else {
    // Overhangs on the right
    cutWidth = movingRight - targetRight;
    cutCenter = targetRight + cutWidth / 2;
    cutSide = 'right';
  }

  return {
    status: 'SUCCESS',
    overlapWidth: Math.round(overlapWidth * 10) / 10,
    overlapX: Math.round(overlapCenter * 10) / 10,
    cutWidth: Math.round(cutWidth * 10) / 10,
    cutX: Math.round(cutCenter * 10) / 10,
    cutSide,
    bonusPoints: 50,
  };
}
