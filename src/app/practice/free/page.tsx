"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff, AlertCircle } from "lucide-react";
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
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1 className="text-lg font-semibold">Free Play</h1>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        {/* Harmonica Diagram */}
        <HarmonicaDiagram
          activeHole={hole}
          activeDirection={direction}
          isClean={isClean}
          bleedSeverity={bleedSeverity}
          centsOff={centsOff}
          isBend={isBend}
          size="lg"
        />

        {/* Detection Info */}
        <div className="text-center space-y-2">
          {hole && direction ? (
            <>
              <div className="text-4xl font-bold">
                Hole {hole}{" "}
                <span className={direction === "blow" ? "text-blow" : "text-draw"}>
                  {direction === "blow" ? "↑ Blow" : "↓ Draw"}
                </span>
                {isBend && <span className="text-draw ml-2">BEND</span>}
              </div>
              <div className="text-muted-foreground">
                {frequency.toFixed(1)} Hz
                <span
                  className={`ml-4 ${
                    Math.abs(centsOff) <= 10
                      ? "text-correct"
                      : Math.abs(centsOff) <= 25
                        ? "text-close"
                        : "text-wrong"
                  }`}
                >
                  {centsOff > 0 ? "+" : ""}
                  {Math.round(centsOff)} cents
                </span>
              </div>
              {!isClean && (
                <div className="text-bleed font-medium">
                  ⚠ Bleed detected - focus your airflow
                </div>
              )}
            </>
          ) : (
            <div className="text-2xl text-muted-foreground">
              {isRequesting
                ? "Requesting microphone access..."
                : isActive
                  ? "Play a note..."
                  : "Press Start to begin"}
            </div>
          )}
        </div>

        {/* Error display */}
        {isError && error && (
          <div className="flex items-center gap-2 text-wrong bg-wrong/10 px-4 py-2 rounded-lg">
            <AlertCircle size={20} />
            <span>{error.message}</span>
          </div>
        )}

        {/* Mic Button */}
        <button
          onClick={toggle}
          disabled={isRequesting}
          className={`w-20 h-20 flex items-center justify-center rounded-full transition-all disabled:opacity-50 ${
            isActive
              ? "bg-wrong text-white animate-pulse"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isActive ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
        <p className="text-sm text-muted-foreground">
          {isRequesting
            ? "Waiting for permission..."
            : isActive
              ? "Tap to stop listening"
              : "Tap to start listening"}
        </p>
      </div>
    </main>
  );
}
