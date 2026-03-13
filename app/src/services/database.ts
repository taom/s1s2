/**
 * Local Database (expo-sqlite)
 *
 * The device-authoritative store for all user-generated data.
 * Every write lands here first. The sync queue handles upstream
 * replication to Supabase.
 *
 * Schema matches the local SQLite schema from the rollout plan.
 *
 * TODO: initialize with expo-sqlite when installed
 */

// import * as SQLite from 'expo-sqlite';

const DB_NAME = 's1s2.db';

/**
 * SQL schema for local database initialization.
 * Runs on first app launch and on schema version upgrades.
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS scan_results (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK(metric_type IN ('heart_rate', 'hrv', 'spo2', 'blood_pressure_systolic', 'blood_pressure_diastolic')),
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
  variant_hue REAL,
  variant_pattern_density REAL,
  variant_glow_intensity REAL,
  variant_size_modifier REAL,
  variant_accent_color TEXT,
  discovery_scan_id TEXT REFERENCES scan_results(id),
  discovery_system_id TEXT,
  discovery_biome TEXT,
  nickname TEXT,
  is_favorite INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS journey_progress (
  id TEXT PRIMARY KEY,
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

/**
 * Initialize the local database.
 * Called once during app startup.
 */
export async function initDatabase(): Promise<void> {
  // TODO: implement with expo-sqlite
  // const db = SQLite.openDatabaseSync(DB_NAME);
  // await db.execAsync(SCHEMA_SQL);
  console.log('[DB] Database initialization placeholder');
}

/**
 * Get database instance.
 */
export function getDatabase() {
  // TODO: return SQLite.openDatabaseSync(DB_NAME);
  return null;
}

export { DB_NAME };
