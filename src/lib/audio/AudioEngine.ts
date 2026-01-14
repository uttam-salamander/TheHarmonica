import { PitchDetector } from "pitchy";

export type AudioEngineState = "idle" | "requesting" | "active" | "error";

export interface AudioEngineCallbacks {
  onStateChange?: (state: AudioEngineState) => void;
  onPitch?: (frequency: number, clarity: number) => void;
  onSilence?: () => void;
  onError?: (error: Error) => void;
}

/**
 * AudioEngine handles microphone input and real-time pitch detection.
 * Uses Web Audio API for mic access and Pitchy for pitch detection.
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private detector: PitchDetector<Float32Array> | null = null;
  private inputBuffer: Float32Array | null = null;
  private animationFrameId: number | null = null;
  private state: AudioEngineState = "idle";
  private callbacks: AudioEngineCallbacks = {};
  private lastPitchTime: number = 0;
  private cachedFrequencyData: Float32Array | null = null;

  // Audio settings
  private readonly FFT_SIZE = 2048;
  private readonly SILENCE_TIMEOUT_MS = 150; // Time before declaring silence
  private minClarity: number; // Minimum clarity threshold for valid pitch

  constructor(callbacks?: AudioEngineCallbacks, options?: { minClarity?: number }) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
    this.minClarity = options?.minClarity ?? 0.8; // Default 0.8, configurable for beginners
  }

  private setState(newState: AudioEngineState) {
    this.state = newState;
    this.callbacks.onStateChange?.(newState);
  }

  getState(): AudioEngineState {
    return this.state;
  }

  /**
   * Request microphone permission and start audio processing
   */
  async start(): Promise<void> {
    // Prevent duplicate start calls
    if (this.state === "active" || this.state === "requesting") return;

    this.setState("requesting");

    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Create audio context
      this.audioContext = new AudioContext();

      // Handle browser autoplay policy - resume if suspended
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.FFT_SIZE;
      source.connect(this.analyser);

      // Initialize pitch detector and buffers
      this.inputBuffer = new Float32Array(this.analyser.fftSize);
      this.cachedFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
      this.detector = PitchDetector.forFloat32Array(this.analyser.fftSize);

      this.setState("active");
      this.lastPitchTime = 0;

      // Start the detection loop
      this.detectPitch();
    } catch (error) {
      this.setState("error");
      const err = error instanceof Error ? error : new Error("Failed to access microphone");
      this.callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Stop audio processing and release resources
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.detector = null;
    this.inputBuffer = null;
    this.cachedFrequencyData = null;
    this.lastPitchTime = 0;

    this.setState("idle");
  }

  /**
   * Main pitch detection loop using requestAnimationFrame
   */
  private detectPitch = (): void => {
    if (!this.analyser || !this.detector || !this.inputBuffer || !this.audioContext) {
      return;
    }

    const now = performance.now();

    // Get time domain data for pitch detection
    this.analyser.getFloatTimeDomainData(this.inputBuffer);

    // Cache frequency data for synchronized bleed detection
    if (this.cachedFrequencyData) {
      this.analyser.getFloatFrequencyData(this.cachedFrequencyData);
    }

    // Detect pitch
    const [frequency, clarity] = this.detector.findPitch(
      this.inputBuffer,
      this.audioContext.sampleRate
    );

    // Only report pitch if clarity is above threshold
    if (clarity >= this.minClarity && frequency > 0) {
      this.lastPitchTime = now;
      this.callbacks.onPitch?.(frequency, clarity);
    } else if (this.lastPitchTime > 0 && now - this.lastPitchTime > this.SILENCE_TIMEOUT_MS) {
      // Silence detected - no valid pitch for SILENCE_TIMEOUT_MS
      this.lastPitchTime = 0;
      this.callbacks.onSilence?.();
    }

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.detectPitch);
  };

  /**
   * Get the cached frequency data for spectral analysis (used by BleedDetector).
   * Returns data captured at the same time as pitch detection for synchronization.
   */
  getFrequencyData(): Float32Array | null {
    return this.cachedFrequencyData;
  }

  /**
   * Get current sample rate
   */
  getSampleRate(): number {
    return this.audioContext?.sampleRate ?? 44100;
  }

  /**
   * Get frequency bin count for spectral analysis
   */
  getFrequencyBinCount(): number {
    return this.analyser?.frequencyBinCount ?? 0;
  }
}
