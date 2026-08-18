# Asset manifest

## Exercise pose media

- Start/end exercise photos: [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db), Unlicense.
- The exact per-exercise mapping is maintained in `src/content/exercise-media.ts`.
- Images are loaded on demand and cached by `expo-image`; text guidance remains available when an image cannot load.

## Primary exercise video

- Curated YouTube demonstrations are presented as the primary 16:9 motion guide, embedded with the official player, and attributed to PureGym.
- Video IDs, titles, channel and review date are maintained in `src/content/exercise-media.ts`.
- YouTube videos are never downloaded, modified, obscured, or used as the offline source of truth.

## Generated brand asset

- `assets/images/nxtset-icon.png` — NXTSET app icon, generated with the built-in image generation tool on 2026-08-18. Prompt: “an original abstract symbol that combines an upward next-step chevron with a balanced barbell or human training posture”, using the product near-black, warm off-white, and blue-green palette. Used for the app icon, splash mark, Android adaptive icon source, and web favicon.

## Future owned exercise video

`ExerciseMedia` is designed so approved owned videos can replace the current pose pair without changing the workout screens.

For each exercise ID below, provide:

- `assets/motion/<id>.mp4` — H.264, 3–6 seconds, seamless loop, no audio or text
- `assets/motion/<id>.webm` — optional web optimization
- `assets/posters/<id>-poster.webp`
- `assets/posters/<id>-start.webp`
- `assets/posters/<id>-end.webp`

Required IDs:

- `chest_press`, `dumbbell_press`, `push_up`, `incline_press`, `pec_fly`
- `lat_pulldown`, `cable_pulldown`, `assisted_pullup`, `seated_row`, `cable_row`, `one_arm_row`
- `leg_press`, `goblet_squat`, `bodyweight_squat`, `leg_extension`, `leg_curl`
- `lateral_raise_machine`, `dumbbell_lateral_raise`, `cable_lateral_raise`, `shoulder_press`, `reverse_fly`
- `machine_biceps_curl`, `dumbbell_curl`, `cable_triceps_pushdown`
- `glute_drive`, `standing_calf_raise`, `machine_crunch`

Capture direction: one trainer, fixed camera, neutral background, full machine and joints visible, 4:3 at 720p or above, no music, one controlled repetition, and no manufacturer marks. Content review by a qualified exercise professional is required before public release.
