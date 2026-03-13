# Phase 1: Data Foundation — Design Spec

**Date:** 2026-03-13
**Status:** Approved (rev 2 — post-review fixes)
**Scope:** Install core deps, wire SQLite, replace placeholder zustand stores, hydrate on startup

---

## 1. Dependencies

Install into `app/`:
- `zustand` — state management
- `expo-sqlite` — local-first database (Expo SDK 55 compatible, import from `expo-sqlite`)

Not yet needed (deferred to later phases):
- `@tanstack/react-query` — Phase 4 (Supabase sync)
- `expo-camera` — Phase 2 (PPG camera scan)
- `@supabase/supabase-js` — Phase 4 (cloud sync)

## 2. Database Service (`services/database.ts`)

### Architecture
- **Singleton pattern**: one `SQLiteDatabase` instance (`import * as SQLite from 'expo-sqlite'`), opened once at startup
- **Synchronous access**: `getDatabase()` returns the cached instance (throws if not initialized). **Invariant:** `initDatabase()` must resolve before any call to `getDatabase()`.
- **Schema fix required**: expand `scan_results.metric_type` CHECK constraint to include all 11 `MetricType` values (the current schema only allows 5)
- **Error handling**: all DB write helpers use try/catch + `console.error`. No retry logic in Phase 1. `enqueueSyncOp` follows the same pattern.
- **Migrations**: deferred to a later phase. Phase 1 uses `CREATE TABLE IF NOT EXISTS` only.

### Schema Fix

The `scan_results` CHECK constraint must be expanded to match all `MetricType` values:

```sql
CHECK(metric_type IN ('heart_rate', 'resting_heart_rate', 'hrv', 'spo2',
  'blood_pressure_systolic', 'blood_pressure_diastolic',
  'sleep_hours', 'sleep_quality', 'mood', 'activity_type', 'activity_duration'))
```

### API Surface

```typescript
// Lifecycle
initDatabase(): Promise<void>          // Open DB, run SCHEMA_SQL
getDatabase(): SQLiteDatabase          // Return singleton, throw if not init

// Scan Results
insertScanResult(scan: Omit<ScanResult, 'createdAt'>): Promise<void>
getScanResults(opts?: { limit?: number; metricType?: MetricType }): Promise<ScanResult[]>
getLatestScanByType(metricType: MetricType): Promise<ScanResult | null>
getTodayScanResults(): Promise<ScanResult[]>

// Journey
getJourneyProgress(): Promise<JourneyProgress | null>
upsertJourneyProgress(progress: JourneyProgress): Promise<void>

// User Preferences
getUserPreferences(): Promise<UserPreferences | null>
upsertUserPreferences(prefs: Partial<UserPreferences>): Promise<void>

// Creatures
insertCreatureDiscovery(creature: Omit<CreatureDiscovery, 'discoveredAt'>): Promise<void>
getCreatureDiscoveries(): Promise<CreatureDiscovery[]>
updateCreatureDiscovery(id: string, updates: Partial<CreatureDiscovery>): Promise<void>

// Sync Queue (signature only — not wired to stores in Phase 1, included for completeness)
enqueueSyncOp(op: { tableName: string; recordId: string; operation: 'INSERT' | 'UPDATE' | 'DELETE'; payload: Record<string, unknown> }): Promise<void>
```

### Type Changes

**Add `UserPreferences`** to `types/index.ts` (matches `user_preferences` table). `id`/`createdAt`/`updatedAt` intentionally excluded — singleton row managed by DB defaults, timestamps needed only for Phase 4 sync:

