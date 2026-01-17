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
  defaultTempo: number; // BPM

  // Actions
  setHarmonicaKey: (key: HarmonicaKey) => void;
  setMetronomeSound: (enabled: boolean) => void;
  setCountIn: (enabled: boolean) => void;
  setWaitModeDefault: (enabled: boolean) => void;
  setDefaultTempo: (tempo: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      harmonicaKey: "C",
      metronomeSound: true,
      countIn: true,
      waitModeDefault: true,
      defaultTempo: 60,

      // Actions
      setHarmonicaKey: (key) => set({ harmonicaKey: key }),
      setMetronomeSound: (enabled) => set({ metronomeSound: enabled }),
      setCountIn: (enabled) => set({ countIn: enabled }),
      setWaitModeDefault: (enabled) => set({ waitModeDefault: enabled }),
      setDefaultTempo: (tempo) => set({ defaultTempo: tempo }),
    }),
    {
      name: "harpflow-settings",
    }
  )
);
