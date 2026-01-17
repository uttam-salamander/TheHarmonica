"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Clock,
  CheckCircle2,
  Trophy,
  Zap,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { WORKOUTS, TECHNIQUES } from "@/lib/techniques";
import { RIFFS } from "@/lib/riffs";

export default function WorkoutPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params.workoutId as string;

  const workout = useMemo(() => WORKOUTS.find((w) => w.id === workoutId), [workoutId]);

  // Initialize state based on workout
  const initialDuration = workout?.exercises[0]?.duration ?? 0;
  const initialExercisesCompleted = useMemo(
    () => (workout ? new Array(workout.exercises.length).fill(false) : []),
    [workout]
  );

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isComplete, setIsComplete] = useState(false);
  const [exercisesCompleted, setExercisesCompleted] = useState<boolean[]>(initialExercisesCompleted);

  // Reset state when workout changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setTimeRemaining(initialDuration);
    setExercisesCompleted(initialExercisesCompleted);
    setCurrentExerciseIndex(0);
    setIsComplete(false);
    setIsPlaying(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [workoutId, initialDuration, initialExercisesCompleted]);

  const handleExerciseComplete = useCallback(() => {
    if (!workout) return;

    setExercisesCompleted((prev) => {
      const updated = [...prev];
      updated[currentExerciseIndex] = true;
      return updated;
    });

    // Move to next exercise or complete workout
    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workout.exercises[nextIndex].duration);
    } else {
      setIsPlaying(false);
      setIsComplete(true);
    }
  }, [workout, currentExerciseIndex]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Exercise complete
          handleExerciseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, handleExerciseComplete, timeRemaining]);

  const skipExercise = useCallback(() => {
    if (!workout) return;
    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(workout.exercises[nextIndex].duration);
    } else {
      setIsComplete(true);
      setIsPlaying(false);
    }
  }, [workout, currentExerciseIndex]);

  const resetWorkout = useCallback(() => {
    if (!workout) return;
    setCurrentExerciseIndex(0);
    setTimeRemaining(workout.exercises[0]?.duration || 0);
    setIsComplete(false);
    setIsPlaying(false);
    setExercisesCompleted(new Array(workout.exercises.length).fill(false));
  }, [workout]);

  if (!workout) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl">
          <h1 className="font-display text-2xl mb-4">Workout not found</h1>
          <Link href="/learn" className="text-amber hover:text-amber-light transition-colors">
            Return to learn
          </Link>
        </div>
      </main>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + (isComplete ? 1 : 0)) / workout.exercises.length) * 100;
  const timeWarning = timeRemaining <= 5 && timeRemaining > 0;

  // Get related content based on exercise
  const relatedTechnique = currentExercise.itemId
    ? TECHNIQUES.find((t) => t.id === currentExercise.itemId)
    : null;
  const relatedRiff = currentExercise.itemId
    ? RIFFS.find((r) => r.id === currentExercise.itemId)
    : null;

  return (
    <main className="practice-immersive min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-area-top">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target"
        >
          <X size={24} />
        </Link>

        <div className="text-center">
          <h1 className="font-display text-lg">{workout.name}</h1>
          <p className="text-xs text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
          </p>
        </div>

        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      <div className="px-4">
        <div className="progress-bar h-2">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      {isComplete ? (
        <CompletionScreen
          workout={workout}
          exercisesCompleted={exercisesCompleted}
          onReset={resetWorkout}
          onExit={() => router.push("/learn")}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 gap-8">
          {/* Timer Circle */}
          <div className="relative">
            <svg className="w-40 h-40 sm:w-48 sm:h-48 progress-ring" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-secondary"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeRemaining / currentExercise.duration)}`}
                className={`progress-ring-circle ${timeWarning ? "text-wrong" : "text-amber"}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`font-display text-4xl sm:text-5xl ${timeWarning ? "timer-warning" : ""}`}>
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, "0")}
              </div>
              <div className="text-sm text-muted-foreground">remaining</div>
            </div>
          </div>

          {/* Exercise Info */}
          <div className="text-center max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/20 text-amber text-sm font-medium mb-4">
              <Clock size={14} />
              {currentExercise.type}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl mb-2">{currentExercise.name}</h2>
            <p className="text-muted-foreground">{currentExercise.instructions}</p>

            {/* Related content tips */}
            {relatedTechnique && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-left text-sm">
                <strong className="text-amber">Tip:</strong> {relatedTechnique.tips[0]}
              </div>
            )}
            {relatedRiff && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-left text-sm">
                <strong className="text-blow">Focus:</strong> {relatedRiff.tips[0]}
              </div>
            )}
          </div>

          {/* Exercise Steps Indicator */}
          <div className="flex gap-2">
            {workout.exercises.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  exercisesCompleted[i]
                    ? "bg-correct"
                    : i === currentExerciseIndex
                      ? "bg-amber scale-125"
                      : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Control Bar */}
      {!isComplete && (
        <div className="p-4 sm:p-6 safe-area-bottom">
          <div className="max-w-md mx-auto flex items-center justify-center gap-4">
            <button
              onClick={resetWorkout}
              className="tap-target p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground"
            >
              <RotateCcw size={24} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl transition-all ${
                isPlaying
                  ? "bg-amber text-background shadow-lg shadow-amber/30"
                  : "bg-gradient-to-br from-amber to-amber-dark text-background shadow-lg shadow-amber/30 hover:scale-105"
              }`}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>

            <button
              onClick={skipExercise}
              className="tap-target p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground"
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function CompletionScreen({
  workout,
  exercisesCompleted,
  onReset,
  onExit,
}: {
  workout: (typeof WORKOUTS)[number];
  exercisesCompleted: boolean[];
  onReset: () => void;
  onExit: () => void;
}) {
  const completedCount = exercisesCompleted.filter(Boolean).length;
  const totalTime = workout.exercises.reduce((acc, ex) => acc + ex.duration, 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 gap-6">
      {/* Celebration */}
      <div className="w-24 h-24 rounded-full bg-correct/20 flex items-center justify-center level-up-anim">
        <Trophy size={48} className="text-correct" />
      </div>

      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl mb-2">Workout Complete!</h2>
        <p className="text-muted-foreground">{workout.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="glass-card p-4 rounded-xl text-center">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-correct" />
          <div className="font-display text-2xl">{completedCount}/{workout.exercises.length}</div>
          <div className="text-xs text-muted-foreground">Exercises</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <Clock size={24} className="mx-auto mb-2 text-amber" />
          <div className="font-display text-2xl">{Math.floor(totalTime / 60)}m</div>
          <div className="text-xs text-muted-foreground">Practice Time</div>
        </div>
      </div>

      {/* XP Award */}
      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber/20 text-amber font-display text-xl">
        <Zap size={24} />
        +{completedCount * 10} XP
      </div>

      {/* Actions */}
      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all font-medium"
        >
          <RotateCcw size={18} />
          Again
        </button>
        <button
          onClick={onExit}
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber to-amber-dark text-background font-medium hover:shadow-lg hover:shadow-amber/30 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}
