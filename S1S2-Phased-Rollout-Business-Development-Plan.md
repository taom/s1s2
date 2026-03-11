# S1S2 Phased Rollout Business and Development Plan

## Version

This is the detailed v3 execution plan aligned to the product bible, the companion planning artifacts, and the requirement to use relative phase timing.

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

### Success Definition

S1S2 succeeds if the first version creates a repeatable loop where users:

1. successfully complete onboarding
2. trust the check-in flow
3. feel rewarded quickly through travel, creatures, and music
4. return often enough for the habit loop to form
5. perceive premium as deeper beauty and continuity rather than a tollbooth

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
8. document fallback options for each failed spike instead of leaving open uncertainty.

#### Deliverables

- camera PPG feasibility memo
- audio feasibility memo
- deterministic-generation memo
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

### Phase 0 Deliverables

- scope lock
- audience lock
- entitlement lock
- financial model
- feasibility memos
- asset plan
- analytics and governance baseline

### Exit Gate

- scope matrix approved
- entitlement matrix approved
- financial model corrected
- feasibility spikes passed or replanned
- asset throughput and contractor budget locked

## Phase 1: Pre-Production

### Relative Timing

- start: `Week 3`
- duration: `2 weeks`

### Objective

Stand up the product foundation so feature work can happen in a stable environment with real data structures, analytics, QA scripts, and seeded content.

### Success Definition

Phase 1 is successful when the repo, environments, schema, analytics, QA harness, and initial content scaffolding are all ready to support feature implementation without rework.

### Workstream 1.1: Repository and Environment Setup

#### Goal

Create a production-safe technical workspace.

#### Steps

1. initialize or confirm the app repository structure.
2. define local, staging, and production environment separation.
3. configure secrets handling for auth, backend, and analytics keys.
4. set up CI for builds, tests, and sanity checks.
5. add crash reporting and analytics SDK scaffolding.
6. define a release-channel naming convention:
   - local
   - staging
   - beta
   - production
7. define build metadata standards so issues can be traced back to a version quickly.

#### Deliverables

- working environments
- CI baseline
- release-channel naming standard

### Workstream 1.2: Schema, Security, and Seed Data

#### Goal

Build the initial backend structure that supports auth, vitals, creatures, journey state, achievements, and music sessions.

#### Steps

1. implement the schema from the product bible in migrations.
2. define row-level security for all user-owned tables.
3. test user isolation with multiple test accounts.
4. seed:
   - creature species
   - achievement definitions
   - starter journey systems
5. verify that seeded content can be read without manual database edits.
6. define backup and rollback rules for critical user data.

#### Deliverables

- migrated schema
- verified RLS policies
- working seed scripts
- backup and rollback notes

### Workstream 1.3: Information Architecture and Design System

#### Goal

Lock the product surfaces and visual language that all later work will build on.

#### Steps

1. lock the information architecture:
   - Bridge
   - Check-In
   - Galaxy
   - Resonance Chamber and Field Guide
   - Signal Deck Lite
   - Log
2. define design tokens for:
   - S1 warm palette
   - S2 cool palette
   - neutral surfaces
   - motion timing
   - depth and parallax
   - display typography versus UI typography
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

#### Deliverables

- locked information architecture
- design token set
- flow wireframes
- Bridge benchmark screen

### Workstream 1.4: Analytics, Debugging, and QA Harness

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
3. create the first QA scripts for:
   - onboarding completion
   - first scan
   - duplicate import handling
   - offline logging
   - reinstall and restore
   - account deletion
4. define blocker severity for beta:
   - any data loss
   - broken onboarding
   - scan lockups
   - audio failures
   - entitlement failures

#### Deliverables

- staging analytics baseline
- developer debug tooling
- first QA script set
- blocker severity rules

### Workstream 1.5: Content Manifest Setup

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
- seeded backend
- locked app surfaces
- design system baseline
- analytics and debug baseline
- QA harness
- content manifest

### Exit Gate

- environments stable
- schema and RLS verified
- analytics firing in staging
- seed data usable
- navigation locked
- Bridge benchmark approved

