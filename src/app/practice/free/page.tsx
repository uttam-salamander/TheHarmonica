"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff, AlertCircle, Radio } from "lucide-react";
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

  return (
    <main className="min-h-screen flex flex-col page-enter">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <Radio size={18} className="text-amber" />
          <h1 className="font-display text-xl">Free Play</h1>
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        {/* Status Badge */}
        {isActive && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-correct/10 border border-correct/30">
            <span className="w-2 h-2 rounded-full bg-correct animate-pulse" />
            <span className="text-correct text-sm font-medium">Listening...</span>
          </div>
        )}

        {/* Harmonica Diagram */}
        <div className="glass-card p-8 rounded-2xl">
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
        <div className="text-center space-y-3">
          {hole && direction ? (
            <>
              <div className="font-display text-5xl md:text-6xl">
                <span className="text-foreground">{hole}</span>
                <span className={direction === "blow" ? "text-blow" : "text-draw"}>
                  {direction === "blow" ? "↑" : "↓"}
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
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
                <span className="font-mono">{frequency.toFixed(1)} Hz</span>
                <span className="text-border">•</span>
                <span
                  className={`font-medium ${
                    Math.abs(centsOff) <= 10
                      ? "text-correct"
                      : Math.abs(centsOff) <= 25
                        ? "text-close"
                        : "text-wrong"
                  }`}
                >
                  {centsOff > 0 ? "+" : ""}
                  {Math.round(centsOff)}¢
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
              <div className="font-display text-2xl text-muted-foreground">
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
          <div className="flex items-center gap-2 text-wrong bg-wrong/10 border border-wrong/30 px-4 py-3 rounded-xl">
            <AlertCircle size={20} />
            <span>{error.message}</span>
          </div>
        )}

        {/* Mic Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={toggle}
            disabled={isRequesting}
            className={`w-20 h-20 flex items-center justify-center rounded-2xl transition-all disabled:opacity-50 ${
              isActive
                ? "bg-gradient-to-br from-wrong to-red-700 text-white shadow-lg shadow-wrong/30 mic-pulse"
                : "bg-gradient-to-br from-amber to-amber-dark text-background shadow-lg shadow-amber/30 hover:shadow-amber/50 hover:scale-105"
            }`}
          >
            {isActive ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          <p className="text-sm text-muted-foreground">
            {isRequesting
              ? "Waiting for permission..."
              : isActive
                ? "Tap to stop"
                : "Tap to start"}
          </p>
        </div>
      </div>
    </main>
  );
}
