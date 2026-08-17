# NXTSET — Product Requirements & Technical Specification

**Document version:** 0.1  
**Date:** 2026-08-18  
**Status:** Implementation-ready MVP specification  
**Working title:** NXTSET（仮称。商標・ドメイン確認前のコードネーム）  
**Primary language:** Japanese first, localization-ready  
**Target platforms:** Web prototype → iOS TestFlight/App Store, using one universal codebase

---

## 0. Agent execution contract

This document is the source of truth for implementation. The coding agent must:

1. Build the app from a clean repository using the architecture and scope defined here.
2. Prioritize a polished, mobile-first user experience over adding more features.
3. Implement all `P0` requirements before any `P1` item.
4. Never add calorie logging, social feeds, live camera form scoring, AI chat, or a dense dashboard to the MVP.
5. Use placeholder motion media where final 3D assets are unavailable, but preserve the specified media component contract.
6. Keep the project runnable without paid services or secret keys by providing a local demo mode.
7. Add clear setup instructions, seed data, tests, and environment templates.
8. Stop and document a limitation rather than silently inventing health or training claims.

The agent may improve implementation details, but must not change the product principles, primary flow, navigation model, visual hierarchy, or scope without recording the change in `DECISIONS.md`.

---

# 1. Product definition

## 1.1 One-sentence definition

**A gym execution app for lean, inexperienced adults who want an athletic body without having to study training, build programs, search machine instructions, log every number, or track every meal.**

## 1.2 Core promise

> **ジムに着いたら、次の一台だけ見ればいい。**

The app translates a body goal and available gym equipment into one next action at a time. It shows the machine, a short motion demonstration, the main target muscle, planned weight/reps/sets, and a single primary action. The user performs the plan and only reports exceptions or a simple difficulty rating. The app handles history, progression, substitutions, and protein reminders in the background.

## 1.3 What the product is not

NXTSET is not:

- a bodybuilding spreadsheet;
- a calorie or full-meal tracker;
- a camera-based form judge;
- a social fitness network;
- a library that expects users to choose and program exercises themselves;
- a celebrity resemblance scorer;
- a medical device or diagnostic service;
- an AI chat interface disguised as a workout app.

## 1.4 Product category

**Turn-by-turn gym coach / zero-admin beginner strength app**

The competitive position is not “the app with the most exercises.” It is:

> **The app that removes the most decisions between arriving at the gym and finishing an effective beginner session.**

---

# 2. Target user

## 2.1 Primary persona

An adult beginner who:

- is naturally lean or feels under-muscled;
- wants a lean, athletic, actor-like physique rather than maximum bodybuilding size;
- is willing to visit a normal commercial gym 2–3 times per week;
- does not know machine names or how to combine exercises;
- dislikes detailed logging, calorie counting, and long educational content;
- has previously stopped because results were slow or the process became troublesome;
- wants reliable instructions but does not want to make fitness a hobby or academic subject.

## 2.2 Jobs to be done

When I arrive at the gym, help me:

1. know exactly what to do next;
2. recognize the correct machine even when I do not know its name;
3. understand the movement without reading a long explanation;
4. know which body part the exercise is mainly for;
5. use a sensible starting load and progress over time;
6. replace an unavailable or busy machine immediately;
7. finish without manually reconstructing a workout log;
8. maintain a simple protein routine without logging all meals;
9. see evidence that I am progressing before a mirror change is obvious.

## 2.3 Anti-persona for MVP

Do not optimize for:

- advanced lifters who want custom periodization;
- competitive powerlifters, weightlifters, or bodybuilders;
- coaches managing multiple clients;
- rehabilitation or clinical populations;
- users under 18;
- users seeking weight-loss calorie tracking;
- users who expect automatic rep recognition or real-time technique correction.

---

# 3. Product principles

These principles outrank feature requests.

## P1. One screen, one purpose

Every primary screen must answer one question or support one action. No screen may present multiple competing primary calls to action.

## P2. Show the next action, not the whole system

The app may calculate program volume, substitutions, history, and progression internally. The default interface shows only what the user needs now.

## P3. Planned values are the default record

The user does not enter what happened when it matched the plan. The planned exercise, weight, reps, and sets become the recorded result by default. The user edits only differences.

## P4. Ask once per exercise, not once per metric

After an exercise, ask one plain-language difficulty question:

- `余裕だった`
- `ちょうどよかった`
- `きつすぎた`

Do not expose RIR, 1RM, volume load, or other specialist vocabulary in the normal flow.

## P5. Media first, words second

Exercise guidance is led by a short looping 3D-style motion demonstration. Text is limited to the exercise name, target area, and up to two setup cues.

## P6. Progressive disclosure

Detailed anatomy, rationale, history, equipment settings, and research notes are available only after deliberate taps. They do not appear in the primary workout flow.

## P7. Normal gym friction is part of the product

A machine being busy, absent, unfamiliar, or different from the illustration is a normal state, not an error. Substitution must be immediate and shame-free.

## P8. Stylish enough to be opened in public

The app must look like a premium consumer media product, not a clinical dashboard or “gym-bro” utility. Use restraint, large artwork, strong typography, and one accent color.

## P9. No false precision

Do not display fake muscle-growth percentages, exact calorie deficits, exact total daily protein, or celebrity similarity scores when the app does not possess valid data.

## P10. The app must disappear during the exercise

The user should glance, understand, perform, tap completion, and move on. No live monitoring, camera placement, or requirement to watch the screen while lifting.

---

# 4. MVP goals and success metrics

## 4.1 Product goal

Validate that a beginner can complete a 5-exercise gym session by following turn-by-turn guidance with minimal logging and low confusion.

## 4.2 Primary success metric

**Completed guided sessions per activated user during the first 28 days.**

## 4.3 Supporting metrics

- onboarding completion rate;
- percentage starting a first workout within 10 minutes of onboarding completion;
- first-workout completion rate;
- 7-day and 28-day return rate;
- machine substitution success rate;
- percentage of exercises completed without opening numeric editing;
- average number of taps per completed exercise;
- percentage of users who log protein at least 4 days in a week;
- percentage of abandoned sessions successfully resumed;
- self-reported “I knew what to do next” score after first workout.

## 4.4 UX targets

- Onboarding must be completable in under 3 minutes by a first-time user.
- A normal exercise must require no keyboard input.
- No primary flow screen may display more than one emphasized button.
- No primary instruction block may exceed two short lines before expansion.
- Alternatives must be limited to the best two options plus `今日は飛ばす`.
- The active workout must survive app closure, refresh, or temporary loss of connectivity.

---

# 5. MVP scope

## 5.1 P0 features

