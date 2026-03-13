# S1S2 — The Two Sounds That Power Everything

> S1 begins. S2 completes. Everything in between is your journey.

![S1S2 Banner](docs/assets/s1s2-banner.png)

## Overview

S1S2 is a heart health app disguised as a space exploration game. Your real heartbeat fuels a spaceship, discovers alien creatures, and composes unique music. It's like No Man's Sky meets a health tracker — where your body is the engine of an ever-expanding universe.

**The name comes from cardiology:** S1 and S2 are the two distinct sounds of every human heartbeat. S1 ("lub") occurs when the mitral and tricuspid valves close at the start of systole — the sound of beginning. S2 ("dub") occurs when the aortic and pulmonary valves close at the start of diastole — the sound of completion. Together, S1S2 is the most fundamental rhythm in every human body.

## Features

### 🚀 Space Explorer — The Journey
- **Your Ship**: A customizable vessel that serves as your home base
- **Procedural Galaxy**: A unique universe generated from your health data
- **Travel System**: Daily health tracking fuels your journey through the stars
- **Dynamic Colors**: Systems change color based on your vitals (calm blues, active golds, intense violets)

### 🦎 Creature Collection — The Reward
- **200+ Creatures**: Discover species across 6 rarity tiers (Common → Mythic)
- **Three Classes**: S1 (Initiators), S2 (Resolvers), Harmonic (Bridges)
- **Parametric Variants**: Each creature is unique to YOUR health data
- **Acoustic Signatures**: Every creature contributes a musical voice

### 🎵 Music Composer — The Soul
- **Generative Soundtrack**: Your health data composes unique music
- **Layered System**: S1S2 fundamentals, biome beds, creature voices, vital modulation
- **Multiple Playback Modes**: Play Today, Play This Week, Play My Journey
- **Audio Export**: Share your body's composition

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native + Expo |
| **Backend** | Supabase (PostgreSQL, Auth, RLS) |
| **Audio** | Tone.js / Custom Audio Engine |
| **Health Data** | Apple HealthKit, Google Health Connect |
| **Payments** | RevenueCat |
| **Analytics** | PostHog / Mixpanel (TBD) |

## Project Structure

```
s1s2/
├── app/                        # Expo SDK 55 app
│   └── src/
│       ├── app/                # Expo Router file-based routing
│       │   ├── (onboarding)/   # 4-screen cinematic intro + setup
│       │   ├── (tabs)/         # Main ship interior rooms
│       │   │   ├── bridge.tsx  # Home (cockpit + vitals instruments)
│       │   │   ├── chamber.tsx # Resonance Chamber (creature gallery)
│       │   │   ├── galaxy.tsx  # Navigation Console (galaxy map)
│       │   │   ├── signals.tsx # Signal Deck (insights & history)
│       │   │   └── log.tsx     # The Log (profile & settings)
│       │   ├── checkin.tsx     # Check-in flow (full-screen modal)
│       │   └── creature-discovery.tsx
│       ├── components/
│       │   └── ship/           # Ship instrument components
│       ├── constants/          # Design tokens, creature data
│       ├── services/           # Supabase client, local DB
│       ├── stores/             # Zustand state (user, journey, creatures, music)
│       └── types/              # TypeScript definitions
├── planning/                   # Execution planning documents
└── docs/                       # Development documentation
```

## Development Phases

### Phase 0: Signal Lock (Weeks 0-2)
Lock strategy, scope, economics, and feasibility.

### Phase 1: Pre-Production (Weeks 3-4)
Build production foundation with stable environments and seeded systems.

### Phase 2: First Signal MVP (Weeks 5-18)
Build closed-beta-ready iOS MVP with:
- Camera-based HR scanning
- HealthKit integration
- Bridge home screen
- Linear galaxy map
- 20 MVP creatures
- Basic music engine
- Cinematic onboarding

### Phase 3: Launch & Stabilization (Weeks 19-22)
Staged public release with aggressive tuning.

### Phase 4: Deep Signal (Weeks 23-32)
Premium-ready expansion with:
- Full graph-based galaxy
- 50 total creatures
- Advanced music system
- Premium monetization

### Phase 5-8: Growth Cycles
Android launch, wearables, social features, content expansion.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Supabase account
- Apple Developer account (for iOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/taom/s1s2.git
cd s1s2/app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npx expo start
```

### Environment Setup

Create a `.env.local` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Documentation

- [Product Bible](./S1S2-Final-Product-Bible.md) — Complete product specification
- [Phased Rollout Plan](./S1S2-Phased-Rollout-Business-Development-Plan.md) — Execution roadmap
- [Planning Documents](./planning/README.md) — Supporting planning artifacts

## Key Principles

### Never Paywalled
- Health data logging, viewing, and export
- Concerning trend notifications
- Basic creature discovery
- Guided breathing

### Brand Voice
- Precise but never cold
- Poetic but never pretentious
- Scientific but never intimidating
- Encouraging but never patronizing
- Uses "Captain" as the user's title

### Design Philosophy
- Feels like a premium atmospheric game, not a medical dashboard
- Free tier is lovable enough to be a referral engine
- Premium marketed as deeper beauty, not a tollbooth

## Success Metrics

| Metric | Target |
|--------|--------|
| Day 1 Retention | >60% |
| Day 7 Retention | >40% |
| Day 30 Retention | >25% |
| Check-ins per DAU | >1.5 |
| Premium Conversion | >5% |
| App Store Rating | >4.5 stars |

## License

Proprietary — Taoftware LLC

## Credits

**Taoftware LLC — App #4**

Created by Tao

---

*"The two sounds that power everything."*
