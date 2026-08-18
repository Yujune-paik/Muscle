# Known limitations

- Exercise guidance now uses public-domain start/end photographs and curated supplemental YouTube embeds. The photographs and third-party videos still require qualified form review before a medical or coaching claim, and YouTube availability is not guaranteed.
- Pose photographs are cached after loading but are not bundled with the app; first viewing requires a network connection. Text cues and the complete workout flow remain available if media fails.
- iOS notification, haptic, background timer, and TestFlight behavior require verification on a physical iPhone and an Apple Developer account.
- Cloud mode requires a Supabase project, the included migration, anonymous auth enabled, and production environment variables. Demo mode is complete without them.
- Email linking sends a Supabase magic link but production deep-link domains must be registered in the Supabase and Apple project dashboards.
- GitHub Pages is a static host. Cloud security headers and server features are better served by EAS Hosting for production.
- Training prescriptions are seeded demo values, not individualized medical or universal exercise recommendations.
- `npm audit` currently reports transitive advisories inside the Expo/React Native build toolchain. Its automated fix proposes incompatible SDK downgrades, so the project stays on the specification-required Expo SDK 57 stack and should adopt upstream patched releases when Expo publishes compatible versions.
