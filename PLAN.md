# HarpFlow - Product Plan

## Product Vision

**Mission**: Help harmonica beginners overcome the "black box problem" by providing real-time visual feedback on their playing technique, making the invisible visible.

**Core Value Proposition**: Unlike video courses that show but don't respond, HarpFlow listens to your playing and tells you exactly what you're doing right or wrong - in real-time.

**Success Metric**: Reduce the 90% dropout rate by helping beginners achieve clean single notes and their first bend within 30 days.

---

## Target Users

### Primary: "The Frustrated Hobbyist"
- Age 25-45, bought a harmonica but quit because they "couldn't get a clear note"
- Willing to spend 10-15 minutes/day practicing
- Wants immediate feedback, not just passive video watching
- Frustrated by the lack of structured learning paths

### Secondary: "The Bending Plateauer"
- Intermediate player stuck on bending technique
- Can play simple melodies but can't achieve the "bluesy wail"
- Needs precision feedback on pitch accuracy (cents deviation)

### Tertiary: "The Commuter"
- Wants 5-minute gamified sessions
- Practices during breaks or commute (quiet environment)
- Motivated by streaks and achievements

---

## User Journeys

### Journey 1: First-Time User (0-5 minutes)
```
Landing Page → "Start Learning" → Mic Permission → Quick Calibration → First Lesson
```
1. User arrives at landing page, sees clear value prop
2. Clicks "Start Learning" (no account needed)
3. Grants microphone permission
4. Quick calibration: "Blow into hole 4" (detects harmonica key)
5. Immediately into first interactive lesson
6. **Goal**: User hears their first clean note with visual confirmation within 5 minutes

### Journey 2: Daily Practice Session (10-15 minutes)
```
Return → Skill Tree → Pick Lesson → Practice with Feedback → Results → XP Earned
```
1. User returns, sees their streak and progress
2. Skill tree shows next recommended lessons
3. Picks a lesson or continues where they left off
4. Plays through tablature with wait-mode
5. Gets real-time bleed/accuracy feedback
6. Sees results: accuracy %, stars, XP earned
7. **Goal**: Feel measurable progress each session

### Journey 3: Bending Practice (Intermediate)
```
Bending Gym → Select Exercise → Target Practice → Visual Feedback → Master the Bend
```
1. User enters Bending Gym
2. Sees current bend targets (start with 4-draw bend)
3. "Landing the Plane" UI: pitch cursor moves toward target line
4. Holds cursor on target for 3 seconds = success
5. Progressive difficulty: any bend → specific depth → in rhythm
6. **Goal**: Master each draw bend with visual proof

---

## Feature Set (By Priority)

### P0: Must-Have (MVP)

| Feature | Description | User Problem Solved |
|---------|-------------|---------------------|
| **Real-Time Note Detection** | Detects which hole (1-10) and direction (blow/draw) | "Am I even playing the right note?" |
| **Accuracy Feedback** | Shows if note is correct, close, or wrong with colors | "How do I know if I'm improving?" |
| **Bleed Detection** | Warns when playing multiple holes accidentally | "I can't get a clean single note" |
| **Wait Mode** | Tab pauses until correct note played | "Everything moves too fast" |
| **Horizontal Scrolling Tab** | Notes scroll left-to-right matching harmonica layout | "Standard notation confuses me" |
| **Bend Detection** | Shows pitch deviation in cents below natural note | "Am I actually bending or just playing badly?" |
| **Beginner Curriculum** | 15-20 structured lessons from basics to first songs | "Where do I even start?" |
| **Progress Persistence** | Saves progress locally, no account needed | "I don't want another login" |

### P0 (continued): Practice Tools

| Feature | Description | User Problem Solved |
|---------|-------------|---------------------|
| **Metronome** | Built-in visual + audio metronome (40-200 BPM) with count-in | "I can't keep a steady rhythm" |
| **Tempo Control** | Adjust playback speed 50%-150% | "This song is too fast for me" |

### P1: High Priority (Post-MVP)