## Phase 2: First Signal MVP Build

### Relative Timing

- start: `Week 5`
- duration: `14 weeks`

### Objective

Build an iOS MVP that proves the first-hour magic loop and the first-week habit loop.

### Success Definition

Phase 2 is successful when a new user can move smoothly from onboarding to first scan to first movement to first creature to first music playback, and then return often enough for retention to be testable in beta.

### Weeks 5-6: Shell, Auth, and Seeding

#### Action Item 2.1: Auth and App Shell

##### Goal

Let a new user enter the product and reach the core surfaces without confusion.

##### Steps

1. implement Apple Sign-In.
2. implement email login as a fallback path.
3. persist onboarding completion state.
4. persist ship naming and basic user preferences.
5. build shell navigation for all MVP surfaces.
6. make every empty state feel like an intentional in-world state rather than a missing feature.

##### Deliverables

- working auth flows
- app shell
- persistent onboarding and profile state

#### Action Item 2.2: Starter Journey and Debug Baseline

##### Goal

Make sure every new account can enter a valid starting universe.

##### Steps

1. seed the starter linear 50-system path for new users.
2. verify that system names generate consistently.
3. verify that seeded planets and creature opportunities exist where expected.
4. confirm that a test user can reach first travel without any database intervention.
5. expose journey and trigger state in debug tooling for rapid validation.

##### Deliverables

- valid starter journey
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
7. instrument start, success, failure, and abandonment events.

##### Deliverables

- scan permissions flow
- confidence-based scan engine
- fallback messaging
- instrumentation for scan quality

#### Action Item 2.4: HealthKit Import

##### Goal

Reduce reliance on camera-only capture and improve trust for already tracked users.

##### Steps

1. integrate HealthKit for heart rate and resting heart rate.
2. define source attribution rules for imported versus manual or camera-entered data.
3. define duplicate handling and latest-value selection rules.
4. test permission granted, permission denied, revoked permission, and partial-data scenarios.
5. ensure imported HR can participate in progression if camera scanning is weak on a device.

##### Deliverables

- HealthKit integration
- source attribution rules
- duplicate-handling behavior

### Weeks 9-10: Bridge, Progression, Signal Deck Lite, and Guided Breathing

#### Action Item 2.5: Bridge and Core Progression

##### Goal

Make the home screen emotionally sticky and mechanically useful.

##### Steps

1. implement the Bridge cockpit with parallax viewport.
2. implement the HR, BP, HRV, and SpO2 instruments with graceful empty states.
3. implement fuel rules from the product bible.
4. implement XP gain logic.
5. implement ship-class scaffolding and unlock display.
6. implement the 48-hour grace-based streak system.
7. add lightweight milestone celebrations for XP, streak, and firsts.

##### Deliverables

- Bridge screen
- progression rules
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
6. ensure all forms are one-handed and fast.
7. connect each completed log to fuel and analytics events.

##### Deliverables

- fast manual-entry flows
- log-to-fuel integration

#### Action Item 2.7: Signal Deck Lite

##### Goal

Prevent the roadmap from losing one of the core ship surfaces while keeping the initial implementation small.

##### Steps

1. implement a minimal Signal Deck landing screen.
2. show recent-history views for the most recent heart rate and other logged vitals.
3. use simple waveform or chart treatments that match the ship aesthetic.
4. reserve space in the UI for future pattern-lock and doctor-report modules.
5. make sure the surface feels intentionally limited, not abandoned.

##### Deliverables

- Signal Deck Lite
- recent-history views
- future-ready layout shell

#### Action Item 2.8: Guided Breathing

##### Goal

Deliver the breathing feature promised by the free tier and used by at least one creature trigger.

##### Steps

1. implement a short guided breathing flow.
2. make the visual and audio treatment match the S1/S2 atmosphere.
3. define a clear completion event.
4. connect breathing completion to creature triggers and analytics.
5. expose breathing from at least one obvious in-app surface.

##### Deliverables

- guided breathing feature
- trigger and analytics integration

### Weeks 11-12: Linear Galaxy and Travel

