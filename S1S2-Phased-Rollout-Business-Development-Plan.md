# S1S2 Phased Rollout Business and Development Plan

## Version

This is the detailed v4 execution plan aligned to the product bible, the companion planning artifacts, and the requirement to use relative phase timing. v4 adds local-first architecture, database schema, dependency inventory, accessibility requirements, performance targets, CI/CD pipeline, incident response, AI/ML model versioning, pricing and billing SDK specifics, app store metadata preparation, support channel setup, camera PPG fallback deadlines, and tightened exit gates throughout.

## Purpose

This document is the master execution sequence for S1S2. It translates the vision in the product bible into a decision-complete rollout program that a founder, contractor, or future team member can execute without needing to reinterpret the strategy.

The plan is designed to do four things at once:

- protect the product vision
- stage the work so a solo founder can survive the roadmap
- keep monetization aligned with user trust
- turn each phase into an operational checklist rather than a vague aspiration

## How To Use This Plan

Use this file as the master roadmap and sequencing document.

Use the planning artifacts in `planning/` as the working documents that support execution:

- entitlement decisions live in `planning/S1S2-Feature-Entitlement-Matrix.md`
- content tracking lives in `planning/S1S2-Content-Manifest.csv`
- KPI instrumentation lives in `planning/S1S2-Analytics-Event-Taxonomy.md`
- phase readiness and hold decisions live in `planning/S1S2-Release-Gate-Scorecard.md`
- health-data trust rules live in `planning/S1S2-Health-Data-Policy.md`
- support operations live in `planning/S1S2-Support-Playbook.md`
- App Review and compliance preparation live in `planning/S1S2-App-Review-Compliance-Pack.md`
- business assumptions live in `planning/S1S2-Business-Model-Framework.md`

When scope changes, update documents in this order:

1. update this rollout plan
2. update the entitlement matrix
3. update the release gate scorecard
4. update the business model and any affected support or compliance docs

## Planning Frame

### Relative Timing Rule

- `Week 0` is project kickoff.
- all dates are relative to kickoff or to the previous successful exit gate.
- if a phase fails its exit gate, do not advance automatically.
- default hold-sprint duration is `2 weeks`.
- hold sprints exist to repair trust, reliability, retention, or support-capacity issues before the roadmap expands again.

### Execution Model

- primary operator: solo founder
- support model: freelance art, freelance audio, burst QA, and occasional trailer or localization help
- platform sequence: iOS first, Android second
- business sequence: retention first, monetization second, scale third
- content sequence: 20 playable MVP creatures, 50 shipped species by Deep Signal, 80+ free Common and Uncommon creatures by the end of Growth Cycle 2, 200+ total creatures by the end of Growth Cycle 3

### Product Rules

- the product must feel like a premium atmospheric game, not a medical dashboard
- the free tier must be lovable enough to be a referral engine
- health logging, health viewing, health export, concerning trend alerts, guided breathing, and basic creature discovery are never paywalled
- premium may only market features that are already live
- `Signal Deck Lite` and `guided breathing` are in MVP scope
- `20-creature MVP set` is the correct phrase for MVP content; do not call it the full launch set
- deterministic journey generation is mandatory
- any scan result with weak confidence must be treated honestly
- health scan data must persist locally before any network call (local-first rule)

### Success Definition

S1S2 succeeds if the first version creates a repeatable loop where users:

1. successfully complete onboarding
2. trust the check-in flow
3. feel rewarded quickly through travel, creatures, and music
4. return often enough for the habit loop to form
5. perceive premium as deeper beauty and continuity rather than a tollbooth

## Dependency Inventory

The following is the canonical dependency list for the S1S2 project. Pin major versions. Use exact versions in lockfiles. Audit quarterly for security patches.

### Core Framework

| Package | Purpose | Notes |
|---|---|---|
| `expo` (~52.x) | managed workflow, OTA updates, build tooling | pin SDK version per phase |
| `react-native` (0.76.x) | UI runtime | version matched to Expo SDK |
| `react` (19.x) | component model | version matched to RN |
| `typescript` (5.x) | type safety | strict mode enabled |

### Local Storage and Data

| Package | Purpose | Notes |
|---|---|---|
| `expo-sqlite` | local-first database for offline scan data, creatures, journey, sync queue | critical path; see local-first architecture section |
| `@supabase/supabase-js` (2.x) | backend client for auth, Postgres, storage, realtime | server-side source of truth after sync |
| `@tanstack/react-query` (5.x) | async state, caching, background refetch | coordinates with sync queue |
| `zustand` (5.x) | lightweight client state for UI, session, and ephemeral state | avoid Redux complexity for solo founder |
| `zod` (3.x) | runtime schema validation for API payloads, form inputs, scan results | shared schemas between client and server |

### Camera and Sensors

| Package | Purpose | Notes |
|---|---|---|
| `expo-camera` | camera access for PPG scanning | requires permission flow |
| `expo-sensors` | accelerometer for motion rejection during scans | used to detect hand tremor |
| `expo-haptics` | haptic feedback for scan events and accessibility | replaces visual-only indicators |

### Rendering and Animation

| Package | Purpose | Notes |
|---|---|---|
| `react-native-reanimated` (3.x) | performant UI animations, gesture-driven transitions | worklet-based for 60fps |
| `@shopify/react-native-skia` | 2D galaxy rendering, creature variants, particle effects | evaluate vs expo-gl/three.js during Phase 0 spike |
| `expo-gl` | fallback 3D rendering if Skia insufficient for galaxy | only if Skia spike fails |
| `three` + `@react-three/fiber` | alternative 3D galaxy rendering | only if expo-gl chosen over Skia |

### Audio

| Package | Purpose | Notes |
|---|---|---|
| `expo-av` | audio playback, background audio, Bluetooth output | primary audio engine |
| `tone` (optional) | procedural music generation | only if feasibility spike passes; otherwise use pre-rendered stems |

### Health Data Integration

| Package | Purpose | Notes |
|---|---|---|
| `react-native-health` | HealthKit integration (iOS) | HR, resting HR, HRV, SpO2 |
| `react-native-health-connect` | Health Connect integration (Android) | Phase 5 |

### Monetization

| Package | Purpose | Notes |
|---|---|---|
| `react-native-purchases` (RevenueCat SDK) | subscription management, receipt validation, entitlements | see pricing section in Phase 4 |

### Analytics, Monitoring, and Error Tracking

| Package | Purpose | Notes |
|---|---|---|
| `@sentry/react-native` | crash reporting, error tracking, performance monitoring | breadcrumbs for scan failures |
| `posthog-react-native` | product analytics, feature flags, session replay | privacy-respecting alternative to Amplitude |

### Utilities

| Package | Purpose | Notes |
|---|---|---|
| `date-fns` (4.x) | date math for streaks, history, timezone handling | tree-shakeable; avoid moment.js |
| `expo-notifications` | local and push notifications for reminders | quiet hours support |
| `expo-secure-store` | secure credential storage | auth tokens, encryption keys |
| `expo-file-system` | file operations for audio export | safe export paths |
| `expo-linking` | deep linking, universal links | share cards, partner links |
| `expo-updates` | OTA update channel management | staging vs production channels |

### Development and Build

| Package | Purpose | Notes |
|---|---|---|
| `jest` + `@testing-library/react-native` | unit and component testing | coverage targets per phase |
| `detox` or `maestro` | E2E testing | evaluate during Phase 1 |
| `eslint` + `prettier` | code quality | strict config, pre-commit hooks |

### Dependency Governance Rules

1. no dependency may be added without a clear owner and a documented reason.
2. prefer Expo-managed packages over bare React Native modules to reduce native build complexity.
3. audit all dependencies for known vulnerabilities before each phase exit gate.
4. remove unused dependencies at every phase boundary.
5. document any native module that requires a custom dev client build.

## Database Schema

### Local Schema (expo-sqlite)

The local database is the device-authoritative store for all user-generated data. Every write lands here first. The sync queue handles upstream replication to Supabase.

```sql
-- Local SQLite schema for S1S2
-- All tables use TEXT for UUIDs and ISO-8601 for timestamps

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
  ship_class TEXT NOT NULL DEFAULT 'starter',
  last_travel_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS galaxy_state (
  id TEXT PRIMARY KEY,
  seed TEXT NOT NULL,
  galaxy_type TEXT NOT NULL CHECK(galaxy_type IN ('linear', 'graph')),
  systems_json TEXT NOT NULL,
  fog_of_war_json TEXT,
  biomes_json TEXT,
  echoes_json TEXT,
  listening_posts_json TEXT,
  generated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  ship_name TEXT,
  reminder_enabled INTEGER DEFAULT 1,
  reminder_time TEXT DEFAULT '09:00',
  quiet_hours_start TEXT DEFAULT '22:00',
  quiet_hours_end TEXT DEFAULT '07:00',
  haptics_enabled INTEGER DEFAULT 1,
  reduce_motion INTEGER DEFAULT 0,
  high_contrast INTEGER DEFAULT 0,
  voiceover_hints_enabled INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'auto' CHECK(theme IN ('auto', 's1_warm', 's2_cool')),
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

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_scan_results_session ON scan_results(session_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created ON scan_results(created_at);
CREATE INDEX IF NOT EXISTS idx_scan_results_metric ON scan_results(metric_type);
CREATE INDEX IF NOT EXISTS idx_creatures_species ON creatures(species_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_table ON sync_queue(table_name, status);
```

### Server Schema (PostgreSQL / Supabase)

The server schema is the durable, multi-device source of truth after sync. All tables have row-level security enabled.

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  ship_name TEXT,
  avatar_seed TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- scan_sessions
-- ============================================================
CREATE TABLE public.scan_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  scan_type TEXT NOT NULL CHECK(scan_type IN ('camera_ppg', 'manual', 'import')),
  device_model TEXT,
  os_version TEXT,
  app_version TEXT,
  signal_quality REAL,
  ambient_light TEXT CHECK(ambient_light IN ('bright', 'normal', 'low')),
  motion_detected BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'completed', 'failed', 'abandoned')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan sessions"
  ON public.scan_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan sessions"
  ON public.scan_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scan sessions"
  ON public.scan_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- scan_results
-- ============================================================
CREATE TABLE public.scan_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.scan_sessions(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK(metric_type IN ('heart_rate', 'hrv', 'spo2', 'blood_pressure_systolic', 'blood_pressure_diastolic')),
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  confidence REAL NOT NULL CHECK(confidence >= 0.0 AND confidence <= 1.0),
  source TEXT NOT NULL CHECK(source IN ('camera_ppg', 'manual', 'healthkit', 'health_connect', 'wearable')),
  source_device TEXT,
  is_low_confidence BOOLEAN GENERATED ALWAYS AS (confidence < 0.7) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_from_device TEXT,
  client_created_at TIMESTAMPTZ
);

ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan results"
  ON public.scan_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan results"
  ON public.scan_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- scan_results are append-only; no UPDATE or DELETE policies
-- deletions happen via account deletion cascade only

