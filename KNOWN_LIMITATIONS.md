# Known limitations

- Exercise media uses code-driven placeholder motion; final reviewed 3D renders are not included.
- iOS notification, haptic, background timer, and TestFlight behavior require verification on a physical iPhone and an Apple Developer account.
- Cloud mode requires a Supabase project, the included migration, anonymous auth enabled, and production environment variables. Demo mode is complete without them.
- Email linking sends a Supabase magic link but production deep-link domains must be registered in the Supabase and Apple project dashboards.
- GitHub Pages is a static host. Cloud security headers and server features are better served by EAS Hosting for production.
- Training prescriptions are seeded demo values, not individualized medical or universal exercise recommendations.
- `npm audit` currently reports transitive advisories inside the Expo/React Native build toolchain. Its automated fix proposes incompatible SDK downgrades, so the project stays on the specification-required Expo SDK 57 stack and should adopt upstream patched releases when Expo publishes compatible versions.
