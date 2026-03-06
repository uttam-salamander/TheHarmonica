"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Wind,
  Target,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { TECHNIQUES, type Technique } from "@/lib/techniques";

export default function TechniquePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const techniqueId = params.techniqueId as string;

  const technique = useMemo(() => TECHNIQUES.find((t) => t.id === techniqueId), [techniqueId]);

  // Initialize state based on technique
  const initialCompletedSteps = useMemo(
    () => (technique ? new Array(technique.steps.length).fill(false) : []),
    [technique]
  );
  const initialDuration = technique?.duration ?? 0;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(initialCompletedSteps);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isComplete, setIsComplete] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Reset state when technique changes
  useEffect(() => {
    setCompletedSteps(initialCompletedSteps);
    setTimeRemaining(initialDuration);
    setCurrentStepIndex(0);
    setIsComplete(false);
    setIsTimerRunning(false);
  }, [techniqueId, initialCompletedSteps, initialDuration]);

  // Timer logic - timeRemaining in condition is intentional (we use functional update)
  useEffect(() => {
    if (!isTimerRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]);

  const markStepComplete = useCallback((index: number) => {
    setCompletedSteps((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  }, []);

  const goToNextStep = useCallback(() => {
    if (!technique) return;
    markStepComplete(currentStepIndex);
    if (currentStepIndex < technique.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [technique, currentStepIndex, markStepComplete]);

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const resetPractice = useCallback(() => {
    if (!technique) return;
    setCurrentStepIndex(0);
    setCompletedSteps(new Array(technique.steps.length).fill(false));
    setTimeRemaining(technique.duration);
    setIsTimerRunning(false);
    setIsComplete(false);
  }, [technique]);

  if (!technique) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl">
          <h1 className="font-display text-2xl mb-4">Technique not found</h1>
          <Link href="/practice/techniques" className="text-amber hover:text-amber-light transition-colors">
            Browse all techniques
          </Link>
        </div>
      </main>
    );
  }

  const categoryStyles = {
    breathing: { color: "text-blow", bg: "bg-blow/20", icon: <Wind size={20} /> },
    embouchure: { color: "text-amber", bg: "bg-amber/20", icon: <Target size={20} /> },
    expression: { color: "text-correct", bg: "bg-correct/20", icon: <Sparkles size={20} /> },
    rhythm: { color: "text-draw", bg: "bg-draw/20", icon: <Zap size={20} /> },
  };

  const style = categoryStyles[technique.category];
  const progress = (completedSteps.filter(Boolean).length / technique.steps.length) * 100;

  return (
    <main className="practice-immersive min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-area-top">
        <Link
          href="/practice/techniques"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target"
        >
          <X size={24} />
        </Link>

        <div className="text-center">
          <h1 className="font-display text-lg">{technique.name}</h1>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className={`flex items-center gap-1 ${style.color}`}>
              {style.icon}
              {technique.category}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowTips(!showTips)}
          className={`tap-target p-2 rounded-lg transition-colors ${
            showTips ? "bg-amber/20 text-amber" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lightbulb size={24} />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-4">
        <div className="progress-bar h-2">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Step {currentStepIndex + 1} of {technique.steps.length}</span>
          <span>{completedSteps.filter(Boolean).length} completed</span>
        </div>
      </div>

      {/* Tips Panel */}
      {showTips && (
        <div className="mx-4 mt-4 glass-card p-4 rounded-xl border border-amber/30 animate-in slide-in-from-top-2">
          <h3 className="font-display text-sm text-amber mb-2 flex items-center gap-2">
            <Lightbulb size={16} />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {technique.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      {isComplete ? (
        <CompletionScreen
          technique={technique}
          completedSteps={completedSteps}
          onReset={resetPractice}
          onExit={() => router.push("/practice/techniques")}
        />
      ) : (
        <div className="flex-1 flex flex-col p-4 sm:p-8">
          {/* Timer */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isTimerRunning
                  ? "bg-correct/20 text-correct border border-correct/50"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <Clock size={18} />
              <span className="font-display text-lg">
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, "0")}
              </span>
              {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          {/* Steps List */}
          <div className="flex-1 max-w-2xl mx-auto w-full space-y-3">
            {technique.steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isActive={index === currentStepIndex}
                isCompleted={completedSteps[index]}
                onClick={() => setCurrentStepIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Control Bar */}
      {!isComplete && (
        <div className="p-4 sm:p-6 safe-area-bottom">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <button
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              className="tap-target p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground disabled:opacity-30"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNextStep}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber to-amber-dark text-background font-display text-lg hover:shadow-lg hover:shadow-amber/30 transition-all"
            >
              {currentStepIndex === technique.steps.length - 1 ? (
                <>
                  <Trophy size={20} />
                  Complete
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Done - Next Step
                </>
              )}
            </button>

            <button
              onClick={resetPractice}
              className="tap-target p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function StepCard({
  step,
  index,
  isActive,
  isCompleted,
  onClick,
}: {
  step: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        isActive
          ? "glass-card border-2 border-amber shadow-lg shadow-amber/20"
          : isCompleted
            ? "bg-correct/10 border border-correct/30"
            : "bg-secondary/50 hover:bg-secondary"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted
              ? "bg-correct text-foreground"
              : isActive
                ? "bg-amber text-background"
                : "bg-secondary text-muted-foreground"
          }`}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : <span className="font-display">{index + 1}</span>}
        </div>
        <div className="flex-1">
          <p className={`${isActive ? "text-foreground" : "text-muted-foreground"} ${isCompleted ? "line-through opacity-60" : ""}`}>
            {step}
          </p>
        </div>
      </div>
    </button>
  );
}

function CompletionScreen({
  technique,
  completedSteps,
  onReset,
  onExit,
}: {
  technique: Technique;
  completedSteps: boolean[];
  onReset: () => void;
  onExit: () => void;
}) {
  const completedCount = completedSteps.filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 gap-6">
      {/* Celebration */}
      <div className="w-24 h-24 rounded-full bg-correct/20 flex items-center justify-center level-up-anim">
        <Trophy size={48} className="text-correct" />
      </div>

      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl mb-2">Practice Complete!</h2>
        <p className="text-muted-foreground">{technique.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="glass-card p-4 rounded-xl text-center">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-correct" />
          <div className="font-display text-2xl">
            {completedCount}/{technique.steps.length}
          </div>
          <div className="text-xs text-muted-foreground">Steps</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <Clock size={24} className="mx-auto mb-2 text-amber" />
          <div className="font-display text-2xl">{Math.floor(technique.duration / 60)}m</div>
          <div className="text-xs text-muted-foreground">Practice Time</div>
        </div>
      </div>

      {/* XP Award */}
      <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber/20 text-amber font-display text-xl">
        <Zap size={24} />
        +{technique.difficulty * 15} XP
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

      {/* Navigation to next technique */}
      <div className="mt-4">
        <NextTechniqueLink currentTechnique={technique} />
      </div>
    </div>
  );
}

function NextTechniqueLink({ currentTechnique }: { currentTechnique: Technique }) {
  const currentIndex = TECHNIQUES.findIndex((t) => t.id === currentTechnique.id);
  const nextTechnique = TECHNIQUES[currentIndex + 1];

  if (!nextTechnique) return null;

  return (
    <Link
      href={`/practice/technique/${nextTechnique.id}`}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <span>Next: {nextTechnique.name}</span>
      <ChevronRight size={16} />
    </Link>
  );
}
