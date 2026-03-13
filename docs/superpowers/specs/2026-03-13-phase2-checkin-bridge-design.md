# Phase 2: Check-In Flow + Bridge with Real Data

**Date:** 2026-03-13
**Status:** Approved
**Scope:** Camera PPG engine, 3-step check-in flow, Bridge screen wired to real data

---

## Overview

Phase 1 established the data foundation (SQLite, zustand stores, hydration, routing). Phase 2 makes the app functional for the first time: a user can complete a check-in with real camera-based heart rate measurement, log optional vitals, and see everything reflected on the Bridge screen.

**What's in scope:**
- Research-grade PPG signal processing pipeline (TypeScript, using `react-native-vision-camera` for frame-level access)
- 3-step check-in flow: camera measurement → result + AI commentary → optional manual logs (step 4 "travel animation" from prior placeholder is deferred)
- Bridge screen reading real data from stores/SQLite
- Ship AI commentary engine

**What's deferred:**
- Travel animation / galaxy generation (was "step 4" in the original placeholder checkin.tsx)
- Creature discovery during check-in
- Supabase sync
- Camera PPG edge cases: extreme motion artifacts, very low ambient light
- SpO2 display (phone cameras lack true IR; red/green ratio is too unreliable for user-facing display — PPG engine will compute it internally for future use but UI will not show SpO2 in this phase)

---

## 1. PPG Signal Processing Pipeline

### Architecture

Four focused modules in `src/services/ppg/`:

```
Camera Frames → frame-processor → filters → peak-detector → ppg-engine → MeasurementResult
```

### 1.1 `frame-processor.ts` — Red Channel Extraction

**Purpose:** Extract per-frame average red (and green) channel intensity from camera video stream.

**Interface:**
```typescript
interface FrameData {
  timestamp: number;       // ms since measurement start
  redMean: number;         // average red channel intensity (0-255)
  greenMean: number;       // average green channel intensity (for SpO2 ratio)
  redVariance: number;     // variance of red channel (finger detection)
}

function processFrame(imageData: Uint8Array, width: number, height: number, timestamp: number): FrameData;
```

**Finger detection logic:**
- Red channel mean > 200 AND red variance < threshold → finger is covering the lens
- Transition from uncovered → covered triggers measurement start
- Transition from covered → uncovered during measurement triggers pause + "Reposition finger" hint

**Sampling:** Uses center 50% crop of frame to avoid edge noise. Targets 30 fps.

### Camera Frame Access Strategy

`expo-camera` does not provide per-frame raw pixel buffers in JS. We use `react-native-vision-camera` (v4.x) which provides `useFrameProcessor()` — a worklet-based API that runs on the camera thread and can extract pixel data at 30fps.

**Approach:**
- `react-native-vision-camera` provides `Frame` objects with `.toArrayBuffer()` for raw RGBA pixel access
- Frame processors run as worklets (Reanimated-powered), so pixel extraction happens off the JS thread
- The extracted red/green channel means are passed to the JS thread via shared values or `runOnJS()` for the PPG pipeline
- This replaces `expo-camera` as the camera dependency for this feature

**New dependency:** `react-native-vision-camera` ~4.x (replaces `expo-camera` for check-in screen only; other screens may still use expo-camera if needed)

### 1.2 `filters.ts` — Bandpass FIR Filter

**Purpose:** Remove DC offset, respiratory artifacts (<0.7 Hz), and high-frequency noise (>4.0 Hz). Passband covers 42-240 BPM.

**Interface:**
```typescript
interface FilterConfig {
  lowCutHz: number;    // 0.7
  highCutHz: number;   // 4.0
  sampleRateHz: number; // ~30 (camera fps)
  order: number;        // 64-128 taps
}

function createBandpassFilter(config: FilterConfig): FIRFilter;
function applyFilter(filter: FIRFilter, signal: Float64Array): Float64Array;
```

**Algorithm:** Windowed-sinc FIR filter using Hamming window. Pure functions, no internal state — the caller manages the signal buffer.

**Additional:** A derivative filter (first-order difference) for peak slope enhancement, used by the peak detector.

### 1.3 `peak-detector.ts` — Adaptive Peak Detection

**Purpose:** Identify systolic peaks in the filtered PPG waveform. Returns timestamps of valid peaks for IBI analysis.

**Interface:**
```typescript
interface Peak {
  index: number;
  timestamp: number;
  amplitude: number;
}

interface PeakDetectorConfig {
  minPeakDistanceMs: number;  // 250ms (240 BPM max)
  maxPeakDistanceMs: number;  // 1500ms (40 BPM min)
  adaptiveWindowSize: number; // samples for threshold adaptation
}

function detectPeaks(filtered: Float64Array, timestamps: number[], config: PeakDetectorConfig): Peak[];
```