-- ============================================================
-- creatures (species definitions, seeded by admin)
-- ============================================================
CREATE TABLE public.creatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  lore TEXT,
  rarity TEXT NOT NULL CHECK(rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'harmonic')),
  resonance_class TEXT NOT NULL CHECK(resonance_class IN ('s1_warm', 's2_cool', 'dual')),
  biome_affinity TEXT,
  trigger_logic JSONB NOT NULL DEFAULT '{}',
  illustration_asset_key TEXT,
  audio_asset_key TEXT,
  phase_introduced TEXT NOT NULL DEFAULT 'mvp',
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.creatures ENABLE ROW LEVEL SECURITY;

-- creatures table is read-only for authenticated users
CREATE POLICY "Authenticated users can view creatures"
  ON public.creatures FOR SELECT
  TO authenticated
  USING (TRUE);

-- ============================================================
-- creature_discoveries (user-owned)
-- ============================================================
CREATE TABLE public.creature_discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creature_id UUID NOT NULL REFERENCES public.creatures(id),
  variant_hue REAL,
  variant_pattern_density REAL,
  variant_glow_intensity REAL,
  variant_size_modifier REAL,
  variant_accent_color TEXT,
  discovery_scan_id UUID REFERENCES public.scan_results(id),
  discovery_system_id TEXT,
  discovery_biome TEXT,
  nickname TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_from_device TEXT,
  client_created_at TIMESTAMPTZ,
  UNIQUE(user_id, creature_id, variant_hue, variant_pattern_density)
);

ALTER TABLE public.creature_discoveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own discoveries"
  ON public.creature_discoveries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own discoveries"
  ON public.creature_discoveries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discoveries"
  ON public.creature_discoveries FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- journey_progress
-- ============================================================
CREATE TABLE public.journey_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  galaxy_seed TEXT NOT NULL,
  current_system_index INTEGER NOT NULL DEFAULT 0,
  current_system_name TEXT,
  total_systems_visited INTEGER NOT NULL DEFAULT 0,
  total_fuel_earned REAL NOT NULL DEFAULT 0.0,
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  streak_grace_expires_at TIMESTAMPTZ,
  ship_class TEXT NOT NULL DEFAULT 'starter',
  last_travel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_from_device TEXT,
  client_updated_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

ALTER TABLE public.journey_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journey"
  ON public.journey_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journey"
  ON public.journey_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journey"
  ON public.journey_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- galaxy_seeds
-- ============================================================
CREATE TABLE public.galaxy_seeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seed TEXT NOT NULL,
  galaxy_type TEXT NOT NULL CHECK(galaxy_type IN ('linear', 'graph')),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, galaxy_type)
);

ALTER TABLE public.galaxy_seeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own galaxy seeds"
  ON public.galaxy_seeds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own galaxy seeds"
  ON public.galaxy_seeds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- seeds are immutable after creation; no UPDATE policy

-- ============================================================
-- achievements
-- ============================================================
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_asset_key TEXT,
  category TEXT NOT NULL CHECK(category IN ('exploration', 'collection', 'consistency', 'social', 'seasonal', 'mastery')),
  threshold_value REAL,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress_value REAL DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- subscriptions (RevenueCat is source of truth; this is a cache)
