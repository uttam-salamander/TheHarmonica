"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
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
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1 className="text-lg font-semibold">Bending Gym - {currentEx.name}</h1>
        <div className="text-sm text-muted-foreground">
          Exercise {currentExercise + 1} / {exercises.length}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8">
        {/* Target Info */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold">
            Target: Hole {currentEx.hole} {currentEx.direction === "blow" ? "Blow" : "Draw"}
          </div>
          <div className="text-muted-foreground">
            Bend to {currentEx.targetBend} cents
          </div>
        </div>

        {/* Pitch Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md h-80 bg-card rounded-lg border border-border">
            {/* Natural note line */}
            <div className="absolute top-8 left-0 right-0 flex items-center gap-2 px-4">
              <div className="flex-1 h-px bg-muted" />
              <span className="text-sm text-muted-foreground">Natural (0 cents)</span>
            </div>

            {/* Target line */}
            <div
              className="absolute left-0 right-0 flex items-center gap-2 px-4"
              style={{ top: `${32 + Math.abs(currentEx.targetBend) * 2}px` }}
            >
              <div className="flex-1 h-1 bg-correct" />
              <span className="text-sm text-correct font-medium">
                TARGET ({currentEx.targetBend} cents)
              </span>
            </div>

            {/* User pitch cursor */}
            <div
              className="absolute left-1/2 -translate-x-1/2 text-4xl transition-all duration-100"
              style={{ top: `${32 + Math.abs(userPitch) * 2}px` }}
            >
              ✈️
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-8 left-0 right-0 flex items-center gap-2 px-4">
              <div className="flex-1 h-px bg-muted" />
              <span className="text-sm text-muted-foreground">-150 cents</span>
            </div>
          </div>
        </div>

        {/* Hold Timer */}
        <div className="text-center mt-8">
          <div className="text-xl">
            HOLD FOR: <span className="font-mono">{holdTime.toFixed(1)}</span> / {targetHoldTime}.0 seconds
          </div>
          <div className="mt-2 w-64 mx-auto h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-correct transition-all"
              style={{ width: `${(holdTime / targetHoldTime) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
            disabled={currentExercise === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <button
            onClick={() => setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1))}
            disabled={currentExercise === exercises.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
