import { create } from "zustand";
import {
  AudioEngine,
  NoteMapper,
  BleedDetector,
  type AudioEngineState,
  type NoteMapResult,
  type BleedResult,
} from "@/lib/audio";
import { useSettingsStore, type HarmonicaKey } from "./settingsStore";

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
  setHarmonicaKey: (key: HarmonicaKey) => void;
}

export const useAudioStore = create<AudioState>((set, get) => {
  // Get initial key from settings store
  const initialKey = useSettingsStore.getState().harmonicaKey;

  // Create instances with current key
  const noteMapper = new NoteMapper(initialKey);
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

    setHarmonicaKey: (key: HarmonicaKey) => {
      // Recreate NoteMapper with new key
      const newNoteMapper = new NoteMapper(key);
      set({ noteMapper: newNoteMapper });
    },

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
        onSilence: () => {
          // Clear the current note when silence is detected
          set({
            currentNote: null,
            frequency: 0,
            clarity: 0,
            bleedResult: null,
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

// Subscribe to settings changes to keep noteMapper in sync
let previousKey = useSettingsStore.getState().harmonicaKey;
useSettingsStore.subscribe((state) => {
  if (state.harmonicaKey !== previousKey) {
    previousKey = state.harmonicaKey;
    useAudioStore.getState().setHarmonicaKey(state.harmonicaKey);
  }
});
