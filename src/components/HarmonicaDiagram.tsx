"use client";

import { cn } from "@/lib/utils";
import type { Direction, HoleNotes, HoleBends } from "@/lib/audio";

/**
 * Format note name for display (e.g., "C4" → "C", "C#5" → "C#")
 * Removes octave number for cleaner diagram display
 */
function formatNoteName(noteName: string): string {
  return noteName.replace(/\d+$/, "");
}

interface HarmonicaDiagramProps {
  /** Currently active hole (1-10), or null if none */
  activeHole?: number | null;
  /** Direction of the active note */
  activeDirection?: Direction | null;
  /** Whether the note is clean (no bleed) */
  isClean?: boolean;
  /** Bleed severity (0-1) */
  bleedSeverity?: number;
  /** Cents deviation from pitch */
  centsOff?: number;
  /** Whether a bend is detected */
  isBend?: boolean;
  /** Optional target hole to highlight */
  targetHole?: number | null;
  /** Optional target direction */
  targetDirection?: Direction | null;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show note labels above/below holes */
  showLabels?: boolean;
  /** Note names for each hole (from NoteMapper.getHoleNotes()) */
  holeNotes?: Record<number, HoleNotes>;
  /** Bend note names for each hole (from NoteMapper.getHoleBends()) */
  holeBends?: Record<number, HoleBends>;
  /** Additional class names */
  className?: string;
}

/**
 * Visual representation of a 10-hole diatonic harmonica.
 * Shows real-time highlighting of played notes with feedback colors.
 */
export function HarmonicaDiagram({
  activeHole = null,
  activeDirection = null,
  isClean = true,
  bleedSeverity = 0,
  centsOff = 0,
  isBend = false,
  targetHole = null,
  targetDirection = null,
  size = "md",
  showLabels = true,
  holeNotes,
  holeBends,
  className,
}: HarmonicaDiagramProps) {
  const holes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const sizeClasses = {
    sm: "h-12 text-sm gap-0.5",
    md: "h-16 text-base gap-1",
    lg: "h-20 text-lg gap-1.5",
  };

  const holeSizeClasses = {
    sm: "w-8 text-xs",
    md: "w-10 text-sm",
    lg: "w-12 text-base",
  };

  const labelSizeClasses = {
    sm: "text-[10px] w-8",
    md: "text-xs w-10",
    lg: "text-sm w-12",
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {/* Blow notes row (top) */}
      {showLabels && holeNotes && (
        <div className="flex items-end justify-center gap-0.5 md:gap-1">
          {holes.map((hole) => {
            const notes = holeNotes[hole];
            const bends = holeBends?.[hole];
            const isActive = activeHole === hole && activeDirection === "blow";
            const isTarget = targetHole === hole && targetDirection === "blow";

            return (
              <div key={hole} className={cn("flex flex-col items-center", labelSizeClasses[size])}>
                {/* Blow bends (if any) - shown smaller above */}
                {bends?.blowBends && bends.blowBends.length > 0 && (
                  <div className="flex flex-col items-center opacity-50 text-[8px] leading-tight">
                    {bends.blowBends.map((bend, i) => (
                      <span key={i} className="text-blow">{formatNoteName(bend)}&apos;</span>
                    ))}
                  </div>
                )}
                {/* Main blow note */}
                <span
                  className={cn(
                    "font-mono transition-all",
                    isActive && "text-blow font-bold scale-110",
                    isTarget && "text-blow/70 animate-pulse",
                    !isActive && !isTarget && "text-blow/40"
                  )}
                >
                  {notes ? formatNoteName(notes.blow) : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Harmonica body */}
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-card border border-border p-2",
          sizeClasses[size]
        )}
      >
        {holes.map((hole) => (
          <Hole
            key={hole}
            number={hole}
            isActive={activeHole === hole}
            activeDirection={activeHole === hole ? activeDirection : null}
            isTarget={targetHole === hole}
            targetDirection={targetHole === hole ? targetDirection : null}
            isClean={isClean}
            bleedSeverity={bleedSeverity}
            sizeClass={holeSizeClasses[size]}
          />
        ))}
      </div>

      {/* Draw notes row (bottom) */}
      {showLabels && holeNotes && (
        <div className="flex items-start justify-center gap-0.5 md:gap-1">
          {holes.map((hole) => {
            const notes = holeNotes[hole];
            const bends = holeBends?.[hole];
            const isActive = activeHole === hole && activeDirection === "draw";
            const isTarget = targetHole === hole && targetDirection === "draw";

            return (
              <div key={hole} className={cn("flex flex-col items-center", labelSizeClasses[size])}>
                {/* Main draw note */}
                <span
                  className={cn(
                    "font-mono transition-all",
                    isActive && "text-draw font-bold scale-110",
                    isTarget && "text-draw/70 animate-pulse",
                    !isActive && !isTarget && "text-draw/40"
                  )}
                >
                  {notes ? formatNoteName(notes.draw) : ""}
                </span>
                {/* Draw bends (if any) - shown smaller below */}
                {bends?.drawBends && bends.drawBends.length > 0 && (
                  <div className="flex flex-col items-center opacity-50 text-[8px] leading-tight">
                    {bends.drawBends.map((bend, i) => (
                      <span key={i} className="text-draw">{formatNoteName(bend)}&apos;</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback display */}
      {activeHole && (
        <div className="flex items-center gap-4 text-sm">
          {/* Note info */}
          <span
            className={cn(
              "font-mono font-semibold",
              activeDirection === "blow" ? "text-blow" : "text-draw"
            )}
          >
            {activeHole}
            {activeDirection === "blow" ? "↑" : "↓"}
            {isBend && "'"}
          </span>

          {/* Pitch accuracy */}
          <span
            className={cn(
              "font-mono",
              Math.abs(centsOff) <= 10
                ? "text-correct"
                : Math.abs(centsOff) <= 25
                  ? "text-close"
                  : "text-wrong"
            )}
          >
            {centsOff > 0 ? "+" : ""}
            {Math.round(centsOff)}¢
          </span>

          {/* Bleed indicator */}
          {!isClean && (
            <span className="text-bleed font-medium">
              BLEED {Math.round(bleedSeverity * 100)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface HoleProps {
  number: number;
  isActive: boolean;
  activeDirection: Direction | null;
  isTarget: boolean;
  targetDirection: Direction | null;
  isClean: boolean;
  bleedSeverity: number;
  sizeClass: string;
}

function Hole({
  number,
  isActive,
  activeDirection,
  isTarget,
  targetDirection,
  isClean,
  bleedSeverity,
  sizeClass,
}: HoleProps) {
  // Determine background color based on state
  const getBackgroundClass = () => {
    if (isActive) {
      if (!isClean && bleedSeverity > 0.3) {
        return "bg-bleed";
      }
      return activeDirection === "blow" ? "bg-blow" : "bg-draw";
    }
    if (isTarget) {
      return targetDirection === "blow"
        ? "bg-blow/30 ring-2 ring-blow animate-pulse"
        : "bg-draw/30 ring-2 ring-draw animate-pulse";
    }
    return "bg-secondary";
  };

  // Text color
  const getTextClass = () => {
    if (isActive || isTarget) {
      return "text-white font-bold";
    }
    return "text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded transition-all duration-75",
        sizeClass,
        getBackgroundClass(),
        getTextClass(),
        isActive && "scale-110 shadow-lg"
      )}
    >
      {number}
    </div>
  );
}