**Algorithm:**
1. Compute adaptive threshold: moving average of signal amplitude × 0.6
2. Find local maxima above threshold
3. Enforce minimum distance between peaks (refractory period)
4. Validate inter-beat intervals: reject peaks producing IBI < 250ms or > 1500ms
5. Use slope analysis (from derivative filter) to distinguish true systolic peaks from dicrotic notch

### 1.4 `ppg-engine.ts` — Orchestrator

**Purpose:** Manage the measurement lifecycle. Accumulates frames, runs the pipeline, emits results.

**Interface:**
```typescript
interface PPGCallbacks {
  onFingerDetected: (detected: boolean) => void;
  onBeatDetected: (bpm: number) => void;
  onHRUpdate: (hr: number, confidence: number) => void;
  onQualityChange: (quality: 'calibrating' | 'poor' | 'fair' | 'good' | 'excellent') => void;
  onMeasurementComplete: (result: MeasurementResult) => void;
}

interface MeasurementResult {
  heartRate: number;          // BPM, averaged over measurement
  heartRateInstant: number;   // BPM, last 3-5 beats
  hrv: number;                // RMSSD of IBIs in ms
  spo2Estimate: number;       // estimated SpO2 % (from red/green ratio)
  confidence: number;         // 0.0 - 1.0
  qualityLabel: 'poor' | 'fair' | 'good' | 'excellent';
  durationMs: number;         // actual measurement duration
  peakCount: number;          // number of valid peaks detected
  signalToNoiseRatio: number; // SNR in dB
}

class PPGEngine {
  constructor(callbacks: PPGCallbacks, config?: Partial<PPGEngineConfig>);
  addFrame(imageData: Uint8Array, width: number, height: number): void;
  start(): void;
  stop(): MeasurementResult | null;
  reset(): void;
}
```

**Internal state:**
- Circular buffer of ~10 seconds of `FrameData` samples (~300 frames at 30fps)
- Running list of detected peaks
- Measurement timer

**Processing loop (on each `addFrame`):**
1. Extract `FrameData` via `processFrame()`
2. Check finger detection — if lost, pause and callback
3. Append red channel mean to circular buffer
4. Every ~0.5 seconds (15 frames): run full pipeline on buffer
   - Apply bandpass filter to buffered signal
   - Run peak detection on filtered signal
   - Compute instantaneous HR from last 3-5 IBIs
   - Compute running average HR from all valid IBIs
   - Compute HRV as RMSSD of IBIs
   - Estimate SpO2 from red/green ratio (Beer-Lambert approximation)
   - Calculate confidence score
   - Emit callbacks

**Confidence scoring (0.0 – 1.0):**

| Component | Weight | Criteria |
|-----------|--------|----------|
| Signal amplitude | 0.25 | Red channel AC component > noise floor |
| IBI consistency | 0.25 | Coefficient of variation of IBIs < 15% |
| Peak regularity | 0.25 | ≥ 5 consecutive valid peaks with consistent spacing |
| Signal-to-noise ratio | 0.25 | SNR > 5 dB |

- Motion penalty: if frame-to-frame red variance spikes (indicating movement), multiply total confidence × 0.5

**Calibration period:** Engine requires ~5 seconds of clean signal (confidence > 0.5) before emitting the first `onHRUpdate`. Until then, quality is `'calibrating'`.

**Early exit:** If confidence > 0.8 sustained for 5+ seconds after the 15-second mark, the engine signals that early completion is available.

**SpO2 estimation:** Uses the ratio of AC/DC components of red vs green channels. This is computed internally for future use but NOT displayed in the UI this phase — phone cameras lack true infrared, making the estimate unreliable (±5% or more). The Life Support gauge on Bridge will show "--" until a reliable SpO2 source is available (e.g., wearable integration).

**`stop()` returns `null`:** When fewer than 5 valid peaks have been detected (insufficient data for a meaningful HR calculation).

---

## 2. Check-In Flow

### Architecture

`app/checkin.tsx` becomes a state machine managing 3 step components:

```typescript
type CheckInStep = 'measure' | 'result' | 'logs';
```

The parent manages step transitions and holds the accumulated data. Each step is a focused component.

### 2.1 Step 1: Camera Measurement (`components/checkin/camera-measure.tsx`)