1. Anonymous start with optional later account linking.
2. Short onboarding for body goal, experience, weekly frequency, gym, and protein routine.
3. One fixed MVP goal archetype: `Lean Athletic`.
4. 2-day and 3-day beginner program templates.
5. Turn-by-turn workout routing.
6. Machine/exercise recognition through image and motion demo, not camera AI.
7. Exercise detail with looping motion media and highlighted target muscles.
8. Planned weight, reps, sets, and rest.
9. One-tap set completion.
10. One difficulty rating after the exercise.
11. Weight/reps editing only when the result differs from the plan.
12. `混んでいる` and `このジムにはない` substitution flow.
13. Progressive gym-equipment learning.
14. Workout pause, resume, and completion summary.
15. Protein serving plan and one-tap logging.
16. Simple progress summary.
17. Offline-safe active workout state.
18. Japanese UI, localization-ready architecture.
19. Web deployment and iOS build configuration.
20. Privacy, data deletion, and health-claim guardrails.

## 5.2 P1 after MVP validation

- gym-chain equipment database;
- barcode/QR recognition for machines;
- saved machine seat/pad settings;
- Apple Health body-weight import;
- smart-scale integrations;
- Apple Watch companion;
- iOS Live Activity for rest timer;
- additional goals and program tracks;
- adaptive weekly volume changes;
- trainer-reviewed content management panel;
- multilingual content;
- richer research/evidence cards;
- optional social accountability with one trusted partner.

## 5.3 Explicitly excluded from MVP

- live camera form analysis;
- automatic rep counting;
- full food, calorie, or macro tracking;
- AI-generated arbitrary workouts;
- chatbot as the main interface;
- community feed, leaderboards, public profiles;
- photoreal celebrity images or names in product claims;
- interactive real-time 3D rendering as a hard dependency;
- subscriptions and payments;
- push marketing campaigns;
- medical advice.

---

# 6. Information architecture

## 6.1 Persistent navigation

Use three bottom tabs only:

1. **今日** — next workout and protein action;
2. **進捗** — simple weekly and longer-term progress;
3. **あなた** — gym, protein, account, preferences, and settings.

The bottom tab bar is hidden during an active workout.

Do not add a permanent `種目` or `検索` tab. Exercise browsing is secondary and accessed from context or the profile screen.

## 6.2 Primary route map

```text
/
├─ onboarding/
│  ├─ welcome
│  ├─ body-goal
│  ├─ experience
│  ├─ schedule
│  ├─ gym
│  ├─ protein
│  └─ ready
├─ tabs/
│  ├─ today
│  ├─ progress
│  └─ profile
├─ workout/:sessionId/
│  ├─ overview
│  ├─ exercise/:itemId
│  ├─ edit-plan/:itemId
│  ├─ unavailable/:itemId
│  ├─ exercise-feedback/:itemId
│  └─ complete
├─ exercise/:exerciseId
├─ gym/
│  ├─ current
│  └─ equipment
├─ protein/
│  ├─ plan
│  └─ history
├─ account/
│  ├─ link
│  ├─ privacy
│  └─ delete
└─ settings
```

---

# 7. Visual and interaction direction

## 7.1 Desired character

The interface should feel:

- confident;
- quiet;
- premium;
- contemporary;
- physical but not aggressive;
- easy to scan with one hand in a gym;
- more like a media player than a health spreadsheet.

The product may borrow the following interaction qualities from premium music apps without copying layouts, assets, branding, or colors:

- artwork-led screens;
- large title hierarchy;
- one obvious play/start action;
- restrained bottom navigation;
- dark surfaces;
- content revealed progressively;
- smooth, short transitions;
- minimal form fields.

## 7.2 Color tokens

Use the following initial tokens. They may be adjusted slightly for verified contrast but not replaced with a multi-color theme.

```ts
export const colors = {
  bg: '#0A0A0B',
  surface: '#161618',
  surfaceRaised: '#202024',
  border: '#2B2B30',
  textPrimary: '#F7F7F8',
  textSecondary: '#A1A1A8',
  textMuted: '#6F6F76',
  accent: '#D7FF4A',
  accentPressed: '#BFE532',
  onAccent: '#0A0A0B',
  muscle: '#FF5A5F',
  warning: '#FFB74D',
  danger: '#FF5A5F',
  white: '#FFFFFF',
  black: '#000000',
};
```

Rules:

- `accent` is reserved for the primary action, active progress, and success emphasis.
- `muscle` is reserved for body-part highlighting and pain warnings; do not use it as a general accent.
- Do not communicate status by color alone. Pair color with text or iconography.
- Avoid decorative gradients except subtle artwork backdrops.
- Do not copy Spotify green.

## 7.3 Typography

Use platform system fonts for native quality and performance.

```text
Display XL: 40 / 44, 700
Display L: 32 / 38, 700
Title: 24 / 30, 700
Heading: 20 / 26, 650
Body: 16 / 23, 450
Label: 14 / 18, 600
Caption: 12 / 16, 500
Numeric Hero: 48 / 52, 700, tabular numbers
```

Rules:

- Maximum of three visible text hierarchy levels per screen.
- Use sentence case, not all caps, except short workout labels such as `UPPER A`.
- Numbers for weight/reps may be large; labels remain quiet.
- Support Dynamic Type / scalable text without clipped controls.

## 7.4 Spacing and geometry

Use an 8-point grid.

```text
4: micro gap
8: compact
12: related elements
16: standard inner padding
24: section gap
32: major separation
48: hero separation
```

Component geometry:

- minimum touch target: 44 × 44 pt/CSS px;
- main buttons: 56 pt height;
- compact buttons: 44–48 pt height;
- card radius: 20 pt;
- media radius: 24 pt;
- pill radius: full;
- bottom sheet top radius: 28 pt;
- screen horizontal padding: 20 pt mobile, 24 pt large mobile.

## 7.5 Motion

- standard transition: 180–240 ms;
- large sheet transition: 280 ms maximum;
- use opacity + small translation, not dramatic zooms;
- use haptic feedback on set completion and workout completion on iOS;
- respect `Reduce Motion`; replace looping exercise motion with key start/end frames when enabled;
- never animate numeric progress continuously for decoration.

## 7.6 Web layout

The web prototype is mobile-first because it validates the future iOS experience.

- Primary app viewport width: 390–430 px.
- On desktop, center the app column in a dark neutral canvas.
- Do not create a separate dense desktop dashboard.
- Allow browser keyboard navigation and visible focus states.
- Support a minimum viewport width of 320 px.
- Provide installable PWA metadata if feasible, but PWA installation is not a release blocker.

---

# 8. Screen specifications

## S00. Splash / bootstrap

### Purpose

Load local state, restore an anonymous or linked session, and resume an active workout if one exists.

### UI

- centered wordmark `NXTSET`;
- black background;
- small accent progress mark only if loading exceeds 400 ms.

### Logic

1. Load design assets and bundled exercise content.
2. Restore local database.
3. Restore auth session if cloud mode is enabled.
4. If an incomplete workout exists, route to a resume sheet.
5. Else route to onboarding or Today.

### Acceptance criteria

- No white flash in dark mode.
- No indefinite spinner; show retry state after 8 seconds.
- Web refresh during workout must recover the session.

