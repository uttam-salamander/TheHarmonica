import { PitchDetector } from "pitchy";

export type AudioEngineState = "idle" | "requesting" | "active" | "error";

export interface AudioEngineCallbacks {
  onStateChange?: (state: AudioEngineState) => void;
  onPitch?: (frequency: number, clarity: number) => void;
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

  // Audio settings
  private readonly FFT_SIZE = 2048;
  private readonly MIN_CLARITY = 0.85; // Minimum clarity threshold for valid pitch

  constructor(callbacks?: AudioEngineCallbacks) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
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
    if (this.state === "active") return;

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
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.FFT_SIZE;
      source.connect(this.analyser);

      // Initialize pitch detector
      this.inputBuffer = new Float32Array(this.analyser.fftSize);
      this.detector = PitchDetector.forFloat32Array(this.analyser.fftSize);

      this.setState("active");

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

    this.setState("idle");
  }

  /**
   * Main pitch detection loop using requestAnimationFrame
   */
  private detectPitch = (): void => {
    if (!this.analyser || !this.detector || !this.inputBuffer || !this.audioContext) {
      return;
    }

    // Get time domain data
    this.analyser.getFloatTimeDomainData(this.inputBuffer);

    // Detect pitch
    const [frequency, clarity] = this.detector.findPitch(
      this.inputBuffer,
      this.audioContext.sampleRate
    );

    // Only report pitch if clarity is above threshold
    if (clarity >= this.MIN_CLARITY && frequency > 0) {
      this.callbacks.onPitch?.(frequency, clarity);
    }

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.detectPitch);
  };

  /**
   * Get the raw frequency data for spectral analysis (used by BleedDetector)
   */
  getFrequencyData(): Float32Array | null {
    if (!this.analyser) return null;
    const data = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatFrequencyData(data);
    return data;
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
