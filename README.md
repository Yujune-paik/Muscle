# NXTSET

NXTSET is a Japanese-first, turn-by-turn gym guide for beginners. It shows one exercise at a time, records the planned values by default, asks one difficulty question per exercise, reroutes around busy equipment, and tracks only the supplemental protein serving the user controls.

The default demo runs without an account, API key, or network connection after the bundle is loaded.

## Requirements

- Node.js 22.13 or newer (22.22 LTS recommended)
- npm 10 or newer
- Xcode and an Apple Developer account only for later iOS device/TestFlight builds

## Run the demo

```bash
npm ci
cp .env.example .env
npm run web
```

Open the URL printed by Expo, normally `http://localhost:8081`.

Native development:

```bash
npm run ios
npm run android
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run test:components
npm run test:e2e:web
npm run export:web
```

The Playwright command expects the Expo web server on port 8081. Set `PLAYWRIGHT_BASE_URL` to use another URL.

## Demo flow

1. Complete the five-step onboarding.
2. Start `Full Body A` from Today.
3. Tap once to start a set and once after performing it to complete the set.
4. Answer one difficulty question after each exercise.
5. On the second exercise, use `この器具が使えない` → `混んでいる` to test a replacement.
6. Finish all five exercises, log the 25 g serving, and refresh. The result remains available locally.

## Persistence and offline behavior

- iOS/Android: the versioned Zustand snapshot is stored with `expo-sqlite/kv-store` (SQLite-backed).
- Web: the same snapshot uses `localStorage`, avoiding Expo SQLite web's alpha-only SharedArrayBuffer requirements on generic static hosts.
- Bundled exercise, program, and replacement data require no server.
- Cloud failures never block local set completion.

## Optional Supabase cloud mode

1. Create a Supabase project and enable anonymous sign-ins.
2. Apply `supabase/migrations/202608180001_initial.sql` and `supabase/seed.sql`.
3. Copy `.env.example` to `.env` and set:

```text
EXPO_PUBLIC_APP_MODE=cloud
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Never expose the service-role key. The included migration enables RLS on every user-owned table. Static content is client-readable and client write-protected.

## Web deployment

Production export:

```bash
npm run export:web
```

EAS Hosting (recommended for production):

```bash
npx eas-cli@latest login
npm run export:web
npx eas-cli@latest deploy
```

GitHub Pages is also configured in `.github/workflows/deploy-web.yml`. The workflow applies the `/Muscle` Expo base URL, checks the app, exports `dist`, and deploys on pushes to `main`. Enable GitHub Pages with **GitHub Actions** as the source in repository settings.

## iOS / EAS

`eas.json` contains development, preview, and production profiles.

```bash
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform ios --profile development
npx eas-cli@latest build --platform ios --profile preview
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios --profile production
```

The placeholder bundle identifier is `jp.nxtset.app`; replace it if your Apple team requires another identifier.

## Project map

- `src/app` — Expo Router routes for onboarding, three tabs, workout, account, gym, and protein
- `src/components` — accessible internal component system and `ExerciseMotion`
- `src/content` — bundled Japanese exercise/program/replacement seeds
- `src/domain` — deterministic progression, replacement, program, protein, and sync logic
- `src/state` — local-first workout/profile/protein state
- `src/services` — optional Supabase, notification, haptic, and sync adapters
- `supabase` — schema, RLS policies, account deletion function, and seed data
- `tests` — unit, component, and critical web-flow tests
- `screenshots` — required 390×844 review captures

See `DECISIONS.md`, `ASSET_MANIFEST.md`, and `KNOWN_LIMITATIONS.md` before production release.

