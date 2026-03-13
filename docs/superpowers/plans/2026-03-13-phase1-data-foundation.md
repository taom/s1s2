# Phase 1: Data Foundation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up real SQLite persistence and zustand state management so the app has a functioning data layer.

**Architecture:** Store-first pattern — app starts, SQLite initializes, stores hydrate from DB, UI reads from stores, writes update store + SQLite together. Music store is pure in-memory (no persistence).

**Tech Stack:** expo-sqlite (Expo SDK 55), zustand, TypeScript strict mode, expo-router

**Spec:** `docs/superpowers/specs/2026-03-13-phase1-data-foundation-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `app/package.json` | Modify | Add zustand, expo-sqlite deps |
| `app/src/types/index.ts` | Modify | Add `UserPreferences`, fix `ScanResult`/`JourneyProgress`/`CreatureDiscovery` |
| `app/src/services/database.ts` | Rewrite | Real expo-sqlite singleton + CRUD helpers |
| `app/src/services/hydrate.ts` | Create | Startup store population from SQLite |
| `app/src/stores/user-store.ts` | Rewrite | Real zustand + SQLite persistence |
| `app/src/stores/journey-store.ts` | Rewrite | Real zustand + SQLite persistence |
| `app/src/stores/creature-store.ts` | Rewrite | Real zustand + SQLite persistence |
| `app/src/stores/music-store.ts` | Rewrite | Real zustand (in-memory only) |
| `app/src/app/index.tsx` | Modify | Read onboarding state from store |
| `app/src/app/_layout.tsx` | Modify | DB init + hydration + splash control |

---

## Chunk 1: Dependencies and Types

### Task 1: Install dependencies

**Files:**
- Modify: `app/package.json`

- [ ] **Step 1: Install zustand and expo-sqlite**

Run from `app/` directory:
```bash
npx expo install expo-sqlite zustand
```

- [ ] **Step 2: Verify installation**

Run: `cat app/package.json | grep -E "zustand|expo-sqlite"`
Expected: both packages appear in dependencies

- [ ] **Step 3: Commit**

```bash
git add app/package.json app/package-lock.json
git commit -m "chore: install zustand and expo-sqlite"
```

---

### Task 2: Fix types to match SQLite schema

**Files:**
- Modify: `app/src/types/index.ts`

- [ ] **Step 1: Add UserPreferences interface**

Add after the `UserProfile` interface (after line 168):

```typescript
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
```

- [ ] **Step 2: Add missing fields to ScanResult**

Add optional device/quality fields to the `ScanResult` interface (after `createdAt`):

```typescript
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
```

- [ ] **Step 3: Add missing fields to JourneyProgress**

Add `currentSystemName` to the `JourneyProgress` interface:

```typescript
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
```

- [ ] **Step 4: Add missing field to CreatureDiscovery**

Add `discoveryScanId` to the `CreatureDiscovery` interface:

```typescript
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
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`
Expected: no errors (or only pre-existing ones from placeholder stores)

- [ ] **Step 6: Commit**

```bash
git add app/src/types/index.ts
git commit -m "feat: add UserPreferences type, fix ScanResult/JourneyProgress/CreatureDiscovery to match schema"
```

---

## Chunk 2: Database Service

### Task 3: Rewrite database.ts with real expo-sqlite

**Files:**
- Rewrite: `app/src/services/database.ts`

- [ ] **Step 1: Write the complete database service**

Replace the entire file with:

```typescript
/**
 * Local Database (expo-sqlite)
 *
 * The device-authoritative store for all user-generated data.
 * Every write lands here first. The sync queue handles upstream
 * replication to Supabase (Phase 4).
 *
 * Invariant: initDatabase() must resolve before any call to getDatabase().
 */

import * as SQLite from 'expo-sqlite';
import type {
  ScanResult,
  MetricType,
  JourneyProgress,
  CreatureDiscovery,
  UserPreferences,
} from '@/types';

