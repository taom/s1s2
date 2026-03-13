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
import type { SQLiteBindValue } from 'expo-sqlite';
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
  const params: SQLiteBindValue[] = [];

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

export async function getYesterdayLatestByType(
  metricType: MetricType
): Promise<ScanResult | null> {
  const d = getDatabase();
  const row = await d.getFirstAsync(
    "SELECT * FROM scan_results WHERE metric_type = ? AND date(created_at) = date('now', '-1 day') ORDER BY created_at DESC LIMIT 1",
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
    const params: SQLiteBindValue[] = [];

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