---

## S01. Welcome

### Purpose

Communicate the product promise without asking for an account.

### Layout, top to bottom

1. Full-bleed dark hero artwork: abstract athletic body/mannequin.
2. Large headline: `次の一台だけ、見ればいい。`
3. Supporting copy: `ジムの器具に合わせて、今日やることを一つずつ案内します。`
4. Primary button: `はじめる`
5. Quiet text button: `すでに使っている方`

### Rules

- Do not show a feature list.
- Do not request notification permission.
- Do not show pricing.

---

## S02. Body goal

### Purpose

Set the program goal without promising celebrity replication.

### UI

- progress indicator: `1 / 5`;
- question: `どんな方向を目指しますか？`;
- one large selected card:
  - title: `Lean Athletic`;
  - subtitle: `肩・胸・背中を育てた、引き締まった全身体型`;
  - generic stylized body artwork;
- primary button: `これで進む`.

### MVP behavior

Only one goal is active in the MVP. The screen exists to communicate the goal, not to provide fake choice. Additional goals can appear later.

---

## S03. Experience

### Purpose

Choose a beginner-safe starting level.

### UI

Question: `ジムの筋トレ経験は？`

Three vertically stacked selection cards:

- `ほぼ初めて`
- `何度か試した`
- `3か月以上続けたことがある`

For the third option, show a note that the MVP is optimized for beginners but still usable.

No numeric skill test.

---

## S04. Schedule

### Purpose

Create a realistic weekly program.

### UI

Question: `週に何回なら、無理なく行けそう？`

Large segmented choice:

- `週2回`
- `週3回` — default recommended

Secondary selector:

- `30分`
- `45分` — default
- `60分`

Primary button: `次へ`.

### Logic

- 2 days → Full Body A/B.
- 3 days → Full Body A/B/C.
- Duration changes exercise count and optional accessories, not the core movement pattern coverage.

---

## S05. Gym setup

### Purpose

Set a gym context without asking the user to catalog every machine.

### UI

Question: `どこでトレーニングしますか？`

- search field: `ジム名や店舗名`;
- results list if gym database exists;
- option: `店舗を登録せずに始める`;
- helper copy: `器具は使いながら覚えていくので、最初に全部登録する必要はありません。`

### MVP demo behavior

Provide:

- `Demo Gym — 基本マシンあり`;
- `自分のジムをあとで設定`.

### Data behavior

Each gym begins with unknown equipment availability. Availability is learned from usage:

- completed exercise → equipment marked `present`;
- `このジムにはない` → marked `absent`;
- `混んでいる` → session-only temporary unavailable; do not mark absent.

---

## S06. Protein setup

### Purpose

Create a lightweight supplement routine without claiming total diet tracking.

### UI

Question: `プロテインも、簡単に続けますか？`

Options:

- `1日1回` — recommended default;
- `トレーニングした日だけ`;
- `今は設定しない`.

If enabled, show a compact setup sheet:

- serving name: default `いつもの1杯`;
- protein per serving: numeric stepper, default 20–25 g;
- timing anchor:
  - `トレーニング後`;
  - `朝`;
  - `夜`;
  - `時刻を指定`.

Do not ask about every meal. Do not display a daily total protein target unless a later evidence-based module has sufficient diet data.

---

## S07. Ready

### Purpose

Create confidence and move directly to the product.

### UI

- large title: `準備できました。`
- summary:
  - `週3回`
  - `1回 約45分`
  - `マシン中心`
  - `Lean Athletic`
- primary button: `今日を見る`.

No account wall. Start anonymous/local.

---

## S10. Today home

### Purpose

Show today’s next meaningful action with a music-player-like hierarchy.

### Layout

1. Header row:
   - date or greeting on left;
   - circular profile/settings icon on right.
2. Hero artwork card occupying roughly 45% of the first viewport:
   - abstract/3D body artwork with today’s main target areas;
   - small label: `TODAY`;
   - workout title: `Full Body A`;
   - metadata: `5種目 · 約38分`;
   - large circular accent play button at bottom-right.
3. Under hero:
   - heading: `次にやること`;
   - first exercise row only, e.g. `チェストプレス` and target `胸`;
   - quiet link: `メニューを見る`.
4. Protein mini-card:
   - `今日の1杯`;
   - serving amount `25g`;
   - status `まだ` or `完了`;
   - compact action `飲んだ`.
5. Optional recovery/resume card only when relevant.

### Interaction

- Tapping play starts the workout immediately.
- Tapping the hero card opens the overview but must keep the same primary CTA.
- Long lists and charts are prohibited on this screen.

### Empty/rest-day state

Headline: `今日は休む日。`

Show:

- next planned workout date;
- protein action if configured;
- one compact educational note maximum, dismissible.

---

## S11. Workout overview

### Purpose

Allow a brief preview without requiring planning.

### UI

- title and estimated time;
- a simple vertical route of 4–6 exercise cards;
- each card shows machine thumbnail, exercise name, target muscle, and status;
- primary sticky button: `トレーニングを始める`.

### Rules

- No drag-and-drop program editing in MVP.
- User may tap an exercise to preview the motion.
- Alternatives are not shown until needed.

---

## S12. Active exercise

### Purpose

Tell the user exactly what to do now.

### Layout

1. Top bar:
   - close/pause icon;
   - progress `2 / 5`;
   - thin route progress indicator.
2. Large motion media occupying 45–55% of screen height:
   - looping 3D-style exercise animation;
   - generic machine representation;
   - target muscles highlighted in `muscle` red;
   - mute by default; no voice required.
3. Exercise information:
   - large name: `チェストプレス`;
   - one-line target: `主に胸`;
   - up to two short setup cues:
     - `ハンドルが胸の中央に来る高さへ`
     - `背中をパッドから離さない`
4. Prescription row:
   - `25 kg`
   - `10 回`
   - `3 セット`
   - weight and reps are tappable quiet chips, not form fields.
5. Primary button: `1セット目を始める` or `セット完了` depending state.
6. Secondary text action: `この器具が使えない`.

### Interaction model

- The app does not observe the set.
- User performs the set, then taps `セット完了`.
- The completed set indicator fills.
- Rest timer begins as an unobtrusive bottom bar.
- Primary action changes to `次のセット`.
- After the last planned set, route to exercise feedback.

### Normal-use logging

No keyboard appears. Planned weight/reps are recorded automatically.

### Weight/reps edit

Tapping a chip opens a bottom sheet with large plus/minus controls and common machine increments. Avoid a raw text field unless `その他` is selected.

### Media fallback

If motion media fails:

- show start and end frames;
- retain muscle highlight and setup cues;
- workout remains fully usable.

---

## S13. Rest timer

### Purpose

Keep rest consistent without trapping the user on a timer screen.

### UI

A compact sticky bar or bottom sheet:

- `休憩 01:12`;
- progress ring/line;
- actions: `次へ` and `+30秒`.

### Behavior

