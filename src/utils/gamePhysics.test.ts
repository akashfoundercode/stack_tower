import { describe, it, expect } from 'vitest';
import {
  calculatePlacement,
  calculateMultiplier,
  calculateSpeed,
  getDifficultyParams,
  getDropTimeLimit,
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

  it('maintains constant steady speed and tilt across all levels without increasing or decreasing', () => {
    const p1 = getDifficultyParams(1);
    const p3 = getDifficultyParams(3);
    const p6 = getDifficultyParams(6);
    const p9 = getDifficultyParams(9);

    // Constant speed across all levels
    expect(p1.angularSpeed).toBe(2.8);
    expect(p3.angularSpeed).toBe(2.8);
    expect(p6.angularSpeed).toBe(2.8);
    expect(p9.angularSpeed).toBe(2.8);

    // Constant tilt angle across all levels
    expect(p1.maxSwingAngle).toBe(16.0);
    expect(p3.maxSwingAngle).toBe(16.0);
    expect(p6.maxSwingAngle).toBe(16.0);
    expect(p9.maxSwingAngle).toBe(16.0);
  });

  it('escalates multiplier progressively as tower grows with different rates per difficulty mode', () => {
    // Medium (Default)
    expect(calculateMultiplier(0, 'MEDIUM')).toBe(1.0);
    expect(calculateMultiplier(1, 'MEDIUM')).toBe(1.30);
    expect(calculateMultiplier(2, 'MEDIUM')).toBe(1.70);
    expect(calculateMultiplier(5, 'MEDIUM')).toBe(4.10);
    expect(calculateMultiplier(10, 'MEDIUM')).toBe(20.0);
    expect(calculateMultiplier(12, 'MEDIUM')).toBeGreaterThan(calculateMultiplier(10, 'MEDIUM'));

    // Easy mode: safe progression
    expect(calculateMultiplier(1, 'EASY')).toBe(1.18);
    expect(calculateMultiplier(5, 'EASY')).toBe(2.75);
    expect(calculateMultiplier(10, 'EASY')).toBe(10.0);

    // Hard mode: thrilling high payouts!
    expect(calculateMultiplier(1, 'HARD')).toBe(1.65);
    expect(calculateMultiplier(5, 'HARD')).toBe(9.20);
    expect(calculateMultiplier(10, 'HARD')).toBe(95.0);

    // Hard > Medium > Easy at all levels
    expect(calculateMultiplier(3, 'HARD')).toBeGreaterThan(calculateMultiplier(3, 'MEDIUM'));
    expect(calculateMultiplier(3, 'MEDIUM')).toBeGreaterThan(calculateMultiplier(3, 'EASY'));
  });

  it('keeps speed constant across all levels', () => {
    const speedLevel1 = calculateSpeed(1);
    const speedLevel5 = calculateSpeed(5);
    const speedLevel20 = calculateSpeed(20);

    expect(speedLevel1).toBe(150);
    expect(speedLevel5).toBe(150);
    expect(speedLevel20).toBe(150);
  });

  it('allocates drop countdown time limit based on difficulty', () => {
    expect(getDropTimeLimit(1, 'EASY')).toBe(6.0);
    expect(getDropTimeLimit(1, 'MEDIUM')).toBe(5.0);
    expect(getDropTimeLimit(1, 'HARD')).toBe(4.0);
  });

  it('tunes swing physics parameters per difficulty mode', () => {
    const easyParams = getDifficultyParams(1, false, 'EASY');
    const medParams = getDifficultyParams(1, false, 'MEDIUM');
    const hardParams = getDifficultyParams(1, false, 'HARD');

    expect(easyParams.angularSpeed).toBe(2.2);
    expect(medParams.angularSpeed).toBe(2.8);
    expect(hardParams.angularSpeed).toBe(3.4);

    expect(easyParams.maxSafeOffset).toBe(24);
    expect(medParams.maxSafeOffset).toBe(20);
    expect(hardParams.maxSafeOffset).toBe(16);
  });
});

