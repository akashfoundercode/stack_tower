import { describe, it, expect } from 'vitest';
import {
  calculatePlacement,
  calculateMultiplier,
  calculateSpeed,
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
    const result = calculatePlacement(8, 140, 0, 140);
    expect(result.status).toBe('GREAT');
    expect(result.overlapWidth).toBe(140);
    expect(result.cutWidth).toBe(0);
    expect(result.cutSide).toBe('none');
  });

  it('correctly calculates BALANCED landing within 20px offset', () => {
    const result = calculatePlacement(-15, 140, 0, 140);
    expect(result.status).toBe('GOOD');
    expect(result.overlapWidth).toBe(140);
    expect(result.cutWidth).toBe(0);
    expect(result.cutSide).toBe('none');
  });

  it('detects complete MISS when moving block exceeds safe alignment offset (>20px)', () => {
    const result = calculatePlacement(25, 140, 0, 140);
    expect(result.status).toBe('MISS');
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
    expect(speedLevel20).toBeLessThanOrEqual(580); // Capped safe max speed
  });
});

