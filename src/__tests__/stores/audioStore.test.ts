/**
 * Tests for audioStore - Audio engine state management
 * @module audioStore.test
 */

import { describe, expect, test, beforeEach } from "bun:test";
import { useAudioStore } from "@/stores/audioStore";

describe("audioStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { stop } = useAudioStore.getState();
    stop();
  });

  describe("initial state", () => {
    test("starts with idle engine state", () => {
      expect(useAudioStore.getState().engineState).toBe("idle");
    });

    test("starts with null error", () => {
      expect(useAudioStore.getState().error).toBeNull();
    });

    test("starts with null currentNote", () => {
      expect(useAudioStore.getState().currentNote).toBeNull();
    });

    test("starts with 0 frequency", () => {
      expect(useAudioStore.getState().frequency).toBe(0);
    });

    test("starts with 0 clarity", () => {
      expect(useAudioStore.getState().clarity).toBe(0);
    });

    test("starts with null bleedResult", () => {
      expect(useAudioStore.getState().bleedResult).toBeNull();
    });

    test("has NoteMapper instance", () => {
      expect(useAudioStore.getState().noteMapper).toBeDefined();
    });

    test("has BleedDetector instance", () => {
      expect(useAudioStore.getState().bleedDetector).toBeDefined();
    });
  });

  describe("stop", () => {
    test("sets engine to null", () => {
      useAudioStore.getState().stop();
      expect(useAudioStore.getState().engine).toBeNull();
    });

    test("sets engineState to idle", () => {
      useAudioStore.getState().stop();
      expect(useAudioStore.getState().engineState).toBe("idle");
    });

    test("clears currentNote", () => {
      useAudioStore.getState().stop();
      expect(useAudioStore.getState().currentNote).toBeNull();
    });

    test("resets frequency to 0", () => {
      useAudioStore.getState().stop();
      expect(useAudioStore.getState().frequency).toBe(0);
    });

    test("resets clarity to 0", () => {
      useAudioStore.getState().stop();
      expect(useAudioStore.getState().clarity).toBe(0);
    });

    test("clears bleedResult", () => {
      useAudioStore.getState().stop();
      expect(useAudioStore.getState().bleedResult).toBeNull();
    });
  });

  describe("NoteMapper integration", () => {
    test("noteMapper can map frequencies", () => {
      const { noteMapper } = useAudioStore.getState();
      const result = noteMapper?.mapFrequency(523.25); // C5, 4-blow
      expect(result).not.toBeNull();
      expect(result?.note.hole).toBe(4);
      expect(result?.note.direction).toBe("blow");
    });

    test("noteMapper can get natural notes", () => {
      const { noteMapper } = useAudioStore.getState();
      const note = noteMapper?.getNaturalNote(4, "blow");
      expect(note).not.toBeNull();
      expect(note?.noteName).toBe("C5");
    });

    test("noteMapper can check bend capability", () => {
      const { noteMapper } = useAudioStore.getState();
      expect(noteMapper?.canBend(3, "draw")).toBe(true);
      expect(noteMapper?.canBend(4, "blow")).toBe(false);
    });
  });

  describe("BleedDetector integration", () => {
    test("bleedDetector is properly instantiated", () => {
      const { bleedDetector } = useAudioStore.getState();
      expect(bleedDetector).toBeDefined();
    });
  });

  describe("state shape", () => {
    test("has all required state properties", () => {
      const state = useAudioStore.getState();
      
      expect(state).toHaveProperty("engineState");
      expect(state).toHaveProperty("error");
      expect(state).toHaveProperty("currentNote");
      expect(state).toHaveProperty("frequency");
      expect(state).toHaveProperty("clarity");
      expect(state).toHaveProperty("bleedResult");
      expect(state).toHaveProperty("engine");
      expect(state).toHaveProperty("noteMapper");
      expect(state).toHaveProperty("bleedDetector");
    });

    test("has all required actions", () => {
      const state = useAudioStore.getState();
      
      expect(typeof state.start).toBe("function");
      expect(typeof state.stop).toBe("function");
    });
  });
});