| Feature | Description | User Problem Solved |
|---------|-------------|---------------------|
| **Bending Gym** | Dedicated pitch target practice mode | "I need to drill this technique" |
| **Song Library** | 10+ playable songs with difficulty ratings | "I want to play real music" |
| **Gamification** | XP, levels, streaks, achievements | "I need motivation to practice daily" |
| **Multi-Key Support** | Switch between C, A, G, D harmonicas | "I have multiple harmonicas" |
| **Rhythm Training** | Tap-along exercises, "chug" drills for breath timing | "My timing is inconsistent" |
| **Loop Sections** | A-B repeat for practicing difficult passages | "I keep failing the same part" |
| **Recording & Playback** | Record sessions, compare to reference | "I want to hear my progress" |

### P2: Nice to Have (Future)

| Feature | Description |
|---------|-------------|
| **Ear Training** | "Which hole was that?" listening exercises, interval recognition |
| **Backing Tracks** | Play along with drums/bass/guitar accompaniment |
| **Chord Mode** | Intentional multi-hole playing (vs bleed detection) |
| **Vibrato Training** | Hand, throat, and diaphragm vibrato techniques |
| **Embouchure Tips** | AI suggestions based on common mistakes |
| **Dark Mode** | Reduce eye strain for evening practice |
| **Mobile PWA** | Install on home screen |
| **Position Theory** | 1st, 2nd, 3rd position explanations with practice |

---

## Page-by-Page Product Spec

### 1. Landing Page (`/`)

**Purpose**: Convert visitors into learners in under 60 seconds

**Content**:
- Hero: "Learn Harmonica with Real-Time Feedback"
- Subheadline: "No account needed. No downloads. Just you and your harmonica."
- CTA Button: "Start Learning Free" (prominent, single action)
- 3 feature highlights with icons:
  - "Hear if you're playing right - instantly"
  - "Learn to bend notes like the pros"
  - "Structured lessons from zero to blues"
- Social proof: "Join X learners" (add later)
- Footer: minimal (About, Privacy, Contact)

**Interactions**:
- CTA → Check mic permission → redirect to /learn or show permission modal

---

### 2. Skill Tree (`/learn`)

**Purpose**: Show learning path, track progress, motivate continuation

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  [Progress Bar: Level 3 - 450 XP]     [🔥 5 day streak] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    FUNDAMENTALS          MELODIES          BENDING      │
│         ○                   ◐                 ○         │
│         │                   │                 │         │
│    ○────○────○         ○────○────○       ○────○────○    │
│    │         │         │         │       │         │    │
│    ○    ○    ○         ○    ○    ○       ○    ○    ○    │
│   (locked)            (locked)           (locked)       │
│                                                         │
│  ○ = Completed (★★★)   ◐ = In Progress   ○ = Locked    │
└─────────────────────────────────────────────────────────┘
```

**Node States**:
- Locked (gray, shows prerequisites)
- Available (glowing, clickable)
- In Progress (partial fill)
- Completed (full color + star rating)

**Branches**:
1. **Fundamentals** (Blue) - Technique basics
2. **Melodies** (Green) - Simple songs in 1st position
3. **Bending** (Purple) - Draw bends and control
4. **Blues** (Red) - 2nd position, licks (future)

---

### 3. Lesson Player (`/learn/[lessonId]`)

**Purpose**: Core learning experience with real-time feedback

**Layout** (Landscape-optimized):
```
┌─────────────────────────────────────────────────────────┐
│  [← Back]    Lesson: Your First Notes    [⚙️ Settings]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ═══════════════════════════════════════════════════   │
│   │ 4↑ │ 5↑ │ 4↓ │ 5↓ │ 6↑ │    <-- SCROLLING TAB     │
│   ═══════════════════════════════════════════════════   │
│                    ▲ playhead                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][10]  │
│                       ▲                                 │
│                  YOU'RE HERE                            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ♩ 80 BPM [-][+]  │ CLEAN ✓ │ 87% │ [Wait: ON] │   │
│  │    ● ○ ○ ○       │         │     │            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Metronome Display**:
- BPM control with -/+ buttons
- Visual beat indicator (● ○ ○ ○ for 4/4 time)
- Optional audio click (can be muted)
- Count-in: "3... 2... 1... GO" before starting

**Elements**:
- **Scrolling Tab Area**: Notes move right-to-left toward playhead
- **Note Representation**:
  - `4↑` = Hole 4, Blow (blue background)
  - `4↓` = Hole 4, Draw (purple background)
  - `4↓'` = Hole 4, Draw Bend (purple with bend indicator)