**Props:**
```typescript
interface CameraMeasureProps {
  onComplete: (result: MeasurementResult) => void;
  onCancel: () => void;
}
```

**Behavior:**
1. Request camera permission on mount (react-native-vision-camera)
   - **Permission denied handling:** Show explanation screen: "S1S2 needs camera access to read your heartbeat through your fingertip." with a "Open Settings" button (linking to app settings) and a "Skip — enter manually" fallback
2. Show camera preview inside the circular UI element (180×180)
3. Overlay: progress ring (0-100% over 30 seconds), centered BPM counter
4. Finger detection phase:
   - Ring border is muted/gray
   - Text: "Place fingertip over camera"
   - When finger detected: ring transitions to coral, countdown begins
5. Measurement phase:
   - Progress ring fills over 30 seconds
   - BPM counter updates in real-time via `onHRUpdate`
   - S1/S2 waveform bars animate on each `onBeatDetected`
   - Quality indicator (dots or bars) reflects current signal quality
   - If confidence < 0.4 for 10 consecutive seconds: show "Reposition finger" hint
   - If finger lost: pause timer, show "Finger lost — replace to continue"
6. Early exit: after 15 seconds, if confidence > 0.8, show "Got it" button
7. On completion (30s or early exit): call `onComplete(result)`

**Camera config:** Rear camera, 640×480 resolution, 30fps, torch ON (improves red channel signal).

### 2.2 Step 2: Result Display (`components/checkin/result-display.tsx`)

**Props:**
```typescript
interface ResultDisplayProps {
  result: MeasurementResult;
  previousHR: number | null;  // yesterday's latest, for comparison
  onContinue: () => void;
  onRetry: () => void;
}
```

**Layout:**
- Hero BPM number (existing `bpmValue` style, font-size 48)
- Confidence indicator: 1-4 signal bars colored by quality
- Delta badge: "▼ 3 vs yesterday" if previous reading available
- Ship AI commentary box (gold left border, italic text)
- If confidence < 0.5: "Try again" button prominent, "Continue anyway" secondary
- If confidence ≥ 0.5: "Continue" button primary

**Ship AI commentary** (from `services/ship-ai.ts`):
- Contextual text based on HR value, time of day, comparison to history, streak
- Examples:
  - First ever check-in: "First signal received, Captain. Engine rhythm: 72 BPM. A strong beginning."
  - Morning check-in, lower HR: "Morning readings show a well-rested engine, Captain. 65 BPM — the quietest I've recorded."
  - Streak day 5: "Five consecutive days of signal data. The patterns are becoming clearer, Captain."
  - HR elevated vs usual: "Engine running warm today — 82 BPM, above your usual range. Worth noting."

### 2.3 Step 3: Optional Logs (`components/checkin/optional-logs.tsx`)

**Props:**
```typescript
interface OptionalLogsProps {
  onComplete: (logs: OptionalLogData) => void;
}

interface OptionalLogData {
  mood?: number;              // 1-5
  activityType?: string;
  activityDurationMin?: number;
  sleepHours?: number;
  sleepQuality?: number;      // 1-5
  bpSystolic?: number;
  bpDiastolic?: number;
}
```

**Layout:** 4 tappable icons in a row (existing UI). Tapping one expands an inline input below:

- **Mood:** 5 emoji buttons in a row (😫 😕 😐 😊 🤩), tap to select
- **Activity:** Type picker (walk/run/cycle/gym/yoga/other) as pill buttons + duration slider (5-120 min)
- **Sleep:** Hours slider (0-12, 0.5 increments) + quality (1-5 star buttons)
- **BP:** Two numeric inputs side-by-side (systolic / diastolic) with validation:
  - Systolic: 70-250 range
  - Diastolic: 40-150 range
  - Systolic must be > diastolic

Each log icon shows a checkmark overlay once data is entered for that category.

"That's everything" button at bottom saves and dismisses.

### 2.4 Check-In Service (`services/checkin-service.ts`)

**Purpose:** Single transaction boundary that persists a complete check-in.

**Interface:**
```typescript
interface CheckInSession {
  sessionId: string;
  scans: Omit<ScanResult, 'createdAt'>[]; // createdAt set by DB, not available at return time
  fuelEarned: number;
}

async function saveCheckIn(
  measurement: MeasurementResult,
  optionalLogs: OptionalLogData
): Promise<CheckInSession>;
```

