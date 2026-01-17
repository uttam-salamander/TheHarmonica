"use client";

import { cn } from "@/lib/utils";
import type { Direction, HoleNotes, HoleBends } from "@/lib/audio";

/**
 * Format note name for display (e.g., "C4" → "C", "C#5" → "C#")
 */
function formatNoteName(noteName: string): string {
  return noteName.replace(/\d+$/, "");
}

interface HarmonicaDiagramProps {
  activeHole?: number | null;
  activeDirection?: Direction | null;
  isClean?: boolean;
  bleedSeverity?: number;
  centsOff?: number;
  isBend?: boolean;
  targetHole?: number | null;
  targetDirection?: Direction | null;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  holeNotes?: Record<number, HoleNotes>;
  holeBends?: Record<number, HoleBends>;
  mobileRotated?: boolean;
  className?: string;
}

/**
 * Premium visual representation of a 10-hole diatonic harmonica.
 * Vintage Blues aesthetic with metallic body and warm amber accents.
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
  mobileRotated = false,
  className,
}: HarmonicaDiagramProps) {
  const holes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Render the premium harmonica for mobile rotated view
  if (mobileRotated) {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        {/* Mobile: Vertical Premium Layout */}
        <div className="flex md:hidden flex-col items-center">
          {/* The Harmonica Body - Vertical */}
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-b from-amber/5 via-transparent to-amber/5 rounded-3xl blur-xl" />

            {/* Main harmonica container */}
            <div className="relative flex flex-row items-stretch gap-0">
              {/* Left cover plate (Blow side) */}
              <div className="relative flex flex-col items-center justify-between py-3 px-2 rounded-l-2xl bg-gradient-to-r from-amber-dark/80 via-amber/60 to-amber/40 border-l-2 border-y-2 border-amber/30">
                {/* Decorative screws */}
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
                <div className="flex-1 flex flex-col items-center justify-center gap-1 my-2">
                  <span className="text-[9px] font-bold tracking-widest text-amber-dark/80 uppercase [writing-mode:vertical-lr] rotate-180">Blow</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
              </div>

              {/* Note labels - Blow (left of holes) */}
              {showLabels && holeNotes && (
                <div className="flex flex-col items-end justify-center gap-[2px] px-3 py-3 bg-gradient-to-r from-amber/10 via-amber/5 to-transparent rounded-l-lg">
                  {holes.map((hole) => {
                    const notes = holeNotes[hole];
                    const isActive = activeHole === hole && activeDirection === "blow";
                    const isTarget = targetHole === hole && targetDirection === "blow";

                    return (
                      <div key={hole} className="h-9 flex items-center justify-end">
                        <span
                          className={cn(
                            "font-display text-sm font-semibold tracking-wide transition-all duration-150",
                            isActive && "text-blow font-bold scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]",
                            isTarget && "text-blow animate-pulse",
                            !isActive && !isTarget && "text-blow/70"
                          )}
                        >
                          {notes ? formatNoteName(notes.blow) : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Center - Comb with holes */}
              <div className="relative flex flex-col items-center py-3 px-1">
                {/* Wood grain texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 opacity-90" />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(255,255,255,0.1) 2px,
                      rgba(255,255,255,0.1) 4px
                    )`
                  }}
                />

                {/* Holes */}
                <div className="relative flex flex-col gap-[2px]">
                  {holes.map((hole) => (
                    <HolePremium
                      key={hole}
                      number={hole}
                      isActive={activeHole === hole}
                      activeDirection={activeHole === hole ? activeDirection : null}
                      isTarget={targetHole === hole}
                      targetDirection={targetHole === hole ? targetDirection : null}
                      isClean={isClean}
                      bleedSeverity={bleedSeverity}
                      variant="vertical"
                    />
                  ))}
                </div>
              </div>

              {/* Note labels - Draw (right of holes) */}
              {showLabels && holeNotes && (
                <div className="flex flex-col items-start justify-center gap-[2px] px-3 py-3 bg-gradient-to-l from-amber/10 via-amber/5 to-transparent rounded-r-lg">
                  {holes.map((hole) => {
                    const notes = holeNotes[hole];
                    const bends = holeBends?.[hole];
                    const isActive = activeHole === hole && activeDirection === "draw";
                    const isTarget = targetHole === hole && targetDirection === "draw";

                    return (
                      <div key={hole} className="h-9 flex items-center gap-1">
                        <span
                          className={cn(
                            "font-display text-sm font-semibold tracking-wide transition-all duration-150",
                            isActive && "text-draw font-bold scale-110 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]",
                            isTarget && "text-draw animate-pulse",
                            !isActive && !isTarget && "text-draw/70"
                          )}
                        >
                          {notes ? formatNoteName(notes.draw) : ""}
                        </span>
                        {bends?.drawBends && bends.drawBends.length > 0 && (
                          <span className="text-[8px] text-draw/50 font-mono">
                            {bends.drawBends.length > 0 && `+${bends.drawBends.length}`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Right cover plate (Draw side) */}
              <div className="relative flex flex-col items-center justify-between py-3 px-2 rounded-r-2xl bg-gradient-to-l from-amber-dark/80 via-amber/60 to-amber/40 border-r-2 border-y-2 border-amber/30">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
                <div className="flex-1 flex flex-col items-center justify-center gap-1 my-2">
                  <span className="text-[9px] font-bold tracking-widest text-amber-dark/80 uppercase [writing-mode:vertical-lr] rotate-180">Draw</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal Premium Layout */}
        <div className="hidden md:flex flex-col items-center">
          <HarmonicaHorizontal
            holes={holes}
            activeHole={activeHole}
            activeDirection={activeDirection}
            targetHole={targetHole}
            targetDirection={targetDirection}
            isClean={isClean}
            bleedSeverity={bleedSeverity}
            showLabels={showLabels}
            holeNotes={holeNotes}
            holeBends={holeBends}
            size={size}
          />
        </div>

        {/* Feedback display */}
        <FeedbackDisplay
          activeHole={activeHole}
          activeDirection={activeDirection}
          isBend={isBend}
          centsOff={centsOff}
          isClean={isClean}
          bleedSeverity={bleedSeverity}
        />
      </div>
    );
  }

  // Default horizontal-only layout
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <HarmonicaHorizontal
        holes={holes}
        activeHole={activeHole}
        activeDirection={activeDirection}
        targetHole={targetHole}
        targetDirection={targetDirection}
        isClean={isClean}
        bleedSeverity={bleedSeverity}
        showLabels={showLabels}
        holeNotes={holeNotes}
        holeBends={holeBends}
        size={size}
      />
      <FeedbackDisplay
        activeHole={activeHole}
        activeDirection={activeDirection}
        isBend={isBend}
        centsOff={centsOff}
        isClean={isClean}
        bleedSeverity={bleedSeverity}
      />
    </div>
  );
}

// Horizontal harmonica layout component
function HarmonicaHorizontal({
  holes,
  activeHole,
  activeDirection,
  targetHole,
  targetDirection,
  isClean,
  bleedSeverity,
  showLabels,
  holeNotes,
  holeBends,
  size,
}: {
  holes: number[];
  activeHole: number | null;
  activeDirection: Direction | null;
  targetHole: number | null;
  targetDirection: Direction | null;
  isClean: boolean;
  bleedSeverity: number;
  showLabels: boolean;
  holeNotes?: Record<number, HoleNotes>;
  holeBends?: Record<number, HoleBends>;
  size: "sm" | "md" | "lg";
}) {
  const labelSizeClasses = {
    sm: "text-[10px] w-7",
    md: "text-xs w-9",
    lg: "text-sm w-11",
  };

  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber/5 via-transparent to-amber/5 rounded-3xl blur-xl" />

      <div className="relative flex flex-col items-center gap-0">
        {/* Top cover plate with blow notes */}
        <div className="relative flex items-end">
          {/* Left end cap */}
          <div className="w-4 h-8 rounded-tl-xl bg-gradient-to-b from-amber-dark/80 via-amber/60 to-amber/40 border-l-2 border-t-2 border-amber/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
          </div>

          {/* Blow notes row */}
          {showLabels && holeNotes && (
            <div className="flex items-end px-1 py-2 bg-gradient-to-b from-amber/15 via-amber/10 to-transparent rounded-t-lg">
              {holes.map((hole) => {
                const notes = holeNotes[hole];
                const bends = holeBends?.[hole];
                const isActive = activeHole === hole && activeDirection === "blow";
                const isTarget = targetHole === hole && targetDirection === "blow";

                return (
                  <div key={hole} className={cn("flex flex-col items-center", labelSizeClasses[size])}>
                    {bends?.blowBends && bends.blowBends.length > 0 && (
                      <div className="flex flex-col items-center opacity-50 text-[7px] leading-tight mb-0.5">
                        {bends.blowBends.slice(0, 2).map((bend, i) => (
                          <span key={i} className="text-blow">{formatNoteName(bend)}&apos;</span>
                        ))}
                      </div>
                    )}
                    <span
                      className={cn(
                        "font-display font-semibold tracking-wide transition-all duration-150",
                        isActive && "text-blow font-bold scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]",
                        isTarget && "text-blow animate-pulse",
                        !isActive && !isTarget && "text-blow/70"
                      )}
                    >
                      {notes ? formatNoteName(notes.blow) : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Right end cap */}
          <div className="w-4 h-8 rounded-tr-xl bg-gradient-to-b from-amber-dark/80 via-amber/60 to-amber/40 border-r-2 border-t-2 border-amber/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
          </div>
        </div>

        {/* Main comb body */}
        <div className="relative flex items-center">
          {/* Left brass plate */}
          <div className="w-4 h-12 bg-gradient-to-b from-amber/60 via-amber/40 to-amber/60 border-l-2 border-amber/30" />

          {/* Comb with holes */}
          <div className="relative flex items-center px-1 py-2">
            {/* Wood texture background */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.1) 2px,
                  rgba(255,255,255,0.1) 3px
                )`
              }}
            />

            <div className="relative flex gap-[2px]">
              {holes.map((hole) => (
                <HolePremium
                  key={hole}
                  number={hole}
                  isActive={activeHole === hole}
                  activeDirection={activeHole === hole ? activeDirection : null}
                  isTarget={targetHole === hole}
                  targetDirection={targetHole === hole ? targetDirection : null}
                  isClean={isClean}
                  bleedSeverity={bleedSeverity}
                  variant="horizontal"
                  size={size}
                />
              ))}
            </div>
          </div>

          {/* Right brass plate */}
          <div className="w-4 h-12 bg-gradient-to-b from-amber/60 via-amber/40 to-amber/60 border-r-2 border-amber/30" />
        </div>

        {/* Bottom cover plate with draw notes */}
        <div className="relative flex items-start">
          {/* Left end cap */}
          <div className="w-4 h-8 rounded-bl-xl bg-gradient-to-t from-amber-dark/80 via-amber/60 to-amber/40 border-l-2 border-b-2 border-amber/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
          </div>

          {/* Draw notes row */}
          {showLabels && holeNotes && (
            <div className="flex items-start px-1 py-2 bg-gradient-to-t from-amber/15 via-amber/10 to-transparent rounded-b-lg">
              {holes.map((hole) => {
                const notes = holeNotes[hole];
                const bends = holeBends?.[hole];
                const isActive = activeHole === hole && activeDirection === "draw";
                const isTarget = targetHole === hole && targetDirection === "draw";

                return (
                  <div key={hole} className={cn("flex flex-col items-center", labelSizeClasses[size])}>
                    <span
                      className={cn(
                        "font-display font-semibold tracking-wide transition-all duration-150",
                        isActive && "text-draw font-bold scale-110 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]",
                        isTarget && "text-draw animate-pulse",
                        !isActive && !isTarget && "text-draw/70"
                      )}
                    >
                      {notes ? formatNoteName(notes.draw) : ""}
                    </span>
                    {bends?.drawBends && bends.drawBends.length > 0 && (
                      <div className="flex flex-col items-center opacity-50 text-[7px] leading-tight mt-0.5">
                        {bends.drawBends.slice(0, 2).map((bend, i) => (
                          <span key={i} className="text-draw">{formatNoteName(bend)}&apos;</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Right end cap */}
          <div className="w-4 h-8 rounded-br-xl bg-gradient-to-t from-amber-dark/80 via-amber/60 to-amber/40 border-r-2 border-b-2 border-amber/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 shadow-inner" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium hole component with realistic depth
function HolePremium({
  number,
  isActive,
  activeDirection,
  isTarget,
  targetDirection,
  isClean,
  bleedSeverity,
  variant,
  size = "md",
}: {
  number: number;
  isActive: boolean;
  activeDirection: Direction | null;
  isTarget: boolean;
  targetDirection: Direction | null;
  isClean: boolean;
  bleedSeverity: number;
  variant: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  const verticalSize = "w-8 h-8 text-xs";

  const getGlowColor = () => {
    if (isActive) {
      if (!isClean && bleedSeverity > 0.3) {
        return "shadow-[0_0_20px_rgba(251,146,60,0.6),inset_0_2px_4px_rgba(0,0,0,0.5)]";
      }
      return activeDirection === "blow"
        ? "shadow-[0_0_20px_rgba(96,165,250,0.6),inset_0_2px_4px_rgba(0,0,0,0.3)]"
        : "shadow-[0_0_20px_rgba(167,139,250,0.6),inset_0_2px_4px_rgba(0,0,0,0.3)]";
    }
    if (isTarget) {
      return targetDirection === "blow"
        ? "shadow-[0_0_12px_rgba(96,165,250,0.4),inset_0_2px_4px_rgba(0,0,0,0.5)]"
        : "shadow-[0_0_12px_rgba(167,139,250,0.4),inset_0_2px_4px_rgba(0,0,0,0.5)]";
    }
    return "shadow-[inset_0_3px_6px_rgba(0,0,0,0.6),inset_0_-1px_2px_rgba(255,255,255,0.05)]";
  };

  const getBackgroundClass = () => {
    if (isActive) {
      if (!isClean && bleedSeverity > 0.3) {
        return "bg-gradient-to-b from-bleed/80 to-bleed/60";
      }
      return activeDirection === "blow"
        ? "bg-gradient-to-b from-blow/80 to-blow/60"
        : "bg-gradient-to-b from-draw/80 to-draw/60";
    }
    if (isTarget) {
      return targetDirection === "blow"
        ? "bg-gradient-to-b from-blow/30 to-blow/20 ring-2 ring-blow/50"
        : "bg-gradient-to-b from-draw/30 to-draw/20 ring-2 ring-draw/50";
    }
    return "bg-gradient-to-b from-stone-950 to-black";
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg transition-all duration-100",
        variant === "vertical" ? verticalSize : sizeClasses[size],
        getBackgroundClass(),
        getGlowColor(),
        isActive && "scale-105",
        isTarget && "animate-pulse"
      )}
    >
      {/* Inner highlight ring */}
      <div className="absolute inset-[2px] rounded-md border border-white/5" />

      {/* Hole number */}
      <span
        className={cn(
          "relative font-display font-bold tracking-tight",
          isActive || isTarget ? "text-white" : "text-stone-600"
        )}
      >
        {number}
      </span>

      {/* Active glow ring */}
      {isActive && (
        <div
          className={cn(
            "absolute -inset-1 rounded-xl opacity-30 animate-ping",
            activeDirection === "blow" ? "bg-blow" : "bg-draw"
          )}
          style={{ animationDuration: "1.5s" }}
        />
      )}
    </div>
  );
}

// Feedback display component
function FeedbackDisplay({
  activeHole,
  activeDirection,
  isBend,
  centsOff,
  isClean,
  bleedSeverity,
}: {
  activeHole: number | null;
  activeDirection: Direction | null;
  isBend: boolean;
  centsOff: number;
  isClean: boolean;
  bleedSeverity: number;
}) {
  if (!activeHole) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-stone-900/50 border border-stone-700/50 backdrop-blur-sm">
      {/* Note indicator */}
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "font-display text-2xl font-bold tracking-tight",
            activeDirection === "blow" ? "text-blow" : "text-draw"
          )}
        >
          {activeHole}
        </span>
        <span
          className={cn(
            "text-lg",
            activeDirection === "blow" ? "text-blow" : "text-draw"
          )}
        >
          {activeDirection === "blow" ? "↑" : "↓"}
        </span>
        {isBend && (
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-draw/20 text-draw border border-draw/30">
            BEND
          </span>
        )}
      </div>

      {/* Pitch accuracy */}
      <div
        className={cn(
          "font-mono text-sm font-medium px-2 py-1 rounded-md",
          Math.abs(centsOff) <= 10
            ? "bg-correct/20 text-correct"
            : Math.abs(centsOff) <= 25
              ? "bg-close/20 text-close"
              : "bg-wrong/20 text-wrong"
        )}
      >
        {centsOff > 0 ? "+" : ""}
        {Math.round(centsOff)}¢
      </div>

      {/* Bleed indicator */}
      {!isClean && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-bleed/20 text-bleed border border-bleed/30">
          <div className="w-1.5 h-1.5 rounded-full bg-bleed animate-pulse" />
          <span className="text-xs font-medium">
            {Math.round(bleedSeverity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
