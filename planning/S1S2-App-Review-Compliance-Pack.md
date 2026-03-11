# S1S2 App Review Compliance Pack

## Positioning Rules

- category default: Health and Fitness
- product framing: a heart-health-informed exploration experience
- safe phrase: `track because it creates beauty`
- prohibited framing: diagnosis, treatment, cure, guaranteed improvement, or medical certainty

## Core Disclaimer Rule

S1S2 must clearly state that it is not a diagnostic medical device and is not a substitute for professional medical advice.

## HealthKit and Health Data Copy

### Permission Explanation Themes

- explain what data is requested
- explain why it improves the in-app experience
- explain that connecting health data is optional where appropriate
- promise that health data is not used for advertising

### Draft Usage Strings

- `S1S2 reads heart rate and related health data so your ship, galaxy, creatures, and music can respond to your real rhythm.`
- `S1S2 writes only the data needed to save your check-ins and keep your history consistent across devices.`

These strings should be refined at implementation time to match the final platform permission requirements exactly.

## Privacy Nutrition Label Prep

Prepare inputs for:

- contact info if support email is collected
- health and fitness data
- identifiers
- diagnostics
- purchase information
- user content where social features later allow messages

For each category, record:

- whether the data is linked to the user
- whether it is used for analytics, functionality, or support
- whether it is used for tracking

Default rule: no advertising tracking.

## Premium and Marketing Review Rules

- do not market doctor reports until the report feature is live
- do not market third-party wearable sync until at least one supported integration is live
- do not phrase upcoming features as included benefits in the current store listing
- update screenshots and store copy whenever entitlement scope changes materially

## Social and Moderation Requirements

Before social-sharing features go live, define:

- abuse report intake path
- blocking and unlinking rules for Rhythm Partners
- message length limits and prohibited content rules
- moderation escalation for harassment, spam, and health misinformation

## Risky Copy Checklist

Reject copy that says or implies:

- your heart is healthier because of S1S2
- S1S2 can detect disease or medical events
- users should change medication or treatment based on S1S2
- a certain map color is good or bad in a moral or clinical sense

Prefer copy that says:

- your data shapes your in-app world
- S1S2 helps you notice patterns and build a tracking habit
- talk to a healthcare professional about medical concerns

## Submission Checklist

- privacy policy URL present
- support URL present
- terms URL present if needed
- HealthKit copy aligned with implemented behavior
- non-diagnostic disclaimer visible in settings, support, and store copy where appropriate
- screenshots lead with ship, galaxy, discovery, and music
- push notification rationale is user-benefit focused, not nagging
- if social features are live, moderation and report handling are documented
