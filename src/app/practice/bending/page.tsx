"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Target, Waves } from "lucide-react";
import { useState } from "react";

export default function BendingGymPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- will be used when audio integration is complete
  const [holdTime, setHoldTime] = useState(0);
  const targetHoldTime = 3;

  const exercises: Array<{ hole: number; direction: "blow" | "draw"; targetBend: number; name: string }> = [
    { hole: 4, direction: "draw", targetBend: -50, name: "4-Draw Half-Step" },
    { hole: 4, direction: "draw", targetBend: -100, name: "4-Draw Full-Step" },
    { hole: 1, direction: "draw", targetBend: -50, name: "1-Draw Half-Step" },
    { hole: 3, direction: "draw", targetBend: -50, name: "3-Draw Half-Step" },
    { hole: 3, direction: "draw", targetBend: -100, name: "3-Draw Full-Step" },
  ];

  const currentEx = exercises[currentExercise];
  const userPitch = -30; // Simulated user pitch

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
          <Target size={18} className="text-draw" />
          <h1 className="font-display text-xl">Bending Gym</h1>
        </div>
        <div className="px-3 py-1 rounded-full bg-draw/10 text-draw text-sm font-medium">
          {currentExercise + 1}/{exercises.length}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 md:p-8">
        {/* Exercise Info Card */}
        <div className="glass-card rounded-xl p-6 mb-6 border-accent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-draw/20 flex items-center justify-center">
              <Waves className="w-6 h-6 text-draw" />
            </div>
            <div>
              <h2 className="font-display text-2xl">{currentEx.name}</h2>
              <p className="text-sm text-muted-foreground">
                Hole {currentEx.hole} • {currentEx.direction === "blow" ? "Blow" : "Draw"} • Bend to {currentEx.targetBend}¢
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="font-display text-2xl text-draw">{currentEx.hole}</div>
              <div className="text-xs text-muted-foreground">Hole</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="font-display text-2xl text-draw">
                {currentEx.direction === "blow" ? "↑" : "↓"}
              </div>
              <div className="text-xs text-muted-foreground">Direction</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="font-display text-2xl text-correct">{currentEx.targetBend}¢</div>
              <div className="text-xs text-muted-foreground">Target</div>
            </div>
          </div>
        </div>

        {/* Pitch Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg h-80 glass-card rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-draw/5 to-draw/10" />

            {/* Natural note line */}
            <div className="absolute top-8 left-0 right-0 flex items-center gap-3 px-6">
              <div className="flex-1 h-px bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded bg-secondary/50">
                Natural (0¢)
              </span>
            </div>

            {/* Target zone */}
            <div
              className="absolute left-6 right-6 h-12 rounded-lg bg-correct/10 border-2 border-correct/50 border-dashed"
              style={{ top: `${32 + Math.abs(currentEx.targetBend) * 2 - 24}px` }}
            />

            {/* Target line */}
            <div
              className="absolute left-0 right-0 flex items-center gap-3 px-6"
              style={{ top: `${32 + Math.abs(currentEx.targetBend) * 2}px` }}
            >
              <div className="flex-1 h-1 bg-correct rounded-full shadow-lg shadow-correct/50" />
              <span className="text-xs text-correct font-bold px-2 py-1 rounded bg-correct/20">
                TARGET ({currentEx.targetBend}¢)
              </span>
            </div>

            {/* User pitch cursor */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-100 flex flex-col items-center"
              style={{ top: `${32 + Math.abs(userPitch) * 2 - 16}px` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center shadow-lg shadow-amber/50">
                <div className="w-3 h-3 rounded-full bg-background" />
              </div>
              <div className="mt-1 text-xs font-mono text-amber">{userPitch}¢</div>
            </div>

            {/* Scale markers */}
            <div className="absolute left-4 top-8 bottom-8 flex flex-col justify-between text-xs text-muted-foreground/50">
              <span>0</span>
              <span>-50</span>
              <span>-100</span>
              <span>-150</span>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center gap-3 px-6">
              <div className="flex-1 h-px bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded bg-secondary/50">
                -150¢ (Max Bend)
              </span>
            </div>
          </div>
        </div>

        {/* Hold Timer */}
        <div className="mt-6 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Hold in target zone</span>
            <span className="font-display text-xl">
              <span className="text-amber">{holdTime.toFixed(1)}</span>
              <span className="text-muted-foreground"> / {targetHoldTime}.0s</span>
            </span>
          </div>
          <div className="progress-bar h-4">
            <div
              className="progress-bar-fill"
              style={{ width: `${(holdTime / targetHoldTime) * 100}%` }}
            />
          </div>
          {holdTime >= targetHoldTime && (
            <div className="mt-3 text-center text-correct font-medium">
              ✓ Exercise complete!
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <button
            onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
            disabled={currentExercise === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Previous</span>
          </button>
          <button
            onClick={() => setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1))}
            disabled={currentExercise === exercises.length - 1}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-draw to-purple-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-draw/30"
          >
            <span className="font-medium">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
