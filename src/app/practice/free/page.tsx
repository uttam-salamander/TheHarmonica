"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { useState } from "react";

export default function FreePlayPage() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState<{
    hole: number;
    direction: "blow" | "draw";
    frequency: number;
    bend: number;
  } | null>(null);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1 className="text-lg font-semibold">Free Play</h1>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        {/* Harmonica Diagram */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hole) => (
            <div
              key={hole}
              className={`w-14 h-20 flex items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all ${
                detectedNote?.hole === hole
                  ? detectedNote.direction === "blow"
                    ? "bg-blow/30 border-blow text-blow scale-110"
                    : "bg-draw/30 border-draw text-draw scale-110"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {hole}
            </div>
          ))}
        </div>

        {/* Detection Info */}
        <div className="text-center space-y-2">
          {detectedNote ? (
            <>
              <div className="text-4xl font-bold">
                Hole {detectedNote.hole}{" "}
                <span className={detectedNote.direction === "blow" ? "text-blow" : "text-draw"}>
                  {detectedNote.direction === "blow" ? "↑ Blow" : "↓ Draw"}
                </span>
              </div>
              <div className="text-muted-foreground">
                {detectedNote.frequency.toFixed(1)} Hz
                {detectedNote.bend !== 0 && (
                  <span className="ml-2 text-draw">
                    Bend: {detectedNote.bend > 0 ? "+" : ""}{detectedNote.bend} cents
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-2xl text-muted-foreground">
              {isListening ? "Play a note..." : "Press Start to begin"}
            </div>
          )}
        </div>

        {/* Mic Button */}
        <button
          onClick={() => setIsListening(!isListening)}
          className={`w-20 h-20 flex items-center justify-center rounded-full transition-all ${
            isListening
              ? "bg-wrong text-white animate-pulse"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
        <p className="text-sm text-muted-foreground">
          {isListening ? "Tap to stop listening" : "Tap to start listening"}
        </p>
      </div>
    </main>
  );
}
