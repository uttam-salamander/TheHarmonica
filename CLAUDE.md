# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HarpFlow is a harmonica learning web app that provides real-time visual feedback on playing technique using pitch detection. The app helps beginners learn clean single notes and bending through interactive lessons with wait-mode tablature.

## Commands

```bash
bun dev              # Start dev server with Turbopack
bun run build        # Production build
bun run lint         # ESLint
bun run typecheck    # TypeScript check (tsc --noEmit)
bun run verify       # Run typecheck, lint, and tests

bun test             # Run all tests
bun test --watch     # Watch mode
bun test <pattern>   # Run specific tests (e.g., bun test NoteMapper)
```

## Tech Stack

- **Framework**: Next.js 16.1 with App Router
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 with CSS-first `@theme` configuration in `globals.css`
- **State**: Zustand with localStorage persistence
- **Audio**: Web Audio API + Pitchy for pitch detection
- **UI**: lucide-react icons, clsx + tailwind-merge via `cn()` helper

## Architecture

### Audio Pipeline

The real-time pitch detection flows through three layers:

```
Microphone → AudioEngine → NoteMapper → BleedDetector
                ↓              ↓              ↓
           frequency      HarmonicaNote    BleedResult
             Hz           hole/direction    isClean
```

- **AudioEngine** (`src/lib/audio/AudioEngine.ts`): Manages Web Audio API, pitch detection via Pitchy
- **NoteMapper** (`src/lib/audio/NoteMapper.ts`): Converts frequency → harmonica hole (1-10) + direction (blow/draw), handles bends
- **BleedDetector** (`src/lib/audio/BleedDetector.ts`): Spectral analysis to detect multi-note bleed

### State Management

Two Zustand stores manage global state:

- **audioStore** (`src/stores/audioStore.ts`): Real-time audio state (engineState, currentNote, frequency, bleedResult). Not persisted.
- **progressStore** (`src/stores/progressStore.ts`): User progress (level, XP, streak, lessonProgress, achievements). Persisted to localStorage.

Components access audio via the `useAudio()` hook which wraps the audioStore.

### Content Libraries

- **Curriculum** (`src/lib/lessons/curriculum.ts`): Structured lessons with prerequisites, organized by branch (fundamentals/melodies/bending)
- **Riffs** (`src/lib/riffs/index.ts`): Practice patterns categorized by style (blues/rhythm/expression) and difficulty
- **Techniques** (`src/lib/techniques/index.ts`): Technique exercises, workouts, and backing tracks

### Color Semantics

Custom colors in `globals.css` using Tailwind v4 `@theme`:
- `blow` (blue) / `draw` (purple) - note direction
- `correct` (green) / `close` (yellow) / `wrong` (red) - feedback states
- `bleed` (orange) - multi-hole warning

## Code Conventions

- Use `@/*` path alias for imports from `src/`
- Use `cn()` from `@/lib/utils` for conditional class merging
- TypeScript strict mode enabled
- Tests use Bun test runner with happy-dom for DOM mocking
