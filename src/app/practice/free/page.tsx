"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff, AlertCircle, Radio, X, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { HarmonicaDiagram } from "@/components";

export default function FreePlayPage() {
  const {
    isActive,
    isRequesting,
    isError,
    error,
    hole,
    direction,
    frequency,
    centsOff,
    isBend,
    isClean,
    bleedSeverity,
    toggle,
  } = useAudio();

  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <main className={`practice-immersive flex flex-col page-enter ${isFullscreen ? "practice-fullscreen" : ""}`}>
      {/* Header - Minimal in fullscreen */}
      <header className={`flex items-center justify-between p-4 ${isFullscreen ? "absolute top-0 left-0 right-0 z-10 safe-area-top" : "border-b border-border"}`}>
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group tap-target"
        >
          {isFullscreen ? (
            <X size={24} onClick={(e) => { e.preventDefault(); setIsFullscreen(false); }} />
          ) : (
            <>
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <Radio size={18} className="text-amber" />
          <h1 className="font-display text-lg sm:text-xl">Free Play</h1>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="tap-target text-muted-foreground hover:text-foreground transition-colors"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </header>

      {/* Main Content - Centered and immersive */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 gap-6 sm:gap-8">
        {/* Status Badge */}
        {isActive && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-correct/10 border border-correct/30">
            <span className="w-2 h-2 rounded-full bg-correct animate-pulse" />
            <span className="text-correct text-sm font-medium">Listening...</span>
          </div>
        )}

        {/* Large Visual Feedback Indicator */}
        <div className={`feedback-indicator ${hole && direction ? (isClean ? "correct" : "wrong") : isActive ? "waiting" : ""}`}>
          {hole && direction ? (
            <div className="text-center">
              <div className="font-display text-responsive-3xl">
                {hole}
                <span className={direction === "blow" ? "text-blow" : "text-draw"}>
                  {direction === "blow" ? "↑" : "↓"}
                </span>
              </div>
            </div>
          ) : isActive ? (
            <div className="sound-wave scale-150">
              <span /><span /><span /><span /><span />
            </div>
          ) : (
            <Mic size={40} className="text-muted-foreground" />
          )}
        </div>

        {/* Harmonica Diagram - Responsive size */}
        <div className="glass-card p-4 sm:p-8 rounded-2xl w-full max-w-lg">
          <HarmonicaDiagram
            activeHole={hole}
            activeDirection={direction}
            isClean={isClean}
            bleedSeverity={bleedSeverity}
            centsOff={centsOff}
            isBend={isBend}
            size="lg"
          />
        </div>

        {/* Detection Info */}
        <div className="text-center space-y-3 min-h-[120px]">
          {hole && direction ? (
            <>
              <div className="flex items-center justify-center gap-3 text-base sm:text-lg">
                <span className={direction === "blow" ? "text-blow" : "text-draw"}>
                  {direction === "blow" ? "Blow" : "Draw"}
                </span>
                {isBend && (
                  <span className="px-2 py-0.5 rounded-md bg-draw/20 text-draw text-sm font-medium">
                    BEND
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="font-mono bg-secondary px-2 py-1 rounded">{frequency.toFixed(1)} Hz</span>
                <span
                  className={`font-medium px-2 py-1 rounded ${
                    Math.abs(centsOff) <= 10
                      ? "bg-correct/20 text-correct"
                      : Math.abs(centsOff) <= 25
                        ? "bg-close/20 text-close"
                        : "bg-wrong/20 text-wrong"
                  }`}
                >
                  {centsOff > 0 ? "+" : ""}{Math.round(centsOff)}¢
                </span>
              </div>
              {!isClean && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bleed/10 border border-bleed/30 text-bleed">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Bleed detected - focus your airflow</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <div className="font-display text-xl sm:text-2xl text-muted-foreground">
                {isRequesting
                  ? "Requesting microphone..."
                  : isActive
                    ? "Play a note..."
                    : "Press Start to begin"}
              </div>
              {!isActive && !isRequesting && (
                <p className="text-sm text-muted-foreground/70">
                  Practice any notes freely without a lesson
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error display */}
        {isError && error && (
          <div className="flex items-center gap-2 text-wrong bg-wrong/10 border border-wrong/30 px-4 py-3 rounded-xl max-w-md">
            <AlertCircle size={20} />
            <span className="text-sm">{error.message}</span>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="p-4 sm:p-6 safe-area-bottom">
        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
          {/* Large Mic Button */}
          <button
            onClick={toggle}
            disabled={isRequesting}
            className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl sm:rounded-3xl transition-all disabled:opacity-50 ${
              isActive
                ? "bg-gradient-to-br from-wrong to-red-700 text-white shadow-lg shadow-wrong/30 mic-pulse"
                : "bg-gradient-to-br from-amber to-amber-dark text-background shadow-lg shadow-amber/30 hover:shadow-amber/50 hover:scale-105"
            }`}
          >
            {isActive ? <MicOff size={36} /> : <Mic size={36} />}
          </button>

          <p className="text-sm text-muted-foreground">
            {isRequesting
              ? "Waiting for permission..."
              : isActive
                ? "Tap to stop"
                : "Tap to start"}
          </p>

          {/* Quick tips */}
          {!isActive && (
            <div className="text-center text-xs text-muted-foreground/70 max-w-xs">
              <p>Hold harmonica with holes facing you. Blow gently through one hole at a time.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
