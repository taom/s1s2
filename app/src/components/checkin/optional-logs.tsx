import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

import { ACTIVITY_TYPES, ACTIVITY_LABELS, type ActivityType } from '@/constants/activity-types';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import type { OptionalLogData } from '@/services/checkin-service';

interface OptionalLogsProps {
  onComplete: (logs: OptionalLogData) => void;
}

type Category = 'mood' | 'activity' | 'sleep' | 'bp';

const MOOD_EMOJIS = ['😫', '😕', '😐', '😊', '🤩'] as const;
const STAR_FILLED = '★';
const STAR_EMPTY = '☆';

export function OptionalLogs({ onComplete }: OptionalLogsProps) {
  const [expanded, setExpanded] = useState<Category | null>(null);

  // Mood
  const [mood, setMood] = useState<number | undefined>(undefined);

  // Activity
  const [activityType, setActivityType] = useState<ActivityType | undefined>(undefined);
  const [activityDurationStr, setActivityDurationStr] = useState('');

  // Sleep
  const [sleepHoursStr, setSleepHoursStr] = useState('');
  const [sleepQuality, setSleepQuality] = useState<number | undefined>(undefined);

  // BP
  const [bpSystolicStr, setBpSystolicStr] = useState('');
  const [bpDiastolicStr, setBpDiastolicStr] = useState('');

  function toggleCategory(cat: Category) {
    setExpanded((prev) => (prev === cat ? null : cat));
  }

  function hasMood() {
    return mood !== undefined;
  }
  function hasActivity() {
    return activityType !== undefined;
  }
  function hasSleep() {
    return sleepHoursStr.trim() !== '' && parseFloat(sleepHoursStr) > 0;
  }
  function hasBP() {
    const sys = parseFloat(bpSystolicStr);
    const dia = parseFloat(bpDiastolicStr);
    return (
      bpSystolicStr.trim() !== '' &&
      bpDiastolicStr.trim() !== '' &&
      !isNaN(sys) &&
      !isNaN(dia) &&
      sys >= 70 && sys <= 250 &&
      dia >= 40 && dia <= 150 &&
      sys > dia
    );
  }

  function getBPError(): string | null {
    const sysRaw = bpSystolicStr.trim();
    const diaRaw = bpDiastolicStr.trim();
    if (sysRaw === '' || diaRaw === '') return null;
    const sys = parseFloat(sysRaw);
    const dia = parseFloat(diaRaw);
    if (isNaN(sys) || isNaN(dia)) return 'Enter valid numbers';
    if (sys < 70 || sys > 250) return 'Systolic should be 70–250 mmHg';
    if (dia < 40 || dia > 150) return 'Diastolic should be 40–150 mmHg';
    if (sys <= dia) return 'Systolic must be greater than diastolic';
    return null;
  }

  function handleComplete() {
    const logs: OptionalLogData = {};

    if (hasMood()) logs.mood = mood;

    if (hasActivity()) {
      logs.activityType = activityType;
      const dur = parseFloat(activityDurationStr);
      if (!isNaN(dur) && dur > 0) logs.activityDurationMin = dur;
    }

    if (hasSleep()) {
      logs.sleepHours = parseFloat(sleepHoursStr);
      if (sleepQuality !== undefined) logs.sleepQuality = sleepQuality;
    }

    if (hasBP()) {
      logs.bpSystolic = parseFloat(bpSystolicStr);
      logs.bpDiastolic = parseFloat(bpDiastolicStr);
    }

    onComplete(logs);
  }

  const bpError = getBPError();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Optional Logs</Text>
      <Text style={styles.subheading}>Log anything else from today</Text>

      {/* Icon row */}
      <View style={styles.iconRow}>
        <CategoryButton
          emoji="😊"
          label="Mood"
          active={expanded === 'mood'}
          done={hasMood()}
          onPress={() => toggleCategory('mood')}
        />
        <CategoryButton
          emoji="🏃"
          label="Activity"
          active={expanded === 'activity'}
          done={hasActivity()}
          onPress={() => toggleCategory('activity')}
        />
        <CategoryButton
          emoji="😴"
          label="Sleep"
          active={expanded === 'sleep'}
          done={hasSleep()}
          onPress={() => toggleCategory('sleep')}
        />
        <CategoryButton
          emoji="💉"
          label="BP"
          active={expanded === 'bp'}
          done={hasBP()}
          onPress={() => toggleCategory('bp')}
        />
      </View>

      {/* Mood section */}
      {expanded === 'mood' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOOD_EMOJIS.map((emoji, i) => {
              const value = i + 1;
              const selected = mood === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.moodButton, selected && styles.moodButtonSelected]}
                  onPress={() => setMood(value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Activity section */}
      {expanded === 'activity' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Activity type</Text>
          <View style={styles.pillsRow}>
            {(Object.keys(ACTIVITY_TYPES) as ActivityType[]).map((type) => {
              const selected = activityType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.pill, selected && styles.pillSelected]}
                  onPress={() => setActivityType(type)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {ACTIVITY_LABELS[type]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.sectionLabel}>Duration (minutes)</Text>
          <TextInput
            style={styles.numericInput}
            value={activityDurationStr}
            onChangeText={setActivityDurationStr}
            keyboardType="numeric"
            placeholder="e.g. 30"
            placeholderTextColor={Colors.text.muted}
            returnKeyType="done"
          />
        </View>
      )}

      {/* Sleep section */}
      {expanded === 'sleep' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Hours of sleep</Text>
          <TextInput
            style={styles.numericInput}
            value={sleepHoursStr}
            onChangeText={setSleepHoursStr}
            keyboardType="numeric"
            placeholder="e.g. 7.5"
            placeholderTextColor={Colors.text.muted}
            returnKeyType="done"
          />
          <Text style={styles.sectionLabel}>Sleep quality</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = sleepQuality !== undefined && star <= sleepQuality;
              return (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSleepQuality(star)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Text style={[styles.star, filled && styles.starFilled]}>
                    {filled ? STAR_FILLED : STAR_EMPTY}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* BP section */}
      {expanded === 'bp' && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Blood Pressure (mmHg)</Text>
          <View style={styles.bpRow}>
            <View style={styles.bpField}>
              <Text style={styles.bpFieldLabel}>Systolic</Text>
              <TextInput
                style={styles.bpInput}
                value={bpSystolicStr}
                onChangeText={setBpSystolicStr}
                keyboardType="numeric"
                placeholder="120"
                placeholderTextColor={Colors.text.muted}
                returnKeyType="done"
                maxLength={3}
              />
            </View>
            <Text style={styles.bpDivider}>/</Text>
            <View style={styles.bpField}>
              <Text style={styles.bpFieldLabel}>Diastolic</Text>
              <TextInput
                style={styles.bpInput}
                value={bpDiastolicStr}
                onChangeText={setBpDiastolicStr}
                keyboardType="numeric"
                placeholder="80"
                placeholderTextColor={Colors.text.muted}
                returnKeyType="done"
                maxLength={3}
              />
            </View>
          </View>
          {bpError !== null && (
            <Text style={styles.errorText}>{bpError}</Text>
          )}
        </View>
      )}

      {/* Complete button */}
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
        activeOpacity={0.85}
      >
        <Text style={styles.completeButtonText}>That's everything</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────────

interface CategoryButtonProps {
  emoji: string;
  label: string;
  active: boolean;
  done: boolean;
  onPress: () => void;
}

function CategoryButton({ emoji, label, active, done, onPress }: CategoryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.categoryButton, active && styles.categoryButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      {done && <Text style={styles.checkmark}>✓</Text>}
      <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.mid,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  heading: {
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  subheading: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    marginTop: -Spacing.xs,
  },

  // Icon row
  iconRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 2,
  },
  categoryButtonActive: {
    borderColor: Colors.s1.primary,
    backgroundColor: Colors.space.nebula,
  },
  categoryEmoji: {
    fontSize: FontSize.xl,
  },
  categoryLabel: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
  },
  categoryLabelActive: {
    color: Colors.s1.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 6,
    color: Colors.star.aurora,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },

  // Shared section
  section: {
    backgroundColor: Colors.space.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  sectionLabel: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Mood
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: Colors.s1.primary,
    backgroundColor: Colors.space.nebula,
  },
  moodEmoji: {
    fontSize: FontSize.lg,
  },

  // Activity pills
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.space.mid,
    borderWidth: 1,
    borderColor: Colors.space.nebula,
  },
  pillSelected: {
    backgroundColor: Colors.s1.primary,
    borderColor: Colors.s1.primary,
  },
  pillText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
  },
  pillTextSelected: {
    color: Colors.text.primary,
    fontWeight: '600',
  },

  // Numeric input
  numericInput: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text.primary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.space.nebula,
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  starButton: {
    padding: Spacing.xs,
  },
  star: {
    fontSize: FontSize.xl,
    color: Colors.text.muted,
  },
  starFilled: {
    color: Colors.star.gold,
  },

  // BP
  bpRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  bpField: {
    flex: 1,
    gap: Spacing.xs,
  },
  bpFieldLabel: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  bpInput: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text.primary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.space.nebula,
    textAlign: 'center',
  },
  bpDivider: {
    color: Colors.text.secondary,
    fontSize: FontSize.xl,
    fontWeight: '300',
    marginBottom: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    marginTop: -Spacing.xs,
  },

  // Complete button
  completeButton: {
    backgroundColor: Colors.s1.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  completeButtonText: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
