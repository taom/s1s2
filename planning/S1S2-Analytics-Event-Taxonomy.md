# S1S2 Analytics Event Taxonomy

## Purpose

This document defines the minimum event model required to operate S1S2 through MVP, launch, premium rollout, and live tuning.

## Naming Rules

- use `snake_case`
- use past-tense outcome names only when an action has completed
- use `viewed`, `started`, `completed`, `failed`, `advanced`, `unlocked`, and `purchased` consistently
- do not create duplicate names for the same business event across platforms

## Required Common Properties

Every event should include these properties when available:

| Property | Description |
|---|---|
| `user_id` | internal app user identifier |
| `session_id` | app session identifier |
| `platform` | ios or android |
| `app_version` | semantic version or build number |
| `build_channel` | local, staging, beta, production |
| `pay_tier` | free or premium |
| `ship_class` | pod, scout, cruiser, explorer, flagship |
| `current_phase` | rollout phase or feature-flag phase |
| `acquisition_source` | waitlist, App Store browse, Product Hunt, referral, etc |
| `device_class` | normalized device bucket |
| `timezone` | local timezone name |

## Onboarding Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `onboarding_started` | `entry_source` | start funnel |
| `onboarding_screen_viewed` | `screen_id`, `screen_index` | screen drop-off analysis |
| `onboarding_completed` | `duration_seconds` | activation baseline |
| `setup_name_completed` | `name_length_bucket` | friction check |
| `setup_first_scan_started` | `permission_state` | scan funnel |
| `setup_first_scan_completed` | `scan_confidence`, `bpm`, `duration_seconds` | first-success metric |
| `setup_first_scan_failed` | `failure_reason`, `permission_state` | trust and technical failures |
| `setup_ship_ready_viewed` | `ship_name_defaulted` | emotional milestone |

## Auth and Profile Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `auth_started` | `provider` | auth funnel |
| `auth_completed` | `provider`, `new_user` | activation baseline |
| `auth_failed` | `provider`, `failure_reason` | auth debugging |
| `ship_name_updated` | `name_length_bucket` | identity attachment |
| `notification_permission_prompted` | `context` | permission funnel |
| `notification_permission_result` | `result`, `context` | reminder eligibility |

## Scan and Vitals Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `checkin_started` | `entry_surface` | session intent |
| `hr_scan_started` | `camera_permission_state` | scan funnel |
| `hr_scan_signal_quality_updated` | `quality_bucket` | algorithm tuning |
| `hr_scan_completed` | `bpm`, `scan_confidence`, `duration_seconds`, `source` | success metric |
| `hr_scan_failed` | `failure_reason`, `duration_seconds`, `camera_permission_state` | failure analysis |
| `manual_vital_logged` | `vital_type`, `source`, `value_bucket` | feature uptake |
| `health_import_started` | `provider`, `metric_type` | import flow baseline |
| `health_import_completed` | `provider`, `metric_type`, `record_count` | import reliability |
| `health_import_failed` | `provider`, `metric_type`, `failure_reason` | provider debugging |
| `guided_breathing_started` | `entry_surface` | free feature usage |
| `guided_breathing_completed` | `duration_seconds` | relaxation-loop usage |

## Journey and Progression Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `fuel_awarded` | `source_action`, `fuel_amount` | economy tuning |
| `xp_awarded` | `source_action`, `xp_amount` | progression tuning |
| `streak_updated` | `current_streak`, `used_grace_window` | retention model |
| `streak_broken` | `previous_streak`, `break_reason` | recovery messaging |
| `travel_advanced` | `systems_advanced`, `fuel_spent`, `entered_new_system` | journey pacing |
| `system_viewed` | `system_id`, `system_type`, `visited_state` | map behavior |
| `planet_viewed` | `system_id`, `planet_name`, `resonance_available` | discovery funnel |
| `weekly_summary_viewed` | `summary_type` | listening-post path validation |

## Creature Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `creature_hint_shown` | `species_id`, `system_id` | hint tuning |
| `creature_discovery_started` | `species_id`, `system_id`, `planet_name` | reveal funnel |
| `creature_discovered` | `species_id`, `rarity`, `resonance_class`, `system_id`, `variant_bucket` | core delight metric |
| `creature_field_guide_viewed` | `species_id`, `discovered_state` | collection depth |
| `creature_signature_played` | `species_id` | audio engagement |
| `creature_favorited` | `species_id` | attachment signal |

## Audio Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `music_play_started` | `mode`, `biome`, `active_creature_count` | playback usage |
| `music_play_completed` | `mode`, `duration_seconds`, `completion_percent` | completion quality |
| `music_play_interrupted` | `mode`, `interruption_reason` | technical debugging |
| `music_export_started` | `mode`, `date_range_bucket` | export intent |
| `music_export_completed` | `mode`, `file_duration_seconds` | premium value metric |
| `music_export_failed` | `mode`, `failure_reason` | export debugging |

## Monetization Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `paywall_viewed` | `entry_context`, `surface`, `eligible_reason` | paywall coverage |
| `paywall_cta_tapped` | `surface`, `offer_type` | interest signal |
| `purchase_started` | `product_id`, `offer_type` | conversion funnel |
| `purchase_completed` | `product_id`, `offer_type`, `price_local`, `currency` | revenue events |
| `purchase_restored` | `product_id` | entitlement recovery |
| `purchase_failed` | `product_id`, `failure_reason` | purchase debugging |
| `subscription_canceled` | `product_id`, `cancel_reason` | churn analysis |
| `refund_recorded` | `product_id`, `refund_reason` | value or trust issue |

## Notifications and Re-Engagement Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `notification_scheduled` | `notification_type`, `local_hour` | reminder strategy |
| `notification_opened` | `notification_type`, `delay_minutes` | reminder performance |
| `notification_dismissed` | `notification_type` | noise signal |
| `reactivation_session_started` | `days_since_last_session` | recovery behavior |

## Support and Trust Events

| Event | Required Event Properties | Why It Exists |
|---|---|---|
| `support_link_opened` | `entry_surface` | support demand |
| `privacy_policy_viewed` | `entry_surface` | trust behavior |
| `data_export_completed` | `export_type`, `record_count_bucket` | trust and portability |
| `account_deletion_requested` | `entry_surface`, `stated_reason` | churn and trust |

## KPI Coverage

The following metrics must be derivable from the taxonomy above:

- onboarding completion
- first successful scan
- first creature within first two sessions
- first music play in week one
- D1, D7, D30 retention
- average check-ins per active user
- creature discoveries per active user
- paywall view-to-purchase conversion
- refund rate
- notification open-to-check-in conversion

## Event Governance

- new event names must be added here before implementation
- deprecated events stay documented until removed from all downstream dashboards
- event properties must be stable across iOS and Android unless the platform truly lacks the signal
