export const ACTIVITY_TYPES = {
  walk: 1,
  run: 2,
  cycle: 3,
  gym: 4,
  yoga: 5,
  other: 6,
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  walk: 'Walk',
  run: 'Run',
  cycle: 'Cycle',
  gym: 'Gym',
  yoga: 'Yoga',
  other: 'Other',
};
