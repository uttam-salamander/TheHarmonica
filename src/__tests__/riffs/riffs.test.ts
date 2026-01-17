/**
 * Tests for Riffs - Riff data and helper functions
 * @module riffs.test
 */

import { describe, expect, test } from "bun:test";
import {
  RIFFS,
  getRiffsByCategory,
  getRiffsByDifficulty,
  getBeginnnerRiffs,
} from "@/lib/riffs";

describe("RIFFS data validation", () => {
  test("riffs array is not empty", () => {
    expect(RIFFS.length).toBeGreaterThan(0);
  });

  test("all riffs have unique IDs", () => {
    const ids = RIFFS.map((riff) => riff.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test("all riffs have required properties", () => {
    RIFFS.forEach((riff) => {
      expect(riff.id).toBeDefined();
      expect(riff.id.length).toBeGreaterThan(0);
      expect(riff.name).toBeDefined();
      expect(riff.name.length).toBeGreaterThan(0);
      expect(riff.description).toBeDefined();
      expect(riff.description.length).toBeGreaterThan(0);
      expect(["blues", "folk", "rhythm", "expression"]).toContain(riff.category);
      expect([1, 2, 3]).toContain(riff.difficulty);
      expect(typeof riff.requiresBend).toBe("boolean");
      expect(Array.isArray(riff.pattern)).toBe(true);
      expect(riff.pattern.length).toBeGreaterThan(0);
      expect(Array.isArray(riff.tips)).toBe(true);
      expect(riff.tips.length).toBeGreaterThan(0);
    });
  });

  test("all pattern notes have valid structure", () => {
    RIFFS.forEach((riff) => {
      riff.pattern.forEach((note) => {
        expect(note.hole).toBeGreaterThanOrEqual(1);
        expect(note.hole).toBeLessThanOrEqual(10);
        expect(["blow", "draw"]).toContain(note.direction);
        expect(note.duration).toBeGreaterThan(0);
      });
    });
  });

  test("riffs with requiresBend=true have bent notes", () => {
    const bendingRiffs = RIFFS.filter((r) => r.requiresBend);

    bendingRiffs.forEach((riff) => {
      const hasBend = riff.pattern.some((note) => note.bend !== undefined && note.bend !== 0);
      expect(hasBend).toBe(true);
    });
  });

  test("riffs with requiresBend=false have no bent notes", () => {
    const noBendRiffs = RIFFS.filter((r) => !r.requiresBend);

    noBendRiffs.forEach((riff) => {
      riff.pattern.forEach((note) => {
        if (note.bend !== undefined) {
          expect(note.bend).toBe(0);
        }
      });
    });
  });

  test("has riffs of each difficulty level", () => {
    const difficulties = new Set(RIFFS.map((r) => r.difficulty));
    expect(difficulties.has(1)).toBe(true);
    expect(difficulties.has(2)).toBe(true);
    expect(difficulties.has(3)).toBe(true);
  });

  test("has riffs of each category", () => {
    const categories = new Set(RIFFS.map((r) => r.category));
    expect(categories.has("blues")).toBe(true);
    expect(categories.has("rhythm")).toBe(true);
    // Folk and expression may or may not be present
  });
});

describe("getRiffsByCategory", () => {
  test("returns only blues riffs for blues category", () => {
    const bluesRiffs = getRiffsByCategory("blues");
    expect(bluesRiffs.length).toBeGreaterThan(0);
    bluesRiffs.forEach((riff) => {
      expect(riff.category).toBe("blues");
    });
  });

  test("returns only rhythm riffs for rhythm category", () => {
    const rhythmRiffs = getRiffsByCategory("rhythm");
    expect(rhythmRiffs.length).toBeGreaterThan(0);
    rhythmRiffs.forEach((riff) => {
      expect(riff.category).toBe("rhythm");
    });
  });

  test("returns only expression riffs for expression category", () => {
    const expressionRiffs = getRiffsByCategory("expression");
    expressionRiffs.forEach((riff) => {
      expect(riff.category).toBe("expression");
    });
  });

  test("returns only folk riffs for folk category", () => {
    const folkRiffs = getRiffsByCategory("folk");
    folkRiffs.forEach((riff) => {
      expect(riff.category).toBe("folk");
    });
  });

  test("returns all riffs when summed across categories", () => {
    const blues = getRiffsByCategory("blues");
    const rhythm = getRiffsByCategory("rhythm");
    const expression = getRiffsByCategory("expression");
    const folk = getRiffsByCategory("folk");

    expect(blues.length + rhythm.length + expression.length + folk.length).toBe(
      RIFFS.length
    );
  });
});

describe("getRiffsByDifficulty", () => {
  test("returns only easy riffs for difficulty 1", () => {
    const easyRiffs = getRiffsByDifficulty(1);
    expect(easyRiffs.length).toBeGreaterThan(0);
    easyRiffs.forEach((riff) => {
      expect(riff.difficulty).toBe(1);
    });
  });

  test("returns only medium riffs for difficulty 2", () => {
    const mediumRiffs = getRiffsByDifficulty(2);
    expect(mediumRiffs.length).toBeGreaterThan(0);
    mediumRiffs.forEach((riff) => {
      expect(riff.difficulty).toBe(2);
    });
  });

  test("returns only hard riffs for difficulty 3", () => {
    const hardRiffs = getRiffsByDifficulty(3);
    expect(hardRiffs.length).toBeGreaterThan(0);
    hardRiffs.forEach((riff) => {
      expect(riff.difficulty).toBe(3);
    });
  });

  test("returns all riffs when summed across difficulties", () => {
    const easy = getRiffsByDifficulty(1);
    const medium = getRiffsByDifficulty(2);
    const hard = getRiffsByDifficulty(3);

    expect(easy.length + medium.length + hard.length).toBe(RIFFS.length);
  });
});

describe("getBeginnnerRiffs", () => {
  test("returns only riffs without bends", () => {
    const beginnerRiffs = getBeginnnerRiffs();
    expect(beginnerRiffs.length).toBeGreaterThan(0);
    beginnerRiffs.forEach((riff) => {
      expect(riff.requiresBend).toBe(false);
    });
  });

  test("returns all non-bending riffs", () => {
    const beginnerRiffs = getBeginnnerRiffs();
    const allNoBendRiffs = RIFFS.filter((r) => !r.requiresBend);

    expect(beginnerRiffs.length).toBe(allNoBendRiffs.length);
  });

  test("beginner riffs have no bend notes in their patterns", () => {
    const beginnerRiffs = getBeginnnerRiffs();
    beginnerRiffs.forEach((riff) => {
      riff.pattern.forEach((note) => {
        if (note.bend !== undefined) {
          expect(note.bend).toBe(0);
        }
      });
    });
  });
});

describe("specific riffs", () => {
  test("warble-45 riff exists and is easy blues", () => {
    const warble = RIFFS.find((r) => r.id === "warble-45");
    expect(warble).toBeDefined();
    expect(warble!.category).toBe("blues");
    expect(warble!.difficulty).toBe(1);
    expect(warble!.requiresBend).toBe(false);
  });

  test("train-chug riff exists", () => {
    const train = RIFFS.find((r) => r.id === "train-chug");
    expect(train).toBeDefined();
    expect(train!.category).toBe("rhythm");
  });

  test("wailing-lick requires bending", () => {
    const wailing = RIFFS.find((r) => r.id === "wailing-lick");
    expect(wailing).toBeDefined();
    expect(wailing!.requiresBend).toBe(true);
    expect(wailing!.difficulty).toBe(3);
  });
});