const DB_NAME = 's1s2.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * SQL schema for local database initialization.
 * Runs on first app launch via CREATE TABLE IF NOT EXISTS.
 */
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS scan_results (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK(metric_type IN (
    'heart_rate', 'resting_heart_rate', 'hrv', 'spo2',
    'blood_pressure_systolic', 'blood_pressure_diastolic',
    'sleep_hours', 'sleep_quality', 'mood', 'activity_type', 'activity_duration'
  )),
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  confidence REAL NOT NULL CHECK(confidence >= 0.0 AND confidence <= 1.0),
  source TEXT NOT NULL CHECK(source IN ('camera_ppg', 'manual', 'healthkit', 'health_connect', 'wearable')),
  device_model TEXT,
  os_version TEXT,
  ambient_light TEXT CHECK(ambient_light IN ('bright', 'normal', 'low')),
  motion_detected INTEGER DEFAULT 0,
  raw_signal_quality REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS creatures (
  id TEXT PRIMARY KEY,
  species_id TEXT NOT NULL,
  discovery_scan_id TEXT REFERENCES scan_results(id),
  variant_hue REAL,
  variant_pattern_density REAL,
  variant_glow_intensity REAL,
  variant_size_modifier REAL,
  variant_accent_color TEXT,
  discovery_system_id TEXT,
  discovery_biome TEXT,
  nickname TEXT,
  is_favorite INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS journey_progress (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  galaxy_seed TEXT NOT NULL,
  current_system_index INTEGER NOT NULL DEFAULT 0,
  current_system_name TEXT,
  total_systems_visited INTEGER NOT NULL DEFAULT 0,
  total_fuel_earned REAL NOT NULL DEFAULT 0.0,
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  streak_grace_expires_at TEXT,
  ship_class TEXT NOT NULL DEFAULT 'pod',
  last_travel_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  captain_name TEXT,
  ship_name TEXT DEFAULT 'Unnamed Vessel',
  reminder_enabled INTEGER DEFAULT 1,
  reminder_time TEXT DEFAULT '09:00',
  quiet_hours_start TEXT DEFAULT '22:00',
  quiet_hours_end TEXT DEFAULT '07:00',
  haptics_enabled INTEGER DEFAULT 1,
  reduce_motion INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'auto',
  onboarding_completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL CHECK(operation IN ('INSERT', 'UPDATE', 'DELETE')),
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_flight', 'synced', 'failed', 'conflict')),
  error_message TEXT,
  UNIQUE(table_name, record_id, operation, created_at)
);

CREATE INDEX IF NOT EXISTS idx_scan_results_session ON scan_results(session_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created ON scan_results(created_at);
CREATE INDEX IF NOT EXISTS idx_scan_results_metric ON scan_results(metric_type);
CREATE INDEX IF NOT EXISTS idx_creatures_species ON creatures(species_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
`;

// ─── Lifecycle ──────────────────────────────────

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(SCHEMA_SQL);
  console.log('[DB] Database initialized');
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

// ─── Scan Results ───────────────────────────────

export async function insertScanResult(
  scan: Omit<ScanResult, 'createdAt'>
): Promise<void> {
  try {
    const d = getDatabase();
    await d.runAsync(
      `INSERT INTO scan_results (id, session_id, metric_type, value, unit, confidence, source, device_model, os_version, ambient_light, motion_detected, raw_signal_quality)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      scan.id,
      scan.sessionId,
      scan.metricType,
      scan.value,
      scan.unit,
      scan.confidence,
      scan.source,
      scan.deviceModel ?? null,
      scan.osVersion ?? null,
      scan.ambientLight ?? null,
      scan.motionDetected ? 1 : 0,
      scan.rawSignalQuality ?? null
    );
  } catch (e) {
    console.error('[DB] insertScanResult failed:', e);
  }
}

export async function getScanResults(
  opts?: { limit?: number; metricType?: MetricType }
): Promise<ScanResult[]> {
  const d = getDatabase();
  let sql = 'SELECT * FROM scan_results';
  const params: unknown[] = [];

  if (opts?.metricType) {
    sql += ' WHERE metric_type = ?';
    params.push(opts.metricType);
  }

  sql += ' ORDER BY created_at DESC';

  if (opts?.limit) {
    sql += ' LIMIT ?';
    params.push(opts.limit);
  }

  const rows = await d.getAllAsync(sql, params);
  return (rows as Record<string, unknown>[]).map(rowToScanResult);
}

export async function getLatestScanByType(
  metricType: MetricType
): Promise<ScanResult | null> {
  const d = getDatabase();
  const row = await d.getFirstAsync(
    'SELECT * FROM scan_results WHERE metric_type = ? ORDER BY created_at DESC LIMIT 1',
    metricType
  );
  return row ? rowToScanResult(row as Record<string, unknown>) : null;
}

export async function getTodayScanResults(): Promise<ScanResult[]> {
  const d = getDatabase();
  const rows = await d.getAllAsync(
    "SELECT * FROM scan_results WHERE date(created_at) = date('now') ORDER BY created_at DESC"
  );
  return (rows as Record<string, unknown>[]).map(rowToScanResult);
}

function rowToScanResult(row: Record<string, unknown>): ScanResult {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    metricType: row.metric_type as MetricType,
    value: row.value as number,
    unit: row.unit as string,
    confidence: row.confidence as number,
    source: row.source as ScanResult['source'],
    deviceModel: row.device_model as string | undefined,
    osVersion: row.os_version as string | undefined,
    ambientLight: row.ambient_light as ScanResult['ambientLight'],
    motionDetected: row.motion_detected != null ? row.motion_detected === 1 : undefined,
    rawSignalQuality: row.raw_signal_quality as number | undefined,
    createdAt: row.created_at as string,
  };
}

