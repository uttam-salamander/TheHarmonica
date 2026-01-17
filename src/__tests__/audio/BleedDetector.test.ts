/**
 * Tests for BleedDetector - Multi-note bleed detection
 * @module BleedDetector.test
 */

import { describe, expect, test, beforeEach } from "bun:test";
import { BleedDetector, type AudioEngine } from "@/lib/audio";

// Mock AudioEngine for testing - implements the interface expected by BleedDetector
class MockAudioEngine {
  private frequencyData: Float32Array<ArrayBuffer>;
  private sampleRate: number;

  constructor(options: { frequencyData?: Float32Array<ArrayBuffer>; sampleRate?: number } = {}) {
    this.sampleRate = options.sampleRate || 44100;
    this.frequencyData = options.frequencyData || new Float32Array(1024).fill(-100) as Float32Array<ArrayBuffer>;
  }

  getFrequencyData(): Float32Array<ArrayBuffer> | null {
    return this.frequencyData;
  }

  getSampleRate(): number {
    return this.sampleRate;
  }

  getFrequencyBinCount(): number {
    return this.frequencyData.length;
  }
}

describe("BleedDetector", () => {
  let detector: BleedDetector;

  beforeEach(() => {
    detector = new BleedDetector();
  });

  describe("analyze", () => {
    test("returns clean result when frequency data has no peaks above threshold", () => {
      // Mock returns all -100 dB (below -40 dB threshold), so no peaks found
      const engine = new MockAudioEngine();
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result.isClean).toBe(true);
      // peakCount is 1 for the primary frequency (even if no secondary peaks found)
      expect(result.peakCount).toBe(1);
      expect(result.bleedSeverity).toBe(0);
    });

    test("returns clean result for zero primary frequency", () => {
      const engine = new MockAudioEngine();
      const result = detector.analyze(engine as unknown as AudioEngine, 0);

      expect(result.isClean).toBe(true);
      expect(result.primaryFrequency).toBe(0);
    });

    test("returns clean result for negative primary frequency", () => {
      const engine = new MockAudioEngine();
      const result = detector.analyze(engine as unknown as AudioEngine, -100);

      expect(result.isClean).toBe(true);
    });

    test("detects clean single note (no secondary peaks)", () => {
      // Create frequency data with single strong peak at 440 Hz
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);
      const frequencyData = new Float32Array(binCount).fill(-100);

      // Add peak at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -20;
      frequencyData[primaryBin + 1] = -20;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result.isClean).toBe(true);
      expect(result.bleedSeverity).toBe(0);
    });

    test("detects bleed when secondary peaks present", () => {
      // Create frequency data with two strong peaks
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);
      const frequencyData = new Float32Array(binCount).fill(-100);

      // Primary peak at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      // Secondary peak at 600 Hz (not a harmonic)
      const secondaryBin = Math.round(600 / binSize);
      frequencyData[secondaryBin] = -15;
      frequencyData[secondaryBin - 1] = -50;
      frequencyData[secondaryBin + 1] = -50;
      frequencyData[secondaryBin - 2] = -80;
      frequencyData[secondaryBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result.isClean).toBe(false);
      expect(result.secondaryFrequencies.length).toBeGreaterThan(0);
      expect(result.bleedSeverity).toBeGreaterThan(0);
    });

    test("filters out harmonics of primary frequency", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);
      const frequencyData = new Float32Array(binCount).fill(-100);

      // Primary at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      // Second harmonic at 880 Hz (should be filtered)
      const harmonic2Bin = Math.round(880 / binSize);
      frequencyData[harmonic2Bin] = -15;
      frequencyData[harmonic2Bin - 1] = -50;
      frequencyData[harmonic2Bin + 1] = -50;
      frequencyData[harmonic2Bin - 2] = -80;
      frequencyData[harmonic2Bin + 2] = -80;

      // Third harmonic at 1320 Hz (should be filtered)
      const harmonic3Bin = Math.round(1320 / binSize);
      frequencyData[harmonic3Bin] = -20;
      frequencyData[harmonic3Bin - 1] = -50;
      frequencyData[harmonic3Bin + 1] = -50;
      frequencyData[harmonic3Bin - 2] = -80;
      frequencyData[harmonic3Bin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      // Harmonics should be filtered, so result should be clean
      expect(result.isClean).toBe(true);
      expect(result.secondaryFrequencies).not.toContain(880);
      expect(result.secondaryFrequencies).not.toContain(1320);
    });

    test("filters out frequencies close to primary (within MIN_PEAK_DISTANCE)", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);
      const frequencyData = new Float32Array(binCount).fill(-100);

      // Primary at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      // Close frequency at 470 Hz (within 50 Hz, should be filtered)
      const closeBin = Math.round(470 / binSize);
      frequencyData[closeBin] = -15;
      frequencyData[closeBin - 1] = -50;
      frequencyData[closeBin + 1] = -50;
      frequencyData[closeBin - 2] = -80;
      frequencyData[closeBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      // Close frequency should be filtered
      expect(result.isClean).toBe(true);
    });

    test("ignores peaks below threshold (-40 dB)", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);
      const frequencyData = new Float32Array(binCount).fill(-100);

      // Primary at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      // Weak secondary peak at 600 Hz (below threshold)
      const secondaryBin = Math.round(600 / binSize);
      frequencyData[secondaryBin] = -50; // Below -40 dB threshold
      frequencyData[secondaryBin - 1] = -60;
      frequencyData[secondaryBin + 1] = -60;
      frequencyData[secondaryBin - 2] = -80;
      frequencyData[secondaryBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result.isClean).toBe(true);
    });

    test("ignores frequencies outside harmonica range (200-2500 Hz)", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);
      const frequencyData = new Float32Array(binCount).fill(-100);

      // Primary at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      // Out of range peak at 100 Hz (below 200 Hz)
      const lowBin = Math.round(100 / binSize);
      if (lowBin > 2) {
        frequencyData[lowBin] = -5;
        frequencyData[lowBin - 1] = -50;
        frequencyData[lowBin + 1] = -50;
        frequencyData[lowBin - 2] = -80;
        frequencyData[lowBin + 2] = -80;
      }

      // Out of range peak at 3000 Hz (above 2500 Hz)
      const highBin = Math.round(3000 / binSize);
      if (highBin < binCount - 2) {
        frequencyData[highBin] = -5;
        frequencyData[highBin - 1] = -50;
        frequencyData[highBin + 1] = -50;
        frequencyData[highBin - 2] = -80;
        frequencyData[highBin + 2] = -80;
      }

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      // Out of range peaks should be ignored
      expect(result.isClean).toBe(true);
    });
  });

  describe("bleed severity calculation", () => {
    test("severity is 0 for no secondary peaks", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const frequencyData = new Float32Array(binCount).fill(-100);
      const binSize = sampleRate / (binCount * 2);

      // Just primary peak
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result.bleedSeverity).toBe(0);
    });

    test("severity approaches 1.0 when secondary peak equals primary", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const frequencyData = new Float32Array(binCount).fill(-100);
      const binSize = sampleRate / (binCount * 2);

      // Primary at 440 Hz
      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      // Equally strong secondary at 600 Hz
      const secondaryBin = Math.round(600 / binSize);
      frequencyData[secondaryBin] = -10; // Same as primary
      frequencyData[secondaryBin - 1] = -50;
      frequencyData[secondaryBin + 1] = -50;
      frequencyData[secondaryBin - 2] = -80;
      frequencyData[secondaryBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      // Severity should be close to 1.0 (0 dB difference)
      expect(result.bleedSeverity).toBeGreaterThanOrEqual(0.9);
    });

    test("severity decreases as secondary peak gets weaker", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const binSize = sampleRate / (binCount * 2);

      // Test with 10 dB difference
      const frequencyData1 = new Float32Array(binCount).fill(-100);
      const primaryBin = Math.round(440 / binSize);
      const secondaryBin = Math.round(600 / binSize);

      frequencyData1[primaryBin] = -10;
      frequencyData1[primaryBin - 1] = -50;
      frequencyData1[primaryBin + 1] = -50;
      frequencyData1[primaryBin - 2] = -80;
      frequencyData1[primaryBin + 2] = -80;
      frequencyData1[secondaryBin] = -20; // 10 dB weaker
      frequencyData1[secondaryBin - 1] = -50;
      frequencyData1[secondaryBin + 1] = -50;
      frequencyData1[secondaryBin - 2] = -80;
      frequencyData1[secondaryBin + 2] = -80;

      const engine1 = new MockAudioEngine({ frequencyData: frequencyData1, sampleRate });
      const result1 = detector.analyze(engine1 as unknown as AudioEngine, 440);

      // Test with 15 dB difference
      const frequencyData2 = new Float32Array(binCount).fill(-100);
      frequencyData2[primaryBin] = -10;
      frequencyData2[primaryBin - 1] = -50;
      frequencyData2[primaryBin + 1] = -50;
      frequencyData2[primaryBin - 2] = -80;
      frequencyData2[primaryBin + 2] = -80;
      frequencyData2[secondaryBin] = -25; // 15 dB weaker
      frequencyData2[secondaryBin - 1] = -50;
      frequencyData2[secondaryBin + 1] = -50;
      frequencyData2[secondaryBin - 2] = -80;
      frequencyData2[secondaryBin + 2] = -80;

      const engine2 = new MockAudioEngine({ frequencyData: frequencyData2, sampleRate });
      const result2 = detector.analyze(engine2 as unknown as AudioEngine, 440);

      // Weaker secondary should produce lower severity
      expect(result1.bleedSeverity).toBeGreaterThan(result2.bleedSeverity);
    });

    test("severity is 0 when secondary is 20+ dB weaker", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const frequencyData = new Float32Array(binCount).fill(-100);
      const binSize = sampleRate / (binCount * 2);

      const primaryBin = Math.round(440 / binSize);
      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;

      const secondaryBin = Math.round(600 / binSize);
      frequencyData[secondaryBin] = -35; // 25 dB weaker (but still above -40 threshold)
      frequencyData[secondaryBin - 1] = -50;
      frequencyData[secondaryBin + 1] = -50;
      frequencyData[secondaryBin - 2] = -80;
      frequencyData[secondaryBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      // 25 dB difference should result in severity close to 0
      expect(result.bleedSeverity).toBeLessThanOrEqual(0.1);
    });
  });

  describe("BleedResult structure", () => {
    test("result has all required properties", () => {
      const engine = new MockAudioEngine();
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result).toHaveProperty("isClean");
      expect(result).toHaveProperty("peakCount");
      expect(result).toHaveProperty("primaryFrequency");
      expect(result).toHaveProperty("secondaryFrequencies");
      expect(result).toHaveProperty("bleedSeverity");
    });

    test("secondaryFrequencies is an array", () => {
      const engine = new MockAudioEngine();
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(Array.isArray(result.secondaryFrequencies)).toBe(true);
    });

    test("bleedSeverity is between 0 and 1", () => {
      const sampleRate = 44100;
      const binCount = 1024;
      const frequencyData = new Float32Array(binCount).fill(-100);
      const binSize = sampleRate / (binCount * 2);

      // Add peaks
      const primaryBin = Math.round(440 / binSize);
      const secondaryBin = Math.round(600 / binSize);

      frequencyData[primaryBin] = -10;
      frequencyData[primaryBin - 1] = -50;
      frequencyData[primaryBin + 1] = -50;
      frequencyData[primaryBin - 2] = -80;
      frequencyData[primaryBin + 2] = -80;
      frequencyData[secondaryBin] = -15;
      frequencyData[secondaryBin - 1] = -50;
      frequencyData[secondaryBin + 1] = -50;
      frequencyData[secondaryBin - 2] = -80;
      frequencyData[secondaryBin + 2] = -80;

      const engine = new MockAudioEngine({ frequencyData, sampleRate });
      const result = detector.analyze(engine as unknown as AudioEngine, 440);

      expect(result.bleedSeverity).toBeGreaterThanOrEqual(0);
      expect(result.bleedSeverity).toBeLessThanOrEqual(1);
    });
  });
});
