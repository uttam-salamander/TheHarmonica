import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LessonProgress, LessonResult } from "@/lib/lessons";
import { CURRICULUM } from "@/lib/lessons";

interface ProgressState {
  // User stats
  level: number;
  xp: number;
  streak: number;
  lastPracticeDate: string | null; // ISO date string

  // Lesson progress
  lessonProgress: Record<string, LessonProgress>;

  // Achievements
  achievements: Set<string>;

  // Computed
  completedLessons: Set<string>;

  // Actions
  recordLessonResult: (result: LessonResult) => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;
  getXPToNextLevel: () => number;
  getLevelTitle: () => string;
}

// XP required for each level
const LEVEL_XP = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];
const FUNDAMENTAL_LESSON_IDS = CURRICULUM
  .filter((lesson) => lesson.branch === "fundamentals")
  .map((lesson) => lesson.id);

function getLevel(xp: number): number {
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) return i + 1;
  }
  return 1;
}

function getXPForNextLevel(currentXP: number): number {
  const level = getLevel(currentXP);
  if (level >= LEVEL_XP.length) return 0;
  return LEVEL_XP[level] - currentXP;
}

function getLevelName(level: number): string {
  if (level <= 2) return "Beginner";
  if (level <= 4) return "Novice";
  if (level <= 6) return "Intermediate";
  if (level <= 8) return "Advanced";
  return "Expert";
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayString(): string {
  return formatLocalDate(new Date());
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      level: 1,
      xp: 0,
      streak: 0,
      lastPracticeDate: null,
      lessonProgress: {},
      achievements: new Set<string>(),
      completedLessons: new Set<string>(),

      recordLessonResult: (result: LessonResult) => {
        const state = get();
        const existing = state.lessonProgress[result.lessonId];

        // Update lesson progress
        const newProgress: LessonProgress = {
          lessonId: result.lessonId,
          completed: true,
          stars: Math.max(existing?.stars ?? 0, result.stars) as 0 | 1 | 2 | 3,
          bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, result.accuracy),
          bestCleanPercent: Math.max(
            existing?.bestCleanPercent ?? 0,
            result.cleanPercent
          ),
          attempts: (existing?.attempts ?? 0) + 1,
          lastAttemptAt: Date.now(),
        };

        // Calculate new XP
        const newXP = state.xp + result.xpEarned;
        const newLevel = getLevel(newXP);

        // Update completed lessons set
        const newCompleted = new Set(state.completedLessons);
        newCompleted.add(result.lessonId);

        // Check for achievements
        const newAchievements = new Set(state.achievements);

        // First note achievement
        if (result.correctNotes > 0 && !state.achievements.has("first-note")) {
          newAchievements.add("first-note");
        }

        // Clean player achievement (90%+ clean)
        if (result.cleanPercent >= 90 && !state.achievements.has("clean-player")) {
          newAchievements.add("clean-player");
        }

        // Perfectionist (3 stars)
        if (result.stars === 3 && !state.achievements.has("perfectionist")) {
          newAchievements.add("perfectionist");
        }

        // First bend (check if lesson is bending)
        if (
          result.lessonId.startsWith("bend-") &&
          result.accuracy >= 60 &&
          !state.achievements.has("first-bend")
        ) {
          newAchievements.add("first-bend");
        }

        // Fundamentals master achievement
        if (!state.achievements.has("fundamentals")) {
          const allFundamentalsComplete = FUNDAMENTAL_LESSON_IDS.every((lessonId) =>
            newCompleted.has(lessonId)
          );
          if (allFundamentalsComplete) {
            newAchievements.add("fundamentals");
          }
        }

        set({
          xp: newXP,
          level: newLevel,
          lessonProgress: {
            ...state.lessonProgress,
            [result.lessonId]: newProgress,
          },
          completedLessons: newCompleted,
          achievements: newAchievements,
        });
      },

      updateStreak: () => {
        const state = get();
        const today = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = formatLocalDate(yesterday);

        if (state.lastPracticeDate === today) {
          // Already practiced today
          return;
        }

        if (state.lastPracticeDate === yesterdayString) {
          // Continuing streak
          const newStreak = state.streak + 1;
          const newAchievements = new Set(state.achievements);

          // Check streak achievement
          if (newStreak >= 7 && !state.achievements.has("on-fire")) {
            newAchievements.add("on-fire");
          }

          set({
            streak: newStreak,
            lastPracticeDate: today,
            achievements: newAchievements,
          });
        } else {
          // Streak broken
          set({
            streak: 1,
            lastPracticeDate: today,
          });
        }
      },

      unlockAchievement: (id: string) => {
        const state = get();
        if (state.achievements.has(id)) return;

        const newAchievements = new Set(state.achievements);
        newAchievements.add(id);
        set({ achievements: newAchievements });
      },

      getXPToNextLevel: () => {
        return getXPForNextLevel(get().xp);
      },

      getLevelTitle: () => {
        return getLevelName(get().level);
      },
    }),
    {
      name: "harpflow-progress",
      // Custom serialization for Sets
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              achievements: new Set(parsed.state.achievements || []),
              completedLessons: new Set(parsed.state.completedLessons || []),
            },
          };
        },
        setItem: (name, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              achievements: Array.from(value.state.achievements || []),
              completedLessons: Array.from(value.state.completedLessons || []),
            },
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