// ─── Journey Progress ───────────────────────────

export async function getJourneyProgress(): Promise<JourneyProgress | null> {
  const d = getDatabase();
  const row = await d.getFirstAsync(
    "SELECT * FROM journey_progress WHERE id = 'singleton'"
  );
  return row ? rowToJourneyProgress(row as Record<string, unknown>) : null;
}

export async function upsertJourneyProgress(
  progress: JourneyProgress
): Promise<void> {
  try {
    const d = getDatabase();
    await d.runAsync(
      `INSERT INTO journey_progress (id, galaxy_seed, current_system_index, current_system_name, total_systems_visited, total_fuel_earned, total_xp_earned, current_streak, longest_streak, streak_grace_expires_at, ship_class, last_travel_at, updated_at)
       VALUES ('singleton', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         galaxy_seed = excluded.galaxy_seed,
         current_system_index = excluded.current_system_index,
         current_system_name = excluded.current_system_name,
         total_systems_visited = excluded.total_systems_visited,
         total_fuel_earned = excluded.total_fuel_earned,
         total_xp_earned = excluded.total_xp_earned,
         current_streak = excluded.current_streak,
         longest_streak = excluded.longest_streak,
         streak_grace_expires_at = excluded.streak_grace_expires_at,
         ship_class = excluded.ship_class,
         last_travel_at = excluded.last_travel_at,
         updated_at = datetime('now')`,
      progress.galaxySeed,
      progress.currentSystemIndex,
      progress.currentSystemName ?? null,
      progress.totalSystemsVisited,
      progress.totalFuelEarned,
      progress.totalXpEarned,
      progress.currentStreak,
      progress.longestStreak,
      progress.streakGraceExpiresAt ?? null,
      progress.shipClass,
      progress.lastTravelAt ?? null
    );
  } catch (e) {
    console.error('[DB] upsertJourneyProgress failed:', e);
  }
}

function rowToJourneyProgress(row: Record<string, unknown>): JourneyProgress {
  return {
    galaxySeed: row.galaxy_seed as string,
    currentSystemIndex: row.current_system_index as number,
    currentSystemName: row.current_system_name as string | undefined,
    totalSystemsVisited: row.total_systems_visited as number,
    totalFuelEarned: row.total_fuel_earned as number,
    totalXpEarned: row.total_xp_earned as number,
    currentStreak: row.current_streak as number,
    longestStreak: row.longest_streak as number,
    streakGraceExpiresAt: row.streak_grace_expires_at as string | undefined,
    shipClass: row.ship_class as JourneyProgress['shipClass'],
    lastTravelAt: row.last_travel_at as string | undefined,
  };
}

// ─── User Preferences ───────────────────────────

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const d = getDatabase();
  const row = await d.getFirstAsync(
    "SELECT * FROM user_preferences WHERE id = 'singleton'"
  );
  return row ? rowToUserPreferences(row as Record<string, unknown>) : null;
}