**Logic:**
1. Generate `sessionId` (UUID)
2. Create `ScanResult` records:
   - Always: `heart_rate` (from measurement.heartRate, source: 'camera_ppg')
   - Always: `hrv` (from measurement.hrv, source: 'camera_ppg')
   - If SpO2 confidence sufficient: `spo2` (source: 'camera_ppg')
   - If mood provided: `mood` (source: 'manual')
   - If activity provided: `activity_type` (encoded as numeric index: walk=1, run=2, cycle=3, gym=4, yoga=5, other=6) + `activity_duration` in minutes (source: 'manual')
   - If sleep provided: `sleep_hours` + `sleep_quality` (source: 'manual')
   - If BP provided: `blood_pressure_systolic` + `blood_pressure_diastolic` (source: 'manual')
3. Insert all scan results via `insertScanResult()`
4. Calculate fuel earned from this session's contributions
5. Update journey store: `addFuel(amount, source)` for each category
6. Return the session for confirmation

---

## 3. Bridge Screen — Real Data Wiring

### 3.1 `hooks/use-latest-vitals.ts`

**Purpose:** Provide the Bridge with the latest vitals snapshot + deltas.

**Interface:**
```typescript
interface VitalsDelta {
  heartRate?: { value: number; delta: number | null };
  hrv?: { value: number; delta: number | null };
  spo2?: { value: number; delta: number | null };
  bpSystolic?: { value: number; delta: number | null };
  bpDiastolic?: { value: number; delta: number | null };
}

interface VitalsStatus {
  heartRate?: 'optimal' | 'normal' | 'elevated' | 'high';
  bp?: 'optimal' | 'normal' | 'elevated' | 'high';
  hrv?: 'optimal' | 'normal' | 'low';
  spo2?: 'optimal' | 'normal' | 'low';
}

function useLatestVitals(): {
  vitals: VitalsDelta;
  status: VitalsStatus;
  lastCheckInAt: string | null;
  isLoading: boolean;
  refresh: () => void;
};
```

**New database function required in `services/database.ts`:**
```typescript
async function getYesterdayLatestByType(metricType: MetricType): Promise<ScanResult | null>;
// SQL: SELECT * FROM scan_results WHERE metric_type = ? AND date(created_at) = date('now', '-1 day') ORDER BY created_at DESC LIMIT 1
```

**Behavior:**
1. On mount: query SQLite for latest scan per metric type (existing `getLatestScanByType()`) + yesterday's latest per type (new `getYesterdayLatestByType()`)
2. Compute deltas (today - yesterday)
3. Compute status labels based on clinical ranges:
   - HR: <60 optimal (resting measurement only — all camera PPG readings are at-rest by definition since the user is holding still), 60-100 normal, 100-120 elevated, >120 high
   - BP: <120/80 optimal, <130/85 normal, <140/90 elevated, >140/90 high
   - HRV: >50ms optimal, 20-50ms normal, <20ms low
   - SpO2: >96% optimal, 94-96% normal, <94% low
4. Re-fetch on screen focus (when returning from check-in)

### 3.2 Bridge Screen Updates (`app/(tabs)/bridge.tsx`)

**Changes:**
- Import `useUserStore`, `useJourneyStore`, `useLatestVitals`
- Top bar: `profile.shipName`, `profile.shipClass`, `profile.currentStreak`, computed level from XP
- Gauges: pass `value`, `delta`, `status` from `useLatestVitals()`
- Fuel bar: `todayFuel` from journey store, with breakdown labels
- "Awaiting First Signal..." only shows when no scans exist yet

### 3.3 VitalGauge Enhancement (`components/ship/vital-gauge.tsx`)

**New props (additive — existing props preserved including `onPress`):**
```typescript
interface VitalGaugeProps {
  // existing (unchanged)
  label: string;
  sublabel: string;
  value: number | null;
  unit: string;
  color: string;
  icon: string;
  onPress?: () => void;
  // new
  delta?: number | null;
  status?: 'optimal' | 'normal' | 'elevated' | 'high' | 'low';
  secondaryValue?: number | null; // for BP diastolic
}
```

- Delta shown as "▼ 3" or "▲ 5" with color coding (green for improvement, amber for change)
- Status label shown below the value in muted text
- BP gauge shows "118/76" format using `value` + `secondaryValue`