- Timer continues when navigating to the exercise detail or locking the phone on iOS.
- Local notification/haptic at completion if permission exists.
- User can start the next set early.
- No punitive message for skipping rest.

---

## S14. Exercise feedback

### Purpose

Collect one useful progression signal after the exercise.

### UI

Title: `この種目、どうでしたか？`

Three large stacked choices:

1. `余裕だった` — `まだ数回できそう`
2. `ちょうどよかった` — `最後まで形を保てた`
3. `きつすぎた` — `回数不足・大きく崩れた`

Quiet action: `痛み・違和感があった`.

### Behavior

- One selection saves and immediately advances.
- If pain is selected, ask location and severity in a separate safety sheet, do not progress load, and propose a non-conflicting alternative next time.
- Never label the user as having failed.

---

## S15. Equipment unavailable

### Purpose

Reroute immediately when a machine is busy or absent.

### UI

Title: `使えない理由は？`

Three choices:

- `混んでいる`
- `このジムにはない`
- `今日は飛ばす`

After choosing busy/absent, show at most two recommended alternatives.

Each alternative card contains:

- machine/exercise thumbnail;
- name;
- target muscle;
- one reason: `同じ胸の押す動き`;
- primary action on selected card: `これに変える`.

### Logic

- Busy is session-only.
- Absent updates the current gym profile.
- Replacement preserves the target movement/muscle, avoids already fatigued duplicates, and uses known available equipment when possible.
- If no equivalent exists, show a bodyweight fallback or skip.

---

## S16. Pause / exit workout

### Purpose

Prevent accidental loss and make resuming easy.

### Sheet

Title: `ここで止めますか？`

Actions:

- primary: `一時停止する`;
- secondary: `続ける`;
- destructive text: `今日の記録を破棄`.

Closing the app or browser must automatically save without showing this sheet.

---

## S17. Workout complete

### Purpose

Celebrate completion and provide a concise reason to return.

### UI

1. subtle completion animation/haptic;
2. title: `今日のトレーニング完了`;
3. three concise metrics only:
   - `5 / 5 種目`
   - `38 分`
   - `前回より進んだ種目 2`;
4. body illustration showing trained target areas;
5. one sentence summary:
   - `胸と背中は前回より負荷を上げられました。`
6. protein action if pending:
   - `次は、いつもの1杯`;
   - accent button: `飲んだ` or `あとで通知`;
7. final button: `ホームへ`.

Do not show confetti everywhere, dozens of stats, or a share prompt in MVP.

---

## S20. Protein card and detail

### Purpose

Track only the controllable supplemental action.

### Today card states

**Pending**

- `今日の1杯`
- `25g · トレーニング後`
- action `飲んだ`

**Completed**

- `今日は補助できました`
- completion time
- no additional action.

**Skipped**

- `今日は記録なし`
- quiet action `今から飲む`.

### Detail screen

- current serving;
- schedule;
- weekly completion circles;
- edit action;
- statement: `食事を含む総タンパク質量ではなく、追加した分だけを記録しています。`

### Safety and truthfulness

- Do not claim that a narrow post-workout window is mandatory.
- Do not automatically increase serving size from incomplete diet information.
- A future suggestion may say `食事や補助量を見直してみましょう`, not `タンパク質不足です`.

---

## S30. Progress

### Purpose

Answer “Am I moving forward?” without becoming an analytics dashboard.

### Default weekly view

1. title: `今週の進み`;
2. primary statement card:
   - `3回中2回できました`;
   - `先週より1回多い` if true;
3. body map card:
   - trained target areas;
   - labels, not color alone;
4. strength card:
   - `3種目で前進`;
   - top example `チェストプレス +5kg`;
5. protein card:
   - `7日中5日`;
6. compact body-weight trend only if data exists;
7. one next-week statement:
   - `次回はラットプルダウンを1段階上げます。`

### Detail drill-down

Users may tap a card for a simple graph or exercise history. Detailed numbers are never the first view.

### No-data state

Show: `2回のトレーニング後から、変化をまとめます。`

Do not invent a score.

---

## S40. Profile / You

### Purpose

House configuration without cluttering daily use.

### Sections

1. identity/account;
2. current goal;
3. training plan;
4. gym;
5. protein;
6. units and language;
7. notification settings;
8. privacy and data;
9. help and safety.

Use a clean list, not cards for every row.

### Account model

- anonymous by default;
- show `データを守る` callout after first completed workout;
- allow linking email by magic link/OTP;
- explain that clearing browser data before linking may lose local/anonymous access;
- support export and deletion.

---

## S41. Gym profile

### Purpose

Display what the app has learned about the current gym.

### UI

- gym name;
- status summary:
  - `確認済み 7`
  - `未確認 5`
  - `ない 2`;
- equipment rows with icon, name, and status;
- `ジムを変更`.

### Interaction

The user can manually correct an equipment status, but this is optional. The normal path learns equipment during workouts.

---

## S42. Exercise detail / library

### Purpose

Allow review outside the active session.

### UI

- large motion media;
- exercise name;
- main target muscles;
- equipment type;
- two setup cues;
- common alternatives;
- expandable `詳しく見る` for rationale and safety notes.

The library is searchable from the Profile screen, not a bottom tab.

---

## S50. Error and offline states

### Required states

- no network;
- failed media load;
- failed cloud sync;
- stale session conflict;
- unsupported browser storage;
- notification permission denied;
- account linking failed;
- deleted/missing exercise content.

### Rules

- The active workout must remain usable offline.
- Show clear text and a retry action.
- Never erase local workout data due to a sync error.
- A cloud conflict uses `latest completed event wins` for immutable set events and explicit user confirmation for profile conflicts.

---

# 9. Core workout logic

## 9.1 Program structure

MVP offers:

### 2-day program

- Full Body A
- Full Body B

### 3-day program

- Full Body A
- Full Body B
- Full Body C

Each session contains 4–6 exercise slots depending on selected duration.

## 9.2 Slot-based planning

The program stores training intent slots rather than only fixed exercises.

Example slots:

```text
1. horizontal_push — chest emphasis
2. vertical_pull — back emphasis
3. knee_dominant — legs
4. horizontal_pull — upper back
5. shoulder_isolation — lateral/rear delts
6. arm_accessory — optional by time
```

The route engine chooses an exercise for each slot based on gym equipment and user history.

## 9.3 Lean Athletic emphasis

Without promising a specific celebrity body, the MVP goal prioritizes:

- chest, including an incline option when available;
- shoulders, especially lateral/rear shoulder accessories;
- back width and upper back;
- balanced arms;
- sufficient legs and posterior chain for whole-body balance;
- sustainable session length.

## 9.4 Seed exercise categories

P0 must support at least these equipment/exercise families:

