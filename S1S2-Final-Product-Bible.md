# S1S2 — Complete Product Bible

**Taoftware LLC — App #4**
**Final Plan — March 2026**

---

# PART I: IDENTITY & VISION

## 1.1 Brand Identity

**Name:** S1S2
**Domain:** s1s2.app
**Tagline:** "The two sounds that power everything."
**Secondary tagline:** "S1 begins. S2 completes. Everything in between is your journey."

**What S1S2 means:** In cardiology, S1 and S2 are the two distinct sounds of every human heartbeat. S1 ("lub") occurs when the mitral and tricuspid valves close at the start of systole — it's the sound of beginning, of contraction, of sending blood out into the world. S2 ("dub") occurs when the aortic and pulmonary valves close at the start of diastole — it's the sound of completion, of relaxation, of the heart refilling for its next beat. Together, S1S2 is the most fundamental rhythm in every human body. The app transforms that rhythm into a living universe.

**Brand personality:** Enigmatic, premium, warm beneath the surface. S1S2 is the indie game that wins Apple Design Awards. It's the health app that doesn't look or feel like a health app. It attracts curious, design-conscious users who appreciate craft and subtlety — people who choose Monument Valley over Candy Crush, who use Headspace instead of a generic timer, who pick Oura over a commodity fitness band.

**Brand voice principles:**
- Precise but never cold
- Poetic but never pretentious
- Scientific but never intimidating
- Encouraging but never patronizing
- Uses "Captain" as the user's title — with genuine respect, as a peer, never as a gimmick
- The ship AI speaks as though your heartbeat is the most fascinating thing it has ever encountered

---

## 1.2 The Elevator Pitch

For casual conversation: "It's a heart health app disguised as a space game. Your real heartbeat fuels a spaceship, discovers alien creatures, and composes music. It's like No Man's Sky meets a health tracker."

For App Store description: "Your heartbeat is an engine. S1S2 transforms your real heart rate, blood pressure, and health data into a procedurally generated galaxy to explore, 200+ creatures to discover, and a living ambient soundtrack — all unique to you. Track your heart health not because you should, but because the universe you're building is too beautiful to stop."

For investors/press: "S1S2 is the first heart health app where the primary engagement driver is gameplay, not guilt. By turning health tracking into the fuel system of a space exploration game with creature collection and generative music, S1S2 solves the #1 problem in consumer health apps: retention. Users come for the game and develop healthy tracking habits as a side effect."

---

# PART II: THE THREE PILLARS — DEEP DESIGN

## 2.1 Pillar 1: Space Explorer — The Journey

### 2.1.1 The Ship

**Your vessel is the central character of the app.** It's not a menu — it's a home. Users should feel attached to their ship the way Tamagotchi owners felt attached to their creatures.

**Ship classes (earned through XP progression, never purchased):**

| Class | XP Required | Visual | Unlocks |
|---|---|---|---|
| Pod | 0 (start) | Small, rounded escape pod. Cozy, minimal. Single porthole. | Basic travel, Resonance Chamber (small) |
| Scout | 1,000 XP | Sleeker, with fins. Two portholes. Visible engine glow. | Extended fuel range, larger Resonance Chamber |
| Cruiser | 5,000 XP | Substantial vessel. Bridge with multiple displays. | Navigation boost, medium Resonance Chamber, customizable hull |
| Explorer | 15,000 XP | Elegant, elongated. Observatory dome visible. | Access to deep space regions, large Resonance Chamber |
| Flagship | 50,000 XP | Majestic capital ship. Multiple rooms. Living quarters. | All regions, full Resonance Chamber, captain's log feature |

**Ship interior screens:**

1. **Bridge (Home Screen):** The cockpit view. Displays current vitals as ship instruments (HR = engine RPM gauge, BP = fuel pressure, HRV = shield harmonics, SpO2 = life support). The galaxy map is visible through the main viewport. Music plays from the ship's ambient system. This is where check-ins happen.

2. **Resonance Chamber (Creature Gallery):** A beautiful room where your discovered creatures live. They have idle animations — floating, pulsing, glowing. Their acoustic signatures play softly as ambient background. Touching a creature brings up its Field Guide entry. As you collect more, the room fills and the ambient sound becomes richer.

3. **Navigation Console (Galaxy Map):** Full-screen galaxy map. Pinch to zoom from current system all the way out to the full journey view. Tap any visited system to see its name, the date you passed through, the creatures discovered there, and the color representing that period's health data.

4. **Signal Deck (Insights & History):** Where health insights are delivered as "decoded transmissions." Your vitals history is displayed as signal waveforms. Correlations appear as "pattern locks." Doctor visit reports are generated here.

5. **The Log (Profile & Settings):** Captain's log where you can review achievements, streaks, and journey statistics. Settings for reminders, privacy, sharing, wearable connections.

### 2.1.2 The Galaxy

**Generation rules:**
- User ID seeds a deterministic random number generator
- Galaxy is a directed acyclic graph: nodes (star systems) connected by paths
- Initial generation creates 50 systems visible from the start, with fog-of-war beyond
- New systems are revealed as the player approaches the frontier
- Systems are spaced so that 1 day of full tracking = 1 system traversal
- Minimum check-in (1 HR reading) = 0.5 system progress
- Maximum daily fuel (3 HR + BP + sleep + mood) = 1.5 systems

**System types (procedurally assigned):**

| Type | Visual | Musical Biome | Creature Tendency |
|---|---|---|---|
| Nebula | Swirling colored gas clouds | Ambient pads, evolving textures | S2 creatures (calm, ethereal) |
| Asteroid Field | Dense rocky clusters | Percussive, crystalline chimes | Harmonic creatures (tough, resilient) |
| Gas Giant | Massive banded sphere | Deep bass drones, sub-frequencies | S1 creatures (massive, powerful) |
| Binary Star | Two orbiting suns | Dual melodies, call-and-response | Paired creatures (always discovered in twos) |
| Deep Void | Near-black, sparse stars | Minimal, single sustained notes | Mythic creatures (rarest) |
| Stellar Nursery | Bright, colorful, new stars forming | Bright arpeggios, hopeful major keys | Common creatures (abundant) |
| Pulsar | Rhythmic flashing beacon | Rhythmic, metronomic | Streak-related creatures |
| Black Hole Vicinity | Warped starfield, gravitational lensing | Time-stretched, granular | Epic creatures (high-value) |

