import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { generateCommentary, getTimeOfDay } from '@/services/ship-ai';
import { useJourneyStore } from '@/stores/journey-store';
import type { MeasurementResult } from '@/services/ppg/types';

interface ResultDisplayProps {
  result: MeasurementResult;
  previousHR: number | null;
  onContinue: () => void;
  onRetry: () => void;
}

// Returns color for each bar count (1=poor, 2=fair, 3=good, 4=excellent)
const BAR_COLORS: Record<number, string> = {
  1: Colors.s1.primary,
  2: Colors.star.gold,
  3: Colors.s2.primary,
  4: Colors.star.aurora,
};

function qualityToBars(qualityLabel: MeasurementResult['qualityLabel']): number {
  switch (qualityLabel) {
    case 'poor':      return 1;
    case 'fair':      return 2;
    case 'good':      return 3;
    case 'excellent': return 4;
    default:          return 1;
  }
}

interface ConfidenceIndicatorProps {
  qualityLabel: MeasurementResult['qualityLabel'];
}

function ConfidenceIndicator({ qualityLabel }: ConfidenceIndicatorProps) {
  const bars = qualityToBars(qualityLabel);
  const color = BAR_COLORS[bars];
  return (
    <View style={styles.barsRow}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: 8 + i * 5 },
            i <= bars
              ? { backgroundColor: color }
              : { backgroundColor: Colors.space.surface },
          ]}
        />
      ))}
      <Text style={[styles.qualityLabel, { color }]}>
        {qualityLabel.charAt(0).toUpperCase() + qualityLabel.slice(1)}
      </Text>
    </View>
  );
}

interface DeltaBadgeProps {
  currentHR: number;
  previousHR: number;
}

function DeltaBadge({ currentHR, previousHR }: DeltaBadgeProps) {
  const diff = currentHR - previousHR;
  if (diff === 0) return null;

  const isDecrease = diff < 0;
  const arrow = isDecrease ? '▼' : '▲';
  const absDiff = Math.abs(diff);
  const color = isDecrease ? Colors.star.aurora : Colors.star.gold;

  return (
    <View style={[styles.deltaBadge, { borderColor: color }]}>
      <Text style={[styles.deltaText, { color }]}>
        {arrow} {absDiff} vs yesterday
      </Text>
    </View>
  );
}

export function ResultDisplay({ result, previousHR, onContinue, onRetry }: ResultDisplayProps) {
  const progress = useJourneyStore((s) => s.progress);

  const commentary = generateCommentary({
    heartRate: result.heartRate,
    confidence: result.confidence,
    previousHR,
    timeOfDay: getTimeOfDay(),
    currentStreak: progress?.currentStreak ?? 0,
    totalCheckIns: progress?.totalSystemsVisited ?? 0,
    isFirstEver: previousHR === null,
  });

  const lowConfidence = result.confidence < 0.5;

  return (
    <View style={styles.container}>
      {/* Hero BPM */}
      <View style={styles.heroSection}>
        <Text style={styles.bpmNumber}>{result.heartRate}</Text>
        <Text style={styles.bpmUnit}>BPM</Text>
      </View>

      {/* Confidence indicator */}
      <ConfidenceIndicator qualityLabel={result.qualityLabel} />

      {/* Delta badge */}
      {previousHR !== null && (
        <DeltaBadge currentHR={result.heartRate} previousHR={previousHR} />
      )}

      {/* Ship AI commentary */}
      <View style={styles.commentaryBox}>
        <Text style={styles.commentaryText}>{commentary}</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonsSection}>
        {lowConfidence ? (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onRetry}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Try again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={onContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.outlineButtonText}>Continue anyway</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },

  // Hero BPM
  heroSection: {
    alignItems: 'center',
  },
  bpmNumber: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.s1.primary,
    lineHeight: FontSize.hero * 1.1,
  },
  bpmUnit: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 2,
    marginTop: Spacing.xxs,
  },

  // Signal bars
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  bar: {
    width: 8,
    borderRadius: BorderRadius.sm,
  },
  qualityLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
    marginBottom: 2,
  },

  // Delta badge
  deltaBadge: {
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
  },
  deltaText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  // Commentary box
  commentaryBox: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.star.gold,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    alignSelf: 'stretch',
  },
  commentaryText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    fontStyle: 'italic',
    lineHeight: FontSize.md * 1.6,
  },

  // Buttons
  buttonsSection: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: Colors.s1.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: Colors.s1.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Colors.s1.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
