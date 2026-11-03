import { describe, it, expect } from 'vitest';
import {
  calculatePlacement,
  calculateMultiplier,
  calculateSpeed,
  getDifficultyParams,
  PERFECT_TOLERANCE_PX,
} from './gamePhysics';

describe('Tower Stacking Physics & Mechanics', () => {
  it('detects a PERFECT landing within tolerance', () => {
    const result = calculatePlacement(1.5, 200, 0, 200, PERFECT_TOLERANCE_PX);
    expect(result.status).toBe('PERFECT');
    expect(result.overlapWidth).toBe(200);
    expect(result.cutWidth).toBe(0);
    expect(result.cutSide).toBe('none');
    expect(result.bonusPoints).toBe(100);
  });

  it('correctly calculates GREAT landing within 12px offset', () => {
    const result = calculatePlacement(10, 140, 0, 140);
    expect(result.status).toBe('GREAT');
    expect(result.overlapWidth).toBe(140);
    expect(result.cutWidth).toBe(0);
    expect(result.cutSide).toBe('none');
  });

  it('correctly calculates GOOD stack landing inside the lines (18px offset for Level 1)', () => {
    const result = calculatePlacement(-18, 140, 0, 140, PERFECT_TOLERANCE_PX, 1);
    expect(result.status).toBe('GOOD');
    expect(result.overlapWidth).toBe(140);
    expect(result.cutWidth).toBe(0);
    expect(result.cutSide).toBe('none');
  });

  it('detects MISSED when moving block is dropped outside the lines (>20px) at Level 1', () => {
    const result = calculatePlacement(25, 140, 0, 140, PERFECT_TOLERANCE_PX, 1);
    expect(result.status).toBe('MISS');
  });

  it('tightens safe landing tolerance at 3rd box milestone (Level 3 misses at 18px)', () => {
    // At level 1, 18px was caught safely inside the lines (<=20px)
    const l1Result = calculatePlacement(18, 140, 0, 140, PERFECT_TOLERANCE_PX, 1);
    expect(l1Result.status).toBe('GOOD');

    // At level 3 (3rd box), safe margin is tightened to 16px -> 18px becomes a MISS
    const l3Result = calculatePlacement(18, 140, 0, 140, PERFECT_TOLERANCE_PX, 3);
    expect(l3Result.status).toBe('MISS');

    // Within safe margin (e.g. 14px) is still successfully stacked
    const l3Good = calculatePlacement(14, 140, 0, 140, PERFECT_TOLERANCE_PX, 3);
    expect(l3Good.status).toBe('GOOD');
  });

  it('rapidly escalates difficulty at 6th box milestone (Level 6 misses at 15px)', () => {
    // At level 3, 14px was safe (<=16px limit)
    const l3Result = calculatePlacement(14, 140, 0, 140, PERFECT_TOLERANCE_PX, 3);
    expect(l3Result.status).toBe('GOOD');

    // At level 6 (6th box), safe margin is tightened to 13px -> 15px becomes a MISS
    const l6Result = calculatePlacement(15, 140, 0, 140, PERFECT_TOLERANCE_PX, 6);
    expect(l6Result.status).toBe('MISS');
  });

  it('progressively escalates angular speed and swing tilt across milestones (L1 -> L3 -> L6 -> L9)', () => {
    const p1 = getDifficultyParams(1);
    const p3 = getDifficultyParams(3);
    const p6 = getDifficultyParams(6);
    const p9 = getDifficultyParams(9);

    // Speed progression
    expect(p3.angularSpeed).toBeGreaterThan(p1.angularSpeed);
    expect(p6.angularSpeed).toBeGreaterThan(p3.angularSpeed);
    expect(p9.angularSpeed).toBeGreaterThan(p6.angularSpeed);

    // Tilt angle progression
    expect(p3.maxSwingAngle).toBeGreaterThan(p1.maxSwingAngle);
    expect(p6.maxSwingAngle).toBeGreaterThan(p3.maxSwingAngle);
    expect(p9.maxSwingAngle).toBeGreaterThan(p6.maxSwingAngle);

    // Safe offset ratio progressively tightens
    expect(p1.safeOffsetRatio).toBeGreaterThan(p3.safeOffsetRatio);
    expect(p3.safeOffsetRatio).toBeGreaterThan(p6.safeOffsetRatio);
    expect(p6.safeOffsetRatio).toBeGreaterThan(p9.safeOffsetRatio);
  });

  it('escalates multiplier progressively as tower grows', () => {
    expect(calculateMultiplier(0)).toBe(1.0);
    expect(calculateMultiplier(1)).toBe(1.25);
    expect(calculateMultiplier(2)).toBe(1.6);
    expect(calculateMultiplier(5)).toBe(3.6);
    expect(calculateMultiplier(10)).toBe(15.0);
    expect(calculateMultiplier(12)).toBeGreaterThan(calculateMultiplier(10));
  });

  it('increases speed with level within reasonable bounds', () => {
    const speedLevel1 = calculateSpeed(1);
    const speedLevel5 = calculateSpeed(5);
    const speedLevel20 = calculateSpeed(20);

    expect(speedLevel5).toBeGreaterThan(speedLevel1);
    expect(speedLevel20).toBeLessThanOrEqual(580);
  });
});

