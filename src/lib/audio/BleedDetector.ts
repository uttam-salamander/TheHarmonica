import type { AudioEngine } from "./AudioEngine";

/**
 * Result of bleed detection analysis
 */
export interface BleedResult {
  isClean: boolean; // True if only one note detected
  peakCount: number; // Number of significant frequency peaks
  primaryFrequency: number; // Strongest detected frequency
  secondaryFrequencies: number[]; // Other significant frequencies
  bleedSeverity: number; // 0 = clean, 1 = severe bleed
}

/**
 * BleedDetector analyzes spectral data to detect when multiple
 * harmonica holes are being played simultaneously (bleed).
 */
export class BleedDetector {
  private readonly PEAK_THRESHOLD_DB = -40; // Minimum dB for a peak
  private readonly HARMONIC_TOLERANCE = 0.05; // 5% tolerance for harmonic detection
  private readonly MIN_PEAK_DISTANCE_HZ = 50; // Minimum Hz between independent peaks

  /**
   * Analyze frequency data to detect bleed
   */
  analyze(audioEngine: AudioEngine, primaryFrequency: number): BleedResult {
    const frequencyData = audioEngine.getFrequencyData();

    if (!frequencyData || primaryFrequency <= 0) {
      return {
        isClean: true,
        peakCount: 0,
        primaryFrequency: 0,
        secondaryFrequencies: [],
        bleedSeverity: 0,
      };
    }

    const sampleRate = audioEngine.getSampleRate();
    const binCount = audioEngine.getFrequencyBinCount();
    const binSize = sampleRate / (binCount * 2);

    // Find all significant peaks
    const peaks = this.findPeaks(frequencyData, binSize);

    // Filter out harmonics of the primary frequency
    const nonHarmonicPeaks = this.filterHarmonics(peaks, primaryFrequency);

    // Calculate bleed severity based on secondary peak strength
    const bleedSeverity = this.calculateBleedSeverity(
      nonHarmonicPeaks,
      primaryFrequency,
      frequencyData,
      binSize
    );

    return {
      isClean: nonHarmonicPeaks.length === 0,
      peakCount: nonHarmonicPeaks.length + 1, // +1 for primary
      primaryFrequency,
      secondaryFrequencies: nonHarmonicPeaks,
      bleedSeverity,
    };
  }

  /**
   * Find peaks in the frequency spectrum
   */
  private findPeaks(frequencyData: Float32Array<ArrayBuffer>, binSize: number): number[] {
    const peaks: number[] = [];

    for (let i = 2; i < frequencyData.length - 2; i++) {
      const magnitude = frequencyData[i];

      // Check if this is a local maximum above threshold
      if (
        magnitude > this.PEAK_THRESHOLD_DB &&
        magnitude > frequencyData[i - 1] &&
        magnitude > frequencyData[i + 1] &&
        magnitude > frequencyData[i - 2] &&
        magnitude > frequencyData[i + 2]
      ) {
        const frequency = i * binSize;
        // Only consider frequencies in harmonica range (200-2500 Hz)
        if (frequency >= 200 && frequency <= 2500) {
          peaks.push(frequency);
        }
      }
    }

    return peaks;
  }

  /**
   * Filter out frequencies that are harmonics of the primary frequency
   */
  private filterHarmonics(peaks: number[], primaryFrequency: number): number[] {
    return peaks.filter((freq) => {
      // Check if this frequency is close to the primary
      if (Math.abs(freq - primaryFrequency) < this.MIN_PEAK_DISTANCE_HZ) {
        return false;
      }

      // Check if this is a harmonic (2x, 3x, 4x, etc.) of the primary
      for (let harmonic = 2; harmonic <= 8; harmonic++) {
        const harmonicFreq = primaryFrequency * harmonic;
        if (Math.abs(freq - harmonicFreq) / harmonicFreq < this.HARMONIC_TOLERANCE) {
          return false;
        }
      }

      // Check if primary is a harmonic of this frequency
      for (let harmonic = 2; harmonic <= 8; harmonic++) {
        const fundamentalFreq = primaryFrequency / harmonic;
        if (Math.abs(freq - fundamentalFreq) / fundamentalFreq < this.HARMONIC_TOLERANCE) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Calculate how severe the bleed is (0-1 scale)
   */
  private calculateBleedSeverity(
    secondaryPeaks: number[],
    primaryFrequency: number,
    frequencyData: Float32Array<ArrayBuffer>,
    binSize: number
  ): number {
    if (secondaryPeaks.length === 0) return 0;

    const primaryBin = Math.round(primaryFrequency / binSize);
    const primaryMagnitude = frequencyData[primaryBin] ?? -100;

    // Find the strongest secondary peak
    let maxSecondaryMagnitude = -100;
    for (const freq of secondaryPeaks) {
      const bin = Math.round(freq / binSize);
      if (bin >= 0 && bin < frequencyData.length) {
        maxSecondaryMagnitude = Math.max(maxSecondaryMagnitude, frequencyData[bin]);
      }
    }

    // Calculate relative strength (difference in dB)
    const magnitudeDiff = primaryMagnitude - maxSecondaryMagnitude;

    // Convert to 0-1 scale: 0 dB diff = 1.0 (severe), 20+ dB diff = 0.0 (clean)
    const severity = Math.max(0, Math.min(1, 1 - magnitudeDiff / 20));

    return severity;
  }
}