-- ============================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  revenucat_customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK(plan_type IN ('monthly', 'annual', 'lifetime')),
  status TEXT NOT NULL CHECK(status IN ('active', 'expired', 'cancelled', 'billing_issue', 'grace_period')),
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  is_trial BOOLEAN DEFAULT FALSE,
  store TEXT NOT NULL CHECK(store IN ('app_store', 'play_store', 'stripe', 'promotional')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- subscriptions are managed by server-side webhook from RevenueCat
-- no direct user INSERT/UPDATE policies

-- ============================================================
-- sync_metadata
-- ============================================================
CREATE TABLE public.sync_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sync_version INTEGER NOT NULL DEFAULT 0,
  tables_synced JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sync metadata"
  ON public.sync_metadata FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own sync metadata"
  ON public.sync_metadata FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sync metadata"
  ON public.sync_metadata FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Utility functions
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all mutable tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.journey_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sync_metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.creatures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

## Performance Targets

The following targets apply from the first testable build and are enforced at every exit gate.

| Metric | Target | Measurement Method |
|---|---|---|
| Camera PPG scan processing time | < 3 seconds from finger placement to result | instrumented timer in scan flow |
| App cold start (splash to Bridge) | < 2 seconds on iPhone 12 and newer | Sentry performance trace |
| App cold start (splash to Bridge) | < 3 seconds on iPhone 11 and older supported devices | Sentry performance trace |
| Creature animation frame rate | >= 30 fps sustained | Skia/GL frame counter, Sentry slow-frame tracking |
| Galaxy rendering (linear, 50 systems) | >= 30 fps during scroll and zoom | Skia/GL frame counter |
| Galaxy rendering (graph, 200+ systems) | >= 24 fps during scroll and zoom | Skia/GL frame counter |
| Sync queue drain latency | < 5 seconds for up to 50 queued items on stable connection | instrumented sync timer |
| Local DB write latency (single scan result) | < 50 ms | instrumented write timer |
| Background sync (when app returns to foreground) | < 10 seconds for full catchup | instrumented sync timer |
| Audio playback start | < 1 second from tap to audible output | instrumented audio timer |
| Notification delivery to app open | < 500 ms for local notifications | instrumented from notification tap |
| JS bundle size (production) | < 15 MB compressed | EAS Build artifact size |
| OTA update download | < 5 MB for typical delta update | EAS Update payload size |

### Performance Regression Rules

1. any performance metric that regresses by more than 20% from the previous release requires investigation before the release ships.
2. scan processing time and cold start are hard blockers; other metrics are soft blockers with a one-release grace period.
3. performance is tested on the lowest-supported device in the matrix, not only on the latest hardware.

## CI/CD Pipeline

### Build System

S1S2 uses Expo Application Services (EAS) for builds, submissions, and over-the-air updates, with GitHub Actions for orchestration.

### Pipeline Architecture

```
GitHub Push/PR
  |
  v
GitHub Actions Workflow
  |
  +-- Lint (eslint, prettier check)
  +-- Type Check (tsc --noEmit)
  +-- Unit Tests (jest, >= 80% coverage for critical paths)
  +-- Schema Validation (zod schemas compile)
  |
  v (on merge to main)
  |
  +-- EAS Build (staging profile)
  |     +-- iOS simulator build
  |     +-- Android APK build
  |
  +-- E2E Tests (Maestro, run against staging builds)
  |
  v (on release tag)
  |
  +-- EAS Build (production profile)
  |     +-- iOS IPA (ad-hoc for TestFlight, release for App Store)
  |     +-- Android AAB (for Play Store)
  |
  +-- EAS Submit (automated submission to TestFlight / Play Console internal track)
  |
  v (manual promotion after QA)
  |
  +-- EAS Submit (production release to App Store / Play Store)
```

### EAS Configuration Profiles

| Profile | Channel | Purpose |
|---|---|---|
| `development` | `development` | local dev client with debug tooling |
| `staging` | `staging` | internal testing, analytics validation |
| `beta` | `beta` | TestFlight / Play Console beta track |
| `production` | `production` | App Store / Play Store public release |

### OTA Updates (EAS Update)

- critical bug fixes may be deployed via OTA without a full store submission.
- OTA updates target a specific channel and runtime version.
- OTA updates must not change native code; native changes require a full build.
- all OTA updates require a smoke test on staging channel before promotion to production channel.
- rollback procedure: publish a new OTA update that reverts the change; EAS Update supports instant rollback.

### GitHub Actions Workflows

1. **`ci.yml`** (runs on every PR):
   - lint, typecheck, unit tests, schema validation
   - posts test coverage delta as PR comment
   - blocks merge if coverage drops below threshold

2. **`build-staging.yml`** (runs on merge to `main`):
   - triggers EAS Build for staging profile
   - runs E2E test suite against staging build
   - posts build artifacts and test results to Slack/Discord

3. **`release.yml`** (runs on version tag `v*`):
   - triggers EAS Build for production profile
   - triggers EAS Submit to TestFlight / Play Console internal track
   - creates GitHub Release with changelog

4. **`ota-hotfix.yml`** (manual trigger):
   - builds and publishes EAS Update to specified channel
   - requires explicit channel and runtime version inputs
   - posts deployment notification

### Branch Strategy

- `main`: always deployable to staging
- `release/*`: release candidates, tagged for production builds
- feature branches: short-lived, merged via PR with required CI pass

## Accessibility Requirements

S1S2 targets WCAG 2.1 AA compliance across all interactive surfaces. Accessibility is not a Phase 8 polish item; it is a Phase 1 foundation requirement.

### Standards

- WCAG 2.1 Level AA for all interactive UI
- iOS: full VoiceOver support
- Android: full TalkBack support (Phase 5)

### Touch Targets

- minimum touch target size: 44x44 points (iOS) / 48x48 dp (Android)
- minimum spacing between adjacent touch targets: 8 points
- scan start/stop button: minimum 64x64 points for motor accessibility

### Color and Contrast

- text contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- non-text UI elements (icons, borders, focus indicators): minimum 3:1 contrast ratio
- never convey information by color alone; always pair with shape, icon, label, or pattern
- S1 warm palette and S2 cool palette must both pass contrast checks independently
- provide a high-contrast mode toggle in user preferences

### Screen Reader Support

- all interactive elements must have accessible labels
- scan interface: announce scan state changes (ready, scanning, processing, complete, failed) via live regions
- creature discovery: announce creature name, rarity, and lore summary
- galaxy navigation: provide text-based system descriptions for screen reader users
- all images must have descriptive alt text or be marked as decorative
- custom gestures must have accessible alternatives (button-based navigation)

### Motion and Animation

- respect `prefers-reduced-motion` / iOS "Reduce Motion" setting
- provide a `reduce_motion` toggle in user preferences that disables:
  - parallax effects on Bridge
  - travel animations (replaced with instant transitions)
  - creature reveal animations (replaced with fade-in)
  - galaxy scroll momentum effects
- all animations must be pausable or skippable

### Haptic Feedback

- provide haptic feedback as an alternative to visual-only indicators:
  - scan progress: gentle pulse pattern during measurement
  - scan complete: success haptic
  - scan failed: error haptic
  - creature discovered: celebration haptic pattern
  - streak milestone: acknowledgment haptic
- haptic feedback must be toggleable in user preferences
- haptic patterns must not be the sole indicator of any state change

### Audio Accessibility

- all audio-dependent features must have visual equivalents
- music playback state must be visible, not only audible
- creature acoustic signatures must have visual waveform representations
- provide captions or descriptions for any audio-only content

### Testing Requirements

- test with VoiceOver enabled on every QA pass from Phase 2 onward
- test with TalkBack enabled on every Android QA pass from Phase 5 onward
- test with increased text size (Dynamic Type / Android font scaling) at 200%
- test with "Reduce Motion" enabled
- test with inverted colors and high-contrast mode
- include at least one accessibility-focused tester in the beta cohort

## Incident Response Playbook

### Severity Levels

| Level | Definition | Response Time | Resolution Target | Example |
|---|---|---|---|---|
| SEV-1 (Critical) | data loss, security breach, app unusable for all users | 15 minutes to acknowledge | 4 hours to mitigate | scan data not saving, auth bypass, database corruption |
| SEV-2 (High) | major feature broken for significant user segment | 1 hour to acknowledge | 24 hours to mitigate | camera PPG failing on specific device class, sync permanently stuck |
| SEV-3 (Medium) | feature degraded but workaround exists | 4 hours to acknowledge | 72 hours to fix | creature animation glitch, incorrect streak count |
| SEV-4 (Low) | cosmetic issue, minor inconvenience | next business day | next release cycle | typo in lore text, slight color mismatch |

### Rollback Procedures

1. **OTA rollback (no native change)**: publish a revert OTA update via EAS Update. Target the affected channel. Typical time: under 10 minutes from decision to deployment.
2. **Store rollback (native change)**: if a store release introduced the issue:
   - iOS: use App Store Connect to remove the build from sale and revert to the previous version. Typical time: 1-24 hours depending on Apple review.
   - Android: use Play Console staged rollout halt and rollback. Typical time: under 1 hour.
3. **Database rollback**: restore from point-in-time recovery via Supabase dashboard. Only for SEV-1 data corruption scenarios. Requires founder authorization.
4. **Feature flag rollback**: if the issue is behind a PostHog feature flag, disable the flag immediately. Typical time: under 2 minutes.

### On-Call Protocol

- solo founder is the only on-call responder through Phase 5.
- Sentry alerts for crash rate spikes (>1% crash-free session drop) trigger push notification.
- PostHog alerts for sudden metric drops (>25% drop in daily active scans) trigger email notification.
- support email monitored at least twice daily; critical reports escalated immediately.

### Post-Incident Process

1. write a brief incident report within 48 hours of resolution.
2. document: timeline, root cause, impact, resolution, and prevention measures.
3. update the risk register if the incident revealed a new risk category.
4. add regression test coverage for the specific failure mode.

## AI/ML Model Versioning Strategy

### PPG Algorithm Versioning

The camera PPG algorithm is the highest-risk ML component in S1S2. It must be versioned, tested, and rolled out with the same discipline as the app itself.

### Version Scheme

- format: `ppg-v{MAJOR}.{MINOR}.{PATCH}`
- `MAJOR`: breaking change to output format, new metric type, or fundamental algorithm change
- `MINOR`: accuracy improvement, new device support, threshold tuning
- `PATCH`: bug fix, edge-case handling

### Model Artifacts

- each version includes:
  - algorithm parameters (signal processing coefficients, filter configs)
  - confidence threshold calibration table
  - device-specific adjustment factors
  - validation dataset results
  - minimum app version required

### Deployment Rules

1. new model versions are deployed behind a PostHog feature flag.
2. initial rollout: 10% of users for 48 hours.
3. monitor: scan success rate, confidence distribution, and user-reported accuracy complaints.
4. if scan success rate drops by more than 5% or confidence distribution shifts significantly, halt rollout and investigate.
5. full rollout only after 48-hour canary shows no regression.

### Validation Requirements

- every model version must be tested against the reference dataset:
  - minimum 100 scan sessions across at least 5 device models
  - heart rate accuracy: within +/-5 BPM of reference device for >= 85% of scans
  - HRV accuracy: within +/-15 ms of reference device for >= 80% of scans
  - false rejection rate (good signal rejected): < 10%
  - false acceptance rate (bad signal accepted): < 5%
- results are stored in the model artifact and referenced in the release gate scorecard.

### Rollback

- if a model version fails validation in production, revert to the previous version via feature flag.
- the previous model version must always remain deployable.
- never delete a model version artifact; archive it for comparison.

## Phase Overview

| Phase | Relative Timing | Main Goal | Primary Output | Gate To Advance |
|---|---|---|---|---|
| 0 | Weeks 0-2 | lock strategy, scope, economics, and feasibility | decision-complete brief | feasibility, scope, and entitlement approved |
| 1 | Weeks 3-4 | build the production foundation | stable environments and seeded systems | environments, schema, analytics, and QA baseline approved |
| 2 | Weeks 5-18 | build the First Signal MVP | closed-beta-ready iOS MVP | activation, scan, crash, and delight gates pass |
| 3 | Weeks 19-22 | launch and stabilize | staged public release | D1, D7, trust, and support gates pass |
| 4 | Weeks 23-32 after Phase 3 gate | build Deep Signal | premium-ready full game expansion | D30, conversion, refund, and rating gates pass |
| 5 | Weeks 33-38 after Phase 4 gate | expand to Android and revenue ops | Android launch and billing operations | Android stability and cadence gates pass |
| 6 | Months 1-3 after Growth start | add wearables, social depth, and correlations | stronger retention moat | MRR, support, and import reliability gates pass |
| 7 | Months 4-6 after Growth start | scale content and utility depth | free-tier promise fulfilled and doctor utility improved | content pipeline and reactivation gates pass |
| 8 | Months 7-12 after Growth start | reach scale and annual identity loops | year-end ritual, localization, and community maturity | moderation, privacy, and retention remain healthy |

## Phase 0: Signal Lock

### Relative Timing

- start: `Week 0`
- duration: `2 weeks`

### Objective

Convert the product bible from a vision document into a locked operating brief so the project starts from deliberate choices rather than from assumptions.

### Success Definition

Phase 0 is successful when the team no longer needs to debate the core audience, the free-versus-premium line, the initial scope, or the technical feasibility of the riskiest systems.

### Workstream 0.1: Audience and Positioning Lock

#### Goal

Define exactly who the product is for at launch, how it will be described publicly, and what it must never sound like.

#### Steps

1. write the hero audience profile as `design-conscious, health-curious iPhone users who value craft and premium-feeling apps`.
2. write the secondary audience profile as `quantified-self users already tracking HR, HRV, sleep, or BP`.
3. write the tertiary audience profile as `cozy or atmospheric indie-game players who may stay for the world before they stay for the health loop`.
4. document for each audience:
   - core motivation
   - emotional trigger
   - likely objection
   - likely premium conversion trigger
5. define the public promise sentence for the App Store, landing page, and founder pitch.
6. define three message pillars:
   - health tracking that creates beauty
   - your body is the engine
   - insight without guilt
7. define the anti-positioning list:
   - no guilt-based copy
   - no sterile health-dashboard look
   - no casino-style gamification
   - no aggressive paywall interruption
8. write a short language guide for any future contractor writing copy so tone stays consistent with the brand voice in the bible.

#### Deliverables

- audience profile sheet
- one-sentence product promise
- message pillars
- anti-positioning list
- brand language guide

### Workstream 0.2: Scope and Entitlement Lock

#### Goal

Freeze what belongs in MVP, what belongs later, and what belongs in the permanent free promise.

#### Steps

1. review the product bible and copy every promised feature into a temporary master list.
2. sort each feature into one of four buckets:
   - MVP
   - Deep Signal
   - Growth
   - long-term or optional
3. explicitly restore `Signal Deck Lite` to MVP.
4. explicitly restore `guided breathing` to MVP.
5. rename `20 launch creatures` to `20-creature MVP set`.
6. define the first content promises clearly:
   - MVP: 20 playable creatures
   - visible roadmap: 50 species represented through live or silhouette entries
   - Deep Signal target: 50 shipped species
7. define the permanent free line:
   - health logging
   - health viewing
   - health export
   - concerning trend alerts
   - guided breathing
   - basic creature discovery
   - daily music generation
8. update the entitlement matrix so premium benefits include only live features.

#### Deliverables

- approved scope matrix
- updated entitlement matrix
- corrected public wording for creature counts and premium scope

### Workstream 0.3: Financial Model Lock

#### Goal

Replace rough projections with a model that is usable for real spending decisions.

#### Steps

1. build conservative, base, and breakout scenarios.
2. separate `cash bookings` from `recognized revenue`.
3. define assumptions for:
   - downloads
   - D30 retention
   - paywall eligibility rate
   - premium conversion
   - annual versus lifetime purchase mix
   - refund rate
4. define monthly contractor assumptions for art, audio, QA, trailer work, and localization.
5. define phase-by-phase spend caps.
6. define a rule for when contractor spend may increase:
   - only after Phase 4 conversion and refund metrics support it
7. define which numbers will be used for which decisions:
   - cash bookings for runway and contractor planning
   - recognized revenue for longer-term business visibility

#### Deliverables

- business model spreadsheet
- spend guardrail table
- runway scenarios

### Workstream 0.4: Technical Feasibility Spikes

#### Goal

Resolve the riskiest technical unknowns before they become schedule traps.

#### Steps

1. run a camera PPG spike on at least three iPhone classes representing older, mid-tier, and newer hardware.
2. record scan reliability under multiple conditions:
   - bright light
   - low light
   - warm fingers
   - cold fingers
   - slight motion
   - partial camera coverage
3. decide whether camera HR can be a primary path or whether manual and imported HR must be treated as equal-first-class options from day one.
4. run an audio spike using the preferred React Native approach.
5. test:
   - startup latency
   - background interruption recovery
   - Bluetooth output
   - silent-mode behavior
   - performance under layered playback
6. do not lock Tone.js unless it proves stable enough on target devices.
7. run a deterministic generation spike:
   - generate a user galaxy
   - reinstall or simulate a second device
   - confirm the same seed produces the same systems and species availability
8. run a rendering spike to evaluate `@shopify/react-native-skia` versus `expo-gl` plus `three.js` for galaxy rendering:
   - test 50-system linear render at 30 fps on iPhone 11
   - test particle effects and parallax performance
   - decide rendering stack and document the choice
9. document fallback options for each failed spike instead of leaving open uncertainty.

#### Deliverables

- camera PPG feasibility memo
- audio feasibility memo
- deterministic-generation memo
- rendering stack decision memo
- fallback decision list

### Workstream 0.5: Asset Throughput and Contractor Planning

#### Goal

Make art and audio a planned production pipeline instead of a vague future concern.

#### Steps

1. define which of the 20 MVP species require final art at beta and which can ship with controlled placeholders during internal development.
2. define which audio assets are acceptable as placeholders at MVP and which must be final before launch.
3. create art-brief and acoustic-signature brief templates.
4. define review checkpoints for concept, sketch, final art, implementation-ready export, and in-app QA.
5. define naming rules, folder rules, and version rules for every asset type.
6. define maximum contractor throughput per month so the roadmap never assumes impossible content velocity.

#### Deliverables

- asset pipeline brief
- contractor brief templates
- throughput assumptions table

### Workstream 0.6: Governance, Analytics, and Risk Setup

#### Goal

Create the rules that will govern execution before the build starts.

#### Steps

1. define the initial analytics event taxonomy.
2. define the release gate scorecard.
3. define the risk register structure.
4. define the support severity model.
5. define the trust escalation rule for anything that may appear diagnostic or medically misleading.
6. define how hold sprints are triggered and how they suspend the roadmap.

#### Deliverables

- analytics taxonomy draft
- release gate scorecard draft
- risk register shell
- support severity framework

### Workstream 0.7: Support Channel and Pre-Launch Operations Setup

#### Goal

Establish support infrastructure before any users interact with the product.

#### Steps

1. register and configure the support email address (e.g., `support@s1s2.app`).
2. set up an email-based support system with tagging, auto-reply, and escalation rules. Evaluate lightweight options: Fastmail with labels, Help Scout free tier, or a shared inbox tool.
3. write the initial auto-reply template acknowledging receipt and setting response-time expectations (target: < 24 hours for non-critical, < 4 hours for critical).
4. create the first set of canned responses for:
   - scan troubleshooting
   - account and data questions
   - premium and billing questions
   - privacy and data export requests
   - bug reporting instructions
5. define the escalation path for health-data concerns and any message that could indicate self-harm risk.
6. set up a public-facing status page or equivalent (e.g., a pinned status post on the landing page) for communicating outages.
7. document the support channel in the privacy policy, terms of service, App Store description, and in-app settings.

#### Deliverables

- working support email with auto-reply
- canned response library
- escalation protocol document
- status page or equivalent

### Phase 0 Deliverables

- scope lock
- audience lock
- entitlement lock
- financial model
- feasibility memos
- asset plan
- analytics and governance baseline
- support channel operational

### Exit Gate

- scope matrix approved
- entitlement matrix approved
- financial model corrected
- feasibility spikes passed or replanned
- asset throughput and contractor budget locked
- support email operational and auto-reply verified

## Phase 1: Pre-Production

### Relative Timing

- start: `Week 3`
- duration: `2 weeks`

### Objective

Stand up the product foundation so feature work can happen in a stable environment with real data structures, analytics, QA scripts, and seeded content. Critically, this phase establishes the local-first architecture that ensures all health data persists on-device before any network call.

### Success Definition

Phase 1 is successful when the repo, environments, schema, analytics, QA harness, initial content scaffolding, and local-first data layer are all ready to support feature implementation without rework.

### Workstream 1.1: Repository and Environment Setup

#### Goal

Create a production-safe technical workspace.

#### Steps

1. initialize or confirm the app repository structure.
2. define local, staging, and production environment separation.
3. configure secrets handling for auth, backend, and analytics keys.
4. set up CI for builds, tests, and sanity checks per the CI/CD pipeline definition in this document.
5. add crash reporting (`@sentry/react-native`) and analytics (`posthog-react-native`) SDK scaffolding.
6. define a release-channel naming convention:
   - development
   - staging
   - beta
   - production
7. define build metadata standards so issues can be traced back to a version quickly.
8. configure EAS Build profiles for development, staging, beta, and production.
9. configure EAS Update channels matching the release-channel naming convention.
10. set up GitHub Actions workflows (`ci.yml`, `build-staging.yml`) per the CI/CD pipeline definition.

#### Deliverables

- working environments
- CI baseline with GitHub Actions
- EAS Build and Update configuration
- release-channel naming standard

### Workstream 1.2: Local-First Architecture

#### Goal

Establish the on-device data layer that guarantees health scan data persists locally before any network call, and that the app remains fully functional offline.

This is the most critical architectural workstream in Phase 1. Every downstream feature depends on local-first data flow.

#### Steps

1. initialize the expo-sqlite database with the local schema defined in the Database Schema section of this document.
2. implement the database migration system so local schema can evolve across app updates without data loss.
3. implement the offline scan capture flow:
   - camera PPG scans write results to local `scan_results` table immediately upon completion
   - no network call is required or attempted before the local write succeeds
   - the user sees confirmation of their scan result from local data, never from a server response
4. implement deterministic procedural generation for offline use:
   - galaxy seed is generated once and stored in local `galaxy_state` table
   - all system names, positions, biomes, and creature availability are derived from the seed using a pure function
   - the generation algorithm must produce identical output for identical seeds on any device, any platform, any app version
   - no network call is required for galaxy generation or journey progression
5. implement creature discovery persistence:
   - when a creature is discovered, write to local `creatures` table immediately
   - variant parameters are calculated and stored locally
   - the user sees the creature reveal from local data
6. implement journey progress persistence:
   - fuel, XP, streak, ship class, and current position are stored locally in `journey_progress`
   - all progression calculations happen against local state
7. implement the sync queue:
   - every local write that needs server replication also inserts a row into `sync_queue`
   - sync queue fields: `id`, `table_name`, `record_id`, `operation` (INSERT/UPDATE/DELETE), `payload` (JSON), `created_at`, `synced_at`, `retry_count`, `status` (pending/in_flight/synced/failed/conflict)
   - sync queue processing runs when the app detects a network connection
   - failed sync attempts increment `retry_count` and use exponential backoff (base: 5 seconds, max: 5 minutes, jitter: +/- 20%)
   - after 10 consecutive failures for a single item, mark status as `failed` and surface a non-blocking alert to the user
8. implement conflict resolution rules:
   - **scan data**: device-authoritative. The user's health data on their device is always trusted. If the server has a different value for the same scan, the device version wins. Rationale: the user performed the scan on this device; their device is the source of truth.
   - **creature discoveries**: additive merge. If a creature exists on either device or server, it exists everywhere. Discoveries are never deleted by sync. Duplicate detection uses the composite key (user_id, creature_id, variant_hue, variant_pattern_density).
   - **journey progress**: max-wins. For numeric progress fields (total_systems_visited, total_xp_earned, longest_streak), the higher value wins. For current position fields (current_system_index), the most recently updated value wins based on `updated_at` timestamp.
   - **galaxy state**: deterministic, no conflicts possible. The same seed always produces the same galaxy. If two devices have different seeds (which should not happen), the earliest `generated_at` timestamp wins.
   - **user preferences**: last-write-wins based on `updated_at` timestamp.
9. implement network state detection:
   - use `NetInfo` (via `@react-native-community/netinfo` or Expo equivalent) to detect online/offline state
   - when offline: all features work normally using local data; sync queue accumulates
   - when transitioning to online: trigger sync queue drain automatically
   - when transitioning to offline during sync: pause gracefully, mark in-flight items as pending
   - never show a blocking "no connection" screen; the app must be fully usable offline
10. implement graceful degradation for network-dependent features:
    - features that require network (e.g., account creation, premium purchase verification): show a clear but non-alarming message explaining the feature requires connectivity
    - features that are enhanced by network but work offline (e.g., creature lore updates, seasonal event data): use cached data and note that content may not be current
    - the Bridge, scan, journey, creature discovery, and music playback must never require network

#### Deliverables

- working expo-sqlite database with full local schema
- offline scan capture flow (scan -> local write -> user confirmation, no network required)
- deterministic procedural generation working entirely offline
- local creature discovery persistence
- local journey progress persistence
- sync queue with retry logic and exponential backoff
- conflict resolution implemented per the rules above
- network state detection and graceful degradation
- integration test proving: airplane mode -> scan -> creature discovery -> journey progress -> all data persisted locally -> network restored -> sync completes

### Workstream 1.3: Schema, Security, and Seed Data

#### Goal

Build the server-side backend structure that supports auth, vitals, creatures, journey state, achievements, and music sessions.

#### Steps

1. implement the server schema from the Database Schema section of this document in Supabase migrations.
2. apply all row-level security policies as defined in the schema.
3. test user isolation with multiple test accounts: verify that user A cannot read or write user B's data across all tables.
4. seed:
   - creature species definitions
   - achievement definitions
   - starter journey galaxy seeds
5. verify that seeded content can be read by authenticated users without manual database edits.
6. define backup and rollback rules for critical user data:
   - Supabase point-in-time recovery enabled
   - daily automated backups
   - documented restore procedure

#### Deliverables

- migrated server schema
- verified RLS policies (test report showing user isolation)
- working seed scripts
- backup and rollback documentation

### Workstream 1.4: Information Architecture and Design System

#### Goal

Lock the product surfaces and visual language that all later work will build on. Ensure accessibility is baked into the design system from the start.

#### Steps

1. lock the information architecture:
   - Bridge
   - Check-In
   - Galaxy
   - Resonance Chamber and Field Guide
   - Signal Deck Lite
   - Log
2. define design tokens for:
   - S1 warm palette (must pass WCAG AA contrast checks)
   - S2 cool palette (must pass WCAG AA contrast checks)
   - neutral surfaces
   - motion timing (with reduced-motion alternatives)
   - depth and parallax
   - display typography versus UI typography
   - minimum touch target sizes (44x44pt iOS, 48x48dp Android)
3. define the UI sound rules for taps, confirmations, errors, XP gains, and discoveries.
4. produce low-fidelity flows for:
   - onboarding
   - first scan
   - manual log
   - guided breathing
   - first travel
   - first creature reveal
   - Signal Deck Lite history view
5. produce one polished Bridge benchmark screen in the intended final style.
6. verify all flows have accessible labels, screen reader navigation order, and sufficient contrast.
7. define the high-contrast mode token overrides.

#### Deliverables

- locked information architecture
- design token set (with accessibility compliance verification)
- flow wireframes
- Bridge benchmark screen

### Workstream 1.5: Analytics, Debugging, and QA Harness

#### Goal

Make the product observable and testable before feature complexity grows.

#### Steps

1. implement the minimum analytics event map into staging.
2. create debug views or dev-only tooling for:
   - current user state
   - streak and XP state
   - journey position
   - creature unlock eligibility
   - pay tier and entitlements
   - sync queue status (pending, in-flight, failed items)
   - local database inspector
   - network state indicator
3. create the first QA scripts for:
   - onboarding completion
   - first scan (with local persistence verification)
   - duplicate import handling
   - offline logging (airplane mode scan flow)
   - reinstall and restore (verify deterministic galaxy regeneration)
   - account deletion
   - sync queue drain after offline period
4. define blocker severity for beta:
   - any data loss (SEV-1)
   - broken onboarding (SEV-1)
   - scan lockups (SEV-1)
   - audio failures (SEV-2)
   - entitlement failures (SEV-2)
   - sync queue permanently stuck (SEV-2)
   - local database corruption (SEV-1)

#### Deliverables

- staging analytics baseline
- developer debug tooling (including sync and local DB inspection)
- first QA script set (including offline scenarios)
- blocker severity rules

### Workstream 1.6: Content Manifest Setup

#### Goal

Make the first 50 species operationally trackable.

#### Steps

1. load the 50-species bible set into the content manifest.
2. mark exactly 20 species as `playable_mvp`.
3. mark the remaining 30 as `silhouette_in_mvp` with planned phase targets.
4. assign art and audio planning status to every species.
5. verify that the MVP set contains enough early rewards to support the first-week habit loop.

#### Deliverables

- working species manifest
- verified 20-creature MVP set
- silhouette roadmap assignments

### Phase 1 Deliverables

- stable environments
- local-first data layer with offline scan capture
- sync queue and conflict resolution
- seeded backend
- locked app surfaces
- design system baseline (accessibility-compliant)
- analytics and debug baseline
- QA harness (including offline scenarios)
- content manifest

### Exit Gate

- environments stable
- local SQLite schema initialized and migration system working
- offline scan -> local persist -> sync verified in integration test
- server schema and RLS verified
- analytics firing in staging
- seed data usable
- navigation locked
- Bridge benchmark approved
- CI/CD pipeline running (lint, typecheck, test on every PR)
- all design tokens pass WCAG AA contrast checks

## Phase 2: First Signal MVP Build

### Relative Timing

- start: `Week 5`
- duration: `14 weeks`

### Objective

Build an iOS MVP that proves the first-hour magic loop and the first-week habit loop.

### Success Definition

Phase 2 is successful when a new user can move smoothly from onboarding to first scan to first movement to first creature to first music playback, and then return often enough for retention to be testable in beta.

### Camera PPG Fallback Deadline

The camera PPG algorithm must achieve the following accuracy targets by the Phase 2 exit gate:

- heart rate within +/-5 BPM of a reference device (Apple Watch or chest strap) for >= 85% of scans under normal conditions (adequate lighting, still finger, supported device)
- scan success rate (non-rejected scans) >= 70% across the device matrix

If these targets are not met by the Phase 2 exit gate:

1. **primary fallback**: promote HealthKit/Health Connect import and manual entry to equal-first-class input methods. Camera scanning becomes an optional convenience feature rather than the primary onboarding path. The onboarding flow adapts to guide users toward their best input method.
2. **secondary fallback**: if camera PPG accuracy is below 60% or scan success rate is below 50%, remove camera PPG from the onboarding flow entirely. The scan becomes a settings-accessible optional feature with clear "experimental" labeling. Onboarding guides users to connect HealthKit or enter vitals manually.
3. **scope reduction fallback**: if neither camera PPG nor imported data achieves sufficient adoption (>= 50% of users logging at least one vital per day by any method), reduce the vital-dependent features to manual-entry-only mode and shift creature triggers to rely more heavily on behavioral inputs (breathing sessions, mood logs, activity logs) rather than biometric inputs.

The fallback decision is made at the Phase 2 exit gate and documented in the release gate scorecard. The chosen fallback does not block Phase 3 launch as long as at least one reliable input method achieves the adoption target.

### Weeks 5-6: Shell, Auth, and Seeding

#### Action Item 2.1: Auth and App Shell

##### Goal

Let a new user enter the product and reach the core surfaces without confusion.

##### Steps

1. implement Apple Sign-In.
2. implement email login as a fallback path.
3. persist onboarding completion state to local database.
4. persist ship naming and basic user preferences to local database.
5. build shell navigation for all MVP surfaces.
6. make every empty state feel like an intentional in-world state rather than a missing feature.
7. implement accessible navigation with proper VoiceOver labels and tab order.

##### Deliverables

- working auth flows
- app shell with accessible navigation
- persistent onboarding and profile state (local-first)

#### Action Item 2.2: Starter Journey and Debug Baseline

##### Goal

Make sure every new account can enter a valid starting universe.

##### Steps

1. seed the starter linear 50-system path for new users using deterministic generation from the local galaxy seed.
2. verify that system names generate consistently from the same seed.
3. verify that seeded planets and creature opportunities exist where expected.
4. confirm that a test user can reach first travel without any database intervention or network connection.
5. expose journey and trigger state in debug tooling for rapid validation.

##### Deliverables

- valid starter journey (generated and stored locally)
- usable debug inspection for early progression

### Weeks 7-8: Camera HR and Import Baseline

#### Action Item 2.3: Camera HR Flow

##### Goal

Turn camera-based HR scanning into a trustable ritual instead of a gimmick.

##### Steps

1. implement camera permission request flow with calm explanatory copy.
2. build finger placement overlay and measurement feedback.
3. implement real-time signal quality assessment.
4. implement confidence scoring.
5. reject low-confidence scans explicitly rather than returning misleading results.
6. define low-confidence fallback copy that points the user toward retry, manual entry, or imported HR.
7. write scan results to local `scan_results` table immediately upon completion, before any network call.
8. enqueue the scan result for server sync via the sync queue.
9. instrument start, success, failure, and abandonment events.
10. implement VoiceOver announcements for scan states: "ready to scan", "scanning in progress", "scan complete, heart rate [value]", "scan failed, please try again".
11. implement haptic feedback for scan progress and completion.
12. ensure the scan start/stop button meets the 64x64pt minimum touch target.

##### Deliverables

- scan permissions flow
- confidence-based scan engine
- local-first scan persistence
- fallback messaging
- instrumentation for scan quality
- accessible scan interface (VoiceOver, haptics, touch targets)

#### Action Item 2.4: HealthKit Import

##### Goal

Reduce reliance on camera-only capture and improve trust for already tracked users.

##### Steps

1. integrate HealthKit for heart rate and resting heart rate.
2. define source attribution rules for imported versus manual or camera-entered data.
3. define duplicate handling and latest-value selection rules.
4. write imported data to local `scan_results` table with source = 'healthkit'.
5. test permission granted, permission denied, revoked permission, and partial-data scenarios.
6. ensure imported HR can participate in progression if camera scanning is weak on a device.

##### Deliverables

- HealthKit integration
- source attribution rules
- duplicate-handling behavior
- local-first imported data persistence

### Weeks 9-10: Bridge, Progression, Signal Deck Lite, and Guided Breathing

#### Action Item 2.5: Bridge and Core Progression

##### Goal

Make the home screen emotionally sticky and mechanically useful.

##### Steps

1. implement the Bridge cockpit with parallax viewport (with reduced-motion alternative).
2. implement the HR, BP, HRV, and SpO2 instruments with graceful empty states.
3. implement fuel rules from the product bible.
4. implement XP gain logic.
5. implement ship-class scaffolding and unlock display.
6. implement the 48-hour grace-based streak system.
7. add lightweight milestone celebrations for XP, streak, and firsts (with haptic alternatives).
8. all progression state reads from and writes to local database.

##### Deliverables

- Bridge screen (with accessibility and reduced-motion support)
- progression rules (local-first)
- streak system
- milestone presentation

#### Action Item 2.6: Manual Logging

##### Goal

Make optional logging fast enough to feel additive rather than burdensome.

##### Steps

1. implement BP entry.
2. implement sleep entry.
3. implement mood entry.
4. implement activity entry.
5. implement any supporting context logs needed for creature triggers, such as caffeine if kept in scope.
6. ensure all forms are one-handed and fast, with minimum 44x44pt touch targets.
7. connect each completed log to fuel and analytics events.
8. all manual log entries persist to local database first.

##### Deliverables

- fast manual-entry flows (accessible, local-first)
- log-to-fuel integration

#### Action Item 2.7: Signal Deck Lite

##### Goal

Prevent the roadmap from losing one of the core ship surfaces while keeping the initial implementation small.

##### Steps

1. implement a minimal Signal Deck landing screen.
2. show recent-history views for the most recent heart rate and other logged vitals, reading from local database.
3. use simple waveform or chart treatments that match the ship aesthetic.
4. reserve space in the UI for future pattern-lock and doctor-report modules.
5. make sure the surface feels intentionally limited, not abandoned.
6. ensure chart data is accessible via VoiceOver (provide text summaries of trends).

##### Deliverables

- Signal Deck Lite
- recent-history views (local data)
- future-ready layout shell

#### Action Item 2.8: Guided Breathing

##### Goal

Deliver the breathing feature promised by the free tier and used by at least one creature trigger.

##### Steps

1. implement a short guided breathing flow.
2. make the visual and audio treatment match the S1/S2 atmosphere.
3. provide haptic rhythm as an alternative to visual-only pacing.
4. define a clear completion event.
5. connect breathing completion to creature triggers and analytics.
6. expose breathing from at least one obvious in-app surface.
7. persist breathing session completion to local database.

##### Deliverables

- guided breathing feature (with haptic pacing)
- trigger and analytics integration

### Weeks 11-12: Linear Galaxy and Travel

#### Action Item 2.9: Journey Rendering

##### Goal

Translate daily tracking into visible movement.

##### Steps

1. render the linear 50-system journey using the rendering stack chosen during the Phase 0 spike.
2. implement system naming and visited-state handling, all derived from local galaxy state.
3. map fuel to travel distance.
4. implement travel animation (with instant-transition alternative for reduced-motion users).
5. derive system color from health data using the calm, active, and intense logic from the bible.
6. verify that color language stays descriptive instead of judgmental.
7. implement accessible galaxy navigation: screen reader users can navigate systems via swipe gestures with system name and status announcements.

##### Deliverables

- working linear galaxy (rendered from local state)
- travel animation (with reduced-motion alternative)
- health-derived color system
- accessible galaxy navigation

#### Action Item 2.10: First Points of Interest

##### Goal

Make systems feel discoverable instead of empty.

##### Steps

1. implement planets as the initial points of interest.
2. connect creature availability to trigger logic instead of random chance, using local data.
3. show subtle resonance hints in the viewport and map.
4. create a weekly-summary content stub so Listening Posts have a downstream path later.
5. verify that users understand why a planet matters even before the full map expands.

##### Deliverables

- planets
- resonance hinting
- weekly-summary content stub

### Weeks 13-14: Creatures and Collection

#### Action Item 2.11: The 20-Creature MVP Set

##### Goal

Create the first reward economy that teaches users why tracking is worth repeating.

##### Steps

1. implement the 20 `playable_mvp` species from the content manifest.
2. verify each species has:
   - trigger logic
   - lore
   - rarity
   - resonance class
   - illustration hook
   - audio hook
3. tune the set so at least three creatures can appear in the first 48 hours for an engaged user.
4. tune the set so >= 85% of beta testers discover at least one creature within 2 sessions.
5. persist all creature discoveries to local database immediately upon discovery.

##### Deliverables

- 20-creature MVP set
- tuned early discovery pacing
- local-first creature discovery persistence

#### Action Item 2.12: Variant Generation

##### Goal

Make discoveries feel owned rather than generic.

##### Steps

1. map resting HR to hue.
2. map HRV to pattern density.
3. map sleep quality to glow intensity.
4. map streak length to size modifier.
5. map time of day to accent color.
6. define guardrails so extreme data still produces tasteful outputs.
7. store the variant parameters in local database so the same creature re-renders consistently later.

##### Deliverables

- variant generation rules
- persistent variant state (local-first)

#### Action Item 2.13: Field Guide and Resonance Chamber

##### Goal

Give discoveries a home and make the collection feel cumulative.

##### Steps

1. build Field Guide detail pages with lore, field notes, discovery context, and acoustic signature controls.
2. build the MVP Resonance Chamber as a grid view.
3. add silhouette entries for the remaining 30 species in the visible roadmap.
4. ensure the Chamber and Guide visually communicate progress and mystery at the same time.
5. ensure all creature entries are accessible: name, rarity, and lore readable by screen readers.

##### Deliverables

- Field Guide detail view (accessible)
- Resonance Chamber grid
- 50-species visible roadmap

### Weeks 15-16: Audio v1

#### Action Item 2.14: Audio Foundation

##### Goal

Make music a real part of the product loop, not a decorative afterthought.

##### Steps

1. implement the mobile-safe audio stack chosen during the feasibility spike.
2. generate S1 and S2 fundamentals from resting HR.
3. implement one biome bed.
4. implement creature voice layering.
5. test playback startup, interruption recovery, Bluetooth output, and app background handling.
6. document known audio limitations before beta if any remain.
7. ensure playback state is visually indicated (not audio-only) for deaf and hard-of-hearing users.

##### Deliverables

- functioning audio foundation
- S1 and S2 fundamentals
- one biome bed
- creature voice layer
- visual playback state indicator

#### Action Item 2.15: Play Today

##### Goal

Give users a clear reason to feel that their body is composing their universe.

##### Steps

1. implement `Play Today`.
2. use the current biome plus today's data (from local database) to drive the arrangement.
3. expose playback from the Bridge.
4. instrument start, completion, interruption, and repeat behavior.
5. verify that at least a minimal soundscape still plays for low-data users.

##### Deliverables

- Play Today
- playback instrumentation

### Weeks 17-18: Beta Prep and Store Prep

#### Action Item 2.16: Cinematic Onboarding

##### Goal

Make the first-run experience memorable enough to justify the unusual premise.

##### Steps

1. implement the four-screen S1/S2 onboarding sequence.
2. implement setup screens for name, first scan, and ship reveal.
3. tune pacing so the sequence feels premium rather than slow.
4. instrument every onboarding screen and completion step.
5. fix the highest-drop screens before expanding the beta audience.
6. ensure the onboarding sequence is fully navigable with VoiceOver.
7. ensure all onboarding animations respect the reduced-motion preference.

##### Deliverables

- cinematic onboarding flow (accessible)
- setup flow instrumentation

#### Action Item 2.17: Reminders and Re-Engagement

##### Goal

Support the habit loop without becoming annoying.

##### Steps

1. implement reminder scheduling logic.
2. define quiet hours (stored in local user preferences).
3. create reminder copy variants for morning, evening, streak-risk, and resonance moments.
4. instrument prompt, permission result, open, and post-open check-in behavior.
5. cap notification frequency so the product never feels like a nagging health utility.

##### Deliverables

- reminder system
- reminder copy set
- notification instrumentation

#### Action Item 2.18: Beta Operations and Store Package

##### Goal

Prepare the product for controlled external testing and later store submission.

##### Steps

1. prepare privacy policy, terms, support URLs (using the support email from Phase 0), and FAQ.
2. define beta feedback tags:
   - activation
   - trust
   - quality
   - delight
   - monetization
   - accessibility
3. define bug triage categories.
4. define acceptance checklists for art, audio, and lore.
5. recruit 20-50 beta testers (include at least 2 testers who use VoiceOver regularly).
6. prepare screenshot and preview asset requirements even if final capture comes later.

##### Deliverables

- beta operations playbook
- legal and support docs
- content acceptance checklists
- beta tester cohort (including accessibility testers)

### Phase 2 Deliverables

- iOS MVP (local-first, accessible)
- closed beta
- first-hour magic loop
- first-week habit loop instrumentation
- launch package draft
- camera PPG fallback decision documented

### Exit Gate

- onboarding completion >= `75%`
- first successful scan >= `70%`
- crash-free sessions >= `99.5%`
- >= 85% of testers discover first creature within 2 sessions
- first music play within week one for >= `35%` of beta users
- scan processing time < 3 seconds (median)
- app cold start < 2 seconds on iPhone 12+
- creature animation frame rate >= 30 fps
- camera PPG accuracy within +/-5 BPM of reference for >= 85% of scans, OR fallback plan activated and documented
- all local-first data flows verified: offline scan, offline discovery, sync queue drain
- VoiceOver navigation functional for all primary flows

## Phase 3: First Signal Launch and Stabilization

### Relative Timing

- start: `Week 19`
- duration: `4 weeks`

### Objective

Launch in controlled stages, tune aggressively, and protect trust before expanding the product surface area.

### Success Definition

Phase 3 is successful when launch metrics prove that the core experience retains users well enough to justify Deep Signal, and when support and trust signals remain healthy enough to handle more growth.

### Workstream 3.1: Staged Release Structure

#### Goal

Avoid a single high-risk launch moment by using controlled expansion.

#### Steps

1. start with closed beta.
2. expand to a wider beta group once the first-hour journey is stable.
3. launch to a limited public audience before a full App Store push.
4. move to full public release only if launch-week gates stay healthy.
5. keep release notes and changelog discipline strict throughout the staged rollout.

#### Deliverables

- staged release sequence
- release-note cadence

### Workstream 3.2: App Store Metadata and Launch Marketing

#### Goal

Prepare the complete App Store presence and run the first public campaign in a way that matches the bible without overwhelming support capacity.

#### App Store Metadata Preparation

1. write the App Store description (short and long) in the brand voice:
   - lead with the experience promise, not health metrics
   - emphasize the game-world framing
   - include the key free-tier promises (health logging, creature discovery, music)
   - mention premium briefly and honestly
   - include the support email address
2. prepare App Store screenshots:
   - 6.7" (iPhone 15 Pro Max) and 6.1" (iPhone 15 Pro) required sizes
   - capture the Bridge, a scan in progress, a creature discovery, the galaxy, the Resonance Chamber, and Play Today
   - add minimal text overlays in the brand voice
   - ensure screenshots represent the actual shipped UI (no mockups that differ from reality)
3. prepare the App Store preview video:
   - 15-30 second capture of the first-hour flow: scan -> travel -> creature discovery -> music
   - no voice-over; let the atmosphere speak
   - review for any inadvertent health-data exposure
4. define App Store keywords (100 character limit):
   - primary: health, heart rate, tracker, space, creatures, music, meditation, wellness
   - avoid: medical, diagnosis, doctor, clinical
5. select the primary and secondary App Store categories:
   - primary: Health & Fitness
   - secondary: Games (if Apple allows dual listing) or Entertainment
6. prepare the App Store privacy nutrition label:
   - document all data types collected, linked, and tracked per Apple's categories
   - align with the privacy policy
   - review against `planning/S1S2-App-Review-Compliance-Pack.md`
7. prepare the App Review notes:
   - explain the camera PPG feature and its non-medical nature
   - provide a demo account if needed
   - preemptively address likely review questions about health claims
   - reference the health-data disclaimer copy
8. prepare the age rating questionnaire:
   - no violent content, no user-generated content at MVP
   - if social features launch later, update the rating

#### Marketing Steps

1. start pre-launch activity four weeks before submission.
2. launch the waitlist email sequence.
3. publish teaser waveform content and creature art drip.
4. prepare preview video capture plan.
5. submit to Product Hunt and relevant editorial opportunities only when the store page is ready.
6. route public attention toward the game-first screenshots and preview, not toward medical framing.

#### Deliverables

- complete App Store listing (description, screenshots, preview video, keywords, categories, privacy label, review notes)
- waitlist conversion sequence
- teaser campaign
- preview and store asset plan

### Workstream 3.3: Live-Ops Tuning Sprint

#### Goal

Turn the first month into a focused tuning cycle rather than a passive launch.

#### Steps

1. review activation metrics daily during week one.
2. review D1, scan success, reminder response, first creature timing, and music usage daily during week one.
3. review D7, support themes, and rating signals twice weekly after week one.
4. tag every complaint into:
   - acquisition mismatch
   - onboarding friction
   - trust issue
   - quality defect
   - boredom or low delight
   - accessibility barrier
5. prioritize fixes that improve activation, trust, and early delight over feature expansion.
6. keep a public-facing known-issues list if repeated questions emerge.

#### Deliverables

- launch metric review cadence
- complaint-tag taxonomy in use
- tuned first-month experience

### Workstream 3.4: Hold-Sprint Management

#### Goal

Prevent the roadmap from outrunning the product's actual health.

#### Steps

1. watch the explicit hold triggers:
   - D1 below `50%`
   - D7 below `35%`
   - first successful scan below `65%`
   - support load above founder capacity (defined as > 20 tickets per day unresolved)
   - repeated privacy or scan-trust complaints (>= 5 unique users reporting the same concern within 7 days)
2. if any hold trigger fires, freeze Phase 4 work.
3. define the hold sprint around the highest-leverage issue only.
4. retest the first-hour journey after every hold sprint.
5. restart roadmap advancement only after the failing gate improves.

#### Deliverables

- hold-sprint rule in operation
- documented resolution path for failed gates

### Phase 3 Deliverables

- staged public release
- complete App Store presence
- live-tuned launch month
- validated or rejected readiness for Deep Signal

### Exit Gate

- D1 >= `60%`
- D7 >= `38%`
- average check-ins >= `1.5` per active user per day
- first-week discoveries >= `8` per active user
- App Store rating >= `4.5`
- support response time < 24 hours for >= 95% of tickets
- sync queue error rate < `1%` (failed items as percentage of total synced items)

## Phase 4: Deep Signal Build

### Relative Timing

- start: immediately after the Phase 3 exit gate
- duration: `10 weeks`

### Objective

Expand the MVP into the richer premium-ready product promised by the product bible while keeping the free-tier trust contract intact.

### Success Definition

Phase 4 is successful when the product no longer feels like a prototype expansion of a single loop, but instead feels like a deeper universe with meaningful premium depth that users can understand and value.

### Workstream 4.1: Graph Galaxy and Exploration Depth

#### Goal

Replace the MVP linear journey with the full exploration model.

#### Steps

1. replace the linear path with a graph-based galaxy.
2. implement fog of war.
3. implement the full biome set:
   - nebula
   - asteroid field
   - gas giant
   - binary star
   - deep void
   - stellar nursery
   - pulsar
   - black hole vicinity
4. implement zoom levels from local system view to broader journey view.
5. add Echoes as personal-best or improvement markers.
6. add Listening Posts as weekly milestone stations.
7. preserve deterministic generation rules across reinstall and multi-device restore. All graph galaxy generation must work from the local seed with no network dependency.
8. verify galaxy rendering performance: >= 24 fps with 200+ systems on iPhone 12.
9. provide accessible navigation for graph galaxy: sequential system traversal via swipe, system detail announcements.

#### Deliverables

- graph galaxy (local-first, deterministic, accessible)
- biome system
- Echoes
- Listening Posts
- deterministic restore behavior

### Workstream 4.2: Creature Expansion to Full First Catalog

#### Goal

Expand from the MVP reward economy to the full first shipped catalog promised by the early product.

#### Steps

1. ship the remaining 30 species from the visible roadmap so the product reaches the first full 50-species catalog.
2. verify that Common and Uncommon species remain the free-tier backbone.
3. add improved trigger logic for medium-term behavior and multi-metric conditions.
4. improve discovery presentation so it feels more like a real event than a pop-up reward.
5. redesign Resonance Chamber from a grid into a room-like display.
6. add class and rarity filters to the Field Guide.
7. all new creature discoveries persist locally first via the existing local-first flow.

#### Deliverables

- 50 shipped species
- improved trigger engine
- room-view Resonance Chamber
- expanded Field Guide controls

### Workstream 4.3: Music Expansion

#### Goal

Turn music into a deeper premium-worthy system.

#### Steps

1. add all biome beds.
2. add richer creature voice layers.
3. add `Play This Week`.
4. add `Play My Journey`.
5. add `S1 vs S2`.
6. add export.
7. verify that exported files contain no health data in filenames or metadata.
8. verify audio performance under higher content density.

#### Deliverables

- full biome-bed set
- advanced playback modes
- safe export flow

### Workstream 4.4: Premium v1 and Pricing

#### Goal

Introduce monetization without breaking trust or confusing the free-tier promise. Use RevenueCat as the billing SDK for cross-platform subscription management.

#### Billing SDK: RevenueCat

RevenueCat (`react-native-purchases`) is the billing SDK for S1S2. It handles:

- App Store and Play Store receipt validation
- subscription lifecycle management (new, renewal, cancellation, billing issue, grace period)
- entitlement management (premium vs free)
- cross-platform purchase restore
- server-side webhook for subscription state sync to Supabase
- analytics dashboard for MRR, churn, trial conversion

#### Price Points

| Plan | Price (USD) | Notes |
|---|---|---|
| Monthly | $4.99/month | standard subscription |
| Annual | $29.99/year (~$2.50/month) | 50% discount vs monthly; promoted as best value |
| Lifetime | $79.99 one-time | available only after 30 days of active use; may be adjusted or removed based on Phase 4 financial review |

Price points will be validated during Phase 4 through:
- A/B testing the annual vs monthly presentation order
- monitoring conversion rate, average revenue per user, and lifetime value
- adjusting if monthly conversion is below 3% or annual take rate is below 40% of conversions

#### Free vs Premium Feature Split

**Always Free (never gated):**
- health logging (camera PPG, manual entry, HealthKit/Health Connect import)
- health viewing (Signal Deck Lite with recent history)
- health data export (CSV)
- concerning trend alerts
- guided breathing
- basic creature discovery (Common and Uncommon creatures)
- daily music generation (Play Today with one biome bed)
- linear galaxy journey (MVP 50-system path)
- 20-creature MVP set interactions
- streaks, XP, and basic progression

**Premium:**
- full graph galaxy exploration (fog of war, all biomes)
- Rare, Epic, Legendary, Mythic, and Harmonic creature tiers
- unlimited health history (free tier shows last 30 days)
- advanced music modes (Play This Week, Play My Journey, S1 vs S2)
- audio export
- ship customization
- Doctor Report (when available)
- Resonance Gates and hidden biomes (when available)
- advanced variant details and creature comparison tools

#### Steps

1. integrate RevenueCat SDK (`react-native-purchases`).
2. configure products in App Store Connect and RevenueCat dashboard.
3. connect entitlements to the approved entitlement matrix only.
4. implement the RevenueCat webhook to sync subscription state to the Supabase `subscriptions` table.
5. define eligible paywall moments:
   - after clear product attachment (>= 3 sessions completed)
   - at premium history boundaries (when user tries to view data older than 30 days)
   - at advanced music or export intent
   - at graph galaxy boundary (when user reaches end of linear journey)
6. verify that no paywall interrupts health-critical actions (logging, viewing recent data, export, alerts).
7. package premium-v1 around only live benefits per the feature split above.
8. if `Doctor Report v1` is ready in this phase, include it carefully.
9. if `Doctor Report v1` is not ready, remove it from premium marketing.
10. do not market third-party wearable sync unless at least one supported non-Apple integration is already live.
11. implement purchase restore flow with clear UI.
12. implement subscription status display in settings.
13. implement graceful downgrade when subscription expires (data retained, premium features locked).

#### Deliverables

- RevenueCat integration
- configured price points
- premium-v1 implementation
- paywall surfaces
- entitlement-safe packaging
- subscription webhook syncing to Supabase

### Workstream 4.5: Deep Signal QA and Financial Validation

#### Goal

Make sure the richer product is both stable and commercially coherent.

#### Steps

1. retest the full first-hour journey with the deeper content set.
2. retest determinism, export safety, and entitlement boundaries.
3. monitor premium conversion, refund rate, and support tickets from premium users.
4. review whether the content cost curve still makes sense under real conversion.
5. decide whether lifetime pricing remains permanent, seasonal, or adjusted later.
6. validate all performance targets still met with expanded content (galaxy rendering, creature animations).

#### Deliverables

- Deep Signal regression pass
- premium health report
- content cost review
- performance validation report

### Phase 4 Deliverables

- full graph galaxy
- 50 shipped species
- advanced music system
- premium-v1 (RevenueCat, priced, feature-gated)
- validated post-MVP business loop

### Exit Gate

- D30 retention >= `30%`
- premium conversion of eligible retained users >= `5%`
- refund rate <= `5%`
- App Store rating maintained >= `4.5`
- support load stable (< 20 unresolved tickets per day)
- galaxy rendering >= 24 fps with full graph on iPhone 12
- RevenueCat webhook processing without errors for >= 99% of events

## Phase 5: Android and Revenue Expansion

### Relative Timing

- start: immediately after the Phase 4 exit gate
- duration: `6 weeks`

### Objective

Bring S1S2 to Android, make billing operations durable, and turn Seasonal Transmissions into a repeatable product and marketing loop.

### Success Definition

Phase 5 is successful when Android is stable enough to scale cautiously, Health Connect is reliable, billing issues are manageable, and seasonal content proves it can drive repeat engagement.

### Workstream 5.1: Android Port

#### Goal

Ship a version of S1S2 that respects the realities of Android device fragmentation.

#### Steps

1. audit every iOS-specific assumption in permissions, camera access, audio handling, notifications, and background behavior.
2. implement the Android-specific fixes required for parity.
3. define a device matrix that includes lower-end and mid-range Android hardware, not only flagship devices.
4. test startup time, camera reliability, audio stability, and animation performance across the matrix.
5. document any known Android-specific limitations before wider rollout.
6. verify TalkBack accessibility across all primary flows.
7. verify all touch targets meet the 48x48dp Android minimum.
8. configure EAS Build for Android (APK for testing, AAB for Play Store).
9. set up the Play Store listing with metadata mirroring the App Store (adapted for Play Store requirements).

#### Deliverables

- working Android build
- Android device matrix
- Android-specific known-issues list
- Play Store listing (description, screenshots, privacy section, review notes)
- TalkBack accessibility verification

### Workstream 5.2: Health Connect

#### Goal

Make imported health data viable on Android from day one.

#### Steps

1. integrate `Health Connect`.
2. map imported metrics to the same normalized model used on iOS.
3. test permission flows and revoked access handling.
4. test duplicate and partial-import cases.
5. verify imported HR and other supported signals can participate in progression safely.
6. imported data writes to local database first, then syncs via the same sync queue.

#### Deliverables

- Health Connect integration
- normalized Android import model

### Workstream 5.3: Seasonal Transmissions

#### Goal

Create the first recurring event system that drives both retention and marketing.

#### Steps

1. define the monthly challenge framework.
2. define how challenge progress is measured and surfaced.
3. define free versus premium participation rules.
4. design the first event with:
   - a clear theme
   - a clear reward
   - a reachable target
5. define launch assets and cadence for each event.
6. verify event completion does not require hidden or confusing mechanics.

#### Deliverables

- seasonal event framework
- first live transmission
- event reward and communications plan

### Workstream 5.4: Billing and Revenue Operations

#### Goal

Make monetization supportable at scale.

#### Steps

1. operationalize purchase restore (RevenueCat handles cross-platform).
2. operationalize refund handling via RevenueCat webhook events.
3. operationalize failed-renewal and billing-problem messaging.
4. create entitlement-audit procedures for support.
5. update support macros for Android billing and restore cases.
6. compare Android and iOS conversion and retention before scaling Android marketing.

#### Deliverables

- billing operations playbook
- entitlement-audit process
- Android-versus-iOS monetization comparison

### Phase 5 Deliverables

- Android release
- Health Connect support
- first Seasonal Transmission
- durable billing operations

### Exit Gate

- Android crash-free session rate >= `99%`
- Android cold start < 3 seconds on mid-range devices (e.g., Samsung Galaxy A54)
- Android scan success rate within 10 percentage points of iOS
- Health Connect import reliable (>= 95% of imports complete without error)
- Seasonal Transmission completion rate >= `20%` of eligible active users
- billing support ticket volume < 5% of total support volume

## Phase 6: Full Spectrum Cycle 1

### Relative Timing

- start: first growth cycle after the Phase 5 exit gate
- duration: `3 months`

### Objective

Add the first major retention moat through passive-data depth, social gravity, and usable correlations.

### Success Definition

Phase 6 is successful when wearables reduce friction, social systems create gentle external motivation, and correlations make the product feel more intelligent without crossing into diagnosis.

### Workstream 6.1: Wearable Expansion

#### Goal

Expand passive-data capture in the order most aligned with the product's design-forward audience.

#### Steps

1. implement integrations in this order:
   - Oura
   - Withings
   - Fitbit
   - Garmin
2. normalize imported data so downstream systems do not need source-specific logic.
3. add sync-status surfaces so users can tell whether data imported correctly.
4. add fallback messages when sync is stale or partial.
5. instrument import reliability and downstream feature impact.
6. wearable data writes to local database first, then syncs via the sync queue.

#### Deliverables

- wearable integrations
- sync-status UI
- import reliability instrumentation

### Workstream 6.2: Social Layer v1

#### Goal

Add social motivation without introducing pressure, toxicity, or privacy confusion.

#### Steps

1. launch Rhythm Partners with explicit opt-in pairing.
2. define partner visibility rules clearly.
3. add Resonance Chamber visits using safe share links or controlled sharing surfaces.
4. add Echo messages with strict limits and moderation hooks.
5. define abuse reporting, unlinking, and blocking rules before launch.
6. test whether social features increase return behavior without increasing support burden unacceptably.

#### Deliverables

- Rhythm Partners
- Chamber visits
- Echo messages
- moderation baseline

### Workstream 6.3: Correlation Engine v1

#### Goal

Make S1S2 feel more insightful without overclaiming medical meaning.

#### Steps

1. define a short list of allowed first correlations.
2. require confidence thresholds before insight delivery.
3. write insight copy in behavior language rather than diagnosis language.
4. connect high-confidence correlations to Harmonic creature discovery.
5. verify that insights are understandable and not overbearing.

#### Deliverables

- correlation engine v1
- confidence rules
- safe insight copy library

### Workstream 6.4: Growth-Cycle Operations

#### Goal

Ensure that the growth cycle does not create more operational debt than value.

#### Steps

1. compare support volume before and after wearable and social launches.
2. compare retention for users with and without connected wearables.
3. review whether imported data increases delight or merely adds sync confusion.
4. keep privacy and trust messaging updated if user questions shift.

#### Deliverables

- wearable-retention analysis
- support impact analysis
- updated trust FAQ

### Phase 6 Deliverables

- initial third-party wearables
- social layer v1
- correlation engine v1
- updated premium value narrative

### Exit Gate

- MRR >= `$5,000`
- support burden <= 30 unresolved tickets per day
- wearable-connected users show >= 15% higher D30 retention than non-connected users
- imported-data error rate < 2%

## Phase 7: Full Spectrum Cycle 2

### Relative Timing

- start: after the Phase 6 exit gate
- duration: `3 months`

### Objective

Scale the content engine, fulfill the free-tier content promise, and deepen utility through provider-ready reporting.

### Success Definition

Phase 7 is successful when S1S2 can sustain ongoing content production, free users can see the breadth of the universe, and doctor-facing outputs are good enough to be genuinely useful.

### Workstream 7.1: Content Pipeline at Scale

#### Goal

Turn content production into a predictable monthly machine.

#### Steps

1. define the monthly content workflow:
   - concept
   - art brief
   - sketch review
   - final art
   - acoustic signature
   - lore and field notes
   - implementation
   - QA
2. assign calendar checkpoints for each stage.
3. cap monthly drop volume to what the contractor pipeline can actually sustain.
4. treat content quality as more important than raw quantity.
5. use this cycle to reach `80+` free Common and Uncommon creatures by the end of the cycle.

#### Deliverables

- monthly content pipeline
- 80+ free Common and Uncommon creatures
- recurring content calendar

### Workstream 7.2: Resonance Gates and Hidden Biomes

#### Goal

Give long-term players a deeper exploration mechanic that feels special.

#### Steps

1. define how Seasonal Transmission completion unlocks Resonance Gates.
2. define hidden-biome visual language.
3. define hidden-biome music language.
4. define which creatures or rewards are exclusive to those spaces.
5. make the unlock rules legible enough that players feel challenged, not confused.

#### Deliverables

- Resonance Gates
- hidden-biome logic
- exclusive content mapping

### Workstream 7.3: Doctor Report Utility

#### Goal

Make S1S2 more useful during real-world care conversations without overreaching clinically.

#### Steps

1. if `Doctor Report v1` shipped earlier, upgrade to `Doctor Report v2`.
2. if it did not ship earlier, ship the first doctor-report version here.
3. include trend views for the most relevant metrics the app can support credibly.
4. label imported versus self-reported data clearly.
5. write the report in a tone that is clinically legible but not stripped of brand coherence.
6. test the report for readability in a normal healthcare context.

#### Deliverables

- doctor report feature
- provider-readable export output

### Workstream 7.4: Apple Watch Companion

#### Goal

Add a wrist companion only if it creates real speed and convenience.

#### Steps

1. validate that a watch check-in can be faster than the phone path.
2. implement quick HR check-in.
3. implement streak complication.
4. implement reminder handoff between phone and watch.
5. test whether the watch meaningfully increases frequency rather than duplicating existing behavior.

#### Deliverables

- Apple Watch quick check-in
- streak complication
- reminder handoff

### Phase 7 Deliverables

- scaled content pipeline
- 80+ free Common and Uncommon creatures
- Resonance Gates
- doctor-report utility
- Apple Watch companion if validated

### Exit Gate

- content pipeline sustains >= 5 new creatures per month without quality erosion
- doctor-report feature used by >= 10% of premium users within 30 days of availability
- content drops measurably reactivate >= 5% of lapsed users (users inactive for 14+ days who return within 7 days of a content drop)

## Phase 8: Full Spectrum Cycle 3

### Relative Timing

- start: after the Phase 7 exit gate
- duration: `6 months`

### Objective

Complete the long-term identity loops of the product through large-scale content, annual recap, localization, and mature community features.

### Success Definition

Phase 8 is successful when S1S2 no longer feels like an emerging app but like a living universe with enough content, identity, and ritual to sustain long-term engagement.

### Workstream 8.1: Long-Term Content Scale

#### Goal

Reach the intended long-term content depth without collapsing quality or operations.

#### Steps

1. grow the species catalog toward `200+`.
2. preserve rarity discipline so Legendary and Mythic creatures still feel special.
3. maintain content reviews for art, audio, lore, and implementation quality.
4. track content release impact on reactivation and retention, not just catalog size.

#### Deliverables

- 200+ creature catalog
- rarity governance
- content-impact reporting

### Workstream 8.2: Compare and Journey in Review

#### Goal

Create annual and longitudinal rituals that make the app feel personal and shareable.

#### Steps

1. implement `Compare` playback mode.
2. define how users select two periods safely and clearly.
3. implement `Journey in Review`.
4. define the annual recap metrics:
   - total cycles recorded
   - systems visited
   - creatures discovered
   - rarest creature
   - year's song
5. design a share card that reveals wonder and progress without exposing sensitive health data.

#### Deliverables

- Compare mode
- Journey in Review
- safe share card

### Workstream 8.3: Community and Public Presence

#### Goal

Expand the sense of community without losing the trust baseline.

#### Steps

1. add anonymous aggregate community stats.
2. test community milestone messaging.
3. only introduce optional public profiles after moderation and privacy systems are mature.
4. keep reporting and moderation tooling ahead of public-feature growth.

#### Deliverables

- aggregate community stats
- controlled public-profile rollout if approved

### Workstream 8.4: Localization and Platform Expansion

#### Goal

Expand reach only after the product can support the complexity.

#### Steps

1. fully externalize all strings, lore, and store metadata.
2. review translation candidates for tone and health-language accuracy.
3. launch localization in the planned target languages only after QA and tone review.
4. evaluate iPad and web companion expansion only if the phone product remains healthy.
5. make sure web or tablet surfaces complement the phone rather than diluting focus.

#### Deliverables

- localization framework in production
- language launches
- validated iPad or web companion decision

### Phase 8 Deliverables

- 200+ creatures
- Compare mode
- Journey in Review
- aggregate community layer
- localization and mature expansion decisions

### Exit Gate

- year-end recap feature completed and tested >= 30 days before December 31
- localization workflow proven for >= 1 non-English language
- community features generate < 1 moderation action per 1,000 daily active users
- D90 retention >= 20%

## Test and Validation Plan

### First-Hour Journey

Every release that materially touches MVP flows should retest:

1. install
2. onboarding
3. permissions
4. first scan
5. first travel
6. first creature
7. first music play
8. first return session

### Scan Reliability

Test camera scanning under:

- bright light
- low light
- warm finger
- cold finger
- partial camera obstruction
- slight movement
- unsupported device
- permission denial
- user cancellation

Record:

- scan success rate
- low-confidence rejection rate
- abandonment rate
- median scan time

### Data Integrity

Retest regularly:

- duplicate HealthKit imports
- duplicate Health Connect imports
- offline logging (airplane mode full session)
- timezone changes
- reinstall and restore (including deterministic galaxy regeneration from local seed)
- account deletion (including local database wipe)
- export correctness
- sync queue drain after extended offline period
- conflict resolution behavior for each table

### Determinism

For any change that touches journey or trigger logic:

1. generate a test user's universe
2. save the expected state
3. reinstall or simulate another device
4. verify galaxy sequence, system identity, and species availability remain consistent

### Creature Logic

For every new species batch:

1. test trigger success
2. test trigger non-success
3. test silhouette behavior
4. test variant persistence (including local-to-server sync round-trip)
5. test entitlement boundaries
6. test lore and rarity display

### Audio

For every release touching music:

1. test playback start
2. test interruption by call or notification
3. test background and foreground behavior
4. test Bluetooth output
5. test silent-mode expectations
6. test export

### Monetization

For every release touching premium:

1. test paywall eligibility
2. test purchase (via RevenueCat sandbox)
3. test restore
4. test refund handling (via RevenueCat webhook)
5. test cancellation behavior
6. test entitlement downgrade
7. test lifetime purchase handling
8. confirm no paywall interrupts a health-critical path

### Compliance

For every release touching trust-sensitive surfaces:

1. retest HealthKit or Health Connect wording
2. retest privacy disclosures
3. retest non-diagnostic copy
4. retest community moderation flow if any social feature changed

### Accessibility

For every release:

1. test VoiceOver navigation of all primary flows
2. test with Dynamic Type at 200% text size
3. test with Reduce Motion enabled
4. test with high-contrast mode enabled
5. test scan interface with haptic-only feedback
6. verify all touch targets meet minimum size (44x44pt iOS, 48x48dp Android)
7. on Android releases, repeat all above with TalkBack

### Performance

For every release:

1. verify scan processing time < 3 seconds (median on lowest supported device)
2. verify app cold start < 2 seconds on reference device (iPhone 12)
3. verify creature animation >= 30 fps on reference device
4. verify galaxy rendering meets target fps for current galaxy type
5. verify sync queue drain latency < 5 seconds for 50 items
6. verify JS bundle size < 15 MB compressed

## Always-On Operating Workstreams

### Analytics and Experimentation

1. review retention by acquisition source, device class, and first-week behavior every week.
2. only run a small number of experiments at once.
3. prioritize experiments on:
   - onboarding pacing
   - reminder timing
   - discovery density
   - paywall copy
4. log experiment decisions and outcomes in the release scorecard.

### QA and Reliability

1. keep smoke tests for every release.
2. re-test older devices regularly.
3. treat data-loss issues as top severity regardless of user count.
4. update known-issues documentation whenever recurring defects emerge.

### Privacy, Trust, and Support

1. keep export and deletion easy to find.
2. keep support tone precise and humane.
3. escalate anything that may look like medical advice or self-harm risk.
4. update trust language whenever the same user confusion appears repeatedly.
5. monitor and respond to support email within 24 hours.

### Asset Production

1. maintain at least `6-8 weeks` of asset backlog visibility.
2. track every art and audio asset against implementation status.
3. keep source files, exports, and licenses organized.
4. never assume future content capacity without confirming contractor availability.

### PPG Model Monitoring

1. track scan accuracy metrics weekly against the baseline established during the Phase 0 feasibility spike.
2. monitor for device-specific regression (new device models with different camera hardware).
3. deploy model updates behind feature flags per the AI/ML Model Versioning Strategy.
4. maintain a validation dataset of >= 100 reference scans, refreshed quarterly.

## Assumptions and Defaults

- audience priority: founder execution first
- schedule style: gated and realistic
- MVP content: 20 playable creatures and 50 visible species roadmap
- Deep Signal target: 50 shipped species
- free-tier long-term target: 80+ Common and Uncommon creatures by the end of Phase 7
- long-term catalog target: 200+ creatures by the end of Phase 8
- MVP includes `Signal Deck Lite` and `guided breathing`
- premium marketing may only describe live features
- Android rollout stays cautious until Android retention and stability are within 10 percentage points of iOS
- all health data is local-first; network sync is secondary
- RevenueCat is the billing SDK; price points are $4.99/month, $29.99/year, $79.99 lifetime
- WCAG 2.1 AA is the accessibility baseline
- camera PPG fallback decision is made at Phase 2 exit gate; no later

## Document Map

This document is the master sequence.

The companion planning artifacts remain the operational sub-documents:

- [planning/README.md](c:/AI/Claude/s1s2/planning/README.md)
- [planning/S1S2-Feature-Entitlement-Matrix.md](c:/AI/Claude/s1s2/planning/S1S2-Feature-Entitlement-Matrix.md)
- [planning/S1S2-Content-Manifest.csv](c:/AI/Claude/s1s2/planning/S1S2-Content-Manifest.csv)
- [planning/S1S2-Analytics-Event-Taxonomy.md](c:/AI/Claude/s1s2/planning/S1S2-Analytics-Event-Taxonomy.md)
- [planning/S1S2-Release-Gate-Scorecard.md](c:/AI/Claude/s1s2/planning/S1S2-Release-Gate-Scorecard.md)
- [planning/S1S2-Health-Data-Policy.md](c:/AI/Claude/s1s2/planning/S1S2-Health-Data-Policy.md)
- [planning/S1S2-Support-Playbook.md](c:/AI/Claude/s1s2/planning/S1S2-Support-Playbook.md)
- [planning/S1S2-App-Review-Compliance-Pack.md](c:/AI/Claude/s1s2/planning/S1S2-App-Review-Compliance-Pack.md)
- [planning/S1S2-Business-Model-Framework.md](c:/AI/Claude/s1s2/planning/S1S2-Business-Model-Framework.md)