export async function upsertUserPreferences(
  prefs: Partial<UserPreferences>
): Promise<void> {
  try {
    const d = getDatabase();
    const current = await getUserPreferences();

    if (!current) {
      await d.runAsync(
        `INSERT INTO user_preferences (id, captain_name, ship_name, reminder_enabled, reminder_time, quiet_hours_start, quiet_hours_end, haptics_enabled, reduce_motion, theme, onboarding_completed)
         VALUES ('singleton', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        prefs.captainName ?? null,
        prefs.shipName ?? 'Unnamed Vessel',
        prefs.reminderEnabled !== false ? 1 : 0,
        prefs.reminderTime ?? '09:00',
        prefs.quietHoursStart ?? '22:00',
        prefs.quietHoursEnd ?? '07:00',
        prefs.hapticsEnabled !== false ? 1 : 0,
        prefs.reduceMotion ? 1 : 0,
        prefs.theme ?? 'auto',
        prefs.onboardingCompleted ? 1 : 0
      );
    } else {
      const merged = { ...current, ...prefs };
      await d.runAsync(
        `UPDATE user_preferences SET
           captain_name = ?,
           ship_name = ?,
           reminder_enabled = ?,
           reminder_time = ?,
           quiet_hours_start = ?,
           quiet_hours_end = ?,
           haptics_enabled = ?,
           reduce_motion = ?,
           theme = ?,
           onboarding_completed = ?,
           updated_at = datetime('now')
         WHERE id = 'singleton'`,
        merged.captainName ?? null,
        merged.shipName,
        merged.reminderEnabled ? 1 : 0,
        merged.reminderTime,
        merged.quietHoursStart,
        merged.quietHoursEnd,
        merged.hapticsEnabled ? 1 : 0,
        merged.reduceMotion ? 1 : 0,
        merged.theme,
        merged.onboardingCompleted ? 1 : 0
      );
    }
  } catch (e) {
    console.error('[DB] upsertUserPreferences failed:', e);
  }
}

function rowToUserPreferences(row: Record<string, unknown>): UserPreferences {
  return {
    captainName: row.captain_name as string | null,
    shipName: row.ship_name as string,
    reminderEnabled: row.reminder_enabled === 1,
    reminderTime: row.reminder_time as string,
    quietHoursStart: row.quiet_hours_start as string,
    quietHoursEnd: row.quiet_hours_end as string,
    hapticsEnabled: row.haptics_enabled === 1,
    reduceMotion: row.reduce_motion === 1,
    theme: row.theme as UserPreferences['theme'],
    onboardingCompleted: row.onboarding_completed === 1,
  };
}

// ─── Creatures ──────────────────────────────────

export async function insertCreatureDiscovery(
  creature: Omit<CreatureDiscovery, 'discoveredAt'>
): Promise<void> {
  try {
    const d = getDatabase();
    await d.runAsync(
      `INSERT INTO creatures (id, species_id, discovery_scan_id, variant_hue, variant_pattern_density, variant_glow_intensity, variant_size_modifier, variant_accent_color, discovery_system_id, discovery_biome, nickname, is_favorite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      creature.id,
      creature.speciesId,
      creature.discoveryScanId ?? null,
      creature.variantHue,
      creature.variantPatternDensity,
      creature.variantGlowIntensity,
      creature.variantSizeModifier,
      creature.variantAccentColor,
      creature.discoverySystemId,
      creature.discoveryBiome,
      creature.nickname ?? null,
      creature.isFavorite ? 1 : 0
    );
  } catch (e) {
    console.error('[DB] insertCreatureDiscovery failed:', e);
  }
}

export async function getCreatureDiscoveries(): Promise<CreatureDiscovery[]> {
  const d = getDatabase();
  const rows = await d.getAllAsync(
    'SELECT * FROM creatures ORDER BY created_at DESC'
  );
  return (rows as Record<string, unknown>[]).map(rowToCreatureDiscovery);
}

export async function updateCreatureDiscovery(
  id: string,
  updates: Partial<CreatureDiscovery>
): Promise<void> {
  try {
    const d = getDatabase();
    const sets: string[] = [];
    const params: unknown[] = [];

    if (updates.nickname !== undefined) {
      sets.push('nickname = ?');
      params.push(updates.nickname);
    }
    if (updates.isFavorite !== undefined) {
      sets.push('is_favorite = ?');
      params.push(updates.isFavorite ? 1 : 0);
    }

    if (sets.length === 0) return;

    sets.push("updated_at = datetime('now')");
    params.push(id);

    await d.runAsync(
      `UPDATE creatures SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
  } catch (e) {
    console.error('[DB] updateCreatureDiscovery failed:', e);
  }
}

function rowToCreatureDiscovery(row: Record<string, unknown>): CreatureDiscovery {
  return {
    id: row.id as string,
    speciesId: row.species_id as string,
    discoveryScanId: row.discovery_scan_id as string | undefined,
    variantHue: row.variant_hue as number,
    variantPatternDensity: row.variant_pattern_density as number,
    variantGlowIntensity: row.variant_glow_intensity as number,
    variantSizeModifier: row.variant_size_modifier as number,
    variantAccentColor: row.variant_accent_color as string,
    discoverySystemId: row.discovery_system_id as string,
    discoveryBiome: row.discovery_biome as string,
    nickname: row.nickname as string | undefined,
    isFavorite: row.is_favorite === 1,
    discoveredAt: row.created_at as string,
  };
}

// ─── Sync Queue (Phase 4 — signature only) ─────

export async function enqueueSyncOp(op: {
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
}): Promise<void> {
  try {
    const d = getDatabase();
    const id = `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await d.runAsync(
      `INSERT INTO sync_queue (id, table_name, record_id, operation, payload)
       VALUES (?, ?, ?, ?, ?)`,
      id,
      op.tableName,
      op.recordId,
      op.operation,
      JSON.stringify(op.payload)
    );
  } catch (e) {
    console.error('[DB] enqueueSyncOp failed:', e);
  }
}

export { DB_NAME };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`
Expected: no errors from database.ts

- [ ] **Step 3: Commit**

```bash
git add app/src/services/database.ts
git commit -m "feat: wire up database.ts with real expo-sqlite and CRUD helpers"
```

---

## Chunk 3: Zustand Stores

### Task 4: Rewrite user-store with real zustand

**Files:**
- Rewrite: `app/src/stores/user-store.ts`

- [ ] **Step 1: Write the real user store**

```typescript
import { create } from 'zustand';
import type { ShipClass, UserProfile, UserPreferences, JourneyProgress } from '@/types';
import { upsertUserPreferences } from '@/services/database';

export interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  isOnboarded: boolean;

  setCaptainName: (name: string) => void;
  setShipName: (name: string) => void;
  completeOnboarding: () => void;
  hydrate: (prefs: UserPreferences | null, journey: JourneyProgress | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  preferences: null,
  isOnboarded: false,

  hydrate: (prefs, journey) => {
    if (!prefs) {
      set({ profile: null, preferences: null, isOnboarded: false });
      return;
    }

    const profile: UserProfile = {
      id: 'local-captain',
      displayName: prefs.captainName ?? 'Captain',
      shipName: prefs.shipName,
      shipClass: journey?.shipClass ?? 'pod',
      xp: journey?.totalXpEarned ?? 0,
      currentStreak: journey?.currentStreak ?? 0,
      longestStreak: journey?.longestStreak ?? 0,
      onboardingCompleted: prefs.onboardingCompleted,
    };

    set({
      profile,
      preferences: prefs,
      isOnboarded: prefs.onboardingCompleted,
    });
  },

  setCaptainName: (name) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, displayName: name } : null,
      preferences: state.preferences ? { ...state.preferences, captainName: name } : null,
    }));
    upsertUserPreferences({ captainName: name });
  },

  setShipName: (name) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, shipName: name } : null,
      preferences: state.preferences ? { ...state.preferences, shipName: name } : null,
    }));
    upsertUserPreferences({ shipName: name });
  },

  completeOnboarding: () => {
    set((state) => ({
      isOnboarded: true,
      profile: state.profile ? { ...state.profile, onboardingCompleted: true } : null,
      preferences: state.preferences ? { ...state.preferences, onboardingCompleted: true } : null,
    }));
    upsertUserPreferences({ onboardingCompleted: true });
  },
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/src/stores/user-store.ts
git commit -m "feat: replace user-store placeholder with real zustand + SQLite"
```

---

### Task 5: Rewrite journey-store with real zustand

**Files:**
- Rewrite: `app/src/stores/journey-store.ts`

- [ ] **Step 1: Write the real journey store**

```typescript
import { create } from 'zustand';
import type { JourneyProgress, StarSystem, FuelLog, ShipClass, ScanResult } from '@/types';
import { SHIP_CLASS_XP } from '@/types';
import { upsertJourneyProgress } from '@/services/database';