1. chest press machine;
2. incline chest press machine or incline dumbbell press;
3. pec fly machine;
4. shoulder press machine;
5. lateral raise machine or dumbbell lateral raise;
6. reverse fly machine;
7. lat pulldown;
8. seated row;
9. leg press;
10. leg extension;
11. leg curl;
12. cable station;
13. dumbbells;
14. adjustable bench;
15. bodyweight push-up fallback.

## 9.5 Initial load selection

For the first encounter with an exercise:

1. show a conservative suggested starting range rather than a single authoritative number when no history exists;
2. allow the user to choose a machine increment with large controls;
3. after the exercise, use the simple difficulty response to set the next prescription;
4. never ask for a one-repetition maximum test.

For demo mode, seed plausible placeholder weights but label them as demo data.

## 9.6 Progression rule

Use a deterministic double-progression model.

Each exercise has:

- rep range, e.g. 8–12;
- planned sets, e.g. 3;
- smallest known machine increment;
- current prescribed weight;
- current prescribed reps.

Default rules:

```text
IF pain reported:
  do not increase load
  flag exercise for substitution/review

ELSE IF difficulty == "きつすぎた":
  if planned reps were not completed or user edited downward:
    reduce next target by one increment OR reduce reps to lower bound
  else:
    maintain weight and lower target reps

ELSE IF difficulty == "ちょうどよかった":
  if all sets at top of rep range for two exposures:
    increase weight by smallest increment and reset reps to lower bound
  else:
    add 1 rep to the next exposure within range

ELSE IF difficulty == "余裕だった":
  if all planned work completed:
    increase one progression step next exposure
  progression step = add reps first; add weight when top of range reached
```

Guardrails:

- change only one variable at a time;
- no large percentage jumps;
- preserve the last successful prescription when data is incomplete;
- avoid reducing an entire program due to one difficult session;
- show the user a plain-language reason, e.g. `前回余裕があったので、次は1回だけ増やします。`.

## 9.7 Exercise result model

Normal case:

- planned sets, reps, and weight are copied into actual result;
- each `セット完了` creates an immutable set event;
- exercise feedback modifies the next prescription;
- edits overwrite only the edited set result while preserving audit history.

## 9.8 Replacement logic

Candidate ranking must consider:

1. same primary target muscle;
2. same movement pattern;
3. available equipment in current gym;
4. known familiarity and previous successful use;
5. current session duplication/fatigue;
6. pain or restriction flags;
7. selected session duration.

Return at most two candidates.

## 9.9 Session completion

A session is complete when:

- all non-skipped slots have been completed; or
- the user explicitly ends early and confirms saving partial progress.

Partial sessions remain valid and visible. Do not erase them or label them failures.

---

# 10. Protein logic

## 10.1 Scope

The app tracks supplemental protein servings only.

It stores:

- product/serving label;
- protein grams per serving;
- servings planned on training/rest days;
- timing anchor;
- completion timestamp.

It does not infer total daily protein from unlogged meals.

## 10.2 Reminder behavior

- Ask notification permission only after the user enables a reminder, not during initial launch.
- Training-after reminder is scheduled relative to workout completion.
- Fixed-time reminders use local time and timezone.
- A completed log cancels remaining reminder for that serving.
- Notifications use neutral copy, e.g. `いつもの1杯を、忘れないうちに。`
- No guilt or streak-loss messaging.

## 10.3 Future adjustment logic

P0 does not automatically change serving size. It may surface a review prompt after consistent training with stagnant user-entered outcomes, but must say:

`食事量や補助の取り方を見直すタイミングかもしれません。`

It must not diagnose protein or calorie deficiency.

---

# 11. Content and motion media specification

## 11.1 MVP media strategy

Use pre-rendered looping 3D-style assets rather than interactive real-time 3D.

Reasons:

- consistent web/iOS behavior;
- fast load and lower battery use;
- no camera or complex rendering dependency;
- easier art direction;
- simple fallback behavior.

## 11.2 Asset contract

Each exercise provides:

```ts
type ExerciseMedia = {
  exerciseId: string;
  posterImage: string;
  videoMp4?: string;     // H.264, iOS/web fallback
  videoWebm?: string;    // web optimization where supported
  durationMs: number;    // target 3000–6000
  loop: true;
  backgroundColor: '#0A0A0B';
  primaryAngle: 'front' | 'side' | 'three-quarter';
  targetMuscles: MuscleId[];
  reducedMotionStartFrame: string;
  reducedMotionEndFrame: string;
  altTextJa: string;
  altTextEn: string;
};
```

## 11.3 Visual rules for motion assets

- Generic mannequin; no celebrity likeness.
- Clean, non-photoreal, premium 3D render.
- Dark neutral body and machine.
- Primary muscle only in red; secondary muscles may use a muted red at lower opacity.
- Camera angle must clearly show the movement.
- Seamless loop.
- No baked-in text; labels are rendered by the app for localization.
- Avoid manufacturer logos and copyrighted machine imagery.

## 11.4 Placeholder policy

The coding agent must not block application completion on final assets.

Implement `ExerciseMotion` with:

1. local placeholder motion asset;
2. poster fallback;
3. reduced-motion fallback;
4. loading skeleton;
5. error state.

Document exact filenames needed for final production assets in `ASSET_MANIFEST.md`.

---

# 12. Data model

Use UUID primary keys and UTC timestamps. User-facing dates render in local timezone.

## 12.1 Main entities

### profiles

```text
id uuid PK, references auth.users
created_at timestamptz
updated_at timestamptz
locale text default 'ja-JP'
unit_system text enum('metric','imperial') default 'metric'
experience_level text
weekly_frequency int
session_duration_min int
onboarding_completed bool
current_gym_id uuid nullable
```

### goals

```text
id text PK
name_ja text
name_en text
description_ja text
description_en text
active bool
```

Seed: `lean_athletic`.

### user_goals

```text
user_id uuid PK/FK
goal_id text FK
started_at timestamptz
active bool
```

### gyms

```text
id uuid PK
name text
branch_name text nullable
country_code text nullable
is_demo bool default false
created_by uuid nullable
```

### equipment_types

```text
id text PK
name_ja text
name_en text
movement_tags text[]
thumbnail_asset text
```

### user_gym_equipment

```text
id uuid PK
user_id uuid FK
gym_id uuid FK
equipment_type_id text FK
status text enum('unknown','present','absent')
last_confirmed_at timestamptz
notes text nullable
unique(user_id, gym_id, equipment_type_id)
```

### exercises

```text
id text PK
name_ja text
name_en text
equipment_type_id text FK
movement_pattern text
primary_muscles text[]
secondary_muscles text[]
rep_min int
rep_max int
default_sets int
rest_seconds int
setup_cues_ja text[]
setup_cues_en text[]
active bool
content_version int
```

### exercise_media

```text
exercise_id text PK/FK
poster_uri text
video_mp4_uri text nullable
video_webm_uri text nullable
start_frame_uri text
end_frame_uri text
duration_ms int
angle text
alt_ja text
alt_en text
```

### exercise_substitutions

