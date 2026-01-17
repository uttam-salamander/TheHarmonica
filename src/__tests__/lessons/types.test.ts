/**
 * Tests for Lesson type functions - calculateStars and calculateXP
 * @module types.test
 */

import { describe, expect, test } from "bun:test";
import { calculateStars, calculateXP } from "@/lib/lessons/types";

describe("calculateStars", () => {
  describe("3 stars (90%+)", () => {
    test("returns 3 for exactly 90%", () => {
      expect(calculateStars(90)).toBe(3);
    });

    test("returns 3 for 95%", () => {
      expect(calculateStars(95)).toBe(3);
    });

    test("returns 3 for 100%", () => {
      expect(calculateStars(100)).toBe(3);
    });

    test("returns 3 for values above 100", () => {
      // Edge case: should handle gracefully
      expect(calculateStars(105)).toBe(3);
    });
  });

  describe("2 stars (75-89%)", () => {
    test("returns 2 for exactly 75%", () => {
      expect(calculateStars(75)).toBe(2);
    });

    test("returns 2 for 80%", () => {
      expect(calculateStars(80)).toBe(2);
    });

    test("returns 2 for 89%", () => {
      expect(calculateStars(89)).toBe(2);
    });

    test("returns 2 for 89.9%", () => {
      expect(calculateStars(89.9)).toBe(2);
    });
  });

  describe("1 star (<75%)", () => {
    test("returns 1 for 74%", () => {
      expect(calculateStars(74)).toBe(1);
    });

    test("returns 1 for 50%", () => {
      expect(calculateStars(50)).toBe(1);
    });

    test("returns 1 for 0%", () => {
      expect(calculateStars(0)).toBe(1);
    });

    test("returns 1 for negative values", () => {
      // Edge case: should handle gracefully
      expect(calculateStars(-10)).toBe(1);
    });
  });

  describe("boundary conditions", () => {
    test("74.9% returns 1 star", () => {
      expect(calculateStars(74.9)).toBe(1);
    });

    test("75% returns 2 stars", () => {
      expect(calculateStars(75)).toBe(2);
    });

    test("89.9% returns 2 stars", () => {
      expect(calculateStars(89.9)).toBe(2);
    });

    test("90% returns 3 stars", () => {
      expect(calculateStars(90)).toBe(3);
    });
  });
});

describe("calculateXP", () => {
  describe("first completion", () => {
    test("3 stars gives 75 XP", () => {
      expect(calculateXP(3, true)).toBe(75);
    });

    test("2 stars gives 50 XP", () => {
      expect(calculateXP(2, true)).toBe(50);
    });

    test("1 star gives 30 XP", () => {
      expect(calculateXP(1, true)).toBe(30);
    });
  });

  describe("subsequent completion (50% reduction)", () => {
    test("3 stars gives 37 XP (75 * 0.5 = 37.5, floored)", () => {
      expect(calculateXP(3, false)).toBe(37);
    });

    test("2 stars gives 25 XP (50 * 0.5)", () => {
      expect(calculateXP(2, false)).toBe(25);
    });

    test("1 star gives 15 XP (30 * 0.5)", () => {
      expect(calculateXP(1, false)).toBe(15);
    });
  });

  describe("XP scaling", () => {
    test("first completion always gives more than subsequent", () => {
      expect(calculateXP(3, true)).toBeGreaterThan(calculateXP(3, false));
      expect(calculateXP(2, true)).toBeGreaterThan(calculateXP(2, false));
      expect(calculateXP(1, true)).toBeGreaterThan(calculateXP(1, false));
    });

    test("more stars gives more XP", () => {
      expect(calculateXP(3, true)).toBeGreaterThan(calculateXP(2, true));
      expect(calculateXP(2, true)).toBeGreaterThan(calculateXP(1, true));
      expect(calculateXP(3, false)).toBeGreaterThan(calculateXP(2, false));
      expect(calculateXP(2, false)).toBeGreaterThan(calculateXP(1, false));
    });
  });
});
