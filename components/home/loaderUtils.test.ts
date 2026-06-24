import { describe, it, expect } from 'vitest';
import { calcCombinedProgress } from './loaderUtils';

describe('calcCombinedProgress', () => {
  it('returns 0 when nothing has loaded', () => {
    expect(calcCombinedProgress(0, false)).toBe(0);
  });

  it('returns 60 when GLB is at 100% but images are not done', () => {
    expect(calcCombinedProgress(100, false)).toBe(60);
  });

  it('returns 40 when GLB is at 0% but images are done', () => {
    expect(calcCombinedProgress(0, true)).toBe(40);
  });

  it('returns 100 when both GLB and images are fully loaded', () => {
    expect(calcCombinedProgress(100, true)).toBe(100);
  });

  it('returns 30 at 50% GLB with images not done', () => {
    expect(calcCombinedProgress(50, false)).toBe(30);
  });

  it('rounds fractional progress to nearest integer', () => {
    // 33 * 0.6 = 19.8 → rounds to 20
    expect(calcCombinedProgress(33, false)).toBe(20);
  });
});