**System color derivation from health data:**
- Each system's color is calculated from the average vitals during the period the player traveled through it
- The algorithm maps HR, BP, HRV, and sleep into a HSL color value
- Low resting HR + high HRV + good sleep = cool blues and greens (calm, healthy)
- Moderate HR + moderate HRV = warm golds and ambers (active, balanced)
- Elevated HR + low HRV = deep violets and magentas (intense, stressed)
- The colors are NEVER labeled "good" or "bad" — they're described as "calm," "active," "intense"
- Over months, the galaxy map becomes a stunning visual diary: "That blue cluster was my vacation. That amber streak was when I started running."

**Points of interest within systems:**

Planets: 1-3 per system. Each can harbor one creature. Creature availability is determined by health data triggers, not random chance. A planet shows as "resonance detected" when you've met the discovery conditions for its creature — you just need to visit it.

Echoes: Rare acoustic anomalies that appear when you hit personal bests or sustained improvements. Visiting an Echo triggers a special musical moment and awards bonus XP. They're marked on the map with a distinctive waveform icon.

Listening Posts: One per 7 systems traveled. These are the weekly milestone stations where your ship AI delivers a conversational summary of the past week. They're visually distinct — space stations with a large antenna dish.

Resonance Gates: Appear after completing multi-week challenges (Seasonal Transmissions). These wormhole-like portals transport you to hidden biomes not on the main galaxy path — exotic regions with unique musical soundscapes and exclusive creatures.

### 2.1.3 Fuel & Travel Mechanics — Detailed

**Fuel cells (daily earning):**

| Action | Fuel Earned | Cap | Notes |
|---|---|---|---|
| Heart rate check-in | 1.0 cell | 3.0/day | Camera or wearable |
| Blood pressure log | 0.5 cell | 1.0/day | Manual input |
| Sleep hours log | 0.5 cell | 0.5/day | Manual or auto from wearable |
| Mood log | 0.25 cell | 0.25/day | 5-point scale |
| Activity log | 0.25 cell | 0.25/day | Type + duration |
| Streak bonus | +0.1 per streak day | +3.0 max | At day 30+, significant boost |

**Travel speed:**
- 1.0 fuel cell = enough to enter the next system
- 2.0 cells = reach the next system + explore all its planets
- 3.0+ cells = reach next system, explore, AND reveal additional systems ahead (extended sensor range)
- Maximum theoretical daily progress: ~5.0 cells with full logging + high streak

**Missing days:**
- No fuel = ship drifts in "quiet space" between systems
- Quiet space is NOT empty — it's a beautiful, serene area with soft ambient music
- No creatures are lost, no progress is reversed, no streaks are broken until 48 hours pass
- After 48 hours without check-in: streak breaks, but with a gentle message
- After 7 days: ship enters "deep hibernation" with a warm welcome-back sequence when you return

---

## 2.2 Pillar 2: Creature Collection — The Reward

### 2.2.1 The Resonance Classification System

Every creature belongs to one of three Resonance Classes, tied to the S1S2 concept:

**S1 Class — "Initiators"**
- Associated with: beginnings, activation, energy, systole, contraction
- Visual traits: warm colors (corals, ambers, reds), angular or dynamic shapes, visible movement/pulsing
- Acoustic signatures: lower-register instruments (bass synths, cellos, timpani, low pads)
- Thematically tied to: active health metrics (exercise, heart rate during activity, morning check-ins)

**S2 Class — "Resolvers"**
- Associated with: completion, relaxation, calm, diastole, recovery
- Visual traits: cool colors (blues, teals, silvers), flowing or rounded shapes, gentle floating
- Acoustic signatures: upper-register instruments (bells, flutes, high arpeggios, wind chimes)
- Thematically tied to: restorative metrics (sleep quality, resting HR, evening check-ins, HRV)

**Harmonic Class — "Bridges"**
- Associated with: balance, correlation, the connection between S1 and S2
- Visual traits: dual-toned (warm AND cool), symmetrical or fractal patterns, subtle luminescence
- Acoustic signatures: mid-range instruments (piano, guitar, mid synths, voice-like tones)
- Thematically tied to: correlations the app discovers, sustained balance across multiple metrics

### 2.2.2 Rarity Tiers — Detailed

**Common (50 creatures at launch)**
- Discovery: simple actions (first check-in, first morning log, 3-day streak, first BP reading)
- Art style: simpler illustrations, 2-3 colors, smaller creatures
- Acoustic signature: single instrument, simple melody loop (2-4 seconds)
- Creature size in Resonance Chamber: small
- Purpose: immediate gratification, teach the collection mechanic, fill the Field Guide early

**Uncommon (30 creatures at launch)**
- Discovery: sustained short-term behaviors (7-day streak, 10 BP readings, first full-data day)
- Art style: more detailed, 3-5 colors, medium creatures with one distinguishing feature
- Acoustic signature: two instruments layered, slightly longer loop (4-6 seconds)
- Creature size: medium
- Purpose: reward the first week of engagement, introduce the idea that tracking unlocks beauty

**Rare (15 creatures at launch)**
- Discovery: sustained medium-term behaviors (14-day streak, resting HR under threshold for 2 weeks, first correlation found, 30 BP readings)
- Art style: detailed illustration with fine linework, 4-6 colors, distinctive creature with personality
- Acoustic signature: multi-instrument arrangement, 6-10 second loop with variation
- Creature size: medium-large
- Purpose: the "aha" tier — users realize that healthy habits directly create beautiful things

**Epic (5 creatures at launch, expanding to 20)**
- Discovery: long-term achievements (60-day streak, multiple metrics improving over 30 days, all vital types logged consistently for a month)
- Art style: highly detailed, luminescent/glowing elements, 6+ colors, large creatures with animated idle behaviors
- Acoustic signature: full arrangement with 3+ instruments, 10-15 second evolving loop
- Creature size: large — these dominate the Resonance Chamber
- Purpose: the aspiration tier — users see silhouettes in the Field Guide and think "I want THAT one"

**Legendary (2 creatures at launch, expanding to 10)**
- Discovery: transformative achievements (3 months of measurable resting HR improvement, 365-day streak, BP normalized over 6 months)
- Art style: museum-quality illustration, bioluminescent, complex animated idle with particle effects
- Acoustic signature: a mini-composition — 15-30 seconds of layered, evolving music unique to this creature
- Creature size: extra-large — their presence transforms the Resonance Chamber's entire mood
- Purpose: the "I can't believe I earned this" tier — genuine pride

