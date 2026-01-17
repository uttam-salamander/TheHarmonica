/**
 * Tests for NoteMapper - Frequency to harmonica note mapping
 * @module NoteMapper.test
 */

import { describe, expect, test, beforeEach } from "bun:test";
import { NoteMapper } from "@/lib/audio";

describe("NoteMapper", () => {
  let mapper: NoteMapper;

  beforeEach(() => {
    mapper = new NoteMapper();
  });

  describe("constructor", () => {
    test("creates instance with note list", () => {
      expect(mapper).toBeDefined();
    });
  });

  describe("mapFrequency", () => {
    describe("basic note detection", () => {
      test("returns null for zero frequency", () => {
        expect(mapper.mapFrequency(0)).toBeNull();
      });

      test("returns null for negative frequency", () => {
        expect(mapper.mapFrequency(-100)).toBeNull();
      });

      test("returns null for out-of-range frequency (too low)", () => {
        expect(mapper.mapFrequency(50)).toBeNull(); // Below harmonica range
      });

      test("returns null for out-of-range frequency (too high)", () => {
        expect(mapper.mapFrequency(5000)).toBeNull(); // Above harmonica range
      });

      test("detects 4-blow (C4) at exact frequency", () => {
        const result = mapper.mapFrequency(261.63);
        expect(result).not.toBeNull();
        expect(result!.note.hole).toBe(1);
        expect(result!.note.direction).toBe("blow");
        expect(result!.note.noteName).toBe("C4");
      });

      test("detects 4-draw (D5) at exact frequency", () => {
        const result = mapper.mapFrequency(587.33);
        expect(result).not.toBeNull();
        expect(result!.note.hole).toBe(4);
        expect(result!.note.direction).toBe("draw");
        expect(result!.note.noteName).toBe("D5");
      });

      test("detects 4-blow (C5) - most common beginner note", () => {
        const result = mapper.mapFrequency(523.25);
        expect(result).not.toBeNull();
        expect(result!.note.hole).toBe(4);
        expect(result!.note.direction).toBe("blow");
        expect(result!.note.noteName).toBe("C5");
      });
    });

    describe("cents detection", () => {
      test("centsOff is near zero for exact frequency", () => {
        const result = mapper.mapFrequency(523.25); // 4-blow exact
        expect(result).not.toBeNull();
        expect(Math.abs(result!.centsOff)).toBeLessThan(1);
      });

      test("detects slightly sharp note (positive cents)", () => {
        // 10 cents sharp would be about 523.25 * 2^(10/1200) ≈ 526.28
        const sharpFreq = 523.25 * Math.pow(2, 10 / 1200);
        const result = mapper.mapFrequency(sharpFreq);
        expect(result).not.toBeNull();
        expect(result!.centsOff).toBeGreaterThan(5);
        expect(result!.centsOff).toBeLessThan(15);
      });

      test("detects slightly flat note (negative cents)", () => {
        // 10 cents flat
        const flatFreq = 523.25 * Math.pow(2, -10 / 1200);
        const result = mapper.mapFrequency(flatFreq);
        expect(result).not.toBeNull();
        expect(result!.centsOff).toBeLessThan(-5);
        expect(result!.centsOff).toBeGreaterThan(-15);
      });

      test("matches note within 50 cent threshold", () => {
        // 45 cents sharp should still match
        const almostOutFreq = 523.25 * Math.pow(2, 45 / 1200);
        const result = mapper.mapFrequency(almostOutFreq);
        expect(result).not.toBeNull();
      });

      test("does not match note beyond 50 cent threshold", () => {
        // 55 cents sharp should not match
        const outOfRangeFreq = 523.25 * Math.pow(2, 55 / 1200);
        const result = mapper.mapFrequency(outOfRangeFreq);
        // May match a different note, or return null
        if (result) {
          // If it matches something, it shouldn't be the original note
          expect(Math.abs(result.centsOff)).toBeLessThanOrEqual(50);
        }
      });
    });

    describe("bend detection", () => {
      test("detects 4-draw bent by 1 semitone", () => {
        // 4-draw (D5) = 587.33 Hz, bent by -1 semitone ≈ 554.37 Hz
        const bentFreq = 587.33 * Math.pow(2, -1 / 12);
        const result = mapper.mapFrequency(bentFreq);
        expect(result).not.toBeNull();
        expect(result!.isBend).toBe(true);
        expect(result!.note.hole).toBe(4);
        expect(result!.note.direction).toBe("draw");
        expect(result!.note.bendSemitones).toBe(-1);
      });

      test("detects 3-draw bent by 2 semitones", () => {
        // 3-draw (B4) = 493.88 Hz, bent by -2 semitones
        const bentFreq = 493.88 * Math.pow(2, -2 / 12);
        const result = mapper.mapFrequency(bentFreq);
        expect(result).not.toBeNull();
        expect(result!.isBend).toBe(true);
        expect(result!.note.hole).toBe(3);
        expect(result!.note.bendSemitones).toBe(-2);
      });

      test("detects 3-draw bent by 3 semitones (max bend)", () => {
        // 3-draw can bend down 3 semitones
        const bentFreq = 493.88 * Math.pow(2, -3 / 12);
        const result = mapper.mapFrequency(bentFreq);
        expect(result).not.toBeNull();
        expect(result!.isBend).toBe(true);
        expect(result!.note.hole).toBe(3);
        expect(result!.note.bendSemitones).toBe(-3);
      });

      test("natural note has isBend = false", () => {
        const result = mapper.mapFrequency(587.33); // 4-draw natural
        expect(result).not.toBeNull();
        expect(result!.isBend).toBe(false);
        expect(result!.note.bendSemitones).toBe(0);
      });
    });

    describe("direction preference disambiguation", () => {
      // 2-draw and 3-blow are both G4 (392 Hz)
      const G4_FREQ = 392.0;

      test("defaults to draw for ambiguous low holes without preference", () => {
        const result = mapper.mapFrequency(G4_FREQ);
        expect(result).not.toBeNull();
        // Default behavior: prefer draw for holes 1-6
        expect(result!.note.direction).toBe("draw");
      });

      test("respects draw preference", () => {
        const result = mapper.mapFrequency(G4_FREQ, "draw");
        expect(result).not.toBeNull();
        expect(result!.note.direction).toBe("draw");
        expect(result!.note.hole).toBe(2);
      });

      test("respects blow preference", () => {
        const result = mapper.mapFrequency(G4_FREQ, "blow");
        expect(result).not.toBeNull();
        expect(result!.note.direction).toBe("blow");
        expect(result!.note.hole).toBe(3);
      });

      test("provides alternate note for ambiguous frequencies", () => {
        const result = mapper.mapFrequency(G4_FREQ);
        expect(result).not.toBeNull();
        expect(result!.alternateNote).toBeDefined();
        // The alternate should be the other direction
        if (result!.note.direction === "draw") {
          expect(result!.alternateNote!.direction).toBe("blow");
        } else {
          expect(result!.alternateNote!.direction).toBe("draw");
        }
      });
    });

    describe("all holes detection", () => {
      const blowFrequencies: [number, number, string][] = [
        [1, 261.63, "C4"],
        [2, 329.63, "E4"],
        [3, 392.0, "G4"],
        [4, 523.25, "C5"],
        [5, 659.25, "E5"],
        [6, 783.99, "G5"],
        [7, 1046.5, "C6"],
        [8, 1318.51, "E6"],
        [9, 1567.98, "G6"],
        [10, 2093.0, "C7"],
      ];

      blowFrequencies.forEach(([hole, freq, noteName]) => {
        test(`detects ${hole}-blow (${noteName})`, () => {
          const result = mapper.mapFrequency(freq, "blow");
          expect(result).not.toBeNull();
          expect(result!.note.hole).toBe(hole);
          expect(result!.note.direction).toBe("blow");
        });
      });

      const drawFrequencies: [number, number, string][] = [
        [1, 293.66, "D4"],
        [2, 392.0, "G4"],
        [3, 493.88, "B4"],
        [4, 587.33, "D5"],
        [5, 739.99, "F5"],
        [6, 880.0, "A5"],
        [7, 987.77, "B5"],
        [8, 1174.66, "D6"],
        [9, 1396.91, "F6"],
        [10, 1760.0, "A6"],
      ];

      drawFrequencies.forEach(([hole, freq, noteName]) => {
        test(`detects ${hole}-draw (${noteName})`, () => {
          const result = mapper.mapFrequency(freq, "draw");
          expect(result).not.toBeNull();
          expect(result!.note.hole).toBe(hole);
          expect(result!.note.direction).toBe("draw");
        });
      });
    });
  });

  describe("getNaturalNote", () => {
    test("returns natural note for valid hole and direction", () => {
      const note = mapper.getNaturalNote(4, "blow");
      expect(note).not.toBeNull();
      expect(note!.hole).toBe(4);
      expect(note!.direction).toBe("blow");
      expect(note!.frequency).toBe(523.25);
      expect(note!.noteName).toBe("C5");
      expect(note!.bendSemitones).toBe(0);
    });

    test("returns null for invalid hole number", () => {
      expect(mapper.getNaturalNote(0, "blow")).toBeNull();
      expect(mapper.getNaturalNote(11, "blow")).toBeNull();
      expect(mapper.getNaturalNote(-1, "draw")).toBeNull();
    });

    test("returns draw note correctly", () => {
      const note = mapper.getNaturalNote(6, "draw");
      expect(note).not.toBeNull();
      expect(note!.hole).toBe(6);
      expect(note!.direction).toBe("draw");
      expect(note!.noteName).toBe("A5");
    });
  });

  describe("getMaxBendDepth", () => {
    test("returns -1 for 1-draw (can bend 1 semitone)", () => {
      expect(mapper.getMaxBendDepth(1, "draw")).toBe(-1);
    });

    test("returns -2 for 2-draw (can bend 2 semitones)", () => {
      expect(mapper.getMaxBendDepth(2, "draw")).toBe(-2);
    });

    test("returns -3 for 3-draw (can bend 3 semitones)", () => {
      expect(mapper.getMaxBendDepth(3, "draw")).toBe(-3);
    });

    test("returns -1 for 4-draw", () => {
      expect(mapper.getMaxBendDepth(4, "draw")).toBe(-1);
    });

    test("returns -1 for 5-draw", () => {
      expect(mapper.getMaxBendDepth(5, "draw")).toBe(-1);
    });

    test("returns -1 for 6-draw", () => {
      expect(mapper.getMaxBendDepth(6, "draw")).toBe(-1);
    });

    test("returns 0 for non-bendable draw notes (7-10)", () => {
      expect(mapper.getMaxBendDepth(7, "draw")).toBe(0);
      expect(mapper.getMaxBendDepth(8, "draw")).toBe(0);
      expect(mapper.getMaxBendDepth(9, "draw")).toBe(0);
      expect(mapper.getMaxBendDepth(10, "draw")).toBe(0);
    });

    test("returns -1 for high blow bends (7-9)", () => {
      expect(mapper.getMaxBendDepth(7, "blow")).toBe(-1);
      expect(mapper.getMaxBendDepth(8, "blow")).toBe(-1);
      expect(mapper.getMaxBendDepth(9, "blow")).toBe(-1);
    });

    test("returns -2 for 10-blow (can bend 2 semitones)", () => {
      expect(mapper.getMaxBendDepth(10, "blow")).toBe(-2);
    });

    test("returns 0 for non-bendable blow notes (1-6)", () => {
      expect(mapper.getMaxBendDepth(1, "blow")).toBe(0);
      expect(mapper.getMaxBendDepth(2, "blow")).toBe(0);
      expect(mapper.getMaxBendDepth(3, "blow")).toBe(0);
      expect(mapper.getMaxBendDepth(4, "blow")).toBe(0);
      expect(mapper.getMaxBendDepth(5, "blow")).toBe(0);
      expect(mapper.getMaxBendDepth(6, "blow")).toBe(0);
    });
  });

  describe("canBend", () => {
    test("returns true for bendable draw notes (1-6)", () => {
      expect(mapper.canBend(1, "draw")).toBe(true);
      expect(mapper.canBend(2, "draw")).toBe(true);
      expect(mapper.canBend(3, "draw")).toBe(true);
      expect(mapper.canBend(4, "draw")).toBe(true);
      expect(mapper.canBend(5, "draw")).toBe(true);
      expect(mapper.canBend(6, "draw")).toBe(true);
    });

    test("returns false for non-bendable draw notes (7-10)", () => {
      expect(mapper.canBend(7, "draw")).toBe(false);
      expect(mapper.canBend(8, "draw")).toBe(false);
      expect(mapper.canBend(9, "draw")).toBe(false);
      expect(mapper.canBend(10, "draw")).toBe(false);
    });

    test("returns true for bendable blow notes (7-10)", () => {
      expect(mapper.canBend(7, "blow")).toBe(true);
      expect(mapper.canBend(8, "blow")).toBe(true);
      expect(mapper.canBend(9, "blow")).toBe(true);
      expect(mapper.canBend(10, "blow")).toBe(true);
    });

    test("returns false for non-bendable blow notes (1-6)", () => {
      expect(mapper.canBend(1, "blow")).toBe(false);
      expect(mapper.canBend(2, "blow")).toBe(false);
      expect(mapper.canBend(3, "blow")).toBe(false);
      expect(mapper.canBend(4, "blow")).toBe(false);
      expect(mapper.canBend(5, "blow")).toBe(false);
      expect(mapper.canBend(6, "blow")).toBe(false);
    });
  });

  describe("getKey", () => {
    test("returns default key C when no key specified", () => {
      expect(mapper.getKey()).toBe("C");
    });

    test("returns specified key when created with different key", () => {
      const gMapper = new NoteMapper("G");
      expect(gMapper.getKey()).toBe("G");
    });
  });

  describe("getHoleNotes", () => {
    test("returns note names for all 10 holes", () => {
      const holeNotes = mapper.getHoleNotes();
      expect(Object.keys(holeNotes).length).toBe(10);
      for (let hole = 1; hole <= 10; hole++) {
        expect(holeNotes[hole]).toBeDefined();
        expect(holeNotes[hole].blow).toBeDefined();
        expect(holeNotes[hole].draw).toBeDefined();
      }
    });

    test("returns correct note names for C harmonica", () => {
      const holeNotes = mapper.getHoleNotes();
      expect(holeNotes[1].blow).toBe("C4");
      expect(holeNotes[1].draw).toBe("D4");
      expect(holeNotes[4].blow).toBe("C5");
      expect(holeNotes[4].draw).toBe("D5");
      expect(holeNotes[10].blow).toBe("C7");
      expect(holeNotes[10].draw).toBe("A6");
    });

    test("returns transposed note names for G harmonica", () => {
      const gMapper = new NoteMapper("G");
      const holeNotes = gMapper.getHoleNotes();
      expect(holeNotes[1].blow).toBe("G4");
      expect(holeNotes[1].draw).toBe("A4");
      expect(holeNotes[4].blow).toBe("G5");
      expect(holeNotes[4].draw).toBe("A5");
    });
  });

  describe("getHoleBends", () => {
    test("returns bend info for all 10 holes", () => {
      const holeBends = mapper.getHoleBends();
      expect(Object.keys(holeBends).length).toBe(10);
      for (let hole = 1; hole <= 10; hole++) {
        expect(holeBends[hole]).toBeDefined();
        expect(holeBends[hole].blowBends).toBeDefined();
        expect(holeBends[hole].drawBends).toBeDefined();
        expect(Array.isArray(holeBends[hole].blowBends)).toBe(true);
        expect(Array.isArray(holeBends[hole].drawBends)).toBe(true);
      }
    });

    test("returns correct draw bends for hole 3 (3 bends)", () => {
      const holeBends = mapper.getHoleBends();
      expect(holeBends[3].drawBends.length).toBe(3);
      expect(holeBends[3].drawBends[0]).toBe("A#4"); // -1 semitone from B4
      expect(holeBends[3].drawBends[1]).toBe("A4");  // -2 semitones
      expect(holeBends[3].drawBends[2]).toBe("G#4"); // -3 semitones
    });

    test("returns no draw bends for holes 7-10", () => {
      const holeBends = mapper.getHoleBends();
      expect(holeBends[7].drawBends.length).toBe(0);
      expect(holeBends[8].drawBends.length).toBe(0);
      expect(holeBends[9].drawBends.length).toBe(0);
      expect(holeBends[10].drawBends.length).toBe(0);
    });

    test("returns blow bends for holes 7-10", () => {
      const holeBends = mapper.getHoleBends();
      expect(holeBends[7].blowBends.length).toBe(1);
      expect(holeBends[8].blowBends.length).toBe(1);
      expect(holeBends[9].blowBends.length).toBe(1);
      expect(holeBends[10].blowBends.length).toBe(2);
    });

    test("returns no blow bends for holes 1-6", () => {
      const holeBends = mapper.getHoleBends();
      for (let hole = 1; hole <= 6; hole++) {
        expect(holeBends[hole].blowBends.length).toBe(0);
      }
    });
  });

  describe("multi-key support", () => {
    test("transposes frequencies correctly for G harmonica", () => {
      const gMapper = new NoteMapper("G");
      // G4 frequency is ~392 Hz (same as 2-draw on C, but now 1-blow on G)
      const note = gMapper.getNaturalNote(1, "blow");
      expect(note).not.toBeNull();
      expect(note!.noteName).toBe("G4");
      // G4 is 7 semitones above C4 (261.63), so 261.63 * 2^(7/12) ≈ 392
      expect(note!.frequency).toBeCloseTo(392.0, 0);
    });

    test("transposes frequencies correctly for A harmonica", () => {
      const aMapper = new NoteMapper("A");
      const note = aMapper.getNaturalNote(1, "blow");
      expect(note).not.toBeNull();
      expect(note!.noteName).toBe("A4");
      // A4 is 9 semitones above C4, so 261.63 * 2^(9/12) ≈ 440
      expect(note!.frequency).toBeCloseTo(440.0, 0);
    });

    test("maps frequencies correctly on transposed harmonica", () => {
      const gMapper = new NoteMapper("G");
      // 392 Hz should map to 1-blow on G harmonica (G4)
      const result = gMapper.mapFrequency(392.0, "blow");
      expect(result).not.toBeNull();
      expect(result!.note.hole).toBe(1);
      expect(result!.note.direction).toBe("blow");
    });
  });
});
