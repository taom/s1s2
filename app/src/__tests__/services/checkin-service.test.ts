import { saveCheckIn } from '@/services/checkin-service';
import type { MeasurementResult } from '@/services/ppg/types';
import * as db from '@/services/database';
import { useJourneyStore } from '@/stores/journey-store';

// Mock database
jest.mock('@/services/database', () => ({
  insertScanResult: jest.fn(),
}));

// Mock journey store
const mockAddFuel = jest.fn();
jest.mock('@/stores/journey-store', () => ({
  useJourneyStore: {
    getState: () => ({ addFuel: mockAddFuel }),
  },
}));

const MOCK_MEASUREMENT: MeasurementResult = {
  heartRate: 72,
  heartRateInstant: 70,
  hrv: 42,
  spo2Estimate: 98,
  confidence: 0.85,
  qualityLabel: 'good',
  durationMs: 30000,
  peakCount: 36,
  signalToNoiseRatio: 12,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('saveCheckIn', () => {
  it('creates HR and HRV scan results from measurement', async () => {
    const result = await saveCheckIn(MOCK_MEASUREMENT, {});
    expect(result.scans.length).toBe(2);
    expect(result.scans[0].metricType).toBe('heart_rate');
    expect(result.scans[0].value).toBe(72);
    expect(result.scans[0].source).toBe('camera_ppg');
    expect(result.scans[1].metricType).toBe('hrv');
    expect(result.scans[1].value).toBe(42);
    expect(db.insertScanResult).toHaveBeenCalledTimes(2);
  });

  it('adds fuel per category, not all to heartRateCheckins', async () => {
    await saveCheckIn(MOCK_MEASUREMENT, {
      mood: 4,
      activityType: 'run',
      activityDurationMin: 30,
      sleepHours: 7.5,
      sleepQuality: 4,
      bpSystolic: 118,
      bpDiastolic: 76,
    });

    expect(mockAddFuel).toHaveBeenCalledWith(1.0, 'heartRateCheckins');
    expect(mockAddFuel).toHaveBeenCalledWith(0.25, 'moodLogs');
    expect(mockAddFuel).toHaveBeenCalledWith(0.25, 'activityLogs');
    expect(mockAddFuel).toHaveBeenCalledWith(0.5, 'sleepLogs');
    expect(mockAddFuel).toHaveBeenCalledWith(1.0, 'bpLogs');
  });

  it('does not add fuel for categories not logged', async () => {
    await saveCheckIn(MOCK_MEASUREMENT, { mood: 3 });

    expect(mockAddFuel).toHaveBeenCalledWith(1.0, 'heartRateCheckins');
    expect(mockAddFuel).toHaveBeenCalledWith(0.25, 'moodLogs');
    expect(mockAddFuel).not.toHaveBeenCalledWith(expect.anything(), 'sleepLogs');
    expect(mockAddFuel).not.toHaveBeenCalledWith(expect.anything(), 'bpLogs');
    expect(mockAddFuel).not.toHaveBeenCalledWith(expect.anything(), 'activityLogs');
  });

  it('encodes activity type as numeric index', async () => {
    const result = await saveCheckIn(MOCK_MEASUREMENT, {
      activityType: 'yoga',
      activityDurationMin: 60,
    });

    const activityScan = result.scans.find(s => s.metricType === 'activity_type');
    expect(activityScan?.value).toBe(5); // yoga = 5
  });

  it('creates BP scans only when both systolic and diastolic provided', async () => {
    const result1 = await saveCheckIn(MOCK_MEASUREMENT, { bpSystolic: 120 });
    expect(result1.scans.find(s => s.metricType === 'blood_pressure_systolic')).toBeUndefined();

    const result2 = await saveCheckIn(MOCK_MEASUREMENT, { bpSystolic: 120, bpDiastolic: 80 });
    expect(result2.scans.find(s => s.metricType === 'blood_pressure_systolic')).toBeDefined();
    expect(result2.scans.find(s => s.metricType === 'blood_pressure_diastolic')).toBeDefined();
  });

  it('all scans share the same sessionId', async () => {
    const result = await saveCheckIn(MOCK_MEASUREMENT, { mood: 3, sleepHours: 8 });
    const ids = new Set(result.scans.map(s => s.sessionId));
    expect(ids.size).toBe(1);
  });
});