**Mythic (0 at launch, 3-5 total over the app's lifetime)**
- Discovery: unknown triggers. No hints in the Field Guide. The community will speculate, share theories, and eventually discover them collaboratively.
- Art style: unlike anything else in the game — ethereal, abstract, almost spiritual
- Acoustic signature: transforms the entire soundscape when present in the chamber
- Purpose: legend — the creatures that S1S2 forums and subreddits obsess over

### 2.2.3 Creature Anatomy — Visual Spec

Every creature is built from a base illustration plus parametric variants:

**Base illustration:** Hand-drawn digital art in a style that blends scientific illustration with fantasy concept art. Think the creature designs of Studio Ghibli crossed with the detailed naturalism of Audubon bird prints. Every creature should look like it could exist in a real ecosystem — no pure abstractions.

**Parametric variants (driven by user's specific data at discovery time):**

| Parameter | Data Source | Visual Effect |
|---|---|---|
| Primary hue | Resting HR at discovery | Shifts the creature's main color along a spectrum |
| Pattern density | HRV at discovery | More spots/stripes/markings = higher HRV |
| Glow intensity | Sleep quality average | Better sleep = brighter bioluminescence |
| Size modifier | Streak length at discovery | Longer streak = slightly larger creature |
| Accent color | Time of day discovered | Morning = gold accents, afternoon = silver, evening = violet |

This means even when two users discover the same species, their creatures look subtly different. YOUR Calm Stag has 58 spots and a golden glow because of YOUR specific data. This creates genuine ownership and attachment.

### 2.2.4 Full Creature List — Launch Set (50 Species)

**Common S1 Class (15 creatures):**
1. First Pulse — tiny spark creature. First ever check-in.
2. Dawn Moth — warm-winged moth. First morning check-in.
3. Kindling Spore — glowing seed pod. 3-day streak.
4. Surge Beetle — armored, energetic. First exercise logged.
5. Flare Minnow — fast, darting fish-like. HR recorded above 100.
6. Ember Slug — slow, warm, glowing trail. 5 consecutive morning check-ins.
7. Ignition Worm — coiled, spring-like. First caffeine logged.
8. Spark Flea — tiny, bouncing. 3 check-ins in a single day.
9. Rush Hare — fast, long-eared. First activity > 30 minutes logged.
10. Blaze Polyp — coral-like, pulsing. 10 total check-ins.
11. Kindle Fox — clever, warm-furred. 5-day streak.
12. Pump Toad — round, rhythmic inflating/deflating. First BP + HR logged same day.
13. Flicker Bird — rapid wingbeats. HR recorded during exercise.
14. Crackle Crab — hard-shelled, warm glow. First mood log of "energized."
15. Torch Anemone — tentacled, bright. 20 total check-ins.

**Common S2 Class (15 creatures):**
16. Drift Medusa — floating jellyfish-like. First sleep log.
17. Settle Frog — calm, sitting perfectly still. First evening check-in.
18. Echo Mite — nearly invisible, delicate. First full day cycle (morning + evening).
19. Hush Snail — spiral shell, faintly glowing. Resting HR recorded below 75.
20. Still Moth — wings rarely move, beautiful patterns. 3 consecutive evening check-ins.
21. Lull Worm — gently undulating. First weekend check-in.
22. Calm Seed — a dormant seed that faintly pulses. 7 total sleep logs.
23. Rest Pup — small, curled up, sleeping. 5 consecutive sleep logs.
24. Deep Fish — bioluminescent, bottom-dwelling. First check-in after midnight.
25. Quiet Beetle — silent, reflective shell. Mood logged as "calm" 3 times.
26. Night Bloom — flower that opens in darkness. 10 evening check-ins.
27. Sigh Jellyfish — exhaling motion, translucent. First guided breathing completed.
28. Slumber Bear (cub) — tiny, hibernating pose. 7 consecutive days with sleep logged.
29. Fade Coral — semi-transparent, peaceful. 30 total check-ins.
30. Dusk Firefly — gentle blinking light. 10-day streak.

**Common Harmonic Class (5 creatures):**
31. Balance Bug — symmetrical, dual-colored. First day with ALL vital types logged.
32. Rhythm Seed — pulsing at a steady rate. 3 full-data days.
33. Cycle Worm — eating its own tail, ouroboros-style. First week completed.
34. Sync Fish — two fish swimming in perfect unison. Both morning and evening check-ins for 5 days.
35. Tempo Cricket — chirps at a steady rhythm. 15-day streak.

**Uncommon S1 Class (5 creatures):**
36. Solar Fox — larger, flame-maned. 14-day streak.
37. Blitz Raptor — fast, sharp features. HR recorded above 120 during exercise 5 times.
38. Thunder Beetle — large, crackling energy. 20 activity logs.
39. Forge Salamander — lives in heat, reshapes itself. 50 total check-ins.
40. Pulse Hawk — soaring, sharp-eyed. HR improving trend over 14 days.

**Uncommon S2 Class (5 creatures):**
41. Lunar Moth — enormous, luminous wings. 14 consecutive sleep logs.
42. Glacier Tortoise — ancient, slow, crystalline shell. Resting HR below 65 recorded 5 times.
43. Mist Octopus — eight gentle tentacles, semi-transparent. 50 total check-ins with sleep data.
44. Frost Fern — plant-creature hybrid, ice-like but alive. HRV improving trend over 14 days.
45. Twilight Deer — elegant, appears at dusk. 20 consecutive evening check-ins.

**Uncommon Harmonic Class (5 creatures):**
46. Mirror Fish — perfectly symmetrical. All vital types logged for 7 consecutive days.
47. Pendulum Moth — swinging motion, balanced. First Listening Post reached.
48. Phase Spider — exists between two states. 21-day streak.
49. Tide Crab — moves with a predictable rhythm. 100 total check-ins.
50. Weave Bird — builds intricate nests from two materials. BP and HR both in healthy range for 7 days.

**Rare, Epic, Legendary creatures** (30 total) are designed but held for Phase 2 launch to create anticipation. Their silhouettes and cryptic hints appear in the Field Guide from day one.

### 2.2.5 The Acoustic Field Guide — Detailed Design

**Layout per creature entry:**

Page 1 (visual):
- Full illustration of the creature (parametric variant specific to this user)
- Resonance Class icon (S1 flame / S2 wave / Harmonic bridge)
- Rarity badge
- Discovery date, location (system name), and the vitals snapshot at discovery

Page 2 (lore + science):
- Creature name in display font
- 3-4 sentence lore description in poetic naturalist style
- "Acoustic Signature" — tap to play this creature's sound
- "Field Notes" — 2-3 sentences of real heart health science seamlessly embedded in the lore
- "Discovery Conditions" — revealed after discovery (e.g., "Appears to those who rest deeply for many consecutive nights")

**Example full entry — Calm Stag (Rare, Harmonic Class):**

*Illustration: A majestic deer-like creature with branching antlers that resemble an EKG waveform. Its body glows faintly in dual tones — warm coral on the left side, cool blue on the right. It stands perfectly still, and tiny motes of light drift from its antlers.*

*Lore: "The Calm Stag generates a bioelectric field at precisely its host's resting frequency. Xenobiologists have observed that nearby creatures gradually synchronize their own rhythms to match. It does not move quickly, nor does it need to. Everything in its vicinity simply... settles."*

*Acoustic Signature: A sustained cello note (low A) with a gentle piano chord (Am7) that resolves every 4 beats. Faint heartbeat rhythm underneath at 58 BPM.*

*Field Notes: "Resting heart rate is one of the strongest indicators of cardiovascular fitness. A consistently low resting rate suggests your heart is pumping efficiently — moving more blood with fewer beats. Athletes commonly have resting rates below 60 BPM. The Calm Stag embodies this efficiency."*

*Discovery Conditions: "Manifests when the engine rhythm sustains below 65 cycles for 14 consecutive days."*

---

## 2.3 Pillar 3: Music Composer — The Soul

### 2.3.1 Technical Architecture of the Sound System

**Layered stem system:**

The music engine operates in 5 simultaneous layers, each modulated by different data:

| Layer | Content | Controlled By | When It Changes |
|---|---|---|---|
| Layer 0: S1S2 Fundamentals | Two sustained tones representing S1 and S2 | User's average resting HR determines pitch | Weekly (recalculated from 7-day average) |
| Layer 1: Biome Bed | Ambient texture specific to current galaxy region | Current star system type | When entering a new system |
| Layer 2: Creature Voices | Instrument loops from discovered creatures | Creatures in Resonance Chamber | When a new creature is discovered |
| Layer 3: Vital Modulation | Real-time adjustments to tempo, key, reverb, density | Current check-in data | At each check-in |
| Layer 4: Momentary Events | One-shot sounds for discoveries, milestones, UI | User actions | Triggered by specific events |

**Layer 0 — The S1S2 Fundamentals (detailed):**

This is the signature innovation of the sound system. Two sustained tones — one for S1, one for S2 — form the harmonic foundation of ALL music in the app.

- S1 tone: derived from the user's average resting HR. Lower resting HR = lower pitch. A user with 60 BPM resting HR gets a deeper, richer S1 tone than a user with 80 BPM.
- S2 tone: always a perfect fifth above the S1 tone. This interval (the most consonant in music theory) creates an inherently pleasing harmonic relationship.
- As the user's resting HR changes over weeks and months, the fundamental tones shift — the music literally evolves with their health.
- Both tones play very quietly underneath everything else — barely audible but subconsciously felt. They're the "gravity" of the soundscape.

**Layer 1 — Biome Beds (detailed):**

Each galaxy region type has 3-5 pre-authored ambient stems (2-4 minutes each, seamlessly looping):

- Nebula: breathy pads, slow LFO modulation, reverb-drenched. Key: relative minor of S1S2 fundamentals.
- Asteroid Field: granular synthesis, metallic resonances, scattered rhythmic pings. Key: lydian mode.
- Gas Giant: sub-bass drones, distant rumbling, massive reverb tails. Key: root note of S1.
- Binary Star: two interlocking melodic fragments in different tempi that periodically align. Key: alternating between S1 and S2 roots.
- Deep Void: near-silence with occasional single notes at extreme reverb. Key: unresolved suspended chords.
- Stellar Nursery: bright, ascending arpeggios, major key, hopeful. Key: major of S2.
- Pulsar: metronomic clicks with harmonic overtones on each pulse. Tempo: user's current HR.
- Black Hole Vicinity: time-stretched granular processing of the user's own S1S2 tones. Unsettling but beautiful.

**Layer 2 — Creature Voices (detailed):**

Each creature's Acoustic Signature is a short musical loop (2-15 seconds depending on rarity) that plays when:
- The creature is in the Resonance Chamber (quietly, as ambient contribution)
- The user plays back their generated music (as part of the full arrangement)
- The user taps the creature in the Field Guide (solo, highlighted)

Creature voices are organized by Resonance Class into frequency bands:
- S1 creatures occupy the lower frequencies (bass, low-mid)
- S2 creatures occupy the upper frequencies (high-mid, treble)
- Harmonic creatures occupy the mid-range and can blend into either

As the user collects more creatures, the music becomes richer:
- 5 creatures: sparse, minimal — 2-3 instruments
- 20 creatures: fuller, more interesting — distinct textures emerging
- 50 creatures: lush, layered — a real composition
- 100+ creatures: orchestral density — genuinely beautiful generative music
- 200+ creatures: the user has composed a full album with their body

**Layer 3 — Vital Modulation (detailed):**

| Current Metric | Musical Parameter | Range |
|---|---|---|
| Current HR | Tempo of Layer 1 & 2 | 50-120 BPM (clamped to musical range) |
| Today's resting HR vs 7-day average | Pitch bend of S1 fundamental | ±50 cents (subtle, subconscious) |
| Today's HRV | Number of active creature voices | Low HRV = fewer layers; high HRV = all layers active |
| Today's BP (if logged) | Key brightness | Normal = bright major modes; elevated = warmer minor modes |
| Sleep quality (last night) | Reverb wet/dry mix | Good = 60% wet (expansive); poor = 20% wet (intimate) |
| Current mood (if logged) | Rhythmic density | Calm = sparse; energized = active; stressed = irregular but musical |
| SpO2 (if available) | High-frequency presence | Normal = full sparkle; low = filtered, muted highs |

### 2.3.2 Playback Modes

**"Play Today"** — Generates a 60-90 second composition from today's data. Algorithm:
1. Set S1S2 fundamentals from weekly average
2. Select biome bed from current system
3. Layer in all active creature voices
4. Apply vital modulation from today's check-ins
5. Structure: 15-second intro (fundamentals only) → gradual creature voice entry → full arrangement → 15-second outro (fade to fundamentals)
6. Every playback is slightly different due to randomized timing of creature voice entries

**"Play This Week"** — 3-5 minute piece that evolves through the week:
1. Each day's data controls one section (~30-45 seconds)
2. Transitions between days are smooth crossfades
3. Listeners can hear their week's health story as an evolving composition
4. Days with more data have richer arrangements; days with less data have sparser sections

**"Play My Journey"** — Compressed full history:
1. Each week is compressed into ~10-15 seconds
2. A 3-month journey = ~2-3 minute piece
3. Listeners can hear their entire health trajectory as music
4. Dramatic improvements sound like a composition getting richer and brighter over time

**"S1 vs S2"** — Isolates just the S1 creature voices OR just the S2 creature voices:
1. S1 solo: hear just the lower, energetic half of your soundscape
2. S2 solo: hear just the upper, calming half
3. This mode reinforces the S1S2 concept and helps users understand their creature collection's musical contribution

**"Compare"** — Side-by-side playback of two time periods:
1. Select two date ranges
2. Hear them played sequentially or simultaneously (left/right stereo split)
3. Makes health changes audible: "My music from January sounds so different from now"

**Audio Export:** Any playback can be exported as an M4A/MP3 file for sharing. The exported file contains NO health data — just beautiful music. Metadata tags include "Generated by S1S2" and the date range.

---

# PART III: USER EXPERIENCE — SCREEN BY SCREEN

## 3.1 Onboarding Flow (4 Screens + Setup)

**Screen 1 — S1:**
- Black screen
- After 1 second, a single waveform pulse appears in warm coral (#E85D5D), traveling left to right
- A deep, warm "lub" sound plays
- Text fades in: "This is S1."
- User taps to continue

**Screen 2 — S2:**
- Same black screen
- The S1 pulse appears again, followed immediately by a second pulse in cool blue (#5D8DE8)
- A higher, resolving "dub" sound plays after the "lub"
- Text: "This is S2."

**Screen 3 — Together:**
- Both pulses repeat in rhythm: lub-dub, lub-dub, lub-dub
- The waveform traces a continuous S1S2 pattern across the screen
- Text: "Together, they're the sound your heart has made every moment of your life."
- Pause for 2 full S1S2 cycles to let the moment breathe

**Screen 4 — The Universe:**
- The S1S2 waveform continues, then the peaks begin to glow
- Each peak explodes outward like a big bang, becoming stars
- Stars scatter across the screen, forming a galaxy
- Camera pulls back to reveal the full cosmos, generated from the waveform
- Text: "Let's turn that sound into a universe."
- Button: "Begin" (styled as a ship ignition switch)

**Setup (3 quick screens after onboarding):**
1. "What should we call you, Captain?" — name entry
2. "Let's hear your engine." — first HR measurement via camera (with coaching overlay showing exactly where to place finger)
3. "Your ship is ready." — ship appears with engine glowing at their measured HR. Galaxy map fades in with the first system highlighted.

## 3.2 Bridge (Home Screen) — Detailed Layout

**Top bar:**
- Ship name (user-editable) — left
- Current streak flame icon + day count — center
- XP level badge — right

**Main viewport (60% of screen):**
- Animated parallax star field showing the current system
- Current planet(s) visible if in a system with undiscovered creatures
- Subtle waveform overlay pulsing at the user's last recorded HR
- Tap viewport to expand to full galaxy map

**Ship instrument panel (25% of screen, below viewport):**
- Engine gauge (HR): circular dial showing last recorded BPM with a gentle pulsing animation
- Fuel pressure (BP): vertical bar if BP was logged today, grayed out with "+" icon if not
- Shield harmonics (HRV): waveform display if available from wearable
- Life support (SpO2): percentage readout if available
- Each instrument can be tapped for its full history view

**Action bar (bottom 15%):**
- "Check In" button (large, center) — initiates camera HR scan
- "Log" button (left) — opens manual vital entry
- "Play" button (right) — plays today's generated music

**Ambient details:**
- Soft particle effects (distant stars, nebula wisps)
- Music plays continuously at low volume (Layer 0 + Layer 1 + discovered creature voices)
- If a creature is discoverable right now (conditions met), a subtle golden shimmer appears on one of the planets in the viewport

## 3.3 Check-In Flow — Detailed

**Step 1: Initiation**
- User taps "Check In" on Bridge
- Camera activates with an overlay showing a fingerprint-shaped target zone
- Text: "Place your fingertip gently over the camera"
- Subtle S1S2 rhythm plays to set a calm mood

**Step 2: Measurement (10-15 seconds)**
- Real-time S1S2 waveform builds on screen as each heartbeat is detected
- Each detected beat shows "S1..." then "S2..." with the waveform peak
- BPM counter updates in real-time, stabilizing after ~8 seconds
- Circular progress indicator fills as measurement completes
- Satisfying "measurement complete" chime (S1-S2 chord)

**Step 3: Result**
- Large BPM display with ship AI commentary: "Engine cycle at 67. That's a smooth rhythm, Captain."
- Contextual comparison: "That's 3 beats calmer than yesterday morning."
- Fuel cell animation: fuel gauge fills, ship engine glows brighter
- If a creature discovery was triggered, golden "RESONANCE DETECTED" banner appears

**Step 4: Optional extras (skippable)**
- Quick-tap icons to log: mood (5 emoji), activity (walked/exercised/rested), sleep (hours slider), BP (systolic/diastolic entry)
- Each additional log adds a fuel cell animation
- "That's everything" button to finish

**Step 5: Travel**
- Galaxy map briefly appears showing the ship advancing
- If a new system is entered: system name reveal animation
- If a planet with a discoverable creature is reached: "Resonance detected on [planet name]. Investigate?"
- Return to Bridge with updated instruments

## 3.4 Creature Discovery Flow

**Trigger:** User has met the discovery conditions AND visits the relevant planet (either automatically upon entering the system, or by tapping the planet in the viewport).

**Step 1: Approach**
- Ship flies toward the planet. Camera zooms in.
- The planet's surface texture hints at the creature's biome
- Suspenseful low-frequency hum builds

**Step 2: Detection**
- A waveform pulse appears on the planet's surface
- Text: "Unknown acoustic signature detected..."
- The creature's Acoustic Signature begins playing — muffled at first, as if heard from a distance

**Step 3: Reveal**
- The creature materializes in a beautiful animation — emerging from light particles that coalesce into its form
- Full-screen illustration with parametric variants applied
- The creature's Acoustic Signature plays clearly
- Resonance Class icon appears (S1 flame / S2 wave / Harmonic bridge)
- Rarity badge materializes

**Step 4: Field Guide Entry**
- Creature name appears in display font
- Lore text fades in, line by line
- "Added to your Acoustic Field Guide" confirmation
- "This creature now plays in your Resonance Chamber" with a visual of it joining the others

**Step 5: Musical Integration**
- Brief demo: the current ambient music plays with this creature's voice now added
- User hears the difference — the soundscape just got slightly richer
- "Your universe grows." — return to Bridge

---

# PART IV: DEVELOPMENT PHASES — DETAILED

## Phase 1: "First Signal" — MVP

**Duration:** 14 weeks (3.5 months)
**Platform:** iOS only
**Monetization:** Free only (validate engagement before building paywall)

### Week 1-2: Foundation
- Project setup: Expo/React Native, Supabase project, basic auth (Apple Sign-In + email)
- Supabase schema: users, vitals, creatures, journey, streaks, achievements tables
- RLS policies for all tables
- Basic navigation shell: Bridge, Check-In, Galaxy Map, Field Guide, Log (Profile)

### Week 3-4: Heart Rate Engine
- Camera-based PPG implementation (react-native-camera + custom PPG algorithm)
- S1S2 waveform visualization during measurement
- BPM calculation with ±3 BPM accuracy target
- Apple HealthKit integration for continuous HR import
- Vitals storage in Supabase

### Week 5-6: Bridge & Ship
- Bridge home screen with ship instrument panel
- Engine gauge (HR), fuel pressure (BP), basic displays
- Manual vital entry screens: BP, sleep, mood, activity
- Fuel cell calculation engine
- XP system with level progression
- Streak tracking with 48-hour grace period

### Week 7-8: Galaxy Map (Simplified)
- Linear path galaxy (not full 2D graph yet — a sequence of 50 systems in a line)
- System color derivation from health data
- Travel animation based on daily fuel
- System naming
- Basic parallax star field rendering
- Points of interest: planets only (no Echoes, Listening Posts, or Resonance Gates yet)

### Week 9-10: Creature System
- 20 launch creatures implemented with discovery triggers
- Parametric variant generation from user data
- Discovery flow animation (simplified — no full planet approach, just on-system discovery)
- Basic Field Guide with illustration, lore, and rarity display
- Resonance Chamber (simple grid view of collected creatures, tap for detail)
- Acoustic Signatures: placeholder synthesized sounds (not final audio)

### Week 11-12: Music Engine (Basic)
- Tone.js integration for audio playback
- Layer 0: S1S2 fundamental tones derived from resting HR
- Layer 1: single biome bed (Nebula — ambient pads)
- Layer 2: creature voices (basic synth versions)
- "Play Today" generation and playback
- Background music on Bridge screen

### Week 13-14: Polish & Launch Prep
- Onboarding flow (4 screens + setup)
- Ship AI commentary system (text-based insights for check-ins and weekly summaries)
- Push notification system for smart reminders
- App Store assets: screenshots, description, preview video
- TestFlight beta with 20-50 users
- Privacy policy, terms of service
- Bug fixes, performance optimization
- App Store submission

### MVP Success Metrics (first 30 days):
- Day 1 retention: >60%
- Day 7 retention: >40%
- Day 30 retention: >25%
- Average check-ins per active user per day: >1.5
- Creatures discovered per user in first week: >8
- "Play Today" taps per user per week: >3
- Organic App Store rating: >4.5 stars
- Crash rate: <0.5%

---

## Phase 2: "Deep Signal" — Full Game

**Duration:** 10 weeks (2.5 months)
**Trigger:** Launch Phase 2 when MVP achieves Day 7 retention >35%

### Week 1-2: Full Galaxy
- Replace linear path with full 2D procedural graph generation
- Implement fog-of-war system: unexplored regions hidden until approached
- Add system types: Nebula, Asteroid Field, Gas Giant, Binary Star, Deep Void, Stellar Nursery, Pulsar, Black Hole Vicinity
- Pinch-to-zoom from system level to full journey view
- Add Echoes (personal best markers on map)
- Add Listening Posts (weekly summary stations)

### Week 3-4: Creature Expansion
- Add 30 more creatures (Rare, Epic, Legendary tiers)
- Implement full Resonance Classification system (S1/S2/Harmonic)
- Enhanced discovery flow with planet approach animation
- Resonance Chamber redesign: 3D-like room view with creatures floating/moving
- Full Field Guide with S1/S2/Harmonic categorization and filtering

### Week 5-6: Music System — Full
- All 8 biome beds implemented with professional audio stems
- Professional creature Acoustic Signatures (commissioned from a sound designer)
- Layer 3 vital modulation: real-time tempo, key, reverb, density adjustments
- "Play This Week" and "Play My Journey" generation
- "S1 vs S2" isolation mode
- Audio export (M4A) with metadata

### Week 7-8: Premium & Monetization
- Premium tier ("Deep Signal") implementation: annual $29.99 / lifetime $79.99
- RevenueCat integration for subscription management
- Paywall screens (non-aggressive — show what's available, never interrupt gameplay)
- Premium features: full galaxy, all creature tiers, unlimited history, advanced music, wearable sync, doctor PDF export
- Free tier constraints: 30-day history, Common/Uncommon creatures only, basic music
- Ensure all health tracking remains free

### Week 9-10: Android & Polish
- Android build and testing (React Native cross-platform)
- Google Health Connect integration
- Google Play Store submission
- Seasonal Transmissions system (monthly challenge framework)
- First seasonal event content
- Performance optimization across both platforms
- Localization framework (English only at launch, but strings externalized for future translation)

### Phase 2 Success Metrics:
- Premium conversion rate: >5% of Day 30 retained users
- Day 30 retention (overall): >30%
- Day 90 retention: >15%
- Creature discovery rate: >2 per active user per week
- Music playback engagement: >5 plays per user per week
- Premium revenue per month: tracking toward $10K MRR within 6 months
- App Store rating maintained >4.5

---

## Phase 3: "Full Spectrum" — Growth

**Duration:** Ongoing (3-6 month cycles)
**Trigger:** Launch Phase 3 features when premium MRR exceeds $5K

### Cycle 1 (Months 1-3): Social & Wearables

**Wearable integrations:**
- Fitbit SDK integration
- Garmin Connect IQ integration
- Oura Ring API integration
- Withings Health Mate integration
- Automatic import of continuous HR, HRV, SpO2, sleep stages
- Background sync — data imports even when app isn't open

**Social features:**
- Rhythm Partners: mutual pairing, streak visibility, Pulse nudges
- Resonance Chamber visits: share a link, visitor sees creatures + hears music
- Echo system: visitors leave short text messages as floating particles
- Collective Expeditions: monthly community progress bars

**Advanced insights:**
- Correlation engine: automated detection of relationships between metrics
- Natural language insight delivery: "When you sleep 7+ hours, your resting HR is 5 BPM lower the next morning"
- Correlations trigger Harmonic creature discoveries

### Cycle 2 (Months 4-6): Content & Depth

**Creature expansion to 150+:**
- 20 new creatures per month
- Each quarterly drop themed around a new galaxy region
- Marketing each drop as an "expedition" event

**Resonance Gates:**
- Hidden biomes accessible after completing Seasonal Transmissions
- Unique musical soundscapes per hidden biome
- Exclusive creatures only available in these regions

**Doctor visit reports:**
- Professional PDF generation with HR trends, BP charts, HRV analysis, sleep patterns
- Formatted for healthcare providers
- S1S2 branded but clinically clear
- One-tap generation from Signal Deck

**Apple Watch companion:**
- Quick check-in from wrist (HR measurement via watch sensors)
- Complication showing current streak
- Notification for smart reminders
- Syncs back to phone app

### Cycle 3 (Months 7-12): Scale & Retention

**Content reaching 200+ creatures**

**"Compare" playback mode** — hear two time periods side by side

**Annual "Journey in Review"** — Spotify Wrapped-style year-end summary:
- Total S1S2 cycles recorded
- Distance traveled (systems visited)
- Creatures discovered
- Rarest creature found
- "Your year's song" — a generated composition from 12 months of data
- Shareable card with galaxy map thumbnail (no health data)

**Community features:**
- Anonymous aggregate statistics: "S1S2 captains collectively traveled 2 million light-years this month"
- Community creature discovery milestones
- Optional public Resonance Chamber profiles

**Localization:** Spanish, Portuguese, Japanese, Korean, German, French

**Platform expansion:** iPad-optimized layout, potential web companion for galaxy map viewing

---

# PART V: BUSINESS

## 5.1 Pricing Strategy

### Free Tier — "First Rhythm"
Generous enough that free users genuinely love the app and recommend it. The free tier IS the marketing engine.

Includes: full health tracking, basic ship (Pod + Scout), 80+ Common and Uncommon creatures, daily music generation, 30-day vitals history, basic Field Guide, core insights, guided breathing, streak system, XP progression through Scout class.

### Premium — "Deep Signal"
Priced to be accessible while funding ongoing creature art and sound design.

- Annual: $29.99/year ($2.50/month)
- Lifetime: $79.99 (offered during launch window, may increase later)
- No monthly option (reduces churn, simplifies billing)

Includes: full galaxy with all regions and biomes, all 200+ creatures (Epic through Mythic), unlimited vitals history, complete music system with export, advanced correlations, doctor PDF reports, ship customization, Resonance Chamber decoration, wearable sync beyond Apple Health, Seasonal Transmissions, priority creature drops, ship classes Cruiser through Flagship.

### Never paywalled
Health data logging, viewing, and export. Concerning trend notifications. Basic creature discovery. Guided breathing. This is a core Taoftware principle: health should never be gated behind money.

## 5.2 Revenue Projections (Conservative)

Assumptions: 1,000 downloads/month growing 20% monthly, 5% premium conversion of Day 30 retained users (25% of downloads), average revenue per premium user $25/year.

| Month | Downloads | Retained (D30) | Premium Users | Monthly Revenue |
|---|---|---|---|---|
| 1 | 1,000 | 250 | 13 | $27 |
| 3 | 1,440 | 360 | 51 | $106 |
| 6 | 2,488 | 622 | 131 | $273 |
| 12 | 7,430 | 1,858 | 508 | $1,058 |
| 18 | 22,186 | 5,547 | 1,695 | $3,531 |
| 24 | 66,240 | 16,560 | 5,395 | $11,240 |

These are intentionally conservative. A single viral moment (App Store feature, influencer mention, health community adoption) could 10x any month's downloads.

## 5.3 Cost Structure

**Fixed costs (monthly):**
- Supabase Pro: $25/month
- Apple Developer: $99/year ($8.25/month)
- Google Play: $25 one-time (paid)
- Domain (s1s2.app): ~$15/year

**Variable costs:**
- Creature illustration: $100-300 per creature (freelance illustrator)
- Sound design: $50-150 per Acoustic Signature (freelance sound designer)
- Marketing: $0 initially (organic + App Store optimization)

**Phase 1 total cost estimate:** $500-1,000 (mostly creature art for launch set of 20)
**Phase 2 total cost estimate:** $3,000-5,000 (30 more creatures + professional audio stems)

Since Tao is doing all development personally, the primary costs are art and audio assets.

---

# PART VI: APPENDICES

## Appendix A: Complete Supabase Schema

```sql
-- Users
create table users (
  id uuid primary key references auth.users(id),
  created_at timestamptz default now(),
  display_name text,
  ship_name text default 'Unnamed Vessel',
  ship_class text default 'pod' check (ship_class in ('pod','scout','cruiser','explorer','flagship')),
  xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  streak_start timestamptz,
  last_checkin timestamptz,
  freezes_remaining integer default 0,
  preferences jsonb default '{}'::jsonb,
  onboarding_completed boolean default false
);

-- Vitals (the core health data table)
create table vitals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null check (type in (
    'heart_rate', 'resting_heart_rate', 'bp_systolic', 'bp_diastolic',
    'hrv', 'spo2', 'weight', 'sleep_hours', 'sleep_quality',
    'mood', 'activity_type', 'activity_duration',
    'water', 'caffeine', 'alcohol', 'sodium'
  )),
  value numeric not null,
  unit text,
  source text default 'manual' check (source in (
    'camera', 'manual', 'apple_health', 'google_health',
    'fitbit', 'garmin', 'oura', 'withings'
  )),
  recorded_at timestamptz default now(),
  notes text
);

-- Creatures (discovered by user)
create table creatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  species_id text not null references creature_species(id),
  discovered_at timestamptz default now(),
  discovery_system_id text,
  discovery_planet_name text,
  variant_params jsonb not null, -- {hue, pattern_density, glow, size, accent_color}
  discovery_vitals jsonb, -- snapshot of relevant vitals at discovery time
  is_favorite boolean default false
);

-- Creature species definitions (shared, read-only)
create table creature_species (
  id text primary key, -- e.g., 'first_pulse', 'calm_stag'
  name text not null,
  resonance_class text not null check (resonance_class in ('s1', 's2', 'harmonic')),
  rarity text not null check (rarity in ('common','uncommon','rare','epic','legendary','mythic')),
  lore_text text not null,
  field_notes text not null,
  discovery_hint text, -- shown when undiscovered
  discovery_conditions text, -- shown after discovered
  acoustic_signature_file text, -- path to audio asset
  base_illustration_file text, -- path to art asset
  trigger_type text not null, -- 'streak', 'metric_sustained', 'correlation', etc.
  trigger_config jsonb not null, -- specific trigger parameters
  sort_order integer default 0
);

-- Journey (galaxy map state)
create table journey_systems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  system_index integer not null, -- position in the galaxy graph
  system_type text check (system_type in (
    'nebula','asteroid_field','gas_giant','binary_star',
    'deep_void','stellar_nursery','pulsar','black_hole'
  )),
  system_name text,
  visited_at timestamptz,
  color_hsl jsonb, -- {h, s, l} derived from health data
  planets jsonb default '[]'::jsonb, -- [{name, creature_species_id, discovered}]
  has_echo boolean default false,
  has_listening_post boolean default false,
  is_resonance_gate boolean default false
);

-- Achievements / Frequencies
create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  achievement_id text not null references achievement_definitions(id),
  unlocked_at timestamptz default now()
);

create table achievement_definitions (
  id text primary key,
  name text not null,
  description text not null,
  icon_file text,
  category text,
  sort_order integer default 0
);

-- Music sessions
create table music_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  generated_at timestamptz default now(),
  mode text check (mode in ('today','week','journey','compare')),
  duration_seconds integer,
  biome text,
  creature_voices text[], -- array of species_ids contributing
  vitals_snapshot jsonb,
  s1_fundamental_hz numeric,
  s2_fundamental_hz numeric,
  exported boolean default false,
  export_file_path text
);

-- Social
create table rhythm_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  partner_id uuid references users(id),
  created_at timestamptz default now(),
  status text default 'pending' check (status in ('pending','active','ended'))
);

create table echoes (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references users(id),
  recipient_id uuid references users(id) on delete cascade,
  message text not null check (char_length(message) <= 140),
  created_at timestamptz default now(),
  read boolean default false
);

-- RLS Policies (applied to all user-data tables)
-- Users can only read/write their own rows
-- creature_species and achievement_definitions are public read-only
-- echoes: sender can insert for recipient; recipient can read their own
-- rhythm_partners: both parties can read; initiator can insert; either can update status
```

## Appendix B: Sound Design Specifications

**S1S2 Fundamental Tone Mapping:**

| Resting HR (BPM) | S1 Note | S1 Frequency (Hz) | S2 Note (Perfect 5th) | S2 Frequency (Hz) |
|---|---|---|---|---|
| 55 | A1 | 55.0 | E2 | 82.4 |
| 60 | B1 | 61.7 | F#2 | 92.5 |
| 65 | C2 | 65.4 | G2 | 98.0 |
| 70 | D2 | 73.4 | A2 | 110.0 |
| 75 | E2 | 82.4 | B2 | 123.5 |
| 80 | F2 | 87.3 | C3 | 130.8 |
| 85 | G2 | 98.0 | D3 | 146.8 |
| 90 | A2 | 110.0 | E3 | 164.8 |

The S1 tone uses a warm synthesized timbre (triangle wave + subtle harmonics). The S2 tone uses a cleaner timbre (sine wave + octave harmonic). Both are processed through a long reverb tail with slow LFO modulation.

**UI Sound Palette:**

| Action | Sound | Duration | Notes |
|---|---|---|---|
| Tap/select | Soft S1 (lub) | 0.1s | Pitched to user's S1 fundamental |
| Confirm/complete | S1 then S2 (lub-dub) | 0.3s | The complete heartbeat — most satisfying UI sound |
| Creature discovery | S1-S2 + rising harmonic swell | 1.5s | Builds tension then resolves into warmth |
| Streak milestone | Layered S1S2 rhythms accelerating | 2.0s | Multiple heartbeats building into a brief orchestral hit |
| Navigation/travel | Low thrumming engine hum | Continuous | Pitch rises as ship accelerates |
| Error/attention needed | S1 without S2 (incomplete beat) | 0.2s | Subconsciously unsettling — something needs resolution |
| Fuel added | Gentle ascending chime | 0.3s | Like filling a glass with light |
| XP gained | Bright ping | 0.15s | Quick, satisfying, not distracting |
| Onboarding S1 | Deep resonant lub | 0.4s | Maximum reverb, theatrical |
| Onboarding S2 | Clear resolving dub | 0.3s | Completes the onboarding heartbeat |

## Appendix C: Marketing Strategy

**Pre-launch (4 weeks before App Store submission):**
- Landing page at s1s2.app with the onboarding animation as a hero video
- Email waitlist with "Be among the first captains"
- Teaser posts on X/Twitter and Instagram showing creature artwork without context
- "What is S1S2?" teaser campaign — post the waveform, let people guess

**Launch week:**
- Product Hunt launch (target #1 in Health & Fitness)
- Submit to App Store "Apps We Love" editorial team
- Press kit with screenshots, creature art, and the story of the name
- Reach out to health/wellness influencers and indie game reviewers
- Reddit posts in r/indiegaming, r/quantifiedself, r/heart (if exists), r/proceduralgeneration

**Ongoing:**
- Seasonal Transmission launches as marketing events
- Quarterly creature drops announced with teaser art
- "Journey in Review" annual feature designed to be shared on social media
- Community building on Discord: creature hunting, theory crafting for Mythic discoveries

**App Store Optimization (ASO):**
- Primary keywords: heart rate, heart health, heartbeat, pulse tracker
- Secondary keywords: space game, creature collection, generative music
- Screenshots should lead with the GAME not the health tracking: ship cockpit, galaxy map, creature discovery, Resonance Chamber
- App Store preview video: the onboarding sequence + a creature discovery + "Play Today" music generation

## Appendix D: Key Performance Indicators

**Engagement KPIs:**
- Daily Active Users (DAU) / Monthly Active Users (MAU) ratio — target >30%
- Check-ins per DAU per day — target >1.5
- Average session duration — target >90 seconds
- Creatures discovered per active user per week — target >2
- "Play Today" engagement rate — target >40% of DAU
- Streak length distribution — target median >14 days

**Retention KPIs:**
- Day 1 retention — target >60%
- Day 7 retention — target >40%
- Day 30 retention — target >25%
- Day 90 retention — target >15%
- Premium subscriber monthly churn — target <5%

**Revenue KPIs:**
- Free-to-premium conversion rate — target >5%
- Average Revenue Per User (ARPU) — target >$0.50/month
- Lifetime Value (LTV) — target >$15
- Customer Acquisition Cost (CAC) — target <$3 (organic-first strategy)

**Health Outcome KPIs (long-term, for press/positioning):**
- % of users who show resting HR improvement after 90 days
- % of users who maintain consistent BP logging for 30+ days
- Average streak length across all users
- These metrics become the "S1S2 works" narrative for press and App Store features

---

*S1S2 — A Taoftware LLC Product*
*"The two sounds that power everything."*

*S1 begins. S2 completes. Everything in between is your journey.*

*Final Plan — March 2026*