#### Action Item 2.9: Journey Rendering

##### Goal

Translate daily tracking into visible movement.

##### Steps

1. render the linear 50-system journey.
2. implement system naming and visited-state handling.
3. map fuel to travel distance.
4. implement travel animation.
5. derive system color from health data using the calm, active, and intense logic from the bible.
6. verify that color language stays descriptive instead of judgmental.

##### Deliverables

- working linear galaxy
- travel animation
- health-derived color system

#### Action Item 2.10: First Points of Interest

##### Goal

Make systems feel discoverable instead of empty.

##### Steps

1. implement planets as the initial points of interest.
2. connect creature availability to trigger logic instead of random chance.
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
4. tune the set so most beta users can reach at least one creature within two sessions.

##### Deliverables

- 20-creature MVP set
- tuned early discovery pacing

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
7. store the variant parameters so the same creature re-renders consistently later.

##### Deliverables

- variant generation rules
- persistent variant state

#### Action Item 2.13: Field Guide and Resonance Chamber

##### Goal

Give discoveries a home and make the collection feel cumulative.

##### Steps

1. build Field Guide detail pages with lore, field notes, discovery context, and acoustic signature controls.
2. build the MVP Resonance Chamber as a grid view.
3. add silhouette entries for the remaining 30 species in the visible roadmap.
4. ensure the Chamber and Guide visually communicate progress and mystery at the same time.

##### Deliverables

- Field Guide detail view
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

##### Deliverables

- functioning audio foundation
- S1 and S2 fundamentals
- one biome bed
- creature voice layer

#### Action Item 2.15: Play Today

##### Goal

Give users a clear reason to feel that their body is composing their universe.

##### Steps

1. implement `Play Today`.
2. use the current biome plus today's data to drive the arrangement.
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

##### Deliverables

- cinematic onboarding flow
- setup flow instrumentation

#### Action Item 2.17: Reminders and Re-Engagement

##### Goal

Support the habit loop without becoming annoying.

##### Steps

1. implement reminder scheduling logic.
2. define quiet hours.
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

1. prepare privacy policy, terms, support URLs, and FAQ.
2. define beta feedback tags:
   - activation
   - trust
   - quality
   - delight
   - monetization
3. define bug triage categories.
4. define acceptance checklists for art, audio, and lore.
5. recruit 20-50 beta testers.
6. prepare screenshot and preview asset requirements even if final capture comes later.

##### Deliverables

- beta operations playbook
- legal and support docs
- content acceptance checklists
- beta tester cohort

### Phase 2 Deliverables

- iOS MVP
- closed beta
- first-hour magic loop
- first-week habit loop instrumentation
- launch package draft

### Exit Gate

- onboarding completion greater than `75%`
- first successful scan greater than `70%`
- crash-free sessions greater than `99.5%`
- first creature reached within two sessions for most testers
- first music play within week one for at least `35%` of beta users

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

### Workstream 3.2: Launch Marketing

#### Goal

Run the first public campaign in a way that matches the bible without overwhelming support capacity.

#### Steps

1. start pre-launch activity four weeks before submission.
2. launch the waitlist email sequence.
3. publish teaser waveform content and creature art drip.
4. prepare preview video capture plan.
5. submit to Product Hunt and relevant editorial opportunities only when the store page is ready.
6. route public attention toward the game-first screenshots and preview, not toward medical framing.

#### Deliverables

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
   - support load above founder capacity
   - repeated privacy or scan-trust complaints
2. if any hold trigger fires, freeze Phase 4 work.
3. define the hold sprint around the highest-leverage issue only.
4. retest the first-hour journey after every hold sprint.
5. restart roadmap advancement only after the failing gate improves.

#### Deliverables

- hold-sprint rule in operation
- documented resolution path for failed gates

### Phase 3 Deliverables

- staged public release
- live-tuned launch month
- validated or rejected readiness for Deep Signal

### Exit Gate

- D1 at or above `60%` or clearly recovering
- D7 at or above `35-40%`
- average check-ins above `1.5` per active user per day
- first-week discoveries above `8` per active user
- App Store rating above `4.5`

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
7. preserve deterministic generation rules across reinstall and multi-device restore.

