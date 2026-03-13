import { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import type { MeasurementResult } from '@/services/ppg/types';
import type { OptionalLogData } from '@/services/checkin-service';
import { saveCheckIn } from '@/services/checkin-service';
import { getLatestScanByType } from '@/services/database';
import { CameraMeasure } from '@/components/checkin/camera-measure';
import { ResultDisplay } from '@/components/checkin/result-display';
import { OptionalLogs } from '@/components/checkin/optional-logs';

type CheckInStep = 'measure' | 'result' | 'logs';

export default function CheckInScreen() {
  const router = useRouter();
  const [step, setStep] = useState<CheckInStep>('measure');
  const [measurement, setMeasurement] = useState<MeasurementResult | null>(null);
  const [previousHR, setPreviousHR] = useState<number | null>(null);

  const handleMeasureComplete = useCallback(async (result: MeasurementResult) => {
    setMeasurement(result);
    // Fetch previous HR for comparison
    const latest = await getLatestScanByType('heart_rate');
    setPreviousHR(latest?.value ?? null);
    setStep('result');
  }, []);

  const handleRetry = useCallback(() => {
    setMeasurement(null);
    setStep('measure');
  }, []);

  const handleContinue = useCallback(() => {
    setStep('logs');
  }, []);

  const handleLogsComplete = useCallback(async (logs: OptionalLogData) => {
    if (measurement) {
      await saveCheckIn(measurement, logs);
    }
    router.back();
  }, [measurement, router]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Close Button — always visible */}
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        {step === 'measure' && (
          <CameraMeasure
            onComplete={handleMeasureComplete}
            onCancel={() => router.back()}
          />
        )}

        {step === 'result' && measurement && (
          <ResultDisplay
            result={measurement}
            previousHR={previousHR}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}

        {step === 'logs' && (
          <OptionalLogs onComplete={handleLogsComplete} />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.space.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
});
