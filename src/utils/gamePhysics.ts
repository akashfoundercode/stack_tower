import { PlacementResult, GameDifficulty } from '../types/game';

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
  maxSafeOffset: number; // computed pixel threshold for base block
  greatThreshold: number; // pixel offset for GREAT
  goodThreshold: number; // pixel offset for GOOD
}

/**
 * Difficulty-tuned physics configuration:
 * EASY: Gentler swing (2.2 rad/s), 13.5° tilt, 24px wide safe zone
 * MEDIUM: Balanced swing (2.8 rad/s), 16.0° dynamic tilt, 20px safe zone
 * HARD: Intense swing (3.4 rad/s), 18.5° tilt, 16px precision safe zone
 */
export function getDifficultyParams(
  _level: number = 1,
  isMobile: boolean = false,
  difficulty: GameDifficulty = 'MEDIUM',
  apiConfig?: { angular_speed: number; max_swing_angle: number; max_safe_offset: number }
): DifficultyParams {
  const baseTravel = isMobile ? 88 : 110;

  if (apiConfig) {
    return {
      angularSpeed: apiConfig.angular_speed,
      maxSwingAngle: apiConfig.max_swing_angle,
      sweepTravel:
        difficulty === 'EASY'
          ? Math.round(baseTravel * 0.9)
          : difficulty === 'HARD'
          ? Math.round(baseTravel * 1.1)
          : baseTravel,
      safeOffsetRatio: apiConfig.max_safe_offset / BASE_BLOCK_WIDTH,
      maxSafeOffset: apiConfig.max_safe_offset,
      greatThreshold: Math.round(apiConfig.max_safe_offset * 0.6),
      goodThreshold: apiConfig.max_safe_offset,
    };
  }

  if (difficulty === 'EASY') {
    return {
      angularSpeed: 2.2, // Smoother, gentler swing
      maxSwingAngle: 13.5, // 13.5° gentle tilt
      sweepTravel: Math.round(baseTravel * 0.9),
      safeOffsetRatio: 0.16,
      maxSafeOffset: 24, // Generous 24px safe zone
      greatThreshold: 15,
      goodThreshold: 24,
    };
  }

  if (difficulty === 'HARD') {
    return {
      angularSpeed: 3.4, // Faster, lively swing
      maxSwingAngle: 18.5, // Dynamic 18.5° pendulum tilt
      sweepTravel: Math.round(baseTravel * 1.1),
      safeOffsetRatio: 0.11,
      maxSafeOffset: 16, // Strict 16px safe precision
      greatThreshold: 9,
      goodThreshold: 16,
    };
  }

  // MEDIUM (Default)
  return {
    angularSpeed: 2.8, // Slightly faster, lively 2.8 rad/s swing speed
    maxSwingAngle: 16.0, // Dynamic 16.0° pendulum tilt
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

export const DIFFICULTY_MULTIPLIERS: Record<
  GameDifficulty,
  { table: number[]; formulaAfter10: (lvl: number) => number }
> = {
  EASY: {
    // Steady, high win-rate progression:
    table: [1.0, 1.18, 1.42, 1.75, 2.18, 2.75, 3.50, 4.50, 5.80, 7.50],
    formulaAfter10: (lvl: number) => Number((10.0 + (lvl - 10) * 2.5).toFixed(2)),
  },
  MEDIUM: {
    // Classic balanced 1win-style progression:
    table: [1.0, 1.30, 1.70, 2.25, 3.00, 4.10, 5.60, 7.70, 10.60, 14.80],
    formulaAfter10: (lvl: number) => Number((20.0 + (lvl - 10) * 5.0).toFixed(2)),
  },
  HARD: {
    // High stakes thrill, huge rewards progression:
    table: [1.0, 1.65, 2.50, 3.85, 5.90, 9.20, 14.50, 23.00, 37.00, 60.00],
    formulaAfter10: (lvl: number) => Number((95.0 + (lvl - 10) * 25.0).toFixed(2)),
  },
};

/**
 * Multiplier progression table per difficulty:
 * - EASY: Higher success rate, gentle progression (1.18x -> 7.50x -> 10x+)
 * - MEDIUM: Balanced risk/reward (1.30x -> 14.80x -> 20x+)
 * - HARD: High-stakes adrenaline rush (1.65x -> 60.00x -> 95x+)
 */
export function calculateMultiplier(level: number, difficulty: GameDifficulty = 'MEDIUM'): number {
  if (level <= 0) return 1.0;
  const config = DIFFICULTY_MULTIPLIERS[difficulty] || DIFFICULTY_MULTIPLIERS.MEDIUM;
  if (level < config.table.length) {
    return config.table[level];
  }
  return config.formulaAfter10(level);
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
 * Drop time limit per floor tuned by difficulty:
 * - EASY: 6.0 seconds (relaxed)
 * - MEDIUM: 5.0 seconds (standard)
 * - HARD: 4.0 seconds (fast-paced intense)
 */
export function getDropTimeLimit(_level?: number, difficulty: GameDifficulty = 'MEDIUM'): number {
  switch (difficulty) {
    case 'EASY':
      return 6.0;
    case 'HARD':
      return 4.0;
    case 'MEDIUM':
    default:
      return 5.0;
  }
}

/**
 * Realistic Alignment Placement Physics with Progressive Difficulty:
 * - Tolerances tighten across level milestones
 * - Easy / Medium / Hard adjust safe offset bounds & multiplier boosts
 */
export function calculatePlacement(
  movingX: number,
  movingWidth: number,
  targetX: number,
  _targetWidth: number,
  tolerance = PERFECT_TOLERANCE_PX,
  level = 1,
  difficulty: GameDifficulty = 'MEDIUM',
  apiConfig?: { angular_speed: number; max_swing_angle: number; max_safe_offset: number }
): PlacementResult {
  const diff = movingX - targetX;
  const absDiff = Math.abs(diff);

  const diffParams = getDifficultyParams(level, false, difficulty, apiConfig);
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
    const perfectGain = difficulty === 'HARD' ? 1.0 : difficulty === 'EASY' ? 0.5 : 0.75;
    return {
      status: 'PERFECT',
      overlapWidth: movingWidth,
      overlapX: 0, // Clean center snap to keep tower inside straight corridor
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 100,
      accuracy: 1.0,
      multiplierGain: perfectGain,
      feedbackLabel: 'PERFECT!',
    };
  }

  // 3. GREAT DROP
  if (absDiff <= diffParams.greatThreshold) {
    const greatGain = difficulty === 'HARD' ? 0.75 : difficulty === 'EASY' ? 0.35 : 0.5;
    return {
      status: 'GREAT',
      overlapWidth: movingWidth,
      overlapX: Math.round(movingX * 10) / 10,
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 70,
      accuracy: Math.max(0.7, 1 - absDiff / maxSafeOffset),
      multiplierGain: greatGain,
      feedbackLabel: 'GREAT DROP!',
    };
  }

  // 4. NICE STACK
  if (absDiff <= diffParams.goodThreshold) {
    const goodGain = difficulty === 'HARD' ? 0.4 : difficulty === 'EASY' ? 0.2 : 0.25;
    return {
      status: 'GOOD',
      overlapWidth: movingWidth,
      overlapX: Math.round(movingX * 10) / 10,
      cutWidth: 0,
      cutX: 0,
      cutSide: 'none',
      bonusPoints: 40,
      accuracy: Math.max(0.4, 1 - absDiff / maxSafeOffset),
      multiplierGain: goodGain,
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

