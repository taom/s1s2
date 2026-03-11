# S1S2 Founder Weekly Checklist

## Purpose

This document converts the master rollout plan into a week-by-week founder operating checklist.

Use it to answer three questions every week:

1. what must ship or be decided this week
2. what must be reviewed this week
3. what must not be allowed to drift this week

## How To Use

- at the start of each week, copy that week's checklist into your working notes or project board
- mark each item `not started`, `in progress`, `blocked`, or `done`
- if a week ends with multiple critical items still blocked, do not roll forward silently; either extend the week or trigger a hold sprint
- use the companion release gate scorecard when a week includes an exit gate or readiness review

## Weekly Operating Rhythm

Apply this cadence every week unless the weekly checklist overrides it:

### Monday

- review prior week outcomes
- review top metrics and blockers
- lock the week's must-ship items
- confirm contractor asks and deadlines

### Tuesday

- execute highest-risk implementation or decision work first
- review support and quality issues
- verify no hidden dependency is blocking the week

### Wednesday

- run midpoint status check
- cut or defer low-value work if the week is drifting
- review asset status and delivery timing

### Thursday

- run functional checks on the week's completed work
- prepare any beta or stakeholder notes
- confirm what is ready for review versus not ready

### Friday

- run founder playtest
- update risk log and gate scorecard
- write changelog or progress notes
- decide whether the next week remains on-plan or needs re-scoping

## Week 0: Kickoff

### Must Finish

- create the master project board
- create the risk register
- create the support inbox
- create the working copies of all planning artifacts
- define what `Week 0` means for the whole project so all relative timing stays aligned

### Must Review

- product bible sections for vision, three pillars, UX flow, development phases, pricing, and KPIs
- current cost assumptions
- current contractor availability

### Must Not Drift

- audience definition
- free-tier promise
- premium scope boundaries

## Week 1: Audience, Scope, and Entitlements

### Must Finish

- write hero, secondary, and tertiary audience profiles
- lock the public promise and anti-positioning rules
- restore `Signal Deck Lite` and `guided breathing` to MVP scope
- rename `20 launch creatures` to `20-creature MVP set`
- update the entitlement matrix so it matches only live features by phase

### Must Review

- whether any feature still sits in the wrong phase
- whether any free-tier promise is currently under-scoped
- whether any premium promise is currently ahead of delivery

### Must Not Drift

- health logging must remain free
- premium must not include marketing for non-live features

## Week 2: Financial Model and Feasibility Spikes

### Must Finish

- build conservative, base, and breakout business scenarios
- split `cash bookings` and `recognized revenue`
- run camera PPG feasibility spike
- run mobile audio feasibility spike
- run deterministic galaxy generation spike
- decide fallback paths for any failed spike

### Must Review

- whether camera HR can truly be primary on target devices
- whether the preferred audio stack is safe for mobile
- whether art and audio throughput assumptions are realistic

### Must Not Drift

- no technical unknown should remain vague after this week
- no spend assumptions should remain tied only to hope

## Week 3: Environment and Repo Foundation

### Must Finish

- stand up local, staging, and production environments
- set up secrets handling
- set up CI
- add crash reporting and analytics scaffolding
- confirm release-channel naming

### Must Review

- environment separation
- build reproducibility
- debug visibility for environment-specific failures

### Must Not Drift

- no feature work should begin on a shaky environment baseline

## Week 4: Schema, Seed Data, Design Baseline, and QA Harness

### Must Finish

- implement schema migrations
- verify RLS policies
- seed species, achievements, and starter journey data
- lock information architecture
- produce the Bridge benchmark screen
- create initial QA scripts and debug views
- verify the content manifest contains exactly 20 `playable_mvp` species

### Must Review

- whether the seeded content actually supports the first user journey
- whether the benchmark screen matches the intended brand tone
- whether the QA scripts cover the first-hour journey

### Must Not Drift

- content manifest accuracy
- analytics and QA instrumentation baseline

## Week 5: Auth and Shell

### Must Finish

