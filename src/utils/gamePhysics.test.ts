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

  it('escalates multiplier progressively as tower grows', () => {
    expect(calculateMultiplier(0)).toBe(1.0);
    expect(calculateMultiplier(1)).toBe(1.25);
    expect(calculateMultiplier(2)).toBe(1.6);
    expect(calculateMultiplier(5)).toBe(3.6);
    expect(calculateMultiplier(10)).toBe(15.0);
    expect(calculateMultiplier(12)).toBeGreaterThan(calculateMultiplier(10));
  });

  it('keeps speed constant across all levels', () => {
    const speedLevel1 = calculateSpeed(1);
    const speedLevel5 = calculateSpeed(5);
    const speedLevel20 = calculateSpeed(20);

    expect(speedLevel1).toBe(150);
    expect(speedLevel5).toBe(150);
    expect(speedLevel20).toBe(150);
  });

  it('allocates drop countdown time limit of exactly 5.0 seconds per floor', () => {
    const timeL1 = getDropTimeLimit(1);
    const timeL4 = getDropTimeLimit(4);
    const timeL10 = getDropTimeLimit(10);

    expect(timeL1).toBe(5.0);
    expect(timeL4).toBe(5.0);
    expect(timeL10).toBe(5.0);
  });
});

