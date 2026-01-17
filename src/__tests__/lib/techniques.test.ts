/**
 * Tests for Techniques and Workouts library
 * @module techniques.test
 */

import { describe, expect, test } from "bun:test";
import {
  TECHNIQUES,
  WORKOUTS,
  BACKING_TRACKS,
  getTechniquesByCategory,
  getWorkoutsByDifficulty,
  getBackingTracksByStyle,
} from "@/lib/techniques";

describe("TECHNIQUES data validation", () => {
  test("techniques array is not empty", () => {
    expect(TECHNIQUES.length).toBeGreaterThan(0);
  });

  test("all techniques have unique IDs", () => {
    const ids = TECHNIQUES.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all techniques have required properties", () => {
    TECHNIQUES.forEach((technique) => {
      expect(technique.id).toBeDefined();
      expect(technique.id.length).toBeGreaterThan(0);
      expect(technique.name).toBeDefined();
      expect(technique.name.length).toBeGreaterThan(0);
      expect(technique.description).toBeDefined();
      expect(technique.description.length).toBeGreaterThan(0);
      expect(["breathing", "embouchure", "expression", "rhythm"]).toContain(
        technique.category
      );
      expect([1, 2, 3]).toContain(technique.difficulty);
      expect(technique.duration).toBeGreaterThan(0);
      expect(Array.isArray(technique.steps)).toBe(true);
      expect(technique.steps.length).toBeGreaterThan(0);
      expect(Array.isArray(technique.tips)).toBe(true);
    });
  });

  test("all technique steps are non-empty strings", () => {
    TECHNIQUES.forEach((technique) => {
      technique.steps.forEach((step) => {
        expect(typeof step).toBe("string");
        expect(step.trim().length).toBeGreaterThan(0);
      });
    });
  });

  test("technique durations are reasonable (30 seconds to 10 minutes)", () => {
    TECHNIQUES.forEach((technique) => {
      expect(technique.duration).toBeGreaterThanOrEqual(30);
      expect(technique.duration).toBeLessThanOrEqual(600);
    });
  });
});

describe("getTechniquesByCategory", () => {
  test("returns breathing techniques", () => {
    const breathing = getTechniquesByCategory("breathing");
    expect(breathing.length).toBeGreaterThan(0);
    breathing.forEach((t) => expect(t.category).toBe("breathing"));
  });

  test("returns embouchure techniques", () => {
    const embouchure = getTechniquesByCategory("embouchure");
    expect(embouchure.length).toBeGreaterThan(0);
    embouchure.forEach((t) => expect(t.category).toBe("embouchure"));
  });

  test("returns expression techniques", () => {
    const expression = getTechniquesByCategory("expression");
    expect(expression.length).toBeGreaterThan(0);
    expression.forEach((t) => expect(t.category).toBe("expression"));
  });

  test("returns rhythm techniques", () => {
    const rhythm = getTechniquesByCategory("rhythm");
    expect(rhythm.length).toBeGreaterThan(0);
    rhythm.forEach((t) => expect(t.category).toBe("rhythm"));
  });

  test("all categories combined equals total techniques", () => {
    const breathing = getTechniquesByCategory("breathing");
    const embouchure = getTechniquesByCategory("embouchure");
    const expression = getTechniquesByCategory("expression");
    const rhythm = getTechniquesByCategory("rhythm");

    expect(
      breathing.length + embouchure.length + expression.length + rhythm.length
    ).toBe(TECHNIQUES.length);
  });
});

describe("WORKOUTS data validation", () => {
  test("workouts array is not empty", () => {
    expect(WORKOUTS.length).toBeGreaterThan(0);
  });

  test("all workouts have unique IDs", () => {
    const ids = WORKOUTS.map((w) => w.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all workouts have required properties", () => {
    WORKOUTS.forEach((workout) => {
      expect(workout.id).toBeDefined();
      expect(workout.id.length).toBeGreaterThan(0);
      expect(workout.name).toBeDefined();
      expect(workout.name.length).toBeGreaterThan(0);
      expect(workout.description).toBeDefined();
      expect(workout.description.length).toBeGreaterThan(0);
      expect(workout.duration).toBeGreaterThan(0);
      expect([1, 2, 3]).toContain(workout.difficulty);
      expect(Array.isArray(workout.exercises)).toBe(true);
      expect(workout.exercises.length).toBeGreaterThan(0);
    });
  });

  test("workout exercises have required properties", () => {
    WORKOUTS.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        expect(["technique", "riff", "scale", "breathing"]).toContain(exercise.type);
        expect(exercise.name).toBeDefined();
        expect(exercise.name.length).toBeGreaterThan(0);
        expect(exercise.duration).toBeGreaterThan(0);
        expect(exercise.instructions).toBeDefined();
        expect(exercise.instructions.length).toBeGreaterThan(0);
      });
    });
  });

  test("workout duration roughly equals sum of exercise durations", () => {
    WORKOUTS.forEach((workout) => {
      const totalExerciseDuration = workout.exercises.reduce(
        (sum, ex) => sum + ex.duration,
        0
      );
      // Allow some flexibility (±30 seconds) for transitions
      expect(Math.abs(workout.duration - totalExerciseDuration)).toBeLessThan(30);
    });
  });

  test("exercises referencing techniques have valid itemId", () => {
    const techniqueIds = new Set(TECHNIQUES.map((t) => t.id));

    WORKOUTS.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.type === "technique" && exercise.itemId) {
          expect(techniqueIds.has(exercise.itemId)).toBe(true);
        }
      });
    });
  });
});