- implement Apple Sign-In
- implement email fallback auth
- persist onboarding state
- build shell navigation
- define intentional empty states

### Must Review

- auth friction
- navigation clarity
- whether the shell already feels like a coherent ship experience

### Must Not Drift

- do not let the app feel like disconnected screens

## Week 6: Starter Journey and Debug State

### Must Finish

- seed the starter linear journey
- verify deterministic naming and generation behavior
- verify first travel path works for a new account
- expose journey and trigger state in debug tooling

### Must Review

- whether the starting universe is understandable
- whether debug tools are sufficient for rapid iteration

### Must Not Drift

- deterministic generation

## Week 7: Camera HR Foundation

### Must Finish

- implement camera permission flow
- implement finger placement overlay
- implement real-time signal quality assessment
- implement confidence scoring
- instrument scan start, success, failure, and abandonment

### Must Review

- scan comfort
- clarity of measurement guidance
- quality of low-confidence detection

### Must Not Drift

- trust in the scan flow

## Week 8: HealthKit Import and Scan Fallbacks

### Must Finish

- integrate HealthKit for HR and resting HR
- implement source attribution
- implement duplicate handling
- connect imported HR to progression safely
- define fallback copy for low-confidence or failed scans

### Must Review

- whether imported data resolves enough friction for users with weak camera-scan experiences
- whether duplicates or stale imports could confuse the user

### Must Not Drift

- do not make camera failure a dead end

## Week 9: Bridge and Progression

### Must Finish

- implement Bridge cockpit layout
- implement HR, BP, HRV, and SpO2 instruments
- implement fuel logic
- implement XP logic
- implement streak logic with 48-hour grace

### Must Review

- whether the Bridge feels emotionally sticky
- whether progression math feels fair
- whether empty instrument states feel intentional

### Must Not Drift

- the Bridge must remain the emotional center of the app

## Week 10: Manual Logging, Signal Deck Lite, and Guided Breathing

### Must Finish

- implement BP, sleep, mood, and activity entry
- connect logs to fuel and analytics
- implement `Signal Deck Lite`
- implement `guided breathing`
- connect breathing completion to creature trigger logic

### Must Review

- entry speed for manual logs
- whether Signal Deck Lite feels intentionally minimal instead of missing
- whether breathing fits the brand tone

### Must Not Drift

- guided breathing cannot slip out of MVP

## Week 11: Journey Rendering and Travel

### Must Finish

- render the linear 50-system path
- map travel to fuel
- animate travel
- derive system colors from health data
- validate calm, active, and intense color logic

### Must Review

- whether movement feels rewarding
- whether system colors are legible but not judgmental

### Must Not Drift

- color logic must never imply moral or clinical judgment

## Week 12: Planets, Resonance Hints, and Weekly Summary Stub

### Must Finish

- add planets as points of interest
- connect discovery logic to planets
- implement resonance hints
- add the weekly-summary content stub

### Must Review

- whether players understand why a planet matters
- whether hinting is too obvious or too obscure

### Must Not Drift

- creature discovery should feel earned, not random

## Week 13: MVP Creatures

### Must Finish

- implement the first half of the 20-creature MVP set
- validate trigger logic for each implemented species
- validate lore, rarity, and resonance metadata

### Must Review

- first-week discovery pacing
- clarity of trigger conditions

### Must Not Drift

- early discoveries must remain generous

## Week 14: Variants, Field Guide, and Resonance Chamber Grid

### Must Finish

- implement the second half of the 20-creature MVP set
- implement variant generation rules
- implement Field Guide detail pages
- implement Resonance Chamber grid
- implement silhouette entries for the remaining 30 species

### Must Review

- whether variants feel personal and tasteful
- whether the collection feels mysterious and cumulative

### Must Not Drift

- the roadmap must still visibly promise 50 species

## Week 15: Audio Foundation

### Must Finish

- implement the chosen audio stack
- implement S1 and S2 fundamentals
- implement one biome bed
- implement creature voice layering

### Must Review

- audio startup latency
- interruption handling
- device performance

### Must Not Drift