export interface JourneyState {
  progress: JourneyProgress | null;
  systems: StarSystem[];
  currentSystemIndex: number;
  todayFuel: FuelLog;

  setProgress: (progress: JourneyProgress) => void;
  addFuel: (amount: number, source: keyof FuelLog) => void;
  travel: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  initJourney: (galaxySeed: string) => void;
  hydrate: (progress: JourneyProgress | null, todayScans: ScanResult[]) => void;
}

const EMPTY_FUEL: FuelLog = {
  heartRateCheckins: 0,
  bpLogs: 0,
  sleepLogs: 0,
  moodLogs: 0,
  activityLogs: 0,
  streakBonus: 0,
};

function computeTodayFuel(scans: ScanResult[]): FuelLog {
  const fuel = { ...EMPTY_FUEL };
  for (const scan of scans) {
    switch (scan.metricType) {
      case 'heart_rate':
      case 'resting_heart_rate':
        fuel.heartRateCheckins = Math.min(3, fuel.heartRateCheckins + 1);
        break;
      case 'blood_pressure_systolic':
      case 'blood_pressure_diastolic':
        fuel.bpLogs = Math.min(1, fuel.bpLogs + 0.5);
        break;
      case 'sleep_hours':
      case 'sleep_quality':
        fuel.sleepLogs = Math.min(0.5, fuel.sleepLogs + 0.25);
        break;
      case 'mood':
        fuel.moodLogs = Math.min(0.25, fuel.moodLogs + 0.25);
        break;
      case 'activity_type':
      case 'activity_duration':
        fuel.activityLogs = Math.min(0.25, fuel.activityLogs + 0.125);
        break;
    }
  }
  return fuel;
}

