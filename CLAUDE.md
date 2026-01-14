# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HarpFlow is a harmonica learning web app that provides real-time visual feedback on playing technique using pitch detection. The app helps beginners learn clean single notes and bending through interactive lessons with wait-mode tablature.

## Commands

```bash
bun dev          # Start dev server with Turbopack
bun run build    # Production build
bun run lint     # ESLint (flat config in eslint.config.mjs)
bun run typecheck # TypeScript check (tsc --noEmit)
bun run verify   # Run both typecheck and lint
```

## Tech Stack

- **Framework**: Next.js 16.1 with App Router (page routing in `src/app/`)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 with CSS-first `@theme` configuration in `globals.css`
- **State**: Zustand with localStorage persistence
- **Audio**: Web Audio API + Pitchy for pitch detection
- **UI**: lucide-react icons, clsx + tailwind-merge via `cn()` helper

## Architecture

### Routing Structure

```
src/app/
├── page.tsx              # Landing page
├── learn/
│   ├── page.tsx          # Skill tree / lesson selection
│   └── [lessonId]/page.tsx  # Lesson player with wait-mode
├── practice/
│   ├── bending/page.tsx  # Bending gym with pitch targeting
│   └── free/page.tsx     # Free play sandbox
├── songs/
│   ├── page.tsx          # Song library
│   └── [songId]/page.tsx # Song player
├── progress/page.tsx     # Stats and achievements
└── settings/page.tsx     # Harmonica key, calibration
```

### Planned Core Components

- **AudioEngine**: Mic input, real-time pitch detection
- **NoteMapper**: Frequency → harmonica hole (1-10) + direction (blow/draw)
- **BleedDetector**: Spectral analysis for multi-note detection
- **TabPlayer**: Horizontal scrolling tablature with wait mode

### Color Semantics

Custom colors defined in `globals.css` using Tailwind v4 `@theme`:
- `blow` (blue #3B82F6) - blow notes
- `draw` (purple #8B5CF6) - draw notes
- `correct` (green) / `close` (yellow) / `wrong` (red) - feedback states
- `bleed` (orange) - multi-hole warning

## Code Conventions

- Use `@/*` path alias for imports from `src/`
- Use `cn()` from `@/lib/utils` for conditional class merging
- TypeScript strict mode is enabled
