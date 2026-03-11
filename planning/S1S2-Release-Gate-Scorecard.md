# S1S2 Release Gate Scorecard

## Purpose

This document defines the phase gates, review cadence, thresholds, and hold actions that control rollout pacing.

## Review Cadence

- Phase 0-2: review weekly
- Phase 3 launch month: review daily in week one, then twice weekly
- Phase 4-5: review weekly
- Phase 6-8: review biweekly for product metrics and monthly for strategic gates

## Hold Sprint Rule

If a phase gate fails, insert a `2-week hold sprint` before the next phase. Hold sprints focus only on retention, reliability, trust, or support capacity issues that blocked the gate.

## Scorecard

| Gate | Relative Timing | Owner | Metrics | Threshold | Fallback If Missed |
|---|---|---|---|---|---|
| Phase 0 exit | end of Week 2 | founder | scope lock, entitlement lock, feasibility spikes, business model | all approved | re-scope MVP and re-run failed spikes |
| Phase 1 exit | end of Week 4 | founder | env stability, schema, analytics, seed data, QA scripts | all working in staging | pause feature work until foundation is stable |
| Beta readiness | end of Week 18 | founder | onboarding completion, first successful scan, crash-free sessions, first creature timing, first music play | >75%, >70%, >99.5%, mostly within 2 sessions, >35% week-one music play | run stability sprint before expanded beta |
| Launch continuation | during Week 19-22 | founder | D1, D7, scan success, trust complaints, support load | D1 >= 50%, D7 >= 35%, scan >= 65%, support within capacity | hold Phase 4 and run retention or trust sprint |
| Phase 3 exit | end of Week 22 | founder | D1 recovery, D7, average check-ins, first-week discoveries, rating | D1 >= 60% or recovering, D7 >= 35-40%, >1.5 check-ins, >8 discoveries, rating >4.5 | extend launch stabilization |
| Phase 4 exit | end of Deep Signal | founder | D30 retention, premium conversion, refund rate, rating, support load | D30 > 30%, conversion > 4-5%, refunds < 5%, rating > 4.5, support stable | delay Android and simplify premium offer |
| Phase 5 exit | end of Android phase | founder | Android stability, Health Connect reliability, Seasonal cadence, billing support | acceptable parity with iOS and stable operations | keep Android soft-launched longer |
| Phase 6 exit | end of Growth cycle 1 | founder | MRR, support burden, import reliability impact | MRR > $5K and stable support | slow social scope and improve integrations |
| Phase 7 exit | end of Growth cycle 2 | founder | content throughput, doctor-report usage, reactivation from drops | monthly drop cadence sustainable and meaningful usage | reduce drop volume and simplify utility scope |
| Phase 8 exit | end of Growth cycle 3 | founder | year-end recap readiness, localization workflow, moderation debt | clean year-end launch and manageable moderation | limit public features and reduce localization breadth |

## Phase 3 Hold Triggers

Any one of these triggers starts a hold sprint:

- D1 below `50%`
- D7 below `35%`
- first successful scan below `65%`
- repeated privacy or scan-trust complaints
- support queue exceeds founder response capacity for more than three business days

## Hold Sprint Work Order

1. freeze new feature work
2. review complaint tags and session replay or debug evidence
3. fix the highest-leverage trust or friction problem first
4. retest the first-hour journey
5. relaunch the affected cohort only after the gate metric improves

## Weekly Review Template

Use the same checklist every week:

1. what changed in activation
2. what changed in retention
3. what changed in trust
4. what changed in support load
5. what changed in quality
6. what will be deliberately ignored until the next review
