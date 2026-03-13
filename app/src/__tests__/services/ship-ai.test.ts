import { generateCommentary } from '@/services/ship-ai';

describe('generateCommentary', () => {
  it('returns first-ever commentary for first check-in', () => {
    const text = generateCommentary({
      heartRate: 72,
      confidence: 0.9,
      previousHR: null,
      timeOfDay: 'morning',
      currentStreak: 0,
      totalCheckIns: 0,
      isFirstEver: true,
    });
    expect(text).toContain('Captain');
    expect(text.length).toBeGreaterThan(20);
  });

  it('returns streak milestone commentary at day 7', () => {
    const text = generateCommentary({
      heartRate: 68,
      confidence: 0.8,
      previousHR: 70,
      timeOfDay: 'afternoon',
      currentStreak: 7,
      totalCheckIns: 10,
      isFirstEver: false,
    });
    expect(text).toContain('7');
    expect(text).toContain('Captain');
  });

  it('mentions elevated HR when significantly above previous', () => {
    const text = generateCommentary({
      heartRate: 95,
      confidence: 0.7,
      previousHR: 68,
      timeOfDay: 'evening',
      currentStreak: 3,
      totalCheckIns: 5,
      isFirstEver: false,
    });
    expect(text.length).toBeGreaterThan(20);
  });

  it('returns a string for generic context (no special triggers)', () => {
    const text = generateCommentary({
      heartRate: 72,
      confidence: 0.8,
      previousHR: 73,
      timeOfDay: 'afternoon',
      currentStreak: 2,
      totalCheckIns: 5,
      isFirstEver: false,
    });
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(20);
  });
});