describe("getWorkoutsByDifficulty", () => {
  test("returns difficulty 1 workouts", () => {
    const easy = getWorkoutsByDifficulty(1);
    expect(easy.length).toBeGreaterThan(0);
    easy.forEach((w) => expect(w.difficulty).toBe(1));
  });

  test("returns difficulty 2 workouts", () => {
    const medium = getWorkoutsByDifficulty(2);
    expect(medium.length).toBeGreaterThan(0);
    medium.forEach((w) => expect(w.difficulty).toBe(2));
  });

  test("returns difficulty 3 workouts", () => {
    const hard = getWorkoutsByDifficulty(3);
    expect(hard.length).toBeGreaterThan(0);
    hard.forEach((w) => expect(w.difficulty).toBe(3));
  });

  test("all difficulties combined equals total workouts", () => {
    const easy = getWorkoutsByDifficulty(1);
    const medium = getWorkoutsByDifficulty(2);
    const hard = getWorkoutsByDifficulty(3);

    expect(easy.length + medium.length + hard.length).toBe(WORKOUTS.length);
  });
});

describe("BACKING_TRACKS data validation", () => {
  test("backing tracks array is not empty", () => {
    expect(BACKING_TRACKS.length).toBeGreaterThan(0);
  });

  test("all backing tracks have unique IDs", () => {
    const ids = BACKING_TRACKS.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all backing tracks have required properties", () => {
    BACKING_TRACKS.forEach((track) => {
      expect(track.id).toBeDefined();
      expect(track.name).toBeDefined();
      expect(track.key).toBeDefined();
      expect(track.style).toBeDefined();
      expect(track.bpm).toBeGreaterThan(0);
      expect(track.duration).toBeDefined();
      expect(track.source).toBeDefined();
      expect(track.url).toBeDefined();
      expect(track.harmonicaKey).toBeDefined();
      expect(track.position).toBeDefined();
    });
  });

  test("backing track URLs are valid format", () => {
    BACKING_TRACKS.forEach((track) => {
      expect(track.url.startsWith("http")).toBe(true);
    });
  });

  test("backing track BPMs are reasonable", () => {
    BACKING_TRACKS.forEach((track) => {
      expect(track.bpm).toBeGreaterThanOrEqual(40);
      expect(track.bpm).toBeLessThanOrEqual(200);
    });
  });

  test("harmonica keys are valid", () => {
    const validKeys = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab"];
    BACKING_TRACKS.forEach((track) => {
      expect(validKeys).toContain(track.harmonicaKey);
    });
  });
});

describe("getBackingTracksByStyle", () => {
  test("finds blues tracks", () => {
    const blues = getBackingTracksByStyle("blues");
    expect(blues.length).toBeGreaterThan(0);
    blues.forEach((t) => {
      expect(t.style.toLowerCase()).toContain("blues");
    });
  });

  test("is case-insensitive", () => {
    const blues1 = getBackingTracksByStyle("blues");
    const blues2 = getBackingTracksByStyle("BLUES");
    const blues3 = getBackingTracksByStyle("Blues");

    expect(blues1.length).toBe(blues2.length);
    expect(blues2.length).toBe(blues3.length);
  });

  test("returns empty array for non-existent style", () => {
    const nonExistent = getBackingTracksByStyle("nonexistentgenre123");
    expect(nonExistent).toHaveLength(0);
  });

  test("partial style matching works", () => {
    const slow = getBackingTracksByStyle("slow");
    slow.forEach((t) => {
      expect(t.style.toLowerCase()).toContain("slow");
    });
  });
});

describe("specific techniques", () => {
  test("has diaphragm breathing technique", () => {
    const technique = TECHNIQUES.find((t) => t.id === "diaphragm-breathing");
    expect(technique).toBeDefined();
    expect(technique!.category).toBe("breathing");
    expect(technique!.difficulty).toBe(1);
  });

  test("has puckering technique", () => {
    const technique = TECHNIQUES.find((t) => t.id === "puckering");
    expect(technique).toBeDefined();
    expect(technique!.category).toBe("embouchure");
  });

  test("has tongue blocking technique", () => {
    const technique = TECHNIQUES.find((t) => t.id === "tongue-blocking");
    expect(technique).toBeDefined();
  });

  test("has hand vibrato technique", () => {
    const technique = TECHNIQUES.find((t) => t.id === "hand-vibrato");
    expect(technique).toBeDefined();
    expect(technique!.category).toBe("expression");
  });
});

describe("specific workouts", () => {
  test("has daily warmup workout", () => {
    const workout = WORKOUTS.find((w) => w.id === "warmup-basic");
    expect(workout).toBeDefined();
    expect(workout!.difficulty).toBe(1);
    expect(workout!.name).toContain("Warm");
  });

  test("has blues foundations workout", () => {
    const workout = WORKOUTS.find((w) => w.id === "blues-foundations");
    expect(workout).toBeDefined();
  });

  test("has bending workout", () => {
    const workout = WORKOUTS.find((w) => w.id === "bend-practice");
    expect(workout).toBeDefined();
    expect(workout!.difficulty).toBe(3); // Hard difficulty
  });
});
