# Asset manifest

## Generated brand asset

- `assets/images/nxtset-icon.png` — NXTSET app icon, generated with the built-in image generation tool on 2026-08-18. Prompt: “an original abstract symbol that combines an upward next-step chevron with a balanced barbell or human training posture”, using the product near-black, warm off-white, and blue-green palette. Used for the app icon, splash mark, Android adaptive icon source, and web favicon.

## Exercise media

`ExerciseMotion` currently supplies an animated, reduced-motion-safe placeholder for every exercise. Production art should replace it without changing screen code.

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

Art direction: generic non-celebrity mannequin, dark neutral machine, primary target muscle in `#FF5A5F`, no manufacturer marks, and the clearest front/side/three-quarter camera angle. Content review by a qualified exercise professional is required before public release.

## Code-driven

- Exercise guidance visuals are drawn and animated in `src/components/media/exercise-motion.tsx`. They are original code-native placeholders, not copied imagery.