```text
source_exercise_id text FK
substitute_exercise_id text FK
priority int
reason_ja text
reason_en text
primary key(source_exercise_id, substitute_exercise_id)
```

### program_templates

```text
id text PK
goal_id text FK
frequency int
duration_min int
name text
version int
active bool
```

### program_slots

```text
id uuid PK
program_template_id text FK
day_index int
slot_index int
movement_pattern text
muscle_emphasis text
optional bool
```

### user_exercise_state

```text
id uuid PK
user_id uuid FK
exercise_id text FK
prescribed_weight numeric nullable
prescribed_reps int
prescribed_sets int
increment numeric nullable
successful_top_range_count int default 0
last_difficulty text nullable
last_completed_at timestamptz nullable
pain_flag bool default false
unique(user_id, exercise_id)
```

### workout_sessions

```text
id uuid PK
user_id uuid FK
program_template_id text FK
program_day_index int
status text enum('planned','active','paused','completed','abandoned')
started_at timestamptz nullable
completed_at timestamptz nullable
current_item_index int default 0
estimated_duration_min int
actual_duration_sec int nullable
source text enum('scheduled','manual','demo')
```

### workout_items

```text
id uuid PK
session_id uuid FK
slot_index int
exercise_id text FK
original_exercise_id text nullable
replacement_reason text nullable
planned_weight numeric nullable
planned_reps int
planned_sets int
status text enum('pending','active','completed','skipped')
difficulty text nullable
pain_reported bool default false
```

### set_results

```text
id uuid PK
workout_item_id uuid FK
set_index int
planned_weight numeric nullable
actual_weight numeric nullable
planned_reps int
actual_reps int nullable
completed_at timestamptz
edited bool default false
client_event_id uuid unique
```

### protein_plans

```text
id uuid PK
user_id uuid FK
label text
protein_grams numeric
schedule_type text enum('daily','training_days','off')
timing_anchor text enum('post_workout','morning','evening','fixed_time')
fixed_local_time time nullable
active bool
```

### protein_logs

```text
id uuid PK
user_id uuid FK
protein_plan_id uuid FK
local_date date
completed_at timestamptz
protein_grams numeric
client_event_id uuid unique
unique(user_id, protein_plan_id, local_date)
```

### body_metrics

```text
id uuid PK
user_id uuid FK
measured_at timestamptz
weight_kg numeric nullable
waist_cm numeric nullable
chest_cm numeric nullable
arm_cm numeric nullable
source text enum('manual','healthkit','scale')
```

### app_preferences

```text
user_id uuid PK/FK
reduce_motion bool nullable
haptics_enabled bool default true
rest_timer_sound bool default false
notification_enabled bool default false
analytics_consent bool default false
```

## 12.2 Row-level security

- All user-owned tables must have RLS enabled.
- A user may select/insert/update/delete only rows whose `user_id` equals `auth.uid()`.
- Static content tables are readable by authenticated and anonymous-authenticated users, not writable from the client.
- Never ship a Supabase service-role key in web or app code.

---

# 13. Technical architecture

## 13.1 Chosen stack

Use one universal React Native project so the web prototype and iOS app share screens, logic, types, and design tokens.

### Baseline

- Expo SDK 57
- React Native 0.86
- React 19.2
- TypeScript with `strict: true`
- Expo Router
- Expo Web
- EAS Build / Submit

### Recommended libraries

- `expo-router` — navigation;
- `expo-video` — motion media;
- `expo-notifications` — local reminders on iOS;
- `expo-haptics` — completion feedback;
- `expo-sqlite` — durable local workout state;
- `@supabase/supabase-js` — cloud auth/data;
- `zustand` — transient UI/workout state;
- `@tanstack/react-query` — remote query and sync state;
- `zod` — runtime validation;
- `date-fns` — date handling;
- `react-native-safe-area-context`;
- `react-native-reanimated` only for restrained transitions where necessary;
- `jest-expo` and React Native Testing Library;
- Playwright for web critical flows;
- Maestro scripts for later iOS end-to-end checks.

Do not introduce a heavy visual component library for MVP. Build a small internal component system from design tokens.

## 13.2 Modes

### Local demo mode

Must run with no secrets:

```text
EXPO_PUBLIC_APP_MODE=demo
```

- bundled exercises and demo gym;
- local anonymous profile;
- local persistence;
- no remote auth required;
- ideal for web review and agent verification.

### Cloud mode

