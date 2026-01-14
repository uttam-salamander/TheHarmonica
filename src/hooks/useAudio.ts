"use client";

import { useCallback } from "react";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Hook for accessing audio engine state and controls.
 * Provides real-time pitch detection, note mapping, and bleed detection.
 *
 * Note: Audio is managed globally via Zustand store. Components should
 * call stop() explicitly when they want to stop listening. The audio
 * does NOT automatically stop when components unmount, allowing multiple
 * components to share the same audio stream.
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
