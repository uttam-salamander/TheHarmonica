"use client";

import { useCallback, useEffect } from "react";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Hook for accessing audio engine state and controls.
 * Provides real-time pitch detection, note mapping, and bleed detection.
 */
export function useAudio() {
  const {
    engineState,
    error,
    currentNote,
    frequency,
    clarity,
    bleedResult,
    start,
    stop,
  } = useAudioStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Only stop if component unmounts while active
      const state = useAudioStore.getState();
      if (state.engineState === "active") {
        state.stop();
      }
    };
  }, []);

  const toggle = useCallback(async () => {
    if (engineState === "active") {
      stop();
    } else {
      await start();
    }
  }, [engineState, start, stop]);

  return {
    // State
    isActive: engineState === "active",
    isRequesting: engineState === "requesting",
    isError: engineState === "error",
    error,

    // Detection data
    currentNote,
    frequency,
    clarity,
    bleedResult,

    // Derived helpers
    hole: currentNote?.note.hole ?? null,
    direction: currentNote?.note.direction ?? null,
    centsOff: currentNote?.centsOff ?? 0,
    isBend: currentNote?.isBend ?? false,
    isClean: bleedResult?.isClean ?? true,
    bleedSeverity: bleedResult?.bleedSeverity ?? 0,

    // Controls
    start,
    stop,
    toggle,
  };
}
