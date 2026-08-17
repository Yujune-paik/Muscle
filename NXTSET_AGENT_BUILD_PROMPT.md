# Agent Build Prompt — NXTSET

Build the NXTSET MVP described in the attached `NXTSET_PRD_TECH_SPEC_v0.1.md`.

## Mandatory behavior

- Treat the specification as the source of truth.
- Use Expo SDK 57, Expo Router, React Native Web, TypeScript strict mode, and a universal web/iOS codebase.
- Begin with local demo mode requiring no API keys.
- Build the dark, premium, media-first UI before adding secondary features.
- The normal workout flow must not open a keyboard.
- Show one exercise at a time.
- Use looping placeholder motion assets through a reusable `ExerciseMotion` component; do not block on final 3D assets.
- Use planned values as the default record and ask one difficulty question after each exercise.
- Implement busy/absent-machine rerouting with at most two alternatives.
- Do not add calorie tracking, meal logging, live camera analysis, social features, AI chat, payments, or dense dashboards.
- Add tests for progression, substitution, persistence, and the critical web flow.
- Configure EAS for later iOS builds.

## Execution order

1. Scaffold project and quality tooling.
2. Implement design tokens and primitive components.
3. Implement onboarding and three-tab shell.
4. Implement Today and the complete demo workout flow.
5. Add durable local persistence and refresh/resume behavior.
6. Add protein and progress screens.
7. Add optional Supabase cloud mode with migrations and RLS.
8. Add web E2E tests and iOS/EAS configuration.
9. Produce screenshots and document limitations.

## Required first milestone

Before implementing cloud sync, deliver a browser-runnable demo in which a new user can:

- finish onboarding;
- start Full Body A;
- view exercise motion and target muscles;
- complete sets without typing;
- rate exercise difficulty;
- replace a busy machine;
- finish the workout;
- log protein;
- refresh the browser and retain the result.

Do not ask for additional product decisions unless the specification contains a direct contradiction. Resolve minor ambiguity in favor of fewer decisions, fewer visible controls, and a more polished interface. Record assumptions in `DECISIONS.md`.
