import { create } from "zustand";
import {
  AudioEngine,
  NoteMapper,
  BleedDetector,
  type AudioEngineState,
  type NoteMapResult,
  type BleedResult,
} from "@/lib/audio";

interface AudioState {
  // Engine state
  engineState: AudioEngineState;
  error: Error | null;

  // Detection results
  currentNote: NoteMapResult | null;
  frequency: number;
  clarity: number;
  bleedResult: BleedResult | null;

  // Engine instance (not persisted)
  engine: AudioEngine | null;
  noteMapper: NoteMapper | null;
  bleedDetector: BleedDetector | null;

  // Actions
  start: () => Promise<void>;
  stop: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => {
  // Create instances once
  const noteMapper = new NoteMapper();
  const bleedDetector = new BleedDetector();

  return {
    // Initial state
    engineState: "idle",
    error: null,
    currentNote: null,
    frequency: 0,
    clarity: 0,
    bleedResult: null,
    engine: null,
    noteMapper,
    bleedDetector,

    start: async () => {
      const { engine: existingEngine } = get();

      // Clean up existing engine if any
      if (existingEngine) {
        existingEngine.stop();
      }

      // Create new engine with callbacks
      const engine = new AudioEngine({
        onStateChange: (state) => {
          set({ engineState: state });
        },
        onPitch: (frequency, clarity) => {
          const { noteMapper, bleedDetector, engine } = get();

          // Map frequency to note
          const currentNote = noteMapper?.mapFrequency(frequency) ?? null;

          // Detect bleed if we have a valid note
          let bleedResult: BleedResult | null = null;
          if (currentNote && engine && bleedDetector) {
            bleedResult = bleedDetector.analyze(engine, frequency);
          }

          set({
            frequency,
            clarity,
            currentNote,
            bleedResult,
          });
        },
        onError: (error) => {
          set({ error });
        },
      });

      set({ engine, error: null });

      try {
        await engine.start();
      } catch (error) {
        set({ error: error instanceof Error ? error : new Error("Failed to start audio") });
      }
    },

    stop: () => {
      const { engine } = get();
      if (engine) {
        engine.stop();
      }
      set({
        engine: null,
        engineState: "idle",
        currentNote: null,
        frequency: 0,
        clarity: 0,
        bleedResult: null,
      });
    },
  };
});
