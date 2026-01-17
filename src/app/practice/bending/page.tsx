"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Target, Waves, CheckCircle2, Trophy } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAudio } from "@/hooks/useAudio";
import { HarmonicaDiagram } from "@/components";
import { useAudioStore } from "@/stores/audioStore";

const exercises: Array<{
  hole: number;
  direction: "blow" | "draw";
  targetBend: number;
  name: string;
  tips: string[];
}> = [
  {
    hole: 4,
    direction: "draw",
    targetBend: -50,
    name: "4-Draw Half-Step",
    tips: ["Say 'ee-yow' while drawing", "Keep tongue relaxed at first"],
  },
  {
    hole: 4,
    direction: "draw",
    targetBend: -100,
    name: "4-Draw Full-Step",
    tips: ["Drop your jaw slightly", "Tongue moves back in mouth"],
  },
  {
    hole: 1,
    direction: "draw",
    targetBend: -50,
    name: "1-Draw Half-Step",
    tips: ["Needs more air than hole 4", "Open your throat wide"],
  },
  {
    hole: 3,
    direction: "draw",
    targetBend: -50,
    name: "3-Draw Half-Step",
    tips: ["This hole has 3 bend depths!", "Start with the easiest one"],
  },
  {
    hole: 3,
    direction: "draw",
    targetBend: -100,
    name: "3-Draw Full-Step",
    tips: ["Say 'eh' to find this bend", "Between half and full-step bend"],
  },
  {
    hole: 3,
    direction: "draw",
    targetBend: -150,
    name: "3-Draw 1.5-Step",
    tips: ["The deepest bend on hole 3", "Say 'aw' - jaw drops more"],
  },
];

