import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { runOnJS } from 'react-native-worklets';

import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { PPGEngine } from '@/services/ppg/ppg-engine';
import type {
  MeasurementResult,
  QualityLevel,
  FrameData,
} from '@/services/ppg/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CameraMeasureProps {
  onComplete: (result: MeasurementResult) => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MEASUREMENT_DURATION_MS = 30_000;
const EARLY_EXIT_MIN_MS = 15_000;
const EARLY_EXIT_CONFIDENCE = 0.8;
const RING_SIZE = 180;

const QUALITY_DOTS: QualityLevel[] = ['poor', 'fair', 'good', 'excellent'];
const QUALITY_ORDER: Record<QualityLevel, number> = {
  calibrating: 0,
  poor: 1,
  fair: 2,
  good: 3,
  excellent: 4,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CameraMeasure({ onComplete, onCancel }: CameraMeasureProps) {
  // Camera
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  // Permission request on mount
  const [permissionRequested, setPermissionRequested] = useState(false);
  useEffect(() => {
    if (!hasPermission && !permissionRequested) {
      setPermissionRequested(true);
      requestPermission();
    }
  }, [hasPermission, permissionRequested, requestPermission]);

  // UI state
  const [fingerDetected, setFingerDetected] = useState(false);
  const [fingerLost, setFingerLost] = useState(false);
  const [currentBPM, setCurrentBPM] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [quality, setQuality] = useState<QualityLevel>('calibrating');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [canEarlyExit, setCanEarlyExit] = useState(false);
  const [measurementStarted, setMeasurementStarted] = useState(false);
  const [timedOutNoResult, setTimedOutNoResult] = useState(false);

  // Refs
  const engineRef = useRef<PPGEngine | null>(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  // ------------------------------------------------------------------
  // PPGEngine setup
  // ------------------------------------------------------------------

  const handleComplete = useCallback(
    (result: MeasurementResult) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(result);
    },
    [onComplete],
  );

  useEffect(() => {
    const engine = new PPGEngine(
      {
        onFingerDetected: (detected: boolean) => {
          setFingerDetected(detected);
          if (!detected && measurementStarted) {
            setFingerLost(true);
          } else if (detected) {
            setFingerLost(false);
          }
        },
        onBeatDetected: (_bpm: number) => {
          // Could trigger a pulse animation here
        },
        onHRUpdate: (hr: number, conf: number) => {
          setCurrentBPM(hr);
          setConfidence(conf);
        },
        onQualityChange: (q: QualityLevel) => {
          setQuality(q);
        },
        onMeasurementComplete: handleComplete,
      },
      {
        measurementDurationMs: MEASUREMENT_DURATION_MS,
        earlyExitMinMs: EARLY_EXIT_MIN_MS,
        earlyExitConfidence: EARLY_EXIT_CONFIDENCE,
      },
    );
    engineRef.current = engine;
    engine.start();
    setMeasurementStarted(true);
    startTimeRef.current = Date.now();

    // Progress timer
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setElapsedMs(elapsed);

      if (elapsed >= MEASUREMENT_DURATION_MS && !completedRef.current) {
        const result = engine.stop();
        if (result) {
          handleComplete(result);
        } else {
          setTimedOutNoResult(true);
        }
      }
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      engine.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleComplete]);

  // Early exit check
  useEffect(() => {
    if (
      elapsedMs >= EARLY_EXIT_MIN_MS &&
      confidence >= EARLY_EXIT_CONFIDENCE &&
      !canEarlyExit
    ) {
      setCanEarlyExit(true);
    }
  }, [elapsedMs, confidence, canEarlyExit]);

  // ------------------------------------------------------------------
  // Frame data handler (called from worklet via runOnJS)
  // ------------------------------------------------------------------

  const handleFrameData = useCallback((data: FrameData) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Build a minimal RGBA buffer from extracted means for addFrame.
    // The engine's processFrame extracts the same means, so we create
    // a 1x1 pixel with the mean values.
    const pixel = new Uint8Array(4);
    pixel[0] = Math.round(data.redMean);
    pixel[1] = Math.round(data.greenMean);
    pixel[2] = 0;
    pixel[3] = 255;
    engine.addFrame(pixel, 1, 1);
  }, []);

  // ------------------------------------------------------------------
  // Frame processor
  // ------------------------------------------------------------------

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      const width = frame.width;
      const height = frame.height;
      const buffer = frame.toArrayBuffer();
      const data = new Uint8Array(buffer);

      // Sample the center 50% of the frame for channel means
      const startX = Math.floor(width * 0.25);
      const endX = Math.floor(width * 0.75);
      const startY = Math.floor(height * 0.25);
      const endY = Math.floor(height * 0.75);

      let redSum = 0;
      let greenSum = 0;
      let redSqSum = 0;
      let count = 0;

      // Stride: 3 bytes per pixel (RGB)
      // Sample every 4th pixel to reduce load
      for (let y = startY; y < endY; y += 4) {
        for (let x = startX; x < endX; x += 4) {
          const idx = (y * width + x) * 3;
          const r = data[idx] ?? 0;
          const g = data[idx + 1] ?? 0;
          redSum += r;
          greenSum += g;
          redSqSum += r * r;
          count++;
        }
      }

      if (count > 0) {
        const redMean = redSum / count;
        const greenMean = greenSum / count;
        const redVariance = redSqSum / count - redMean * redMean;

        const frameData: FrameData = {
          redMean,
          greenMean,
          redVariance,
          timestamp: frame.timestamp,
        };

        runOnJS(handleFrameData)(frameData);
      }
    },
    [handleFrameData],
  );

  // ------------------------------------------------------------------
  // Early exit handler
  // ------------------------------------------------------------------

  const handleEarlyExit = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || completedRef.current) return;
    const result = engine.stop();
    if (result) {
      handleComplete(result);
    }
  }, [handleComplete]);

  // ------------------------------------------------------------------
  // Permission denied screen
  // ------------------------------------------------------------------

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionBody}>
            S1S2 needs camera access to read your heartbeat through your
            fingertip.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={onCancel}>
            <Text style={styles.skipButtonText}>
              Skip — enter manually
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ------------------------------------------------------------------
  // No device fallback
  // ------------------------------------------------------------------

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No camera device found</Text>
        <TouchableOpacity style={styles.skipButton} onPress={onCancel}>
          <Text style={styles.skipButtonText}>Enter manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ------------------------------------------------------------------
  // Progress
  // ------------------------------------------------------------------

  // ------------------------------------------------------------------
  // Timed out with no result
  // ------------------------------------------------------------------

  if (timedOutNoResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Could not detect heartbeat</Text>
        <Text style={styles.timerText}>
          Make sure your finger covers the camera and flash
        </Text>
        <TouchableOpacity
          style={styles.earlyExitButton}
          onPress={() => {
            setTimedOutNoResult(false);
            setElapsedMs(0);
            setCurrentBPM(0);
            setConfidence(0);
            setQuality('calibrating');
            setCanEarlyExit(false);
            completedRef.current = false;
            const engine = new PPGEngine(
              engineRef.current
                ? // re-use same callbacks shape
                  {
                    onFingerDetected: (detected: boolean) => {
                      setFingerDetected(detected);
                      if (!detected) setFingerLost(true);
                      else setFingerLost(false);
                    },
                    onBeatDetected: () => {},
                    onHRUpdate: (hr: number, conf: number) => {
                      setCurrentBPM(hr);
                      setConfidence(conf);
                    },
                    onQualityChange: (q: QualityLevel) => setQuality(q),
                    onMeasurementComplete: handleComplete,
                  }
                : {
                    onFingerDetected: () => {},
                    onBeatDetected: () => {},
                    onHRUpdate: () => {},
                    onQualityChange: () => {},
                    onMeasurementComplete: handleComplete,
                  },
            );
            engineRef.current = engine;
            engine.start();
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
              const elapsed = Date.now() - startTimeRef.current;
              setElapsedMs(elapsed);
              if (elapsed >= MEASUREMENT_DURATION_MS && !completedRef.current) {
                const result = engine.stop();
                if (result) handleComplete(result);
                else setTimedOutNoResult(true);
              }
            }, 200);
          }}
        >
          <Text style={styles.earlyExitText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progressPct = Math.min(elapsedMs / MEASUREMENT_DURATION_MS, 1) * 100;

  // ------------------------------------------------------------------
  // Main measurement UI
  // ------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* Camera ring */}
      <View
        style={[
          styles.ring,
          {
            borderColor: fingerDetected
              ? Colors.s1.primary
              : Colors.text.muted,
          },
        ]}
      >
        <Camera
          style={styles.camera}
          device={device}
          isActive={!completedRef.current}
          frameProcessor={frameProcessor}
          torch="on"
          pixelFormat="rgb"
          video={true}
          photo={false}
          audio={false}
        />
      </View>

      {/* Status text */}
      <Text style={styles.statusText}>
        {!fingerDetected
          ? 'Place fingertip over camera'
          : fingerLost
            ? 'Finger lost — replace to continue'
            : currentBPM > 0
              ? `${currentBPM} BPM`
              : 'Detecting heartbeat…'}
      </Text>

      {/* Quality dots */}
      <View style={styles.qualityRow}>
        {QUALITY_DOTS.map((level, i) => (
          <View
            key={level}
            style={[
              styles.qualityDot,
              {
                backgroundColor:
                  QUALITY_ORDER[quality] >= i + 1
                    ? Colors.s1.primary
                    : Colors.text.muted,
              },
            ]}
          />
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${progressPct}%` as never }]}
        />
      </View>
      <Text style={styles.timerText}>
        {Math.max(
          0,
          Math.ceil((MEASUREMENT_DURATION_MS - elapsedMs) / 1000),
        )}
        s remaining
      </Text>

      {/* Early exit button */}
      {canEarlyExit && (
        <TouchableOpacity
          style={styles.earlyExitButton}
          onPress={handleEarlyExit}
        >
          <Text style={styles.earlyExitText}>Got it</Text>
        </TouchableOpacity>
      )}

      {/* Cancel */}
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.deep,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },

  // Camera ring
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  camera: {
    width: '100%',
    height: '100%',
  },

  // Status
  statusText: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  // Quality dots
  qualityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  qualityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Progress bar
  progressTrack: {
    width: '80%',
    height: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.space.mid,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.s1.primary,
    borderRadius: BorderRadius.sm,
  },
  timerText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
  },

  // Buttons
  earlyExitButton: {
    backgroundColor: Colors.s1.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  earlyExitText: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  cancelText: {
    color: Colors.text.muted,
    fontSize: FontSize.md,
  },

  // Permission screen
  permissionCard: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  permissionTitle: {
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  permissionBody: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  settingsButton: {
    backgroundColor: Colors.s1.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  settingsButtonText: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: Spacing.sm,
  },
  skipButtonText: {
    color: Colors.text.muted,
    fontSize: FontSize.md,
  },
  errorText: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    marginBottom: Spacing.lg,
  },
});
