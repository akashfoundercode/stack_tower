import { PlacementResult } from '../types/game';

// Configuration
export const BASE_BLOCK_WIDTH = 148; // standard obstacle PNG width in px
export const BLOCK_HEIGHT = 70; // height of each stacked level
export const PERFECT_TOLERANCE_PX = 5; // pixel tolerance to qualify as PERFECT
export const MAX_SAFE_ALIGNMENT_OFFSET = 20; // Strict boundary of the vertical guide lines: if dropped outside lines (>20px), MISSED!

export interface DifficultyParams {
  angularSpeed: number; // rad/s for pendulum swing
  maxSwingAngle: number; // degrees pendulum tilt
  sweepTravel: number; // horizontal trolley travel in px
  safeOffsetRatio: number; // ratio of target block width allowed before toppling
  maxSafeOffset: number; // computed pixel threshold for 140px base block
  greatThreshold: number; // pixel offset for GREAT
  goodThreshold: number; // pixel offset for GOOD
}

/**
 * Constant smooth swing speed and natural pendulum tilt across ALL levels:
 * Har baar ek hi steady speed rehti hai - badhti ya ghati nahi!
 */
export function getDifficultyParams(_level: number = 1, isMobile: boolean = false): DifficultyParams {
  const baseTravel = isMobile ? 88 : 110;

  return {
    angularSpeed: 2.2, // Constant steady 2.2 rad/s swing speed
    maxSwingAngle: 14.5, // Constant natural 14.5° pendulum tilt
    sweepTravel: baseTravel,
    safeOffsetRatio: 0.135,
    maxSafeOffset: 20,
    greatThreshold: 12,
    goodThreshold: 20,
  };
}

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
 * Constant speed across all levels (pixels per second)
 */
export function calculateSpeed(_level: number): number {
  return 150;
}

/**
 * Stable Width for upcoming box:
 * Width stays consistent and never shrinks, ensuring zero gaps!
 */
export function calculateNextWidth(_level: number): number {
  return BASE_BLOCK_WIDTH;
}

/**
 * Exact 5.0 seconds drop time limit per floor:
 * Player must drop the block within 5 seconds or lose!
 */
export function getDropTimeLimit(_level?: number): number {
  return 5.0;
}

/**
 * Realistic Alignment Placement Physics with Progressive Difficulty:
 * - Tolerances tighten across level milestones (Level 1-2, 3-5, 6-8, 9+)
 * - At lower levels, box only misses when hanging outside ~46% of width (~65px)
 * - At higher levels (3rd box, 6th box), allowable offset tightens progressively
 *   to make precision stacking intensely challenging!
 */
export function calculatePlacement(
  movingX: number,
  movingWidth: number,
  targetX: number,
  _targetWidth: number,
  tolerance = PERFECT_TOLERANCE_PX,
  level = 1
): PlacementResult {
  const diff = movingX - targetX;
  const absDiff = Math.abs(diff);

  const diffParams = getDifficultyParams(level, false);
  const maxSafeOffset = diffParams.maxSafeOffset;

  // 1. MISS: Box dropped outside straight corridor guide lines or target threshold
  if (Math.abs(movingX) > maxSafeOffset || absDiff > maxSafeOffset) {
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

  // 2. PERFECT LANDING (Exact center within tolerance <= 5px)
  if (absDiff <= tolerance) {
    return {
      status: 'PERFECT',
      overlapWidth: movingWidth,
      overlapX: 0, // Clean center snap to keep tower inside straight corridor
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 100,
      accuracy: 1.0,
      multiplierGain: 0.75, // Huge multiplier boost for dead center!
      feedbackLabel: 'PERFECT!',
    };
  }

  // 3. GREAT DROP
  if (absDiff <= diffParams.greatThreshold) {
    return {
      status: 'GREAT',
      overlapWidth: movingWidth,
      overlapX: Math.round(movingX * 10) / 10,
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 70,
      accuracy: Math.max(0.7, 1 - absDiff / maxSafeOffset),
      multiplierGain: 0.50,
      feedbackLabel: 'GREAT DROP!',
    };
  }

  // 4. NICE STACK
  if (absDiff <= diffParams.goodThreshold) {
    return {
      status: 'GOOD',
      overlapWidth: movingWidth,
      overlapX: Math.round(movingX * 10) / 10,
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 40,
      accuracy: Math.max(0.4, 1 - absDiff / maxSafeOffset),
      multiplierGain: 0.25,
      feedbackLabel: 'NICE STACK!',
    };
  }

  // 5. EDGE CATCH (Overhangs within current level's safe limit)
  return {
    status: 'GOOD',
    overlapWidth: movingWidth,
    overlapX: Math.round(movingX * 10) / 10,
    cutWidth: 0,
    cutX: 0,
    cutSide: 'none',
    bonusPoints: 25,
    accuracy: Math.max(0.15, 1 - absDiff / maxSafeOffset),
    multiplierGain: 0.15,
    feedbackLabel: 'EDGE CATCH!',
  };
}