export default function BendingGymPage() {
  const { isActive, toggle, centsOff, hole: detectedHole, direction: detectedDirection } = useAudio();

  const { noteMapper } = useAudioStore();
  const holeNotes = useMemo(() => noteMapper?.getHoleNotes(), [noteMapper]);
  const holeBends = useMemo(() => noteMapper?.getHoleBends(), [noteMapper]);

  const [currentExercise, setCurrentExercise] = useState(0);
  const [holdTime, setHoldTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>(new Array(exercises.length).fill(false));
  const targetHoldTime = 3;

  const currentEx = exercises[currentExercise];

  // Simulated pitch detection relative to target
  // In real app, this would come from audio analysis
  const userPitch = isActive && detectedHole === currentEx.hole && detectedDirection === currentEx.direction
    ? centsOff
    : 0;

  const isInTargetZone = Math.abs(userPitch - currentEx.targetBend) < 20;

  // Reset hold time when conditions change
  const shouldTrackHold = isActive && isInTargetZone;
  useEffect(() => {
    if (!shouldTrackHold) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHoldTime(0);
    }
  }, [shouldTrackHold]);

  // Hold time tracking (only runs when shouldTrackHold is true)
  useEffect(() => {
    if (!shouldTrackHold) {
      return;
    }

    const timer = setInterval(() => {
      setHoldTime((prev) => {
        const newTime = prev + 0.1;
        if (newTime >= targetHoldTime && !completedExercises[currentExercise]) {
          // Mark exercise complete
          setCompletedExercises((arr) => {
            const updated = [...arr];
            updated[currentExercise] = true;
            return updated;
          });
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [shouldTrackHold, currentExercise, completedExercises]);

  const goToExercise = useCallback((index: number) => {
    setCurrentExercise(index);
    setHoldTime(0);
  }, []);

  const completedCount = completedExercises.filter(Boolean).length;

  return (
    <main className="practice-immersive min-h-screen flex flex-col page-enter">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-area-top">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group tap-target"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <Target size={18} className="text-draw" />
          <h1 className="font-display text-lg sm:text-xl">Bending Gym</h1>
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber" />
          <span className="text-sm font-medium">{completedCount}/{exercises.length}</span>
        </div>
      </header>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 px-4 pb-2">
        {exercises.map((_, i) => (
          <button
            key={i}
            onClick={() => goToExercise(i)}
            className={`w-3 h-3 rounded-full transition-all tap-target ${
              completedExercises[i]
                ? "bg-correct"
                : i === currentExercise
                  ? "bg-draw scale-125"
                  : "bg-secondary hover:bg-secondary/80"
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        {/* Exercise Info Card */}
        <div className="glass-card rounded-xl p-4 sm:p-6 mb-4 border-accent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-draw/20 flex items-center justify-center">
              <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-draw" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl sm:text-2xl">{currentEx.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Hole {currentEx.hole} • {currentEx.direction === "blow" ? "Blow" : "Draw"} • Target: {currentEx.targetBend}¢
              </p>
            </div>
            {completedExercises[currentExercise] && (
              <CheckCircle2 className="w-6 h-6 text-correct" />
            )}
          </div>

          {/* Tip */}
          <div className="p-3 rounded-lg bg-secondary/50 text-sm">
            <strong className="text-draw">Tip:</strong> {currentEx.tips[0]}
          </div>
        </div>

        {/* Pitch Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg h-64 sm:h-80 glass-card rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-draw/5 to-draw/10" />

            {/* Natural note line */}
            <div className="absolute top-6 sm:top-8 left-0 right-0 flex items-center gap-3 px-4 sm:px-6">
              <div className="flex-1 h-px bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded bg-secondary/50">
                Natural (0¢)
              </span>
            </div>

            {/* Target zone */}
            <div
              className={`absolute left-4 sm:left-6 right-4 sm:right-6 h-10 sm:h-12 rounded-lg border-2 border-dashed transition-all ${
                isInTargetZone && isActive
                  ? "bg-correct/20 border-correct"
                  : "bg-correct/10 border-correct/50"
              }`}
              style={{ top: `${24 + Math.abs(currentEx.targetBend) * 1.2 - 20}px` }}
            />

            {/* Target line */}
            <div
              className="absolute left-0 right-0 flex items-center gap-3 px-4 sm:px-6"
              style={{ top: `${24 + Math.abs(currentEx.targetBend) * 1.2}px` }}
            >
              <div className="flex-1 h-1 bg-correct rounded-full shadow-lg shadow-correct/50" />
              <span className="text-xs text-correct font-bold px-2 py-1 rounded bg-correct/20">
                TARGET ({currentEx.targetBend}¢)
              </span>
            </div>

            {/* User pitch cursor */}
            {isActive && (
              <div
                className="absolute left-1/2 -translate-x-1/2 transition-all duration-100 flex flex-col items-center"
                style={{ top: `${24 + Math.abs(userPitch) * 1.2 - 16}px` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isInTargetZone
                    ? "bg-correct shadow-correct/50"
                    : "bg-amber shadow-amber/50"
                }`}>
                  <div className="w-3 h-3 rounded-full bg-background" />
                </div>
                <div className={`mt-1 text-xs font-mono ${isInTargetZone ? "text-correct" : "text-amber"}`}>
                  {Math.round(userPitch)}¢
                </div>
              </div>
            )}

            {/* Scale markers */}
            <div className="absolute left-2 sm:left-4 top-6 sm:top-8 bottom-4 sm:bottom-8 flex flex-col justify-between text-xs text-muted-foreground/50">
              <span>0</span>
              <span>-50</span>
              <span>-100</span>
              <span>-150</span>
            </div>

            {/* Instructions when not active */}
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="font-display text-xl sm:text-2xl mb-2">Start Listening</div>
                  <p className="text-sm text-muted-foreground">Tap the button below to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Harmonica Diagram - Smaller on mobile */}
        <div className="my-4 flex justify-center">
          <div className="glass-card p-3 sm:p-4 rounded-xl">
            <HarmonicaDiagram
              activeHole={currentEx.hole}
              activeDirection={currentEx.direction}
              isClean={true}
              bleedSeverity={0}
              centsOff={0}
              isBend={true}
              holeNotes={holeNotes}
              holeBends={holeBends}
              size="md"
            />
          </div>
        </div>

        {/* Hold Timer */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Hold in target zone</span>
            <span className="font-display text-lg">
              <span className={holdTime >= targetHoldTime ? "text-correct" : "text-amber"}>
                {holdTime.toFixed(1)}
              </span>
              <span className="text-muted-foreground"> / {targetHoldTime}.0s</span>
            </span>
          </div>
          <div className="progress-bar h-3">
            <div
              className={`h-full rounded transition-all ${
                holdTime >= targetHoldTime
                  ? "bg-correct shadow-correct"
                  : "progress-bar-fill"
              }`}
              style={{ width: `${Math.min((holdTime / targetHoldTime) * 100, 100)}%` }}
            />
          </div>
          {holdTime >= targetHoldTime && (
            <div className="mt-2 text-center text-correct font-medium text-sm">
              ✓ Exercise complete!
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => goToExercise(Math.max(0, currentExercise - 1))}
            disabled={currentExercise === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium tap-target"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={toggle}
            className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all ${
              isActive
                ? "bg-gradient-to-br from-wrong to-red-700 text-white shadow-lg shadow-wrong/30 mic-pulse"
                : "bg-gradient-to-br from-draw to-purple-600 text-white shadow-lg shadow-draw/30 hover:scale-105"
            }`}
          >
            {isActive ? (
              <div className="w-5 h-5 bg-white rounded-sm" />
            ) : (
              <Target size={28} />
            )}
          </button>

          <button
            onClick={() => goToExercise(Math.min(exercises.length - 1, currentExercise + 1))}
            disabled={currentExercise === exercises.length - 1}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-draw to-purple-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-draw/30 font-medium tap-target"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
