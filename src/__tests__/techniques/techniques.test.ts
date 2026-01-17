/**
 * Tests for Techniques - Technique, Workout, and BackingTrack data
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
import { RIFFS } from "@/lib/riffs";

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
      expect(technique.tips.length).toBeGreaterThan(0);
    });
  });

  test("has techniques of each category", () => {
    const categories = new Set(TECHNIQUES.map((t) => t.category));
    expect(categories.has("breathing")).toBe(true);
    expect(categories.has("embouchure")).toBe(true);
    expect(categories.has("expression")).toBe(true);
    expect(categories.has("rhythm")).toBe(true);
  });

  test("has techniques of each difficulty level", () => {
    const difficulties = new Set(TECHNIQUES.map((t) => t.difficulty));
    expect(difficulties.has(1)).toBe(true);
    expect(difficulties.has(2)).toBe(true);
    expect(difficulties.has(3)).toBe(true);
  });

  test("all steps are non-empty strings", () => {
    TECHNIQUES.forEach((technique) => {
      technique.steps.forEach((step) => {
        expect(typeof step).toBe("string");
        expect(step.length).toBeGreaterThan(0);
      });
    });
  });

  test("all tips are non-empty strings", () => {
    TECHNIQUES.forEach((technique) => {
      technique.tips.forEach((tip) => {
        expect(typeof tip).toBe("string");
        expect(tip.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("getTechniquesByCategory", () => {
  test("returns only breathing techniques for breathing category", () => {
    const breathing = getTechniquesByCategory("breathing");
    expect(breathing.length).toBeGreaterThan(0);
    breathing.forEach((t) => {
      expect(t.category).toBe("breathing");
    });
  });

  test("returns only embouchure techniques for embouchure category", () => {
    const embouchure = getTechniquesByCategory("embouchure");
    expect(embouchure.length).toBeGreaterThan(0);
    embouchure.forEach((t) => {
      expect(t.category).toBe("embouchure");
    });
  });

  test("returns only expression techniques for expression category", () => {
    const expression = getTechniquesByCategory("expression");
    expect(expression.length).toBeGreaterThan(0);
    expression.forEach((t) => {
      expect(t.category).toBe("expression");
    });
  });

  test("returns only rhythm techniques for rhythm category", () => {
    const rhythm = getTechniquesByCategory("rhythm");
    expect(rhythm.length).toBeGreaterThan(0);
    rhythm.forEach((t) => {
      expect(t.category).toBe("rhythm");
    });
  });

  test("returns all techniques when summed across categories", () => {
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

  test("all exercises have required properties", () => {
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

  test("workout duration equals sum of exercise durations", () => {
    WORKOUTS.forEach((workout) => {
      const totalExerciseDuration = workout.exercises.reduce(
        (sum, ex) => sum + ex.duration,
        0
      );
      expect(workout.duration).toBe(totalExerciseDuration);
    });
  });

  test("exercises with technique type have valid itemId references", () => {
    const techniqueIds = new Set(TECHNIQUES.map((t) => t.id));

    WORKOUTS.forEach((workout) => {
      workout.exercises
        .filter((ex) => ex.type === "technique" && ex.itemId)
        .forEach((ex) => {
          expect(techniqueIds.has(ex.itemId!)).toBe(true);
        });
    });
  });

  test("exercises with riff type have valid itemId references", () => {
    const riffIds = new Set(RIFFS.map((r) => r.id));

    WORKOUTS.forEach((workout) => {
      workout.exercises
        .filter((ex) => ex.type === "riff" && ex.itemId)
        .forEach((ex) => {
          expect(riffIds.has(ex.itemId!)).toBe(true);
        });
    });
  });
});

describe("getWorkoutsByDifficulty", () => {
  test("returns only easy workouts for difficulty 1", () => {
    const easy = getWorkoutsByDifficulty(1);
    easy.forEach((w) => {
      expect(w.difficulty).toBe(1);
    });
  });

  test("returns only medium workouts for difficulty 2", () => {
    const medium = getWorkoutsByDifficulty(2);
    medium.forEach((w) => {
      expect(w.difficulty).toBe(2);
    });
  });

  test("returns only hard workouts for difficulty 3", () => {
    const hard = getWorkoutsByDifficulty(3);
    hard.forEach((w) => {
      expect(w.difficulty).toBe(3);
    });
  });

  test("returns all workouts when summed across difficulties", () => {
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
      expect(track.id.length).toBeGreaterThan(0);
      expect(track.name).toBeDefined();
      expect(track.name.length).toBeGreaterThan(0);
      expect(track.key).toBeDefined();
      expect(track.style).toBeDefined();
      expect(track.bpm).toBeGreaterThan(0);
      expect(track.duration).toBeDefined();
      expect(track.source).toBeDefined();
      expect(track.url).toBeDefined();
      expect(track.url.startsWith("http")).toBe(true);
      expect(track.harmonicaKey).toBeDefined();
      expect(track.position).toBeDefined();
    });
  });

  test("BPM values are reasonable (40-200)", () => {
    BACKING_TRACKS.forEach((track) => {
      expect(track.bpm).toBeGreaterThanOrEqual(40);
      expect(track.bpm).toBeLessThanOrEqual(200);
    });
  });

  test("keys are valid musical keys", () => {
    const validKeys = ["C", "D", "E", "F", "G", "A", "B"];
    BACKING_TRACKS.forEach((track) => {
      expect(validKeys).toContain(track.key);
    });
  });
});

describe("getBackingTracksByStyle", () => {
  test("returns blues tracks for 'blues' search", () => {
    const blues = getBackingTracksByStyle("blues");
    expect(blues.length).toBeGreaterThan(0);
    blues.forEach((track) => {
      expect(track.style.toLowerCase()).toContain("blues");
    });
  });

  test("is case-insensitive", () => {
    const upper = getBackingTracksByStyle("BLUES");
    const lower = getBackingTracksByStyle("blues");
    const mixed = getBackingTracksByStyle("Blues");

    expect(upper.length).toBe(lower.length);
    expect(lower.length).toBe(mixed.length);
  });

  test("returns empty array for non-matching style", () => {
    const techno = getBackingTracksByStyle("techno");
    expect(techno.length).toBe(0);
  });

  test("partial match works (substring)", () => {
    const slow = getBackingTracksByStyle("slow");
    slow.forEach((track) => {
      expect(track.style.toLowerCase()).toContain("slow");
    });
  });
});

describe("specific techniques", () => {
  test("diaphragm-breathing exists and is breathing category", () => {
    const diaphragm = TECHNIQUES.find((t) => t.id === "diaphragm-breathing");
    expect(diaphragm).toBeDefined();
    expect(diaphragm!.category).toBe("breathing");
    expect(diaphragm!.difficulty).toBe(1);
  });

  test("tongue-blocking exists and is embouchure category", () => {
    const tongueBlock = TECHNIQUES.find((t) => t.id === "tongue-blocking");
    expect(tongueBlock).toBeDefined();
    expect(tongueBlock!.category).toBe("embouchure");
  });

  test("hand-vibrato exists and is expression category", () => {
    const handVibrato = TECHNIQUES.find((t) => t.id === "hand-vibrato");
    expect(handVibrato).toBeDefined();
    expect(handVibrato!.category).toBe("expression");
  });
});

describe("specific workouts", () => {
  test("daily warm-up exists", () => {
    const warmup = WORKOUTS.find((w) => w.id === "warmup-basic");
    expect(warmup).toBeDefined();
    expect(warmup!.name).toContain("Warm");
    expect(warmup!.difficulty).toBe(1);
  });

  test("blues-foundations exists", () => {
    const blues = WORKOUTS.find((w) => w.id === "blues-foundations");
    expect(blues).toBeDefined();
  });

  test("bend-practice exists and is hard", () => {
    const bendPractice = WORKOUTS.find((w) => w.id === "bend-practice");
    expect(bendPractice).toBeDefined();
    expect(bendPractice!.difficulty).toBe(3);
  });
});
