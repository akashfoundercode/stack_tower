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
 * Rapid & progressive difficulty progression calibrated around key milestones:
 * - Level 1-2 (Starter): Smooth swing (2.2 rad/s, 16.5° tilt, 20px safe drop window inside the lines)
 * - Level 3-5 (3rd box series jump): Faster speed & sway (3.2-3.7 rad/s, 19.5°-21.5° tilt, 16px safe drop window)
 * - Level 6-8 (6th box rapid escalation): High speed, aggressive swing (4.3-4.9 rad/s, 23.5°-25.5° tilt, 13px safe drop window)
 * - Level 9+ (Extreme High Stakes): Lightning reflexes required (5.2-5.8 rad/s, up to 27.5° tilt, 10px safe drop window)
 */
export function getDifficultyParams(level: number, isMobile: boolean = false): DifficultyParams {
  const baseTravel = isMobile ? 88 : 110;

  if (level <= 2) {
    // Level 1-2: Starter friendly (safe margin 20px inside the lines)
    const angularSpeed = 2.2 + (level - 1) * 0.2;
    const maxSwingAngle = 16.5;
    const sweepTravel = baseTravel;
    const safeOffsetRatio = 0.143; // 20px on 140px block
    return {
      angularSpeed,
      maxSwingAngle,
      sweepTravel,
      safeOffsetRatio,
      maxSafeOffset: 20,
      greatThreshold: 12,
      goodThreshold: 20,
    };
  }

  if (level <= 5) {
    // Level 3-5: 3rd box series jump (faster speed, wider swing, tighter drop tolerance 16px)
    const angularSpeed = 3.2 + (level - 3) * 0.28; // L3: 3.2, L4: 3.48, L5: 3.76
    const maxSwingAngle = 19.5 + (level - 3) * 1.0; // L3: 19.5°, L4: 20.5°, L5: 21.5°
    const sweepTravel = Math.round(baseTravel * 1.12);
    const safeOffsetRatio = 0.114; // 16px on 140px block
    return {
      angularSpeed,
      maxSwingAngle,
      sweepTravel,
      safeOffsetRatio,
      maxSafeOffset: 16,
      greatThreshold: 9,
      goodThreshold: 16,
    };
  }

  if (level <= 8) {
    // Level 6-8: 6th box rapid escalation (fast & intense swing, tight margin 13px)
    const angularSpeed = 4.3 + (level - 6) * 0.32; // L6: 4.3, L7: 4.62, L8: 4.94
    const maxSwingAngle = 23.5 + (level - 6) * 1.0; // L6: 23.5°, L7: 24.5°, L8: 25.5°
    const sweepTravel = Math.round(baseTravel * 1.22);
    const safeOffsetRatio = 0.092; // 13px on 140px block
    return {
      angularSpeed,
      maxSwingAngle,
      sweepTravel,
      safeOffsetRatio,
      maxSafeOffset: 13,
      greatThreshold: 7,
      goodThreshold: 13,
    };
  }

  // Level 9+: Extreme High Stakes crash adrenaline (ultra tight margin 10px)
  const angularSpeed = Math.min(5.8, 5.2 + (level - 9) * 0.2); // L9: 5.2, L10: 5.4, L11: 5.6, capped at 5.8
  const maxSwingAngle = Math.min(27.5, 26.5 + (level - 9) * 0.3); // max 27.5°
  const sweepTravel = Math.round(baseTravel * 1.3);
  const safeOffsetRatio = 0.071; // 10px on 140px block
  return {
    angularSpeed,
    maxSwingAngle,
    sweepTravel,
    safeOffsetRatio,
    maxSafeOffset: 10,
    greatThreshold: 5,
    goodThreshold: 10,
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
 * Speed progression based on level (pixels per second)
 * Scales progressively with milestones at Level 1, 3, 6, and 9+.
 */
export function calculateSpeed(level: number): number {
  if (level <= 2) return 135 + level * 10;
  if (level <= 5) return 175 + (level - 2) * 20;
  if (level <= 8) return 245 + (level - 5) * 25;
  return Math.min(420, 325 + (level - 8) * 20);
}

/**
 * Stable Width for upcoming box:
 * Width stays consistent and never shrinks, ensuring zero gaps!
 */
export function calculateNextWidth(_level: number): number {
  return BASE_BLOCK_WIDTH;
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

