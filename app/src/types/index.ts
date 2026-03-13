/**
 * S1S2 Core Type Definitions
 */

// ─── Ship ───────────────────────────────────────
export type ShipClass = 'pod' | 'scout' | 'cruiser' | 'explorer' | 'flagship';

export const SHIP_CLASS_XP: Record<ShipClass, number> = {
  pod: 0,
  scout: 1000,
  cruiser: 5000,
  explorer: 15000,
  flagship: 50000,
};

// ─── Vitals ─────────────────────────────────────
export type MetricType =
  | 'heart_rate'
  | 'resting_heart_rate'
  | 'hrv'
  | 'spo2'
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic'
  | 'sleep_hours'
  | 'sleep_quality'
  | 'mood'
  | 'activity_type'
  | 'activity_duration';

export type VitalSource =
  | 'camera_ppg'
  | 'manual'
  | 'healthkit'
  | 'health_connect'
  | 'wearable';

export interface ScanResult {
  id: string;
  sessionId: string;
  metricType: MetricType;
  value: number;
  unit: string;
  confidence: number;
  source: VitalSource;
  deviceModel?: string;
  osVersion?: string;
  ambientLight?: 'bright' | 'normal' | 'low';
  motionDetected?: boolean;
  rawSignalQuality?: number;
  createdAt: string;
}

export interface VitalsSnapshot {
  heartRate?: number;
  restingHeartRate?: number;
  hrv?: number;
  spo2?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  sleepHours?: number;
  mood?: number; // 1-5
}

// ─── Creatures ──────────────────────────────────
export type ResonanceClass = 's1' | 's2' | 'harmonic';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface CreatureSpecies {
  id: string;
  name: string;
  resonanceClass: ResonanceClass;
  rarity: Rarity;
  loreText: string;
  fieldNotes: string;
  discoveryHint: string;
  discoveryConditions: string;
  triggerType: string;
  triggerConfig: Record<string, unknown>;
  sortOrder: number;
}

export interface CreatureDiscovery {
  id: string;
  speciesId: string;
  discoveryScanId?: string;
  variantHue: number;
  variantPatternDensity: number;
  variantGlowIntensity: number;
  variantSizeModifier: number;
  variantAccentColor: string;
  discoverySystemId: string;
  discoveryBiome: string;
  nickname?: string;
  isFavorite: boolean;
  discoveredAt: string;
}

// ─── Galaxy ─────────────────────────────────────
export type SystemType =
  | 'nebula'
  | 'asteroid_field'
  | 'gas_giant'
  | 'binary_star'
  | 'deep_void'
  | 'stellar_nursery'
  | 'pulsar'
  | 'black_hole';

export interface StarSystem {
  index: number;
  type: SystemType;
  name: string;
  colorHSL: { h: number; s: number; l: number };
  planets: Planet[];
  hasEcho: boolean;
  hasListeningPost: boolean;
  isResonanceGate: boolean;
  visitedAt?: string;
}

export interface Planet {
  name: string;
  creatureSpeciesId?: string;
  discovered: boolean;
}

export interface JourneyProgress {
  galaxySeed: string;
  currentSystemIndex: number;
  currentSystemName?: string;
  totalSystemsVisited: number;
  totalFuelEarned: number;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  streakGraceExpiresAt?: string;
  shipClass: ShipClass;
  lastTravelAt?: string;
}

// ─── Fuel ───────────────────────────────────────
export interface FuelLog {
  heartRateCheckins: number;  // max 3.0/day
  bpLogs: number;             // max 1.0/day
  sleepLogs: number;          // max 0.5/day
  moodLogs: number;           // max 0.25/day
  activityLogs: number;       // max 0.25/day
  streakBonus: number;        // +0.1 per streak day, max +3.0
}

// ─── Music ──────────────────────────────────────
export type PlaybackMode = 'today' | 'week' | 'journey' | 's1_vs_s2' | 'compare';

export interface MusicSession {
  id: string;
  mode: PlaybackMode;
  durationSeconds: number;
  biome: string;
  creatureVoices: string[];
  s1FundamentalHz: number;
  s2FundamentalHz: number;
  generatedAt: string;
}

// ─── User ───────────────────────────────────────
export interface UserProfile {
  id: string;
  displayName: string;
  shipName: string;
  shipClass: ShipClass;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  onboardingCompleted: boolean;
}

// ─── Preferences (SQLite singleton) ────────────
export interface UserPreferences {
  captainName: string | null;
  shipName: string;
  reminderEnabled: boolean;
  reminderTime: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  theme: 'auto' | 'light' | 'dark';
  onboardingCompleted: boolean;
}

// ─── Achievements ───────────────────────────────
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  unlockedAt?: string;
}