function getTotalFuel(fuel: FuelLog): number {
  return fuel.heartRateCheckins + fuel.bpLogs + fuel.sleepLogs +
         fuel.moodLogs + fuel.activityLogs + fuel.streakBonus;
}

function computeShipClass(xp: number): ShipClass {
  if (xp >= SHIP_CLASS_XP.flagship) return 'flagship';
  if (xp >= SHIP_CLASS_XP.explorer) return 'explorer';
  if (xp >= SHIP_CLASS_XP.cruiser) return 'cruiser';
  if (xp >= SHIP_CLASS_XP.scout) return 'scout';
  return 'pod';
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  progress: null,
  systems: [],
  currentSystemIndex: 0,
  todayFuel: { ...EMPTY_FUEL },

  hydrate: (progress, todayScans) => {
    const todayFuel = computeTodayFuel(todayScans);
    if (progress) {
      todayFuel.streakBonus = Math.min(3, progress.currentStreak * 0.1);
    }
    set({
      progress,
      currentSystemIndex: progress?.currentSystemIndex ?? 0,
      todayFuel,
    });
  },

  setProgress: (progress) => {
    set({ progress, currentSystemIndex: progress.currentSystemIndex });
    upsertJourneyProgress(progress);
  },

  addFuel: (amount, source) => {
    set((state) => {
      const todayFuel = { ...state.todayFuel, [source]: state.todayFuel[source] + amount };
      const progress = state.progress
        ? { ...state.progress, totalFuelEarned: state.progress.totalFuelEarned + amount }
        : null;
      return { todayFuel, progress };
    });
    const { progress } = get();
    if (progress) upsertJourneyProgress(progress);
  },

  travel: () => {
    const { progress: current, todayFuel } = get();
    if (!current) return;
    const fuel = getTotalFuel(todayFuel);
    if (fuel < 0.5) return; // minimum fuel to travel

    const xpGain = Math.floor(fuel * 100);
    const newXp = current.totalXpEarned + xpGain;
    const progress: JourneyProgress = {
      ...current,
      currentSystemIndex: current.currentSystemIndex + 1,
      totalSystemsVisited: current.totalSystemsVisited + 1,
      totalXpEarned: newXp,
      shipClass: computeShipClass(newXp),
      lastTravelAt: new Date().toISOString(),
    };
    set({ progress, currentSystemIndex: progress.currentSystemIndex });
    upsertJourneyProgress(progress);
  },

  incrementStreak: () => {
    const current = get().progress;
    if (!current) return;
    const newStreak = current.currentStreak + 1;
    const progress: JourneyProgress = {
      ...current,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, current.longestStreak),
    };
    set((state) => ({
      progress,
      todayFuel: { ...state.todayFuel, streakBonus: Math.min(3, newStreak * 0.1) },
    }));
    upsertJourneyProgress(progress);
  },

  resetStreak: () => {
    const current = get().progress;
    if (!current) return;
    const progress: JourneyProgress = { ...current, currentStreak: 0 };
    set((state) => ({
      progress,
      todayFuel: { ...state.todayFuel, streakBonus: 0 },
    }));
    upsertJourneyProgress(progress);
  },

  initJourney: (galaxySeed) => {
    const progress: JourneyProgress = {
      galaxySeed,
      currentSystemIndex: 0,
      totalSystemsVisited: 0,
      totalFuelEarned: 0,
      totalXpEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      shipClass: 'pod',
    };
    set({ progress, currentSystemIndex: 0, todayFuel: { ...EMPTY_FUEL } });
    upsertJourneyProgress(progress);
  },
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/src/stores/journey-store.ts
git commit -m "feat: replace journey-store placeholder with real zustand + SQLite"
```

---

### Task 6: Rewrite creature-store with real zustand

**Files:**
- Rewrite: `app/src/stores/creature-store.ts`

- [ ] **Step 1: Write the real creature store**

```typescript
import { create } from 'zustand';
import type { CreatureDiscovery, CreatureSpecies, ResonanceClass, Rarity } from '@/types';
import { insertCreatureDiscovery, updateCreatureDiscovery } from '@/services/database';
import { MVP_CREATURES } from '@/constants/creatures';