- no unstable audio stack should survive into beta

## Week 16: Play Today

### Must Finish

- implement `Play Today`
- instrument playback start, completion, interruption, and replay
- verify low-data users still get a meaningful playback experience

### Must Review

- whether `Play Today` feels magical enough to be a retention driver
- whether playback reliability is beta-safe

### Must Not Drift

- music must feel central, not decorative

## Week 17: Cinematic Onboarding

### Must Finish

- implement the four-screen onboarding sequence
- implement name, first-scan, and ship-reveal setup steps
- instrument every onboarding step

### Must Review

- drop-off by screen
- pacing
- whether the sequence feels premium rather than indulgent

### Must Not Drift

- onboarding must preserve wonder while staying short enough to complete

## Week 18: Beta Prep and Closed Beta

### Must Finish

- implement reminders and quiet hours
- finalize privacy, support, and FAQ docs
- define beta tags and bug triage categories
- define art, audio, and lore acceptance checklists
- recruit and onboard 20-50 beta testers

### Must Review

- onboarding completion
- scan success
- crash-free sessions
- first creature timing
- first music play rate

### Must Not Drift

- do not expand the beta if gate metrics are weak

## Week 19: Expanded Beta and Launch Prep

### Must Finish

- widen beta access if the closed beta gates pass
- prepare store assets and metadata
- start the final pre-launch marketing sequence

### Must Review

- support ticket themes
- whether expanded beta introduces new trust problems

### Must Not Drift

- trust complaints should be handled before public launch

## Week 20: Limited Public Launch

### Must Finish

- release to a limited public audience
- monitor activation and first-day quality issues daily
- ship critical micro-fixes immediately when safe

### Must Review

- D1 retention
- scan success
- support volume
- App Store feedback

### Must Not Drift

- no new feature work if launch health is unstable

## Week 21: Launch Stabilization

### Must Finish

- continue daily launch reviews
- tune copy, reminders, and early discovery pacing
- document any hold-sprint trigger if reached

### Must Review

- D7 trajectory
- first-week discoveries
- rating trends

### Must Not Drift

- avoid overreacting to noise while still acting fast on real trust issues

## Week 22: Launch Gate Decision

### Must Finish

- evaluate the Phase 3 exit gate
- decide whether to advance to Deep Signal or trigger a hold sprint
- document the decision and next-phase scope lock

### Must Review

- D1
- D7
- average check-ins
- first-week discoveries
- rating

### Must Not Drift

- do not force the roadmap forward if the gate is weak

## Weeks 23-32: Deep Signal Weekly Checklist

Apply this repeating weekly pattern through the 10-week Deep Signal phase. Each week must still have a locked primary outcome.

### Weekly Must Finish

- ship one defined Deep Signal workstream milestone
- re-run determinism checks if galaxy or trigger logic changes
- re-run entitlement checks if premium or catalog access changes
- review refund and conversion early once premium is live

### Weekly Must Review

- D30 trend
- premium conversion
- refund rate
- support burden
- content throughput versus contractor capacity

### Weekly Must Not Drift

- do not market future premium features as live
- do not let the free-tier promise erode during premium packaging

## Weeks 33-38: Android and Revenue Expansion Weekly Checklist

### Weekly Must Finish

- advance Android parity and device testing
- expand Health Connect reliability
- build and test Seasonal Transmissions
- operationalize billing and restore workflows

### Weekly Must Review

- Android crash and performance profile
- Android retention versus iOS
- billing-related support burden

### Weekly Must Not Drift

- do not scale Android acquisition before Android quality is acceptable

## Growth Cycle Monthly Checklist

Use this checklist during Phases 6-8.

### Month Start

- lock the month's content and feature targets
- confirm contractor capacity
- confirm moderation and support coverage for anything public-facing

### Mid-Month

- review retention effects of new integrations, social features, or content drops
- cut underperforming scope before it creates operational debt

### Month End

- review gate metrics for the active cycle
- update the entitlement matrix if scope changed
- update the business model if costs or conversion assumptions changed
- roll lessons into the next month's scope
