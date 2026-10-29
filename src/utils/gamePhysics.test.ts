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

  it('correctly calculates right-side overhang and cut', () => {
    // Target is center 0, width 200 (bounds -100 to 100)
    // Moving block is at center +40, width 200 (bounds -60 to 140)
    // Overlap should be from -60 to 100 => width 160
    // Center of overlap is (-60 + 100)/2 = +20
    // Cut should be on right, width 40
    const result = calculatePlacement(40, 200, 0, 200);
    expect(result.status).toBe('SUCCESS');
    expect(result.overlapWidth).toBe(160);
    expect(result.overlapX).toBe(20);
    expect(result.cutWidth).toBe(40);
    expect(result.cutSide).toBe('right');
  });

  it('correctly calculates left-side overhang and cut', () => {
    // Target is center 0, width 200 (bounds -100 to 100)
    // Moving block is at center -50, width 200 (bounds -150 to 50)
    // Overlap should be from -100 to 50 => width 150
    // Center of overlap is (-100 + 50)/2 = -25
    // Cut should be on left, width 50
    const result = calculatePlacement(-50, 200, 0, 200);
    expect(result.status).toBe('SUCCESS');
    expect(result.overlapWidth).toBe(150);
    expect(result.overlapX).toBe(-25);
    expect(result.cutWidth).toBe(50);
    expect(result.cutSide).toBe('left');
  });

  it('detects complete MISS when moving block is completely outside target', () => {
    // Target center 0, width 100 (-50 to +50)
    // Moving center 200, width 100 (150 to 250) -> zero overlap
    const result = calculatePlacement(200, 100, 0, 100);
    expect(result.status).toBe('MISS');
    expect(result.overlapWidth).toBe(0);
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