**Status color mapping:**
| Status | Color | Used for |
|--------|-------|----------|
| optimal | `Colors.star.aurora` (#47FFCB) | Good health indicator |
| normal | `Colors.text.secondary` (#8892A8) | Neutral, expected |
| elevated | `Colors.star.gold` (#FFD666) | Worth noting |
| high | `Colors.s1.primary` (#E85D5D) | Attention needed |
| low | `Colors.s2.primary` (#5D8DE8) | Below expected (HRV, SpO2) |

### 3.4 FuelBar Enhancement (`components/ship/fuel-bar.tsx`)

**Updated props (breaking change — Bridge must update its `<FuelBar>` call):**
```typescript
interface FuelBarProps {
  fuel: FuelLog;     // replaces currentFuel/maxFuel
  maxFuel?: number;  // default 5
}
```

The existing `<FuelBar currentFuel={0} maxFuel={5} />` in bridge.tsx must change to `<FuelBar fuel={todayFuel} />`.

Uses `getTotalFuel()` from `journey-store.ts` (already exists) to compute fill ratio.

- Shows gradient progress bar based on total fuel
- Below bar: breakdown chips showing what contributed ("♥×1", "BP×1", "🔥+0.3")

---

## 4. Ship AI Commentary (`services/ship-ai.ts`)

**Purpose:** Generate contextual commentary for the result screen. Maintains the "ship AI" voice — precise, warm, uses "Captain" respectfully.

**Interface:**
```typescript
function generateCommentary(context: {
  heartRate: number;
  confidence: number;
  previousHR: number | null;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  currentStreak: number;
  totalCheckIns: number;
  isFirstEver: boolean;
}): string;
```

**Logic:** Rule-based template selection (not AI-generated). Picks from a curated set of templates based on context. Templates are organized by trigger priority:
1. First-ever check-in (highest priority)
2. Streak milestones (3, 7, 14, 30, 60, 100 days)
3. Notable HR patterns (significantly higher/lower than history)
4. Time-of-day flavor (morning calm, evening wind-down)
5. Generic variety (rotated to avoid repetition)

---

## 5. Type Locations

**PPG-specific types** (`FrameData`, `Peak`, `MeasurementResult`, `PPGCallbacks`, `PPGEngineConfig`, `FilterConfig`, `PeakDetectorConfig`) live in `services/ppg/types.ts` — they are internal to the PPG module and not needed by the rest of the app.

**Check-in types** (`OptionalLogData`, `CheckInSession`) live in `services/checkin-service.ts` — co-located with the service since they're only used by checkin components.

**Activity type encoding** lives in `constants/activity-types.ts`:
```typescript
export const ACTIVITY_TYPES = { walk: 1, run: 2, cycle: 3, gym: 4, yoga: 5, other: 6 } as const;
export type ActivityType = keyof typeof ACTIVITY_TYPES;
```

## 6. New Files Summary

```
src/
├── services/
│   ├── ppg/
│   │   ├── types.ts               — PPG-internal type definitions
│   │   ├── frame-processor.ts    — red/green channel extraction, finger detection
│   │   ├── filters.ts            — FIR bandpass filter (windowed-sinc)
│   │   ├── peak-detector.ts      — adaptive peak detection + IBI validation
│   │   └── ppg-engine.ts         — orchestrator, confidence scoring, callbacks
│   ├── checkin-service.ts        — save check-in to SQLite + update stores
│   └── ship-ai.ts                — contextual commentary generation
├── components/
│   └── checkin/
│       ├── camera-measure.tsx     — step 1: camera PPG UI
│       ├── result-display.tsx     — step 2: BPM result + AI commentary
│       └── optional-logs.tsx      — step 3: mood/activity/sleep/BP inputs
├── hooks/
│   └── use-latest-vitals.ts      — Bridge data hook (latest scans + deltas)
├── app/
│   ├── checkin.tsx                — updated: 3-step state machine
│   └── (tabs)/bridge.tsx          — updated: reads from stores
├── constants/
│   └── activity-types.ts          — activity type enum + numeric encoding
└── components/ship/
    ├── vital-gauge.tsx            — updated: delta + status props
    └── fuel-bar.tsx               — updated: FuelLog prop + breakdown
```

## 7. Dependencies

**New:** `react-native-vision-camera` (~4.x) — provides frame processor API for raw pixel access at 30fps. Required for PPG pipeline. Note: this has a native module, so a dev client rebuild is needed after install.

**Already in project and used:** `react-native-reanimated` 4.x (required by vision-camera frame processors — already installed).

## 8. Testing Strategy

- **PPG modules:** Pure function unit tests for filters, peak detector, frame processor. Feed known synthetic waveforms, verify BPM output.
- **PPG engine:** Integration test with recorded signal data (capture real frame data once, replay in tests).
- **Check-in service:** Test that saveCheckIn produces correct ScanResult records and updates fuel.
- **useLatestVitals:** Test with pre-seeded SQLite data, verify delta computation.
- **Ship AI:** Snapshot tests for commentary template selection logic.