```text
EXPO_PUBLIC_APP_MODE=cloud
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

- anonymous Supabase sign-in;
- optional email OTP/magic-link linking;
- cloud sync;
- RLS.

## 13.3 Offline-first behavior

- Bundled program and exercise content is available offline.
- Active workout events write to SQLite first.
- A sync queue retries cloud writes when online.
- Each event uses a unique `client_event_id` for idempotency.
- Remote failure never blocks set completion.
- User profile changes may be last-write-wins with `updated_at` conflict checks.
- Immutable completed set events are merged, not overwritten silently.

## 13.4 Authentication

- On first launch in cloud mode, call anonymous sign-in.
- Do not show a login screen before value is demonstrated.
- After first completed workout, offer email linking.
- Use email OTP or magic link, with deep-link configuration for iOS and web.
- Provide account deletion and logout.
- Warn anonymous users before logout because access may be unrecoverable.

## 13.5 State boundaries

- `SQLite`: durable user/session/events and sync queue.
- `Zustand`: current navigation/workout interaction state.
- `React Query`: server reads and mutation status.
- `Bundled JSON`: exercises, program templates, static copy keys.
- `Supabase Storage` or bundled assets: exercise media.

Do not duplicate the same source of truth in multiple stores without a clear adapter.

---

# 14. Suggested project structure

```text
nxtset/
├─ app/
│  ├─ _layout.tsx
│  ├─ index.tsx
│  ├─ (onboarding)/
│  │  ├─ _layout.tsx
│  │  ├─ welcome.tsx
│  │  ├─ body-goal.tsx
│  │  ├─ experience.tsx
│  │  ├─ schedule.tsx
│  │  ├─ gym.tsx
│  │  ├─ protein.tsx
│  │  └─ ready.tsx
│  ├─ (tabs)/
│  │  ├─ _layout.tsx
│  │  ├─ today.tsx
│  │  ├─ progress.tsx
│  │  └─ profile.tsx
│  ├─ workout/
│  │  └─ [sessionId]/
│  │     ├─ index.tsx
│  │     ├─ exercise/[itemId].tsx
│  │     ├─ unavailable/[itemId].tsx
│  │     └─ complete.tsx
│  ├─ exercise/[exerciseId].tsx
│  ├─ gym/index.tsx
│  ├─ protein/index.tsx
│  ├─ account/link.tsx
│  ├─ account/privacy.tsx
│  └─ settings.tsx
├─ src/
│  ├─ components/
│  │  ├─ primitives/
│  │  ├─ workout/
│  │  ├─ media/
│  │  └─ feedback/
│  ├─ design/
│  │  ├─ tokens.ts
│  │  ├─ typography.ts
│  │  └─ theme.ts
│  ├─ content/
│  │  ├─ exercises.ja.json
│  │  ├─ programs.json
│  │  ├─ substitutions.json
│  │  └─ muscles.json
│  ├─ domain/
│  │  ├─ program.ts
│  │  ├─ progression.ts
│  │  ├─ replacement.ts
│  │  ├─ workoutSession.ts
│  │  └─ protein.ts
│  ├─ data/
│  │  ├─ db.ts
│  │  ├─ schema.ts
│  │  ├─ repositories/
│  │  └─ sync/
│  ├─ services/
│  │  ├─ supabase.ts
│  │  ├─ notifications.ts
│  │  └─ analytics.ts
│  ├─ state/
│  ├─ hooks/
│  ├─ i18n/
│  ├─ types/
│  └─ utils/
├─ assets/
│  ├─ motion/
│  ├─ posters/
│  ├─ machines/
│  └─ icons/
├─ supabase/
│  ├─ migrations/
│  └─ seed.sql
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ .env.example
├─ app.config.ts
├─ eas.json
├─ README.md
├─ ASSET_MANIFEST.md
├─ DECISIONS.md
└─ package.json
```

---

# 15. Internal component specification

At minimum, implement:

- `Screen`
- `TopBar`
- `BottomTabBar`
- `PrimaryButton`
- `IconButton`
- `PillButton`
- `SelectionCard`
- `HeroWorkoutCard`
- `ExerciseRow`
- `ExerciseMotion`
- `MuscleLabel`
- `PrescriptionChip`
- `SetProgress`
- `RestTimerBar`
- `DifficultyChoice`
- `AlternativeExerciseCard`
- `ProteinCard`
- `WeeklySummaryCard`
- `BottomSheet`
- `InlineError`
- `OfflineBanner`
- `SkeletonMedia`

Every component must include:

- disabled state;
- pressed state;
- loading state where applicable;
- accessibility label/role;
- web focus state;
- dark-theme styling from tokens only.

---

# 16. Analytics event specification

Analytics is opt-in where legally required and must avoid raw sensitive measurements.

Events:

```text
app_opened
onboarding_started
onboarding_step_completed
onboarding_completed
workout_previewed
workout_started
workout_resumed
exercise_viewed
exercise_set_completed
exercise_plan_edited
exercise_feedback_submitted
equipment_unavailable_selected
alternative_presented
alternative_accepted
exercise_skipped
workout_paused
workout_completed
workout_ended_early
protein_logged
protein_reminder_enabled
progress_viewed
account_link_started
account_link_completed
sync_failed
media_failed
```

Common properties:

- app version;
- platform;
- locale;
- anonymous/linked account status;
- program frequency;
- exercise ID;
- gym equipment status category;
- duration bucket, not raw health details.

Do not send exact body weight, measurements, pain notes, email, or free text to generic analytics.

---

# 17. Accessibility requirements

- Minimum target size 44 × 44.
- Normal text contrast target at least 4.5:1.
- Large text contrast target at least 3:1.
- All controls have accessible names and roles.
- Color is never the sole indicator.
- Dynamic text scaling must not hide primary actions.
- Web flow has logical keyboard focus order.
- Visible focus treatment on web.
- Exercise motion has text alternative and start/end frame fallback.
- Respect Reduce Motion.
- Rest timer completion is not conveyed by sound alone.
- Do not depend on complex gestures; every swipe has a tap alternative.

---

# 18. Privacy, safety, and health claims

## 18.1 Privacy

- Collect only data necessary for program operation.
- Explain collection, use, retention, deletion, and third-party processors.
- Provide in-app account/data deletion.
- Do not sell health or fitness data.
- Use TLS and RLS.
- Store secrets only in server/dashboard environments.
- App Store privacy disclosures must match actual implementation.

## 18.2 Safety

At onboarding and in help:

- state that the app is general fitness guidance, not medical advice;
- instruct users with medical conditions, injuries, pregnancy, or concerning symptoms to consult a qualified professional;
- stop normal progression after pain reports;
- show urgent guidance for chest pain, fainting, severe shortness of breath, or acute injury without attempting diagnosis.

## 18.3 Claims

Allowed examples:

- `初心者向けに、ジムで次にすることを案内します。`
- `記録と次回の負荷調整を簡単にします。`
- `リーンで筋肉質な体を目指す行動を支援します。`

Disallowed examples:

- `必ずトム・ホランドの体になります。`
- `この動きは胸に73%効いています。`
- `今日12g筋肉が増えました。`
- `食事を記録しなくても総タンパク質が分かります。`
- `このアプリが怪我を防ぎます。`

Any future quantitative health measurement claim must disclose methodology and validation.

---

# 19. Testing specification

## 19.1 Unit tests

Required for:

- program slot selection;
- equipment availability updates;
- replacement ranking;
- progression rules;
- planned-to-actual result copying;
- protein reminder scheduling;
- sync idempotency;
- locale/unit conversions.

## 19.2 Component tests

Required for:

- PrimaryButton states;
- ExerciseMotion fallback;
- PrescriptionChip editing;
- DifficultyChoice;
- Equipment unavailable flow;
- Today hero states;
- protein pending/completed states.

## 19.3 Web end-to-end test

Automate this critical flow:

1. open clean app;
2. complete onboarding;
3. open Today;
4. start workout;
5. complete all sets of first exercise using defaults;
6. choose `ちょうどよかった`;
7. mark next machine `混んでいる`;
8. accept an alternative;
9. finish remaining demo exercises;
10. complete workout;
11. log protein;
12. refresh browser;
13. verify completion and progress persist.

## 19.4 iOS beta checks

- safe area and tab bar;
- Dynamic Type;
- Reduce Motion;
- local notifications;
- haptics;
- app background/resume during rest timer;
- offline completion and later sync;
- email OTP deep link;
- TestFlight release build splash/icon.

---

# 20. Performance requirements

- Initial cached launch should feel immediate; avoid blocking on network.
- Today screen interactive before non-critical media completes.
- Motion assets lazy-load and use poster placeholders.
- Preload only the current and next exercise media during a workout.
- Do not mount every library video in a list.
- Keep initial JavaScript bundle and media separate.
- Avoid overlapping video views.
- Compress images and provide appropriate dimensions.
- No continuous background network polling.

---

# 21. Implementation phases

## Phase 0 — Repository and design foundation

Deliver:

- Expo SDK 57 universal project;
- Expo Router routes;
- TypeScript strict mode;
- design tokens and primitive components;
- demo mode;
- lint, formatting, tests, CI;
- README and environment setup.

Definition of done:

- app runs with `npm install` and one documented command;
- web renders a polished Welcome and Today skeleton;
- no secret required.

## Phase 1 — Clickable product shell

Deliver:

- all onboarding screens;
- Today, Progress, Profile;
- static demo workout route;
- exercise motion placeholder and target muscle UI;
- dark visual system;
- responsive web behavior.

Definition of done:

- user can navigate the full conceptual flow;
- no dense placeholder admin UI;
- design review can happen in browser.

## Phase 2 — Functional workout engine

Deliver:

- local database;
- seeded exercises/programs/substitutions;
- set completion;
- exercise feedback;
- weight/reps exception editing;
- rest timer;
- substitution flow;
- pause/resume;
- completion summary;
- progression unit tests.

Definition of done:

- critical web E2E flow passes;
- browser refresh does not lose the active session.

## Phase 3 — Protein and progress

Deliver:

- protein plan and logging;
- local reminder abstraction;
- weekly summary;
- exercise progression display;
- simple body-weight entry as optional data.

Definition of done:

- no screen claims total daily protein;
- completed workout and protein log appear after refresh.

## Phase 4 — Cloud sync and accounts

Deliver:

- Supabase migrations and seed;
- anonymous sign-in;
- RLS;
- sync queue;
- email OTP/magic-link linking;
- deletion/export basics.

Definition of done:

- two sessions on the same linked account converge without duplicate set events;
- demo mode remains available.

## Phase 5 — iOS development build

Deliver:

- app icon, splash, bundle ID placeholder;
- EAS profiles for development, preview, production;
- local notifications;
- haptics;
- TestFlight build instructions;
- iOS QA checklist.

Definition of done:

- development build installs on a physical iPhone;
- core workout works offline;
- notification and resume behavior verified.

## Phase 6 — Production preparation

Deliver:

- final motion assets;
- privacy policy and support page;
- App Store metadata draft;
- analytics consent;
- crash/error monitoring;
- accessibility pass;
- content review by qualified exercise professional;
- TestFlight user study.

---

# 22. Build and deployment commands

The agent must verify commands against the generated project, but the expected flow is:

```bash
# Create project
npx create-expo-app@latest --template default@sdk-57

