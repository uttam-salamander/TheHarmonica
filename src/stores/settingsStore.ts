import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Supported harmonica keys
 */
export type HarmonicaKey = "C" | "A" | "G" | "D" | "E" | "F" | "Bb" | "Eb" | "Ab";

interface SettingsState {
  // Harmonica settings
  harmonicaKey: HarmonicaKey;

  // Audio settings
  metronomeSound: boolean;
  countIn: boolean;

  // Practice defaults
  waitModeDefault: boolean;
  defaultTempo: number | null; // BPM override, null = use lesson tempo

  // Actions
  setHarmonicaKey: (key: HarmonicaKey) => void;
  setMetronomeSound: (enabled: boolean) => void;
  setCountIn: (enabled: boolean) => void;
  setWaitModeDefault: (enabled: boolean) => void;
  setDefaultTempo: (tempo: number | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      harmonicaKey: "C",
      metronomeSound: true,
      countIn: true,
      waitModeDefault: true,
      defaultTempo: null,

      // Actions
      setHarmonicaKey: (key) => set({ harmonicaKey: key }),
      setMetronomeSound: (enabled) => set({ metronomeSound: enabled }),
      setCountIn: (enabled) => set({ countIn: enabled }),
      setWaitModeDefault: (enabled) => set({ waitModeDefault: enabled }),
      setDefaultTempo: (tempo) =>
        set({
          defaultTempo:
            tempo === null ? null : Math.max(40, Math.min(200, Math.round(tempo))),
        }),
    }),
    {
      name: "harpflow-settings",
    }
  )
);
