# NXTSET implementation decisions

## 2026-08-18

- The repository uses the official Expo SDK 57 default template and `src/app` Expo Router layout. This keeps the generated SDK conventions while matching the route map in the specification.
- Native persistence uses `expo-sqlite/kv-store`, which is SQLite-backed. Web persistence uses `localStorage` because Expo SQLite web support is still alpha and requires cross-origin isolation headers that are not consistently available on every static host. Both platforms share the same versioned Zustand snapshot and the critical refresh flow is covered by Playwright.
- Placeholder exercise motion is rendered by the reusable `ExerciseMotion` component with animated React Native primitives. It respects Reduce Motion and remains usable without video. Final pre-rendered MP4/WebM/poster files are listed in `ASSET_MANIFEST.md`.
- The public GitHub projects Skulpt, LiftLog, and Musclog were reviewed for local-first and Expo navigation patterns. No third-party application code or copyrighted visual assets were copied. Expo Router, Expo SQLite, Expo Haptics, Expo Notifications, Expo Video, Material Community Icons, Zustand, TanStack Query, Zod, and Supabase are used as maintained building blocks.
- The MVP starts in API-key-free demo mode. Cloud mode adds anonymous Supabase auth, magic-link linking, an idempotent sync event queue, migrations, and RLS. Production credentials remain outside the repository.
- GitHub Pages is configured as the zero-service web deployment target. EAS Hosting remains the recommended production option for native/web version coordination and can deploy the same `dist` export.

