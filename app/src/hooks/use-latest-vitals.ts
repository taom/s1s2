import { useState, useEffect, useCallback } from 'react';
import { getLatestScanByType, getYesterdayLatestByType } from '@/services/database';
import type { MetricType } from '@/types';

type StatusLevel = 'optimal' | 'normal' | 'elevated' | 'high' | 'low';

interface VitalReading {
  value: number;
  delta: number | null;
}

interface VitalsDelta {
  heartRate?: VitalReading;
  hrv?: VitalReading;
  spo2?: VitalReading;
  bpSystolic?: VitalReading;
  bpDiastolic?: VitalReading;
}

interface VitalsStatus {
  heartRate?: StatusLevel;
  bp?: StatusLevel;
  hrv?: StatusLevel;
  spo2?: StatusLevel;
}

interface UseLatestVitalsResult {
  vitals: VitalsDelta;
  status: VitalsStatus;
  lastCheckInAt: string | null;
  isLoading: boolean;
  refresh: () => void;
}

function classifyHR(hr: number): StatusLevel {
  if (hr < 60) return 'optimal';
  if (hr <= 100) return 'normal';
  if (hr <= 120) return 'elevated';
  return 'high';
}

function classifyBP(systolic: number, diastolic: number): StatusLevel {
  if (systolic < 120 && diastolic < 80) return 'optimal';
  if (systolic < 130 && diastolic < 85) return 'normal';
  if (systolic < 140 && diastolic < 90) return 'elevated';
  return 'high';
}

function classifyHRV(hrv: number): StatusLevel {
  if (hrv > 50) return 'optimal';
  if (hrv >= 20) return 'normal';
  return 'low';
}

function classifySpO2(spo2: number): StatusLevel {
  if (spo2 > 96) return 'optimal';
  if (spo2 >= 94) return 'normal';
  return 'low';
}

async function fetchVital(metricType: MetricType): Promise<VitalReading | undefined> {
  const latest = await getLatestScanByType(metricType);
  if (!latest) return undefined;

  const yesterday = await getYesterdayLatestByType(metricType);
  return {
    value: latest.value,
    delta: yesterday ? latest.value - yesterday.value : null,
  };
}

export function useLatestVitals(): UseLatestVitalsResult {
  const [vitals, setVitals] = useState<VitalsDelta>({});
  const [status, setStatus] = useState<VitalsStatus>({});
  const [lastCheckInAt, setLastCheckInAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [hr, hrv, spo2, bpSys, bpDia] = await Promise.all([
        fetchVital('heart_rate'),
        fetchVital('hrv'),
        fetchVital('spo2'),
        fetchVital('blood_pressure_systolic'),
        fetchVital('blood_pressure_diastolic'),
      ]);

      setVitals({
        heartRate: hr,
        hrv,
        spo2,
        bpSystolic: bpSys,
        bpDiastolic: bpDia,
      });

      const newStatus: VitalsStatus = {};
      if (hr) newStatus.heartRate = classifyHR(hr.value);
      if (bpSys && bpDia) newStatus.bp = classifyBP(bpSys.value, bpDia.value);
      if (hrv) newStatus.hrv = classifyHRV(hrv.value);
      if (spo2) newStatus.spo2 = classifySpO2(spo2.value);
      setStatus(newStatus);

      const latestHR = await getLatestScanByType('heart_rate');
      setLastCheckInAt(latestHR?.createdAt ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { vitals, status, lastCheckInAt, isLoading, refresh };
}
