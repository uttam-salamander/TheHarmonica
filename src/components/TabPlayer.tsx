"use client";

import { useEffect, useRef, useCallback, useReducer } from "react";
import { cn } from "@/lib/utils";
import type { TabNote } from "@/lib/lessons";
import type { Direction, NoteMapResult } from "@/lib/audio";

interface TabPlayerProps {
  /** The tablature to display */
  tablature: TabNote[];
  /** Current BPM */
  bpm: number;
  /** Time signature [beats per measure, beat unit] */
  timeSignature: [number, number];
  /** Whether wait mode is enabled */
  waitMode: boolean;
  /** Currently detected note from audio */
  detectedNote: NoteMapResult | null;
  /** Whether audio is active */
  isListening: boolean;
  /** Callback when a note is hit (correct/incorrect) */
  onNoteHit?: (noteIndex: number, correct: boolean, clean: boolean) => void;
  /** Callback when lesson is complete */
  onComplete?: () => void;
  /** Additional class names */
  className?: string;
}

interface NoteState {
  status: "upcoming" | "current" | "correct" | "incorrect" | "missed";
  clean: boolean;
}

type TabAction =
  | { type: "SET_CURRENT"; index: number }
  | { type: "MARK_NOTE"; index: number; correct: boolean; clean: boolean }
  | { type: "RESET"; length: number };

interface TabState {
  currentIndex: number;
  noteStates: NoteState[];
  isComplete: boolean;
}

function tabReducer(state: TabState, action: TabAction): TabState {
  switch (action.type) {
    case "SET_CURRENT": {
      const newNoteStates = [...state.noteStates];
      if (action.index < newNoteStates.length && newNoteStates[action.index].status === "upcoming") {
        newNoteStates[action.index] = { ...newNoteStates[action.index], status: "current" };
      }
      return { ...state, currentIndex: action.index, noteStates: newNoteStates };
    }
    case "MARK_NOTE": {
      const newNoteStates = [...state.noteStates];
      newNoteStates[action.index] = {
        status: action.correct ? "correct" : "incorrect",
        clean: action.clean,
      };
      const nextIndex = action.correct ? action.index + 1 : state.currentIndex;
      const isComplete = nextIndex >= newNoteStates.length;
      return {
        ...state,
        noteStates: newNoteStates,
        currentIndex: nextIndex,
        isComplete,
      };
    }
    case "RESET":
      return {
        currentIndex: 0,
        noteStates: Array(action.length).fill(null).map(() => ({ status: "upcoming" as const, clean: true })),
        isComplete: false,
      };
    default:
      return state;
  }
}

/**
 * Horizontal scrolling tablature player with wait mode support.
 * Notes scroll from right to left, matching harmonica layout.
 */