- **Harmonica Diagram**: Visual of 10 holes, highlights current played hole
- **Status Bar**:
  - Clean/Bleed indicator
  - Running accuracy percentage
  - Wait Mode toggle

**Wait Mode Behavior**:
- Tab scrolls until reaching next note
- Pauses at note until user plays correct hole + direction
- Visual pulsing on target note
- After correct: brief green flash, advance to next

**Bleed Feedback**:
- If bleed detected: orange highlight on adjacent holes
- Status shows "BLEED - Focus your airflow"
- Note still counts if primary pitch is correct (reduced score)

---

### 4. Results Screen (Post-Lesson Modal)

**Purpose**: Celebrate progress, show improvement areas, drive retention

**Content**:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ★ ★ ☆                                │
│                  2 out of 3 stars                       │
│                                                         │
│              "Your First Draw Notes"                    │
│                   COMPLETED!                            │
│                                                         │
│    ┌─────────────┬─────────────┬─────────────┐         │
│    │  Accuracy   │   Clean %   │    Time     │         │
│    │    78%      │     65%     │   2:34      │         │
│    └─────────────┴─────────────┴─────────────┘         │
│                                                         │
│                   +50 XP earned                         │
│                                                         │
│    [Try Again]              [Next Lesson →]            │
│                                                         │
│    💡 Tip: "Try tilting your harmonica up slightly     │
│        for cleaner hole 2 draws"                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Star Thresholds**:
- ★☆☆: 60-74% accuracy
- ★★☆: 75-89% accuracy
- ★★★: 90%+ accuracy

**Contextual Tips**: Based on most common mistakes in lesson

---

### 5. Bending Gym (`/practice/bending`)

**Purpose**: Dedicated bend training with precision feedback

**"Landing the Plane" UI**:
```
┌─────────────────────────────────────────────────────────┐
│  [← Back]         Bending Gym - 4 Draw         [Level] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Target: D4 (half-step bend)                          │
│   ════════════════════════════════════  ← TARGET LINE  │
│                                                         │
│                         ✈️  ← YOUR PITCH               │
│                                                         │
│                                                         │
│   Natural D4  ─────────────────────────                │
│                                                         │
│   -50 cents   ════════════════════════  ← TARGET       │
│                                                         │
│   -100 cents  ─────────────────────────                │
│                                                         │
│              HOLD FOR: 2.3 / 3.0 seconds               │
│                                                         │
│    [← Prev Exercise]              [Next Exercise →]    │
└─────────────────────────────────────────────────────────┘
```

**Mechanics**:
- Plane (cursor) moves vertically based on detected pitch
- Target line = specific bend depth (e.g., -50 cents from natural)
- User must:
  1. Get plane into target zone (±15 cents)
  2. Hold position for 3 seconds
- Success = exercise complete, unlock next

**Exercise Progression**:
1. "Any bend" - just achieve any pitch drop
2. "Half-step bend" - hit -50 cents specifically
3. "Full-step bend" - hit -100 cents
4. "Bend in rhythm" - hit targets on beat

---

### 6. Free Play (`/practice/free`)

**Purpose**: Sandbox for experimentation, technique checking

**Features**:
- No scrolling tab, just live feedback
- Full harmonica diagram with real-time highlighting
- Shows: detected hole, direction, pitch (Hz), bend status
- Useful for: warming up, testing new harps, checking technique

---

### 7. Song Library (`/songs`)

**Purpose**: Apply skills to real music, drive engagement

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Song Library                          [Search 🔍]      │
├─────────────────────────────────────────────────────────┤
│  Filter: [All] [Easy] [Medium] [Hard]  [Folk] [Blues]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ 🎵 Mary Had a    │  │ 🎵 Oh Susanna    │            │
│  │    Little Lamb   │  │                  │            │
│  │ ★☆☆ Easy         │  │ ★★☆ Medium       │            │
│  │ Key: C  |  1:20  │  │ Key: C  |  2:15  │            │
│  │ [▶ Play]         │  │ [▶ Play]         │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ 🎵 Amazing Grace │  │ 🎵 Red River     │            │
│  │                  │  │    Valley        │            │
│  │ ★★☆ Medium       │  │ ★★☆ Medium       │            │
│  │ Key: C  |  3:00  │  │ Key: C  |  2:30  │            │
│  │ [▶ Play]         │  │ [▶ Play]         │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 8. Settings (`/settings`)

