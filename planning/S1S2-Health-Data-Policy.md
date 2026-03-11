# S1S2 Health Data Policy

## Purpose

This document defines how S1S2 handles health-related user data for storage, retention, export, deletion, analytics, and trust.

## Product Principles

- user health data exists to power the user experience, not ad targeting
- the product is not a diagnostic medical device
- health logging, viewing, export, and concerning trend alerts remain free
- users must be able to understand what was collected and where it came from

## Data Classes

| Class | Examples | Sensitivity | Exportable | Deletable | Marketing Use |
|---|---|---|---|---|---|
| account data | display name, ship name, preferences | moderate | yes | yes | no personalized advertising |
| health metrics | HR, resting HR, BP, HRV, SpO2, sleep, mood, activity | high | yes | yes | no |
| derived health signals | system color, streak state, trend summaries, discovery snapshots | high | yes where user-visible | yes with source data deletion | no |
| gameplay state | creatures, journey progress, ship class, achievements | moderate | yes | yes | only aggregate product analytics |
| purchase state | subscription and entitlement status | moderate | yes where required | yes subject to billing record needs | no ad targeting |
| support data | support emails and issue details | moderate to high | case by case | yes where permitted | no |

## Collection Sources

- camera-based PPG
- manual entry
- Apple Health
- Health Connect
- later third-party wearable integrations only after explicit user authorization

## Retention Rules

| Data | Default Retention Rule |
|---|---|
| health metric records | retained until user deletes account or specific records |
| exported files | generated on demand and removable by user |
| crash and error logs | retain only as long as needed for debugging and product safety |
| analytics events | retain in aggregated and operational form only as long as needed for product improvement |
| purchase records | retain according to billing and legal requirements |

## Export Rules

- users can export raw health logs, visible gameplay state tied to their account, and user-facing reports
- exports must preserve source attribution where possible
- exported music files must not include health data in file names or metadata
- export should be understandable without requiring the app UI

## Deletion Rules

- account deletion removes user-owned data from active systems except records required for billing, fraud prevention, or legal compliance
- deletion requests should be acknowledged quickly and tracked as high-priority support tasks
- users should be told clearly which data disappears immediately and which may persist temporarily in backups

## Analytics Rules

- no raw health values should be sent to marketing tools
- analytics should prefer buckets, state labels, or derived usage signals when exact values are not necessary
- health data may be used for product improvement only within privacy-safe operational analytics
- never use individual health patterns in testimonials or marketing without explicit, separate consent

## Trust and Messaging Rules

- present imported versus self-reported data clearly
- never imply diagnosis, treatment, or medical certainty
- never frame calm, active, or intense map colors as moral judgments
- show failure states honestly when scan confidence is low

## Incident Response

High-priority incidents include:

- data loss
- incorrect entitlement affecting health access promises
- false or misleading health-facing copy
- broken export or deletion
- repeated reports of incorrect scan results without low-confidence warnings

Response order:

1. acknowledge the issue
2. protect the user from further harm or confusion
3. fix or disable the broken behavior
4. document the root cause and user impact
5. update support and product copy if trust language contributed
