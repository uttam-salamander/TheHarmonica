/**
 * Tests for progressStore - User progress state management
 * @module progressStore.test
 */

import { describe, expect, test, beforeEach } from "bun:test";
import type { LessonResult } from "@/lib/lessons";

/* eslint-disable @typescript-eslint/no-unused-vars */

// Mock localStorage before importing the store
const localStorageStore: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: (key: string): string | null => localStorageStore[key] || null,
  setItem: (key: string, value: string): void => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string): void => {
    delete localStorageStore[key];
  },
  clear: (): void => {
    Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key]);
  },
  length: 0,
  key: (index: number): string | null => null,
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Import after setting up mocks
import { useProgressStore } from "@/stores/progressStore";

describe("progressStore", () => {
  beforeEach(() => {
    // Clear localStorage and reset store state
    localStorageMock.clear();

    // Reset the store to initial state
    useProgressStore.setState({
      level: 1,
      xp: 0,
      streak: 0,
      lastPracticeDate: null,
      lessonProgress: {},
      achievements: new Set<string>(),
      completedLessons: new Set<string>(),
    });
  });

  describe("initial state", () => {
    test("starts with level 1", () => {
      expect(useProgressStore.getState().level).toBe(1);
    });

    test("starts with 0 XP", () => {
      expect(useProgressStore.getState().xp).toBe(0);
    });

    test("starts with 0 streak", () => {
      expect(useProgressStore.getState().streak).toBe(0);
    });

    test("starts with null lastPracticeDate", () => {
      expect(useProgressStore.getState().lastPracticeDate).toBeNull();
    });

    test("starts with empty lessonProgress", () => {
      expect(Object.keys(useProgressStore.getState().lessonProgress).length).toBe(0);
    });

    test("starts with empty achievements Set", () => {
      expect(useProgressStore.getState().achievements.size).toBe(0);
    });

    test("starts with empty completedLessons Set", () => {
      expect(useProgressStore.getState().completedLessons.size).toBe(0);
    });
  });

  describe("recordLessonResult", () => {
    const createResult = (overrides: Partial<LessonResult> = {}): LessonResult => ({
      lessonId: "fund-1",
      accuracy: 85,
      cleanPercent: 90,
      totalNotes: 10,
      correctNotes: 8,
      missedNotes: 2,
      bleedCount: 1,
      duration: 60,
      xpEarned: 50,
      stars: 2,
      ...overrides,
    });

    test("adds XP to total", () => {
      const result = createResult({ xpEarned: 50 });
      useProgressStore.getState().recordLessonResult(result);
      expect(useProgressStore.getState().xp).toBe(50);
    });

    test("accumulates XP from multiple lessons", () => {
      useProgressStore.getState().recordLessonResult(createResult({ xpEarned: 50 }));
      useProgressStore.getState().recordLessonResult(createResult({ lessonId: "fund-2", xpEarned: 30 }));
      expect(useProgressStore.getState().xp).toBe(80);
    });

    test("updates level based on XP", () => {
      // Level 2 requires 100 XP
      useProgressStore.getState().recordLessonResult(createResult({ xpEarned: 110 }));
      expect(useProgressStore.getState().level).toBe(2);
    });

    test("creates lesson progress entry", () => {
      const result = createResult({ lessonId: "fund-1", accuracy: 85, stars: 2 });
      useProgressStore.getState().recordLessonResult(result);

      const progress = useProgressStore.getState().lessonProgress["fund-1"];
      expect(progress).toBeDefined();
      expect(progress.lessonId).toBe("fund-1");
      expect(progress.completed).toBe(true);
      expect(progress.stars).toBe(2);
      expect(progress.bestAccuracy).toBe(85);
      expect(progress.attempts).toBe(1);
    });

    test("updates best accuracy when improving", () => {
      useProgressStore.getState().recordLessonResult(createResult({ accuracy: 70 }));
      useProgressStore.getState().recordLessonResult(createResult({ accuracy: 85 }));

      expect(useProgressStore.getState().lessonProgress["fund-1"].bestAccuracy).toBe(85);
    });

    test("keeps best accuracy when not improving", () => {
      useProgressStore.getState().recordLessonResult(createResult({ accuracy: 90 }));
      useProgressStore.getState().recordLessonResult(createResult({ accuracy: 70 }));

      expect(useProgressStore.getState().lessonProgress["fund-1"].bestAccuracy).toBe(90);
    });

    test("updates best stars when improving", () => {
      useProgressStore.getState().recordLessonResult(createResult({ stars: 1 }));
      useProgressStore.getState().recordLessonResult(createResult({ stars: 3 }));

      expect(useProgressStore.getState().lessonProgress["fund-1"].stars).toBe(3);
    });

    test("increments attempt count", () => {
      useProgressStore.getState().recordLessonResult(createResult());
      useProgressStore.getState().recordLessonResult(createResult());
      useProgressStore.getState().recordLessonResult(createResult());

      expect(useProgressStore.getState().lessonProgress["fund-1"].attempts).toBe(3);
    });

    test("adds lesson to completedLessons set", () => {
      useProgressStore.getState().recordLessonResult(createResult({ lessonId: "fund-1" }));
      expect(useProgressStore.getState().completedLessons.has("fund-1")).toBe(true);
    });

    describe("achievements", () => {
      test("unlocks first-note achievement when correctNotes > 0", () => {
        useProgressStore.getState().recordLessonResult(createResult({ correctNotes: 1 }));
        expect(useProgressStore.getState().achievements.has("first-note")).toBe(true);
      });

      test("does not unlock first-note when correctNotes = 0", () => {
        useProgressStore.getState().recordLessonResult(createResult({ correctNotes: 0 }));
        expect(useProgressStore.getState().achievements.has("first-note")).toBe(false);
      });

      test("unlocks clean-player achievement when cleanPercent >= 90", () => {
        useProgressStore.getState().recordLessonResult(createResult({ cleanPercent: 90 }));
        expect(useProgressStore.getState().achievements.has("clean-player")).toBe(true);
      });

      test("unlocks perfectionist achievement when stars = 3", () => {
        useProgressStore.getState().recordLessonResult(createResult({ stars: 3 }));
        expect(useProgressStore.getState().achievements.has("perfectionist")).toBe(true);
      });

      test("unlocks first-bend achievement for bending lesson with good accuracy", () => {
        useProgressStore.getState().recordLessonResult(
          createResult({ lessonId: "bend-1", accuracy: 60 })
        );
        expect(useProgressStore.getState().achievements.has("first-bend")).toBe(true);
      });
    });
  });

  describe("updateStreak", () => {
    const getTodayString = () => new Date().toISOString().split("T")[0];
    const getYesterdayString = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split("T")[0];
    };
    const getTwoDaysAgoString = () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      return twoDaysAgo.toISOString().split("T")[0];
    };

    test("sets streak to 1 on first practice", () => {
      useProgressStore.getState().updateStreak();
      expect(useProgressStore.getState().streak).toBe(1);
    });

    test("sets lastPracticeDate to today", () => {
      useProgressStore.getState().updateStreak();
      expect(useProgressStore.getState().lastPracticeDate).toBe(getTodayString());
    });

    test("does not increment streak if already practiced today", () => {
      useProgressStore.getState().updateStreak();
      useProgressStore.getState().updateStreak();
      expect(useProgressStore.getState().streak).toBe(1);
    });

    test("increments streak when practiced yesterday", () => {
      useProgressStore.setState({
        streak: 5,
        lastPracticeDate: getYesterdayString(),
      });

      useProgressStore.getState().updateStreak();
      expect(useProgressStore.getState().streak).toBe(6);
    });

    test("resets streak to 1 when gap in practice", () => {
      useProgressStore.setState({
        streak: 10,
        lastPracticeDate: getTwoDaysAgoString(),
      });

      useProgressStore.getState().updateStreak();
      expect(useProgressStore.getState().streak).toBe(1);
    });

    test("unlocks on-fire achievement at 7+ day streak", () => {
      useProgressStore.setState({
        streak: 6,
        lastPracticeDate: getYesterdayString(),
      });

      useProgressStore.getState().updateStreak();
      expect(useProgressStore.getState().streak).toBe(7);
      expect(useProgressStore.getState().achievements.has("on-fire")).toBe(true);
    });
  });

  describe("unlockAchievement", () => {
    test("adds new achievement", () => {
      useProgressStore.getState().unlockAchievement("custom-achievement");
      expect(useProgressStore.getState().achievements.has("custom-achievement")).toBe(true);
    });

    test("does not duplicate existing achievement", () => {
      useProgressStore.getState().unlockAchievement("test");
      useProgressStore.getState().unlockAchievement("test");

      expect(
        Array.from(useProgressStore.getState().achievements).filter((a) => a === "test").length
      ).toBe(1);
    });
  });

  describe("getXPToNextLevel", () => {
    test("returns XP needed for level 2 at level 1", () => {
      expect(useProgressStore.getState().getXPToNextLevel()).toBe(100);
    });

    test("returns remaining XP after earning some", () => {
      useProgressStore.setState({ xp: 30 });
      expect(useProgressStore.getState().getXPToNextLevel()).toBe(70);
    });
  });

  describe("getLevelTitle", () => {
    test("returns Beginner for level 1-2", () => {
      useProgressStore.setState({ level: 1 });
      expect(useProgressStore.getState().getLevelTitle()).toBe("Beginner");
      useProgressStore.setState({ level: 2 });
      expect(useProgressStore.getState().getLevelTitle()).toBe("Beginner");
    });

    test("returns Novice for level 3-4", () => {
      useProgressStore.setState({ level: 3 });
      expect(useProgressStore.getState().getLevelTitle()).toBe("Novice");
    });

    test("returns Expert for level 9+", () => {
      useProgressStore.setState({ level: 9 });
      expect(useProgressStore.getState().getLevelTitle()).toBe("Expert");
    });
  });
});