#### Deliverables

- graph galaxy
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

### Workstream 4.4: Premium v1

#### Goal

Introduce monetization without breaking trust or confusing the free-tier promise.

#### Steps

1. implement subscription and lifetime-purchase management.
2. connect entitlements to the approved entitlement matrix only.
3. define eligible paywall moments:
   - after clear product attachment
   - at premium history boundaries
   - at advanced music or export intent
4. verify that no paywall interrupts health-critical actions.
5. package premium-v1 around only live benefits:
   - full galaxy
   - live premium creature tiers
   - unlimited history
   - advanced music
   - export
   - ship customization if implemented
6. if `Doctor Report v1` is ready in this phase, include it carefully.
7. if `Doctor Report v1` is not ready, remove it from premium marketing.
8. do not market third-party wearable sync unless at least one supported non-Apple integration is already live.

#### Deliverables

- premium-v1 implementation
- paywall surfaces
- entitlement-safe packaging

### Workstream 4.5: Deep Signal QA and Financial Validation

#### Goal

Make sure the richer product is both stable and commercially coherent.

#### Steps

1. retest the full first-hour journey with the deeper content set.
2. retest determinism, export safety, and entitlement boundaries.
3. monitor premium conversion, refund rate, and support tickets from premium users.
4. review whether the content cost curve still makes sense under real conversion.
5. decide whether lifetime pricing remains permanent, seasonal, or adjusted later.

#### Deliverables

- Deep Signal regression pass
- premium health report
- content cost review

### Phase 4 Deliverables

- full graph galaxy
- 50 shipped species
- advanced music system
- premium-v1
- validated post-MVP business loop

### Exit Gate

- D30 retention above `30%`
- premium conversion of eligible retained users above `4-5%`
- refund rate below `5%`
- App Store rating maintained above `4.5`
- support load stable enough for Android work

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

#### Deliverables

- working Android build
- Android device matrix
- Android-specific known-issues list

### Workstream 5.2: Health Connect

#### Goal

Make imported health data viable on Android from day one.

#### Steps

1. integrate `Health Connect`.
2. map imported metrics to the same normalized model used on iOS.
3. test permission flows and revoked access handling.
4. test duplicate and partial-import cases.
5. verify imported HR and other supported signals can participate in progression safely.

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
- event reward and comms plan

### Workstream 5.4: Billing and Revenue Operations

#### Goal

Make monetization supportable at scale.

#### Steps

1. operationalize purchase restore.
2. operationalize refund handling.
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

- Android stability within acceptable range of iOS
- Health Connect import reliable
- Seasonal Transmission cadence working
- billing support no longer ad hoc

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

- MRR above `$5K`
- support burden remains manageable
- imported-data reliability improves retention instead of causing confusion

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

- content pipeline sustains monthly drops without quality erosion
- doctor-report usage is meaningful
- content drops measurably reactivate lapsed users

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

- year-end recap ready to ship cleanly
- localization workflow proven
- community features add delight without generating moderation debt

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
- offline logging
- timezone changes
- reinstall and restore
- account deletion
- export correctness

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
4. test variant persistence
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
2. test purchase
3. test restore
4. test refund handling
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

### Asset Production

1. maintain at least `6-8 weeks` of asset backlog visibility.
2. track every art and audio asset against implementation status.
3. keep source files, exports, and licenses organized.
4. never assume future content capacity without confirming contractor availability.

## Assumptions and Defaults

- audience priority: founder execution first
- schedule style: gated and realistic
- MVP content: 20 playable creatures and 50 visible species roadmap
- Deep Signal target: 50 shipped species
- free-tier long-term target: 80+ Common and Uncommon creatures by the end of Phase 7
- long-term catalog target: 200+ creatures by the end of Phase 8
- MVP includes `Signal Deck Lite` and `guided breathing`
- premium marketing may only describe live features
- Android rollout stays cautious until Android retention and stability are near acceptable iOS ranges

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