export interface CreatureState {
  species: CreatureSpecies[];
  discoveries: CreatureDiscovery[];
  filterClass: ResonanceClass | 'all';
  filterRarity: Rarity | 'all';

  setSpecies: (species: CreatureSpecies[]) => void;
  addDiscovery: (discovery: Omit<CreatureDiscovery, 'discoveredAt'>) => void;
  setFilter: (filterClass: ResonanceClass | 'all') => void;
  setRarityFilter: (filterRarity: Rarity | 'all') => void;
  toggleFavorite: (discoveryId: string) => void;
  hydrate: (discoveries: CreatureDiscovery[]) => void;
}

export const useCreatureStore = create<CreatureState>((set, get) => ({
  species: MVP_CREATURES,
  discoveries: [],
  filterClass: 'all',
  filterRarity: 'all',

  hydrate: (discoveries) => {
    set({ discoveries });
  },

  setSpecies: (species) => set({ species }),

  addDiscovery: (discovery) => {
    const full: CreatureDiscovery = {
      ...discovery,
      discoveredAt: new Date().toISOString(),
    };
    set((state) => ({ discoveries: [full, ...state.discoveries] }));
    insertCreatureDiscovery(discovery);
  },

  setFilter: (filterClass) => set({ filterClass }),

  setRarityFilter: (filterRarity) => set({ filterRarity }),

  toggleFavorite: (discoveryId) => {
    const current = get().discoveries.find((d) => d.id === discoveryId);
    if (!current) return;
    const newFav = !current.isFavorite;
    set((state) => ({
      discoveries: state.discoveries.map((d) =>
        d.id === discoveryId ? { ...d, isFavorite: newFav } : d
      ),
    }));
    updateCreatureDiscovery(discoveryId, { isFavorite: newFav });
  },
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/src/stores/creature-store.ts
git commit -m "feat: replace creature-store placeholder with real zustand + SQLite"
```

---

### Task 7: Rewrite music-store with real zustand

**Files:**
- Rewrite: `app/src/stores/music-store.ts`

- [ ] **Step 1: Write the real music store**

Keep the existing `restingHRToS1Frequency` and `s1ToS2Frequency` helper functions. Replace only the placeholder store:

```typescript
import { create } from 'zustand';
import type { PlaybackMode, MusicSession } from '@/types';

export interface MusicState {
  isPlaying: boolean;
  currentMode: PlaybackMode | null;
  currentSession: MusicSession | null;
  s1FrequencyHz: number;
  s2FrequencyHz: number;
  layers: {
    fundamentals: boolean;
    biomeBed: boolean;
    creatureVoices: boolean;
    vitalModulation: boolean;
    events: boolean;
  };

  play: (mode: PlaybackMode) => void;
  pause: () => void;
  updateFundamentals: (restingHR: number) => void;
  toggleLayer: (layer: keyof MusicState['layers']) => void;
}

/**
 * Maps resting heart rate to S1 fundamental frequency.
 * Based on the Sound Design Spec in the Product Bible.
 */
export function restingHRToS1Frequency(restingHR: number): number {
  const map: [number, number][] = [
    [55, 55.0],   // A1
    [60, 61.7],   // B1
    [65, 65.4],   // C2
    [70, 73.4],   // D2
    [75, 82.4],   // E2
    [80, 87.3],   // F2
    [85, 98.0],   // G2
    [90, 110.0],  // A2
  ];

  const clamped = Math.max(55, Math.min(90, restingHR));

  for (let i = 0; i < map.length - 1; i++) {
    const [hrLow, freqLow] = map[i];
    const [hrHigh, freqHigh] = map[i + 1];
    if (clamped >= hrLow && clamped <= hrHigh) {
      const t = (clamped - hrLow) / (hrHigh - hrLow);
      return freqLow + t * (freqHigh - freqLow);
    }
  }

  return 65.4; // default C2
}

/**
 * S2 is always a perfect fifth above S1.
 */
export function s1ToS2Frequency(s1Hz: number): number {
  return s1Hz * 1.5;
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  currentMode: null,
  currentSession: null,
  s1FrequencyHz: 65.4,
  s2FrequencyHz: 98.0,
  layers: {
    fundamentals: true,
    biomeBed: true,
    creatureVoices: true,
    vitalModulation: true,
    events: true,
  },

  play: (mode) => set({ isPlaying: true, currentMode: mode }),

  pause: () => set({ isPlaying: false }),

  updateFundamentals: (restingHR) => {
    const s1 = restingHRToS1Frequency(restingHR);
    set({ s1FrequencyHz: s1, s2FrequencyHz: s1ToS2Frequency(s1) });
  },

  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/src/stores/music-store.ts
git commit -m "feat: replace music-store placeholder with real zustand (in-memory)"
```

---

## Chunk 4: Hydration and Root Layout

### Task 8: Create hydrate.ts service

**Files:**
- Create: `app/src/services/hydrate.ts`

- [ ] **Step 1: Write the hydration service**

```typescript
/**
 * Store Hydration Service
 *
 * Reads SQLite and populates all zustand stores on app startup.
 * Called once from the root layout after initDatabase() resolves.
 */

import {
  getUserPreferences,
  getJourneyProgress,
  getCreatureDiscoveries,
  getTodayScanResults,
} from '@/services/database';
import { useUserStore } from '@/stores/user-store';
import { useJourneyStore } from '@/stores/journey-store';
import { useCreatureStore } from '@/stores/creature-store';

export async function hydrateStores(): Promise<{ isOnboarded: boolean }> {
  const [prefs, journey, discoveries, todayScans] = await Promise.all([
    getUserPreferences(),
    getJourneyProgress(),
    getCreatureDiscoveries(),
    getTodayScanResults(),
  ]);

  useUserStore.getState().hydrate(prefs, journey);
  useJourneyStore.getState().hydrate(journey, todayScans);
  useCreatureStore.getState().hydrate(discoveries);

  return { isOnboarded: prefs?.onboardingCompleted ?? false };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add app/src/services/hydrate.ts
git commit -m "feat: add store hydration service for startup"
```

---

### Task 9: Wire up root layout with DB init and hydration

**Files:**
- Modify: `app/src/app/_layout.tsx`
- Modify: `app/src/app/index.tsx`

- [ ] **Step 1: Update _layout.tsx**

Replace the entire file:

```typescript
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { initDatabase } from '@/services/database';
import { hydrateStores } from '@/services/hydrate';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initDatabase();
        await hydrateStores();
      } catch (e) {
        console.error('[App] Bootstrap failed:', e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    bootstrap();
  }, []);

  if (!isReady) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0E1A' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="checkin"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="creature-discovery"
          options={{ presentation: 'fullScreenModal', animation: 'fade' }}
        />
      </Stack>
    </>
  );
}
```

- [ ] **Step 2: Update index.tsx to read from store**

Replace the entire file:

```typescript
import { Redirect } from 'expo-router';
import { useUserStore } from '@/stores/user-store';

export default function Index() {
  const isOnboarded = useUserStore((s) => s.isOnboarded);

  if (isOnboarded) {
    return <Redirect href="/(tabs)/bridge" />;
  }

  return <Redirect href="/(onboarding)" />;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd app && npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add app/src/app/_layout.tsx app/src/app/index.tsx
git commit -m "feat: wire root layout with DB init, hydration, and store-based routing"
```

---

## Verification

### Task 10: Final verification

- [ ] **Step 1: Full TypeScript check**

Run: `cd app && npx tsc --noEmit`
Expected: zero errors

- [ ] **Step 2: Start the dev server**

Run: `cd app && npx expo start`
Expected: Metro bundler starts without errors. App should launch to onboarding screen (since no user_preferences row exists yet → isOnboarded = false).

- [ ] **Step 3: Verify on device/emulator**

Open on Android emulator or Expo Go. Confirm:
- App launches (no crash)
- Shows onboarding screen
- No red error screen
- Console shows `[DB] Database initialized`