export function TabPlayer({
  tablature,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for future metronome feature
  bpm,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for future metronome feature
  timeSignature,
  waitMode,
  detectedNote,
  isListening,
  onNoteHit,
  onComplete,
  className,
}: TabPlayerProps) {
  const [state, dispatch] = useReducer(tabReducer, {
    currentIndex: 0,
    noteStates: tablature.map(() => ({ status: "upcoming" as const, clean: true })),
    isComplete: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastDetectedRef = useRef<{ hole: number; direction: Direction } | null>(null);
  const completedRef = useRef(false);

  // Check if detected note matches current target
  const checkNoteMatch = useCallback(
    (detected: NoteMapResult | null, target: TabNote): boolean => {
      if (!detected) return false;

      const holeMatch = detected.note.hole === target.hole;
      const directionMatch = detected.note.direction === target.direction;

      // For bends, check if we're within range
      if (target.bend) {
        const targetCents = target.bend * 100; // semitones to cents
        const actualCents = detected.centsOff;
        const bendMatch = Math.abs(actualCents - targetCents) < 50; // ±50 cents tolerance
        return holeMatch && directionMatch && bendMatch;
      }

      // For natural notes, just check hole and direction
      return holeMatch && directionMatch;
    },
    []
  );

  // Handle note detection in wait mode
  useEffect(() => {
    if (!waitMode || !isListening || state.isComplete) return;
    if (state.currentIndex >= tablature.length) return;

    const currentNote = tablature[state.currentIndex];

    // Check if we've detected a new note
    if (detectedNote) {
      const newDetection = {
        hole: detectedNote.note.hole,
        direction: detectedNote.note.direction,
      };

      // Avoid processing the same held note multiple times
      if (
        lastDetectedRef.current?.hole === newDetection.hole &&
        lastDetectedRef.current?.direction === newDetection.direction
      ) {
        return;
      }

      lastDetectedRef.current = newDetection;

      const isCorrect = checkNoteMatch(detectedNote, currentNote);
      const isClean = true; // TODO: integrate with bleed detection

      // Update state via reducer
      dispatch({ type: "MARK_NOTE", index: state.currentIndex, correct: isCorrect, clean: isClean });

      // Notify parent
      onNoteHit?.(state.currentIndex, isCorrect, isClean);
    }
  }, [
    detectedNote,
    state.currentIndex,
    state.isComplete,
    tablature,
    waitMode,
    isListening,
    checkNoteMatch,
    onNoteHit,
  ]);

  // Call onComplete when finished
  useEffect(() => {
    if (state.isComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [state.isComplete, onComplete]);

  // Reset when silence detected
  useEffect(() => {
    if (!detectedNote) {
      lastDetectedRef.current = null;
    }
  }, [detectedNote]);

  // Set current note on mount and index change
  useEffect(() => {
    if (!state.isComplete && state.currentIndex < tablature.length) {
      dispatch({ type: "SET_CURRENT", index: state.currentIndex });
    }
  }, [state.currentIndex, state.isComplete, tablature.length]);

  // Auto-scroll to keep current note visible
  useEffect(() => {
    if (!containerRef.current) return;
    const noteWidth = 80; // Approximate width per note
    const scrollPosition = state.currentIndex * noteWidth - 200; // Keep current note centered-ish
    containerRef.current.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  }, [state.currentIndex]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Tab scroll container */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden py-4 scrollbar-hide"
      >
        <div className="flex items-center gap-2 min-w-max px-8">
          {tablature.map((note, index) => (
            <TabNoteDisplay
              key={index}
              note={note}
              state={state.noteStates[index]}
              isCurrent={index === state.currentIndex && !state.isComplete}
            />
          ))}

          {/* End marker */}
          <div className="w-16 h-20 flex items-center justify-center text-muted-foreground">
            🎵
          </div>
        </div>

        {/* Playhead indicator */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary/50 pointer-events-none" />
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(state.currentIndex / tablature.length) * 100}%` }}
        />
      </div>

      {/* Current note info */}
      {!state.isComplete && state.currentIndex < tablature.length && (
        <div className="text-center text-sm text-muted-foreground">
          Note {state.currentIndex + 1} of {tablature.length}
          {waitMode && " • Wait Mode ON"}
        </div>
      )}

      {state.isComplete && (
        <div className="text-center text-lg font-semibold text-correct">
          ✓ Complete!
        </div>
      )}
    </div>
  );
}

interface TabNoteDisplayProps {
  note: TabNote;
  state: NoteState;
  isCurrent: boolean;
}

function TabNoteDisplay({ note, state, isCurrent }: TabNoteDisplayProps) {
  const isBlow = note.direction === "blow";
  const hasBend = note.bend && note.bend < 0;

  // Width based on duration (quarter note = base width)
  const baseWidth = 64;
  const width = baseWidth * note.duration;

  // Colors based on state
  const getBgColor = () => {
    switch (state.status) {
      case "correct":
        return "bg-correct";
      case "incorrect":
        return "bg-wrong";
      case "missed":
        return "bg-muted";
      case "current":
        return isBlow ? "bg-blow" : "bg-draw";
      default:
        return isBlow ? "bg-blow/30" : "bg-draw/30";
    }
  };

  const getTextColor = () => {
    if (state.status === "correct" || state.status === "incorrect" || state.status === "current") {
      return "text-white";
    }
    return isBlow ? "text-blow" : "text-draw";
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-150",
        getBgColor(),
        getTextColor(),
        isCurrent && "scale-110 shadow-lg ring-2 ring-primary animate-pulse",
        state.status === "upcoming" && "border-border",
        state.status === "current" && (isBlow ? "border-blow" : "border-draw"),
        state.status === "correct" && "border-correct",
        state.status === "incorrect" && "border-wrong"
      )}
      style={{ width: `${width}px`, height: "80px" }}
    >
      {/* Hole number */}
      <span className="text-2xl font-bold">{note.hole}</span>

      {/* Direction arrow */}
      <span className="text-sm">
        {isBlow ? "↑" : "↓"}
        {hasBend && "'".repeat(Math.abs(note.bend!))}
      </span>

      {/* Bend indicator */}
      {hasBend && (
        <span className="absolute -bottom-1 text-xs bg-draw text-white px-1 rounded">
          bend
        </span>
      )}

      {/* Status indicator */}
      {state.status === "correct" && (
        <span className="absolute -top-2 -right-2 text-lg">✓</span>
      )}
      {state.status === "incorrect" && (
        <span className="absolute -top-2 -right-2 text-lg">✗</span>
      )}
    </div>
  );
}
