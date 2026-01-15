import type { Direction } from "@/lib/audio";

/**
 * A riff pattern - short repeatable phrases for practice
 */
export interface Riff {
  id: string;
  name: string;
  description: string;
  category: "blues" | "folk" | "rhythm" | "expression";
  difficulty: 1 | 2 | 3; // 1 = easy, 3 = hard
  requiresBend: boolean;
  pattern: RiffNote[];
  tips: string[];
  audioDemo?: string; // URL to demo audio
}

export interface RiffNote {
  hole: number;
  direction: Direction;
  duration: number; // beats
  bend?: number; // semitones
}

/**
 * Blues riffs - the heart of harmonica playing
 * Based on research from harmonicalessons.com and tomlinharmonicalessons.com
 */
export const RIFFS: Riff[] = [
  // ============ ESSENTIAL BLUES RIFFS ============
  {
    id: "warble-45",
    name: "-4/-5 Warble",
    description: "THE #1 most important blues riff - alternating quickly between -4 and -5",
    category: "blues",
    difficulty: 1,
    requiresBend: false,
    pattern: [
      { hole: 4, direction: "draw", duration: 0.25 },
      { hole: 5, direction: "draw", duration: 0.25 },
      { hole: 4, direction: "draw", duration: 0.25 },
      { hole: 5, direction: "draw", duration: 0.25 },
      { hole: 4, direction: "draw", duration: 0.25 },
      { hole: 5, direction: "draw", duration: 0.25 },
      { hole: 4, direction: "draw", duration: 0.25 },
      { hole: 5, direction: "draw", duration: 0.25 },
      // Repeat with emphasis
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
    ],
    tips: [
      "Nothing excites a crowd like the -45 warble!",
      "Keep your mouth loose and let the holes blur together",
      "Put ALL your emotion into it",
    ],
  },
  {
    id: "train-chug",
    name: "Train Chug",
    description: "The classic chug-a-chug rhythm that sounds like a steam train",
    category: "rhythm",
    difficulty: 1,
    requiresBend: false,
    pattern: [
      { hole: 1, direction: "blow", duration: 0.5 },
      { hole: 2, direction: "draw", duration: 0.25 },
      { hole: 1, direction: "blow", duration: 0.25 },
      { hole: 2, direction: "draw", duration: 0.5 },
      { hole: 1, direction: "blow", duration: 0.5 },
      { hole: 2, direction: "draw", duration: 0.25 },
      { hole: 1, direction: "blow", duration: 0.25 },
      { hole: 2, direction: "draw", duration: 0.5 },
    ],
    tips: [
      "Listen for the 'chug-a-chug-a' train sound",
      "Keep breathing rhythmic like a steam engine",
      "This is the foundation of train songs!",
    ],
  },
  {
    id: "boogie-woogie",
    name: "Boogie Woogie",
    description: "Upbeat, driving rhythm pattern for fast blues",
    category: "rhythm",
    difficulty: 2,
    requiresBend: false,
    pattern: [
      { hole: 2, direction: "draw", duration: 0.5 },
      { hole: 3, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 3, direction: "draw", duration: 0.5 },
      { hole: 2, direction: "draw", duration: 0.5 },
      { hole: 3, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 3, direction: "draw", duration: 0.5 },
    ],
    tips: [
      "Think John Lee Hooker style",
      "Keep it driving and relentless",
      "Let your foot tap the beat",
    ],
  },
  {
    id: "v-iv-i-turnaround",
    name: "V-IV-I Turnaround",
    description: "Essential blues ending pattern - last 4 bars of 12-bar blues",
    category: "blues",
    difficulty: 2,
    requiresBend: true,
    pattern: [
      // V chord
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "draw", duration: 0.5, bend: -1 },
      { hole: 4, direction: "draw", duration: 0.5 },
      // IV chord
      { hole: 3, direction: "draw", duration: 0.5, bend: -1 },
      { hole: 3, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 1 },
      // I chord
      { hole: 2, direction: "draw", duration: 1 },
      { hole: 1, direction: "draw", duration: 1, bend: -1 },
      { hole: 1, direction: "draw", duration: 2 },
    ],
    tips: [
      "This is how blues songs END",
      "The bends add the 'cry' to the phrase",
      "Practice following the chord changes",
    ],
  },
  {
    id: "wailing-lick",
    name: "Wailing Lick",
    description: "Expressive bent note pattern that makes harmonicas 'cry'",
    category: "expression",
    difficulty: 3,
    requiresBend: true,
    pattern: [
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 1, bend: -1 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 3, direction: "draw", duration: 0.5, bend: -2 },
      { hole: 3, direction: "draw", duration: 0.5, bend: -1 },
      { hole: 3, direction: "draw", duration: 1 },
      { hole: 2, direction: "draw", duration: 2 },
    ],
    tips: [
      "Let the bends 'cry' - don't rush",
      "This is pure emotion in riff form",
      "Try varying the bend depth for expression",
    ],
  },
  {
    id: "tongue-slap",
    name: "Tongue Slap Accent",
    description: "Percussive technique using tongue blocking for rhythm",
    category: "rhythm",
    difficulty: 2,
    requiresBend: false,
    pattern: [
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
    ],
    tips: [
      "Use your tongue to slap and lift",
      "Creates a chunky, rhythmic sound",
      "Essential for Chicago blues style",
    ],
  },
  {
    id: "octave-split",
    name: "Octave Split",
    description: "Play two notes an octave apart for a full, rich sound",
    category: "expression",
    difficulty: 3,
    requiresBend: false,
    pattern: [
      { hole: 1, direction: "blow", duration: 2 },
      { hole: 4, direction: "blow", duration: 2 },
      { hole: 1, direction: "draw", duration: 2 },
      { hole: 4, direction: "draw", duration: 2 },
    ],
    tips: [
      "Block the middle holes with your tongue",
      "Both notes should sound equally",
      "Creates a big, full harmonica sound",
    ],
  },
  {
    id: "simple-shuffle",
    name: "Simple Shuffle",
    description: "Basic swing rhythm that underlies most blues",
    category: "rhythm",
    difficulty: 1,
    requiresBend: false,
    pattern: [
      { hole: 4, direction: "blow", duration: 0.75 },
      { hole: 4, direction: "draw", duration: 0.25 },
      { hole: 4, direction: "blow", duration: 0.75 },
      { hole: 4, direction: "draw", duration: 0.25 },
      { hole: 5, direction: "blow", duration: 0.75 },
      { hole: 5, direction: "draw", duration: 0.25 },
      { hole: 5, direction: "blow", duration: 0.75 },
      { hole: 5, direction: "draw", duration: 0.25 },
    ],
    tips: [
      "Long-short, long-short rhythm",
      "This is the 'swing' in swing blues",
      "Accent the long notes slightly",
    ],
  },
];

/**
 * Get riffs by category
 */
export function getRiffsByCategory(category: Riff["category"]): Riff[] {
  return RIFFS.filter((riff) => riff.category === category);
}

/**
 * Get riffs by difficulty
 */
export function getRiffsByDifficulty(difficulty: 1 | 2 | 3): Riff[] {
  return RIFFS.filter((riff) => riff.difficulty === difficulty);
}

/**
 * Get riffs that don't require bending (for beginners)
 */
export function getBeginnnerRiffs(): Riff[] {
  return RIFFS.filter((riff) => !riff.requiresBend);
}
