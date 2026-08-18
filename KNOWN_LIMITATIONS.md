# Known limitations

- Exercise guidance now uses curated YouTube embeds as the primary form guide and public-domain start/end photographs as a fallback. Both still require qualified form review before a medical or coaching claim, and YouTube availability is not guaranteed.
- Pose photographs are cached after loading but are not bundled with the app; first viewing requires a network connection. Text cues and the complete workout flow remain available if media fails.
- iOS notification, haptic, background timer, and TestFlight behavior require verification on a physical iPhone and an Apple Developer account.
- Cloud mode requires a Supabase project, the included migration, anonymous auth enabled, and production environment variables. Demo mode is complete without them.
- Email linking sends a Supabase magic link but production deep-link domains must be registered in the Supabase and Apple project dashboards.
- GitHub Pages is a static host. Cloud security headers and server features are better served by EAS Hosting for production.
- Programs, weekly set targets, recovery volume suggestions, protein targets, and stimulus scores are personalized from a small set of user inputs and history, but remain general fitness guidance rather than medical, diagnostic, or universally optimal prescriptions.
- Muscle stimulus is an explainable estimate from completed sets, effort feedback, exercise contribution weights, body size, and recent load history. It is not a measurement of muscle damage, activation, or injury.
- `npm audit` currently reports transitive advisories inside the Expo/React Native build toolchain. Its automated fix proposes incompatible SDK downgrades, so the project stays on the specification-required Expo SDK 57 stack and should adopt upstream patched releases when Expo publishes compatible versions.