**Purpose**: Configure harmonica key, calibration, preferences

**Options**:
- **Harmonica Key**: C (default), A, G, D, E, F, Bb (dropdown)
- **Calibrate Microphone**: Re-run noise floor detection
- **Input Device**: Select mic if multiple available
- **Wait Mode Default**: On/Off
- **Theme**: Light/Dark (P2)

---

### 9. Progress Dashboard (`/progress`)

**Purpose**: Visualize progress, motivate continued practice

**Sections**:
1. **Level & XP**: Current level, XP bar to next level
2. **Streak**: Calendar view of practice days, current streak count
3. **Stats**:
   - Lessons completed
   - Songs mastered
   - Total practice time
   - Average accuracy trend
4. **Achievements**: Badge grid (First Note, First Bend, Week Streak, etc.)

---

## Standard Harmonica Learning Progression

Based on research from harmonica educators, this is the proven skill progression:

### Phase 1: Foundations (Weeks 1-4)
1. **Proper holding** - Grip, hand cupping for resonance
2. **Breathing control** - Diaphragm breathing, not chest
3. **Single notes** - Lip pursing or tongue blocking to isolate holes
4. **All 10 holes** - Comfortable with blow and draw on each

### Phase 2: Musicality (Weeks 5-12)
5. **Simple melodies** - First songs using middle octave
6. **Rhythm & timing** - Steady tempo, the "train" chug pattern
7. **Low notes** - Holes 1-3 (harder for beginners)
8. **High notes** - Holes 8-10

### Phase 3: Expression (Months 3-6)
9. **Bending** - Starting with 4-draw (easiest)
10. **Vibrato** - Hand, throat, or diaphragm techniques
11. **Tongue blocking** - For advanced articulation
12. **Playing by ear** - Recognizing notes and intervals

### Phase 4: Advanced (6+ months)
13. **All draw bends** - Holes 1-6 at various depths
14. **Blow bends** - Holes 7-10
15. **Positions** - 2nd position (cross harp) for blues
16. **Improvisation** - Blues scales, creating your own phrases

---

## Content Strategy (MVP)

### Curriculum Structure

**Branch 1: Fundamentals** (Unlocked by default)
| # | Lesson | Focus | Duration |
|---|--------|-------|----------|
| 1 | Welcome to Harmonica | Mic setup, key detection, hold position | 3 min |
| 2 | Your First Blow Notes | Holes 4, 5, 6 blow with feedback | 5 min |
| 3 | Your First Draw Notes | Holes 4, 5, 6 draw with feedback | 5 min |
| 4 | Clean Single Notes | Embouchure focus, bleed correction | 5 min |
| 5 | The Middle Octave | All blow notes 4-7 | 5 min |
| 6 | The Low Notes | Holes 1, 2, 3 (harder!) | 5 min |
| 7 | The High Notes | Holes 8, 9, 10 | 5 min |
| 8 | Breath & Rhythm | Chug pattern, breathing control | 5 min |
| 9 | The Train Rhythm | Blow-draw patterns with metronome | 5 min |
| 10 | Rhythm Variations | Syncopation, accents, dynamics | 5 min |

**Branch 2: Melodies** (Unlocks after Lesson 4)
| # | Song | Difficulty | Notes Used |
|---|------|------------|------------|
| 1 | Mary Had a Little Lamb | Easy | 4, 5, 6 |
| 2 | Twinkle Twinkle | Easy | 4, 5, 6, 7 |
| 3 | Oh Susanna | Medium | 4, 5, 6, 7 |
| 4 | Amazing Grace | Medium | 3, 4, 5, 6, 7 |
| 5 | When the Saints | Medium | 4, 5, 6, 7 |

**Branch 3: Bending** (Unlocks after Lesson 8)
| # | Lesson | Focus |
|---|--------|-------|
| 1 | What is Bending? | Theory, demonstration |
| 2 | Your First Bend (4-Draw) | Easiest bend, feel the drop |
| 3 | Bend Control | Hit specific targets |
| 4 | The 1-Draw Bend | Deep bend technique |
| 5 | The 3-Draw Bends | Multiple bend depths |
| 6 | Bending in Songs | Apply bends musically |

---

## Visual Design Direction

