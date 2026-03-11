# S1S2 Phase Kanban Board

## Purpose

This document turns the rollout plan into a Kanban-style execution board by phase.

Use it to keep work visible and to prevent hidden scope creep.

## How To Use

- copy the phase you are actively working on into your actual task system
- move each task through these status buckets:
  - `backlog`
  - `ready`
  - `in progress`
  - `blocked`
  - `review`
  - `done`
- if more than 2 critical tasks are `blocked` in the same phase, stop adding new work and resolve blockers first
- keep only one major founder-owned deliverable `in progress` at a time when possible

## Board Fields

For each task, track:

- task name
- owner
- status
- dependency
- success check
- notes

## Phase 0 Board

### Backlog

- audience profiles
- public promise and anti-positioning guide
- scope matrix
- entitlement matrix revision
- financial model scenarios
- camera PPG spike
- audio spike
- deterministic generation spike
- asset pipeline brief
- contractor brief templates
- analytics baseline
- risk register shell

### Ready

- product-bible feature inventory
- current free-versus-premium promise review

### In Progress

- none by default at kickoff

### Blocked

- anything dependent on unresolved feasibility spikes

### Review

- spike results
- entitlement conflicts
- budget assumptions

### Done

- move only after phase lock is approved

## Phase 1 Board

### Backlog

- local, staging, and production setup
- CI and release-channel setup
- schema migrations
- RLS verification
- seed scripts
- Bridge benchmark screen
- information architecture lock
- debug tooling
- QA script library
- content manifest verification

### Ready

- environment setup
- schema migration plan
- design token definition

### In Progress

- only the current highest-priority foundation deliverable

### Blocked

- anything waiting on access keys, service setup, or unresolved architecture decisions

### Review

- environment stability
- seeded content usability
- Bridge benchmark approval

### Done

- foundation items that are stable in staging

## Phase 2 Board

### Backlog

- Apple Sign-In
- email fallback auth
- onboarding persistence
- app shell navigation
- starter journey seeding
- debug state exposure
- camera permission flow
- signal quality UI
- confidence scoring
- HealthKit import
- duplicate handling
- Bridge cockpit
- fuel rules
- XP and streak systems
- manual logging flows
- Signal Deck Lite
- guided breathing
- linear galaxy rendering
- travel animation
- planets and resonance hints
- weekly-summary stub
- 20-creature MVP set
- variant generation
- Field Guide detail pages
- Resonance Chamber grid
- silhouette roadmap entries
- audio foundation
- Play Today
- cinematic onboarding
- reminder system
- beta tagging and triage
- FAQ and legal docs
- closed beta recruitment

### Ready

- current week's scope from the founder checklist
- supporting assets that have passed acceptance review

### In Progress

- current week's primary build target only

### Blocked

- tasks dependent on failed scan or audio feasibility
- tasks waiting on art or audio contractor delivery
- tasks waiting on seeded data fixes

### Review

- first-hour journey
- onboarding completion
- scan success
- crash-free sessions
- first creature timing
- first music play

### Done

- only features stable enough for closed beta

## Phase 3 Board

### Backlog

- expanded beta release
- limited public launch
- full public launch
- launch waitlist sequence
- teaser and preview assets
- launch review dashboard
- complaint-tagging workflow
- hold-sprint protocol

### Ready

- features that passed beta gates
- store assets ready for submission

### In Progress

- current launch-stage release
- current live-ops tuning priority

### Blocked

- launch expansion blocked by D1, D7, scan, or support-capacity failures

### Review

- D1 retention
- D7 trend
- support queue
- trust issues
- rating and review signals

### Done

- release stages that passed their gates

## Phase 4 Board

### Backlog

- graph galaxy
- fog of war
- full biome set
- Echoes
- Listening Posts
- remaining 30 species
- improved trigger engine
- Resonance Chamber room view
- Field Guide filters
- all biome beds
- advanced music modes
- music export
- premium-v1 packaging
- paywall surfaces
- entitlement verification
- doctor report decision
- Deep Signal regression pass

### Ready

- post-launch validated areas that have passed Phase 3 gates

### In Progress

- one major Deep Signal subsystem at a time

### Blocked

- any feature whose marketing promise outruns implementation
- any premium surface waiting on entitlement clarity

### Review

- D30 retention
- conversion
- refund rate
- rating
- support burden

### Done

- features stable enough for premium packaging

## Phase 5 Board

### Backlog

- Android parity fixes
- Android device matrix
- Health Connect integration
- Android import normalization
- Seasonal Transmissions framework
- first seasonal event
- billing restore workflows
- refund workflows
- entitlement audit process
- Android monetization comparison

### Ready

- Android tasks not blocked by iOS-only assumptions

### In Progress

- one Android stability target and one revenue-ops target maximum

### Blocked

- tasks blocked by platform-specific SDK issues
- tasks blocked by billing-provider edge cases

### Review

- Android crash profile
- Android retention
- Health Connect import quality
- seasonal event completion behavior

### Done

- Android and billing tasks that are support-safe

## Phase 6 Board

### Backlog

- Oura integration
- Withings integration
- Fitbit integration
- Garmin integration
- sync-status UI
- Rhythm Partners
- Chamber visits
- Echo messages
- moderation rules
- correlation engine v1
- Harmonic creature correlation unlocks
- retention impact analysis

### Ready

- integrations with finalized access requirements
- social features with moderation rules defined

### In Progress

- one integration or one social system at a time

### Blocked

- anything requiring policy or moderation decisions not yet documented

### Review

- import reliability
- support burden
- retention effect
- privacy complaints

### Done

- integrations and social systems with stable retention benefit

## Phase 7 Board

### Backlog

- monthly content workflow
- 80+ free-creature target
- Resonance Gates
- hidden biomes
- doctor report feature
- Apple Watch quick check-in
- streak complication
- reminder handoff
- content-reactivation analysis

### Ready

- content batches whose art and audio briefs are approved
- utility features with data definitions complete

### In Progress

- one content drop pipeline milestone plus one utility milestone

### Blocked

- tasks waiting on content assets
- tasks waiting on doctor-report data structure decisions

### Review

- content quality
- reactivation lift
- doctor-report usefulness
- watch adoption quality

### Done

- content and utility items stable enough for repeated use

## Phase 8 Board

### Backlog

- 200+ creature roadmap
- Compare playback mode
- Journey in Review
- annual share card
- aggregate community stats
- optional public profiles
- localization rollout
- iPad decision
- web companion decision

### Ready

- any expansion work that no longer threatens moderation or privacy stability

### In Progress

- one identity-loop feature plus one expansion feature

### Blocked

- public or social features without moderation readiness
- localization without full string externalization

### Review

- moderation load
- retention impact
- localization quality
- share-card safety

### Done

- mature growth features with sustainable operations

## Pull Rules

- never pull a task into `in progress` unless its dependency is resolved
- never pull a roadmap feature into `review` if acceptance criteria are undefined
- never leave trust or data-integrity tasks behind lower-value cosmetic tasks
- when a hold sprint starts, freeze all `ready` and `backlog` pulls that are not directly related to the failed gate

## Founder Priority Order

When too many tasks compete at once, prioritize in this order:

1. trust and data integrity
2. onboarding and activation
3. scan reliability
4. first creature and first music delight
5. retention improvements
6. monetization clarity
7. expansion features
