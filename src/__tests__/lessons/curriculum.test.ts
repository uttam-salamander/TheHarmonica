/**
 * Tests for Curriculum - Lesson data and helper functions
 * @module curriculum.test
 */

import { describe, expect, test } from "bun:test";
import {
  CURRICULUM,
  getLessonById,
  getLessonsByBranch,
  isLessonAvailable,
} from "@/lib/lessons/curriculum";

describe("CURRICULUM data validation", () => {
  test("curriculum is not empty", () => {
    expect(CURRICULUM.length).toBeGreaterThan(0);
  });

  test("all lessons have unique IDs", () => {
    const ids = CURRICULUM.map((lesson) => lesson.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all lessons have required properties", () => {
    CURRICULUM.forEach((lesson) => {
      expect(lesson.id).toBeDefined();
      expect(lesson.id.length).toBeGreaterThan(0);
      expect(lesson.title).toBeDefined();
      expect(lesson.title.length).toBeGreaterThan(0);
      expect(lesson.description).toBeDefined();
      expect(lesson.description.length).toBeGreaterThan(0);
      expect(["fundamentals", "melodies", "bending"]).toContain(lesson.branch);
      expect(lesson.order).toBeGreaterThan(0);
      expect(Array.isArray(lesson.prerequisites)).toBe(true);
      expect(lesson.bpm).toBeGreaterThan(0);
      expect(Array.isArray(lesson.timeSignature)).toBe(true);
      expect(lesson.timeSignature.length).toBe(2);
      expect(Array.isArray(lesson.tablature)).toBe(true);
      expect(lesson.tablature.length).toBeGreaterThan(0);
      expect(Array.isArray(lesson.tips)).toBe(true);
    });
  });

  test("all prerequisite references are valid lesson IDs", () => {
    const allIds = new Set(CURRICULUM.map((lesson) => lesson.id));

    CURRICULUM.forEach((lesson) => {
      lesson.prerequisites.forEach((prereq) => {
        expect(allIds.has(prereq)).toBe(true);
      });
    });
  });

  test("no circular dependencies in prerequisites", () => {
    const dependencyMap = new Map<string, string[]>();
    CURRICULUM.forEach((lesson) => {
      dependencyMap.set(lesson.id, lesson.prerequisites);
    });

    // Check for cycles using DFS
    function hasCycle(id: string, visited: Set<string>, path: Set<string>): boolean {
      if (path.has(id)) return true;
      if (visited.has(id)) return false;

      visited.add(id);
      path.add(id);

      const deps = dependencyMap.get(id) || [];
      for (const dep of deps) {
        if (hasCycle(dep, visited, path)) return true;
      }

      path.delete(id);
      return false;
    }

    CURRICULUM.forEach((lesson) => {
      const hasCyclic = hasCycle(lesson.id, new Set(), new Set());
      expect(hasCyclic).toBe(false);
    });
  });

  test("tablature notes have valid hole numbers (1-10)", () => {
    CURRICULUM.forEach((lesson) => {
      lesson.tablature.forEach((note) => {
        expect(note.hole).toBeGreaterThanOrEqual(1);
        expect(note.hole).toBeLessThanOrEqual(10);
      });
    });
  });

  test("tablature notes have valid direction", () => {
    CURRICULUM.forEach((lesson) => {
      lesson.tablature.forEach((note) => {
        expect(["blow", "draw"]).toContain(note.direction);
      });
    });
  });

  test("tablature notes have positive duration", () => {
    CURRICULUM.forEach((lesson) => {
      lesson.tablature.forEach((note) => {
        expect(note.duration).toBeGreaterThan(0);
      });
    });
  });

  test("bending lessons have bend notes", () => {
    const bendingLessons = CURRICULUM.filter((l) => l.branch === "bending");
    expect(bendingLessons.length).toBeGreaterThan(0);

    bendingLessons.forEach((lesson) => {
      const hasBendNote = lesson.tablature.some((note) => note.bend !== undefined);
      expect(hasBendNote).toBe(true);
    });
  });

  test("fundamentals lessons have no bend notes", () => {
    const fundamentalsLessons = CURRICULUM.filter((l) => l.branch === "fundamentals");

    fundamentalsLessons.forEach((lesson) => {
      lesson.tablature.forEach((note) => {
        expect(note.bend).toBeUndefined();
      });
    });
  });
});

describe("getLessonById", () => {
  test("returns lesson for valid ID", () => {
    const lesson = getLessonById("fund-1");
    expect(lesson).toBeDefined();
    expect(lesson!.id).toBe("fund-1");
    expect(lesson!.title).toBe("Your First Blow Notes");
  });

  test("returns undefined for invalid ID", () => {
    expect(getLessonById("nonexistent")).toBeUndefined();
  });

  test("returns undefined for empty string", () => {
    expect(getLessonById("")).toBeUndefined();
  });

  test("is case-sensitive", () => {
    expect(getLessonById("FUND-1")).toBeUndefined();
    expect(getLessonById("Fund-1")).toBeUndefined();
  });

  test("finds all curriculum lessons by ID", () => {
    CURRICULUM.forEach((lesson) => {
      const found = getLessonById(lesson.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(lesson.id);
    });
  });
});

describe("getLessonsByBranch", () => {
  test("returns fundamentals lessons sorted by order", () => {
    const fundamentals = getLessonsByBranch("fundamentals");
    expect(fundamentals.length).toBeGreaterThan(0);

    fundamentals.forEach((lesson) => {
      expect(lesson.branch).toBe("fundamentals");
    });

    // Check sorted by order
    for (let i = 1; i < fundamentals.length; i++) {
      expect(fundamentals[i].order).toBeGreaterThan(fundamentals[i - 1].order);
    }
  });

  test("returns melodies lessons sorted by order", () => {
    const melodies = getLessonsByBranch("melodies");
    expect(melodies.length).toBeGreaterThan(0);

    melodies.forEach((lesson) => {
      expect(lesson.branch).toBe("melodies");
    });

    for (let i = 1; i < melodies.length; i++) {
      expect(melodies[i].order).toBeGreaterThan(melodies[i - 1].order);
    }
  });

  test("returns bending lessons sorted by order", () => {
    const bending = getLessonsByBranch("bending");
    expect(bending.length).toBeGreaterThan(0);

    bending.forEach((lesson) => {
      expect(lesson.branch).toBe("bending");
    });

    for (let i = 1; i < bending.length; i++) {
      expect(bending[i].order).toBeGreaterThan(bending[i - 1].order);
    }
  });

  test("total lessons equals sum of all branches", () => {
    const fundamentals = getLessonsByBranch("fundamentals");
    const melodies = getLessonsByBranch("melodies");
    const bending = getLessonsByBranch("bending");

    expect(fundamentals.length + melodies.length + bending.length).toBe(
      CURRICULUM.length
    );
  });
});

describe("isLessonAvailable", () => {
  test("first lesson (no prerequisites) is always available", () => {
    const emptyCompleted = new Set<string>();
    expect(isLessonAvailable("fund-1", emptyCompleted)).toBe(true);
  });

  test("lesson with unmet prerequisites is unavailable", () => {
    const emptyCompleted = new Set<string>();
    // fund-2 requires fund-1
    expect(isLessonAvailable("fund-2", emptyCompleted)).toBe(false);
  });

  test("lesson with met prerequisites is available", () => {
    const completed = new Set<string>(["fund-1"]);
    expect(isLessonAvailable("fund-2", completed)).toBe(true);
  });

  test("lesson with multiple prerequisites requires all to be met", () => {
    // melody-4 requires melody-2 and fund-5
    expect(isLessonAvailable("melody-4", new Set<string>())).toBe(false);
    expect(isLessonAvailable("melody-4", new Set(["melody-2"]))).toBe(false);
    expect(isLessonAvailable("melody-4", new Set(["fund-5"]))).toBe(false);
    expect(isLessonAvailable("melody-4", new Set(["melody-2", "fund-5"]))).toBe(true);
  });

  test("returns false for invalid lesson ID", () => {
    expect(isLessonAvailable("nonexistent", new Set<string>())).toBe(false);
  });

  test("returns false for empty lesson ID", () => {
    expect(isLessonAvailable("", new Set<string>())).toBe(false);
  });

  test("all lessons with no prerequisites are available initially", () => {
    const emptyCompleted = new Set<string>();
    const noPrereqLessons = CURRICULUM.filter((l) => l.prerequisites.length === 0);

    noPrereqLessons.forEach((lesson) => {
      expect(isLessonAvailable(lesson.id, emptyCompleted)).toBe(true);
    });
  });

  test("all lessons become available when all others completed", () => {
    const allCompleted = new Set(CURRICULUM.map((l) => l.id));

    CURRICULUM.forEach((lesson) => {
      expect(isLessonAvailable(lesson.id, allCompleted)).toBe(true);
    });
  });
});