### Color System
| Element | Color | Hex |
|---------|-------|-----|
| Blow notes | Blue | #3B82F6 |
| Draw notes | Purple | #8B5CF6 |
| Correct | Green | #22C55E |
| Close | Yellow | #EAB308 |
| Wrong | Red | #EF4444 |
| Bleed warning | Orange | #F97316 |
| Background | Dark slate | #0F172A |
| Card background | Slate | #1E293B |

### Typography
- Headings: Bold, large, high contrast
- Hole numbers: Extra large (easy to read at glance)
- Body: Clean sans-serif (Inter or system)

### Responsive Priorities
1. Desktop landscape (primary development target)
2. Tablet landscape
3. Mobile landscape (lesson player)
4. Mobile portrait (navigation, results only)

---

## Gamification Details

### XP System
| Action | XP Reward |
|--------|-----------|
| Complete lesson (1 star) | 30 XP |
| Complete lesson (2 stars) | 50 XP |
| Complete lesson (3 stars) | 75 XP |
| Complete song | 50-100 XP based on difficulty |
| Daily login bonus | 10 XP |
| First practice of day | 25 XP |

### Levels
- Level 1: 0 XP (Beginner)
- Level 2: 100 XP
- Level 3: 250 XP
- Level 4: 500 XP
- Level 5: 1000 XP (Intermediate)
- ...continues exponentially

### Achievements
| Badge | Criteria |
|-------|----------|
| 🎵 First Note | Play any correct note |
| 🎯 Clean Player | Get 90%+ clean (no bleed) on a lesson |
| 🔥 On Fire | 7-day streak |
| 🌊 First Bend | Successfully bend any note |
| ⭐ Perfectionist | 3 stars on any lesson |
| 🏆 Fundamentals Master | Complete all Fundamentals lessons |

---

## Success Metrics (To Track)

1. **Activation Rate**: % of visitors who complete first lesson
2. **Day 1 Retention**: % who return next day
3. **Week 1 Retention**: % active after 7 days
4. **Lesson Completion Rate**: Average lessons completed per user
5. **Clean Note Progression**: Average bleed % improvement over time
6. **Bend Achievement Rate**: % of users who achieve first bend

---

## Technical Implementation (High Level)

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Runtime**: Bun
- **Styling**: Tailwind CSS + shadcn/ui
- **Audio**: Web Audio API + Pitchy library
- **State**: Zustand with localStorage persistence

### Core Technical Components
1. **AudioEngine**: Mic input, real-time pitch detection
2. **BleedDetector**: Spectral analysis for multi-note detection
3. **NoteMapper**: Frequency → harmonica hole mapping
4. **TabPlayer**: Scrolling tablature with wait mode logic
5. **ProgressStore**: Zustand store synced to localStorage

---

## Implementation Phases

### Phase 1: Audio Foundation
- Project setup (Next.js, Bun, Tailwind, shadcn)
- AudioEngine with mic permissions
- Pitch detection integration
- Note mapping for C harmonica
- Bleed detection algorithm

### Phase 2: Core UI
- Harmonica diagram component
- Horizontal scrolling tab component
- Real-time feedback display
- Lesson player with wait mode

### Phase 3: Curriculum & Progress
- Skill tree visualization
- Lesson data structure
- Progress persistence
- Results screen with scoring

### Phase 4: Content & Polish
- All MVP lesson content
- Song library
- Bending gym
- Settings page
- Gamification (XP, streaks, achievements)

### Phase 5: Testing & Launch
- Cross-browser testing
- Mobile testing
- Performance optimization
- Deployment

---

## Verification Plan

### Manual Testing Checklist
- [ ] Mic permission grant/deny flows work
- [ ] Each hole 1-10 blow/draw detected correctly (C harmonica)
- [ ] Bending detection shows cents deviation
- [ ] Bleed detected when playing 2+ holes
- [ ] Wait mode pauses and advances correctly
- [ ] Metronome BPM adjusts correctly (40-200)
- [ ] Metronome visual beat indicator syncs with audio
- [ ] Count-in works before exercise start
- [ ] Tempo control slows/speeds playback correctly
- [ ] Progress saves and persists across refresh
- [ ] Skill tree unlocks work based on prerequisites
- [ ] Star ratings calculate correctly
- [ ] Works in Chrome, Safari, Firefox
- [ ] Responsive on tablet and mobile landscape