```typescript
interface UserPreferences {
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

**Fix `JourneyProgress`** — the `journey_progress` table uses a singleton pattern (like `user_preferences`). Add `id` to the table's DEFAULT clause in schema, and keep the TS type without `id` (same rationale as UserPreferences).

**Fix `ScanResult`** — add optional fields that exist in the table but not the type: `deviceModel?: string`, `osVersion?: string`, `ambientLight?: 'bright' | 'normal' | 'low'`, `motionDetected?: boolean`, `rawSignalQuality?: number`. These are populated by the camera PPG flow (Phase 2) but left undefined for manual entries.

**Fix `JourneyProgress`** — add `currentSystemName?: string` to match the table column.

**Fix `CreatureDiscovery`** — add `discoveryScanId?: string` to match the `discovery_scan_id` FK column.

## 3. Zustand Stores

### Pattern (all stores follow this)
- `create<XState>()` from zustand
- Actions that modify persisted data call the DB helper, then `set()` the store
- No async in the store itself for reads — stores are hydrated at startup
- DB writes are fire-and-forget with `try/catch` + `console.error` (don't block UI)

### user-store
- State: `profile: UserProfile | null`, `isOnboarded: boolean`, `preferences: UserPreferences | null`
- Hydration: read `user_preferences` table → set `preferences` and build `UserProfile`
- **UserProfile assembly**: `captainName`/`shipName`/`onboardingCompleted` come from `user_preferences`. `xp`/`currentStreak`/`longestStreak`/`shipClass` come from `journey_progress` (passed in during hydration). `id` is generated client-side (UUID) on first onboarding and stored as a field in preferences.
- Actions: `setCaptainName`, `setShipName`, `completeOnboarding` → write to SQLite + update store
- `hydrate(prefs, journeyProgress)` method for startup loading

### journey-store
- State: `progress: JourneyProgress | null`, `systems: StarSystem[]`, `currentSystemIndex`, `todayFuel: FuelLog`
- Hydration: read `journey_progress` table. `todayFuel` is computed from today's `scan_results` via `getTodayScanResults()` — counts today's check-ins by type. Resets to zero naturally each day (no timer needed).
- Actions: `addFuel`, `travel`, `incrementStreak`, `resetStreak` → write to SQLite + update store
- `initJourney(galaxySeed)` — called during onboarding completion (NOT during hydration). Creates the initial `journey_progress` row.
- `hydrate()` method for startup loading
- **`systems` array**: not populated in Phase 1. Galaxy generation is Phase 2+ scope. The array starts empty; screens that reference it will show placeholder/empty states.

### creature-store
- State: `species: CreatureSpecies[]`, `discoveries: CreatureDiscovery[]`, filters
- Hydration: species from static `constants/creatures.ts`, discoveries from `creatures` table
- Actions: `addDiscovery`, `toggleFavorite` → write to SQLite + update store
- `hydrate()` method for startup loading

### music-store
- State: playback state, frequencies, layer toggles
- **No SQLite backing** — pure in-memory, ephemeral
- Just replace placeholder with real `create<MusicState>()`

## 4. Hydration Service (`services/hydrate.ts`)

Single entry point called from root layout:

```typescript
async function hydrateStores(): Promise<{ isOnboarded: boolean }>
```

- Reads `user_preferences`, `journey_progress`, `creatures` table, and today's `scan_results`
- Populates all three persisted stores (user, journey, creature)
- Computes `todayFuel` from today's scan results
- Assembles `UserProfile` from preferences + journey progress
- Returns `isOnboarded` flag for routing decision

## 5. Root Layout Changes (`app/_layout.tsx`)

```
App Start
  → preventAutoHideAsync()
  → initDatabase()          // MUST complete before anything else
  → hydrateStores() → get isOnboarded
  → hideAsync()
  → Route to (onboarding) or (tabs) based on isOnboarded
```

Use a `loading` state to hold the splash screen until hydration completes.

## 6. Files Changed

| File | Change |
|------|--------|
| `app/package.json` | Add zustand, expo-sqlite |
| `app/src/types/index.ts` | Add `UserPreferences`, fix `ScanResult`/`JourneyProgress`/`CreatureDiscovery` |
| `app/src/services/database.ts` | Full rewrite: real expo-sqlite + CRUD helpers + schema fix |
| `app/src/services/hydrate.ts` | **New file**: startup hydration |
| `app/src/stores/user-store.ts` | Replace placeholder with real zustand |
| `app/src/stores/journey-store.ts` | Replace placeholder with real zustand |
| `app/src/stores/creature-store.ts` | Replace placeholder with real zustand |
| `app/src/stores/music-store.ts` | Replace placeholder with real zustand |
| `app/src/app/_layout.tsx` | Add DB init, hydration, conditional routing |

## 7. What This Does NOT Include

- No Supabase sync (Phase 4) — `enqueueSyncOp` signature exists but is not called
- No camera/PPG scanning (Phase 2)
- No React Query (Phase 4)
- No galaxy generation — `systems` array stays empty (Phase 2+)
- No schema migration system — deferred to later phase
- No new screens or UI changes
- No visual changes to existing screens
