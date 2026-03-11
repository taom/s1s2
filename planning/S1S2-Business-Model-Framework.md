# S1S2 Business Model Framework

## Purpose

This document corrects the earlier revenue-model ambiguity by separating cash collected from recognized revenue.

## Definitions

| Term | Meaning |
|---|---|
| `downloads` | new installs in the period |
| `D30 retained users` | users still active 30 days after install |
| `eligible retained users` | retained users who have reached a paywall-eligible moment |
| `premium conversion rate` | percent of eligible retained users who purchase |
| `cash bookings` | actual money collected at purchase time |
| `recognized revenue` | revenue recognized over the service period |

## Core Modeling Rule

- annual subscriptions generate a large upfront cash booking but recognized revenue is spread across 12 months
- lifetime purchases create upfront cash bookings and recognized revenue treatment should follow the accounting method actually used
- operational planning should track both numbers because contractor cash flow depends on bookings, while business reporting may focus on recognized revenue

## Scenario Inputs

Model three scenarios:

- conservative
- base
- breakout

Each scenario should include:

- monthly downloads
- organic growth rate
- D30 retention rate
- paywall eligibility rate
- premium conversion rate
- mix of annual versus lifetime purchases
- refund rate
- monthly contractor spend

## Required Output Tabs

The working spreadsheet should contain these tabs:

1. assumptions
2. conservative
3. base
4. breakout
5. cash bookings
6. recognized revenue
7. contractor spend
8. runway impact

## Starter Formula Logic

- `D30 retained users = downloads x D30 retention`
- `eligible retained users = D30 retained users x paywall eligibility rate`
- `new premium purchasers = eligible retained users x premium conversion rate`
- `cash bookings = annual purchases x annual price + lifetime purchases x lifetime price`
- `recognized monthly annual revenue = annual cash bookings / 12`
- `recognized lifetime revenue = follow chosen accounting treatment consistently`

## Decision Rules

- use `cash bookings` for contractor and runway planning
- use `recognized revenue` for long-run business visibility
- do not increase content spend because of a one-time lifetime-sales spike without checking recurring cash durability
- review refund rate before scaling paid acquisition or contractor commitments

## Spend Guardrails

- art and audio are hard constraints, not aspirational extras
- define a maximum monthly contractor budget per phase before growth features are approved
- require Phase 4 conversion evidence before materially increasing recurring content spend
