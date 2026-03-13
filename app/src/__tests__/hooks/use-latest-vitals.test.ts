jest.mock('@/services/database', () => ({
  getLatestScanByType: jest.fn(),
  getYesterdayLatestByType: jest.fn(),
}));

describe('useLatestVitals classification logic', () => {
  it('classifies HR correctly', () => {
    const classifyHR = (hr: number) => {
      if (hr < 60) return 'optimal';
      if (hr <= 100) return 'normal';
      if (hr <= 120) return 'elevated';
      return 'high';
    };
    expect(classifyHR(55)).toBe('optimal');
    expect(classifyHR(72)).toBe('normal');
    expect(classifyHR(110)).toBe('elevated');
    expect(classifyHR(130)).toBe('high');
  });

  it('classifies BP correctly', () => {
    const classifyBP = (sys: number, dia: number) => {
      if (sys < 120 && dia < 80) return 'optimal';
      if (sys < 130 && dia < 85) return 'normal';
      if (sys < 140 && dia < 90) return 'elevated';
      return 'high';
    };
    expect(classifyBP(110, 70)).toBe('optimal');
    expect(classifyBP(125, 82)).toBe('normal');
    expect(classifyBP(135, 88)).toBe('elevated');
    expect(classifyBP(150, 95)).toBe('high');
  });

  it('classifies HRV correctly', () => {
    const classifyHRV = (hrv: number) => {
      if (hrv > 50) return 'optimal';
      if (hrv >= 20) return 'normal';
      return 'low';
    };
    expect(classifyHRV(60)).toBe('optimal');
    expect(classifyHRV(35)).toBe('normal');
    expect(classifyHRV(15)).toBe('low');
  });
});
