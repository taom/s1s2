import type { ScanResult, MetricType, VitalSource } from '@/types';
import type { MeasurementResult } from '@/services/ppg/types';
import { getDatabase, insertScanResult } from '@/services/database';
import { useJourneyStore } from '@/stores/journey-store';
import { ACTIVITY_TYPES, type ActivityType } from '@/constants/activity-types';

export interface OptionalLogData {
  mood?: number;              // 1-5
  activityType?: ActivityType;
  activityDurationMin?: number;
  sleepHours?: number;
  sleepQuality?: number;      // 1-5
  bpSystolic?: number;
  bpDiastolic?: number;
}

export interface CheckInSession {
  sessionId: string;
  scans: Omit<ScanResult, 'createdAt'>[];
  fuelEarned: number;
}

function generateId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function makeScan(
  sessionId: string,
  metricType: MetricType,
  value: number,
  unit: string,
  source: VitalSource,
  confidence: number
): Omit<ScanResult, 'createdAt'> {
  return {
    id: generateId(),
    sessionId,
    metricType,
    value,
    unit,
    confidence,
    source,
  };
}

export async function saveCheckIn(
  measurement: MeasurementResult,
  optionalLogs: OptionalLogData
): Promise<CheckInSession> {
  const sessionId = generateSessionId();
  const scans: Omit<ScanResult, 'createdAt'>[] = [];
  let fuelEarned = 0;

  // Always: heart rate from camera PPG
  scans.push(makeScan(sessionId, 'heart_rate', measurement.heartRate, 'bpm', 'camera_ppg', measurement.confidence));
  fuelEarned += 1.0;

  // Always: HRV from camera PPG
  scans.push(makeScan(sessionId, 'hrv', measurement.hrv, 'ms', 'camera_ppg', measurement.confidence));

  // Optional: mood
  if (optionalLogs.mood != null) {
    scans.push(makeScan(sessionId, 'mood', optionalLogs.mood, 'scale', 'manual', 1.0));
    fuelEarned += 0.25;
  }

  // Optional: activity
  if (optionalLogs.activityType != null) {
    scans.push(makeScan(sessionId, 'activity_type', ACTIVITY_TYPES[optionalLogs.activityType], 'enum', 'manual', 1.0));
    if (optionalLogs.activityDurationMin != null) {
      scans.push(makeScan(sessionId, 'activity_duration', optionalLogs.activityDurationMin, 'min', 'manual', 1.0));
    }
    fuelEarned += 0.25;
  }

  // Optional: sleep
  if (optionalLogs.sleepHours != null) {
    scans.push(makeScan(sessionId, 'sleep_hours', optionalLogs.sleepHours, 'hours', 'manual', 1.0));
    if (optionalLogs.sleepQuality != null) {
      scans.push(makeScan(sessionId, 'sleep_quality', optionalLogs.sleepQuality, 'scale', 'manual', 1.0));
    }
    fuelEarned += 0.5;
  }

  // Optional: blood pressure
  if (optionalLogs.bpSystolic != null && optionalLogs.bpDiastolic != null) {
    scans.push(makeScan(sessionId, 'blood_pressure_systolic', optionalLogs.bpSystolic, 'mmHg', 'manual', 1.0));
    scans.push(makeScan(sessionId, 'blood_pressure_diastolic', optionalLogs.bpDiastolic, 'mmHg', 'manual', 1.0));
    fuelEarned += 1.0;
  }

  // Persist all scans in a single transaction
  const d = getDatabase();
  await d.execAsync('BEGIN');
  try {
    for (const scan of scans) {
      await insertScanResult(scan);
    }
    await d.execAsync('COMMIT');
  } catch (err) {
    await d.execAsync('ROLLBACK');
    throw err;
  }

  // Update journey store fuel (only after successful DB commit)
  const store = useJourneyStore.getState();
  store.addFuel(1.0, 'heartRateCheckins');
  if (optionalLogs.mood != null) store.addFuel(0.25, 'moodLogs');
  if (optionalLogs.activityType != null) store.addFuel(0.25, 'activityLogs');
  if (optionalLogs.sleepHours != null) store.addFuel(0.5, 'sleepLogs');
  if (optionalLogs.bpSystolic != null && optionalLogs.bpDiastolic != null) store.addFuel(1.0, 'bpLogs');

  return { sessionId, scans, fuelEarned };
}