# Install
npm install

# Run mobile bundler
npx expo start

# Run web
npx expo start --web

# Test
npm test
npm run test:e2e:web

# Type and lint checks
npm run typecheck
npm run lint

# Configure EAS
eas build:configure

# iOS development build
eas build --platform ios --profile development

# iOS preview/TestFlight candidate
eas build --platform ios --profile preview

# Production build
eas build --platform ios --profile production

# Submit
eas submit --platform ios --profile production
```

For web deployment, configure either EAS Hosting or a static export compatible with the selected hosting provider. The README must describe the exact command used by this repository.

---

# 23. Seed demo content

The repository must include a complete demo path that does not require final proprietary assets.

## Demo user

- goal: Lean Athletic;
- experience: first-time;
- frequency: 3;
- session duration: 45 minutes;
- gym: Demo Gym;
- protein: 25 g after training.

## Demo Full Body A

1. Chest Press — chest — 3 × 10
2. Lat Pulldown — back — 3 × 10
3. Leg Press — legs — 3 × 10
4. Seated Row — upper back — 2 × 10
5. Lateral Raise — shoulders — 2 × 12

## Demo substitutions

- Chest Press → Dumbbell Press → Push-up
- Lat Pulldown → Assisted Pull-up or Cable Pulldown → One-arm Dumbbell Row
- Leg Press → Goblet Squat → Bodyweight Squat
- Seated Row → Cable Row → One-arm Dumbbell Row
- Lateral Raise Machine → Dumbbell Lateral Raise → Cable Lateral Raise

All numbers are demo prescriptions, not universal recommendations.

---

# 24. Acceptance checklist

## Product

- [ ] User can begin without creating an account.
- [ ] Today screen has one dominant workout action.
- [ ] Active workout shows one exercise at a time.
- [ ] Motion demonstration is visually dominant.
- [ ] Target muscle is named and highlighted.
- [ ] Normal path uses no keyboard.
- [ ] User reports difficulty only once per exercise.
- [ ] Busy/absent machine flow offers at most two alternatives.
- [ ] Planned results become records automatically.
- [ ] Workout survives refresh/app closure.
- [ ] Protein logging is one tap.
- [ ] Progress screen remains understandable without specialist knowledge.

## Design

- [ ] Dark premium visual system is consistent.
- [ ] Only one accent color is used for primary interaction.
- [ ] No screen resembles a spreadsheet or admin dashboard.
- [ ] Touch targets meet minimum size.
- [ ] Text contrast passes target ratios.
- [ ] Dynamic text and reduced motion are supported.
- [ ] Web focus states are visible.

## Technical

- [ ] Expo universal app runs on web and iOS.
- [ ] Demo mode works without secrets.
- [ ] Cloud mode uses RLS.
- [ ] Service-role credentials are absent from client code.
- [ ] Core domain logic has tests.
- [ ] Critical web E2E test passes.
- [ ] EAS configuration is present.
- [ ] README covers setup, web deploy, and iOS build.

## Trust and safety

- [ ] No celebrity outcome guarantee.
- [ ] No total-protein claim without meal data.
- [ ] No live-form accuracy claim.
- [ ] Pain prevents automatic load progression.
- [ ] Privacy policy and deletion route are prepared before public release.

---

# 25. Final UX copy principles

Use short, calm, non-judgmental Japanese.

Prefer:

- `次はチェストプレス`
- `この器具が使えない`
- `前回より1回だけ増やします`
- `今日はここまででも記録できます`
- `いつもの1杯を、忘れないうちに。`
- `3日空きました。続きから始めます。`

Avoid:

- `限界まで追い込め！`
- `サボりました`
- `ストリークが失われます`
- `脂肪を燃焼させろ`
- `AIが完璧なフォームを保証`
- `科学的に最適な唯一の方法`

---

# 26. Final agent deliverables

The implementation agent must return:

1. runnable source repository;
2. `README.md` with exact setup commands;
3. `.env.example`;
4. all database migrations and seed data;
5. local demo mode;
6. web deployment configuration;
7. `eas.json` and iOS build configuration;
8. test suite and test report;
9. `ASSET_MANIFEST.md` listing all final motion assets still required;
10. `DECISIONS.md` documenting any deviation from this specification;
11. screenshots of these screens at 390 × 844:
    - Welcome;
    - Today;
    - Active Exercise;
    - Exercise Feedback;
    - Equipment Alternative;
    - Workout Complete;
    - Progress;
12. a short list of known limitations, with no hidden unfinished behavior.

---

# 27. Technical basis checked for this specification

Architecture and release assumptions should be rechecked at implementation time. This specification was prepared against the official documentation available on 2026-08-18 for:

- Expo SDK 57 and React Native 0.86;
- Expo Router for universal web/iOS navigation;
- Expo Video, Notifications, SQLite, and EAS Build/Submit;
- Supabase Expo integration, anonymous sign-in, passwordless email, Postgres, and RLS;
- Apple App Review guidance for health claims and privacy;
- Apple Human Interface Guidelines and WCAG 2.2 accessibility guidance.

