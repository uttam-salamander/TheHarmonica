import type { Direction } from "@/lib/audio";

/**
 * A single note in a lesson's tablature
 */
export interface TabNote {
  hole: number; // 1-10
  direction: Direction;
  duration: number; // beats (1 = quarter note, 0.5 = eighth, etc.)
  bend?: number; // semitones to bend (negative for draw bends)
}

/**
 * A lesson in the curriculum
 */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  branch: "fundamentals" | "melodies" | "bending";
  order: number; // Position within branch
  prerequisites: string[]; // Lesson IDs that must be completed first
  bpm: number; // Default tempo
  timeSignature: [number, number]; // e.g., [4, 4] for 4/4
  tablature: TabNote[];
  tips: string[]; // Contextual tips shown during/after lesson
}

/**
 * User's progress on a specific lesson
 */
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  bestAccuracy: number; // 0-100
  bestCleanPercent: number; // 0-100 (no bleed)
  attempts: number;
  lastAttemptAt: number; // timestamp
}

/**
 * Result of completing a lesson attempt
 */
export interface LessonResult {
  lessonId: string;
  accuracy: number; // 0-100
  cleanPercent: number; // 0-100
  totalNotes: number;
  correctNotes: number;
  missedNotes: number;
  bleedCount: number;
  duration: number; // seconds
  xpEarned: number;
  stars: 1 | 2 | 3;
}

/**
 * Calculate stars from accuracy
 */
export function calculateStars(accuracy: number): 1 | 2 | 3 {
  if (accuracy >= 90) return 3;
  if (accuracy >= 75) return 2;
  return 1;
}

/**
 * Calculate XP from lesson result
 */
export function calculateXP(stars: 1 | 2 | 3, isFirstCompletion: boolean): number {
  const baseXP = stars === 3 ? 75 : stars === 2 ? 50 : 30;
  return isFirstCompletion ? baseXP : Math.floor(baseXP * 0.5);
}
