"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Mic, MicOff, RotateCcw } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useAudio } from "@/hooks/useAudio";
import { HarmonicaDiagram, TabPlayer } from "@/components";
import { getLessonById, calculateStars, calculateXP } from "@/lib/lessons";
import { useProgressStore } from "@/stores/progressStore";
import type { LessonResult } from "@/lib/lessons";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);

  // Audio state
  const {
    isActive,
    toggle,
    currentNote,
    hole,
    direction,
    centsOff,
    isBend,
    isClean,
    bleedSeverity,
  } = useAudio();

  // Lesson state
  const [waitMode, setWaitMode] = useState(true);
  const [bpm, setBpm] = useState(lesson?.bpm ?? 80);
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState({
    correctNotes: 0,
    totalNotes: 0,
    bleedCount: 0,
    startTime: 0,
  });

  // Progress store
  const { recordLessonResult, updateStreak, lessonProgress } = useProgressStore();
  const existingProgress = lessonProgress[lessonId];

  // Handle note hit
  const handleNoteHit = useCallback(
    (noteIndex: number, correct: boolean, clean: boolean) => {
      setStats((prev) => ({
        ...prev,
        correctNotes: prev.correctNotes + (correct ? 1 : 0),
        totalNotes: prev.totalNotes + 1,
        bleedCount: prev.bleedCount + (clean ? 0 : 1),
        startTime: prev.startTime || Date.now(),
      }));
    },
    []
  );

  // Handle lesson complete
  const handleComplete = useCallback(() => {
    if (!lesson) return;

    const duration = (Date.now() - stats.startTime) / 1000;
    const accuracy = (stats.correctNotes / lesson.tablature.length) * 100;
    const cleanPercent =
      ((lesson.tablature.length - stats.bleedCount) / lesson.tablature.length) * 100;
    const stars = calculateStars(accuracy);
    const isFirstCompletion = !existingProgress?.completed;
    const xpEarned = calculateXP(stars, isFirstCompletion);

    const result: LessonResult = {
      lessonId,
      accuracy,
      cleanPercent,
      totalNotes: lesson.tablature.length,
      correctNotes: stats.correctNotes,
      missedNotes: lesson.tablature.length - stats.correctNotes,
      bleedCount: stats.bleedCount,
      duration,
      xpEarned,
      stars,
    };

    recordLessonResult(result);
    updateStreak();
    setShowResults(true);
  }, [lesson, stats, lessonId, existingProgress, recordLessonResult, updateStreak]);

  // Reset lesson
  const resetLesson = useCallback(() => {
    setStats({
      correctNotes: 0,
      totalNotes: 0,
      bleedCount: 0,
      startTime: 0,
    });
    setShowResults(false);
  }, []);

  // Loading state
  if (!lesson) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link href="/learn" className="text-primary hover:underline">
            Return to lessons
          </Link>
        </div>
      </main>
    );
  }

  // Calculate running accuracy
  const runningAccuracy =
    stats.totalNotes > 0
      ? Math.round((stats.correctNotes / stats.totalNotes) * 100)
      : 0;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
          Back
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tab Player */}
        <div className="p-4 bg-card border-b border-border">
          <TabPlayer
            tablature={lesson.tablature}
            bpm={bpm}
            timeSignature={lesson.timeSignature}
            waitMode={waitMode}
            detectedNote={currentNote}
            isListening={isActive}
            onNoteHit={handleNoteHit}
            onComplete={handleComplete}
          />
        </div>

        {/* Harmonica Diagram */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <HarmonicaDiagram
            activeHole={hole}
            activeDirection={direction}
            isClean={isClean}
            bleedSeverity={bleedSeverity}
            centsOff={centsOff}
            isBend={isBend}
            size="lg"
          />

          {/* Detected note info */}
          {isActive && hole && direction && (
            <div className="text-center">
              <div className="text-3xl font-bold">
                Hole {hole}{" "}
                <span className={direction === "blow" ? "text-blow" : "text-draw"}>
                  {direction === "blow" ? "↑ Blow" : "↓ Draw"}
                </span>
                {isBend && <span className="text-draw ml-2">BEND</span>}
              </div>
              {!isClean && (
                <div className="text-bleed font-medium mt-2">
                  ⚠ Bleed detected - focus your airflow
                </div>
              )}
            </div>
          )}

          {!isActive && (
            <div className="text-muted-foreground text-lg">
              Click the microphone to start
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* BPM Control */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">♩</span>
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-8 h-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80"
              >
                -
              </button>
              <span className="w-20 text-center font-mono">{bpm} BPM</span>
              <button
                onClick={() => setBpm(Math.min(200, bpm + 5))}
                className="w-8 h-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80"
              >
                +
              </button>
            </div>

            {/* Mic Button */}
            <button
              onClick={toggle}
              className={`w-16 h-16 flex items-center justify-center rounded-full transition-all ${
                isActive
                  ? "bg-wrong text-white animate-pulse"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isActive ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            {/* Status */}
            <div className="flex items-center gap-4">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  isClean
                    ? "bg-correct/20 text-correct"
                    : "bg-bleed/20 text-bleed"
                }`}
              >
                {isClean ? "CLEAN ✓" : "BLEED"}
              </div>
              <div className="text-lg font-mono w-16 text-right">
                {runningAccuracy}%
              </div>
              <button
                onClick={() => setWaitMode(!waitMode)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  waitMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Wait: {waitMode ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <ResultsModal
          lesson={lesson}
          stats={stats}
          onRetry={resetLesson}
          onNext={() => router.push("/learn")}
        />
      )}
    </main>
  );
}

interface ResultsModalProps {
  lesson: NonNullable<ReturnType<typeof getLessonById>>;
  stats: {
    correctNotes: number;
    totalNotes: number;
    bleedCount: number;
    startTime: number;
  };
  onRetry: () => void;
  onNext: () => void;
}

function ResultsModal({ lesson, stats, onRetry, onNext }: ResultsModalProps) {
  // Use useMemo to calculate values once when modal opens
  const { accuracy, cleanPercent, duration, stars, xpEarned, starDisplay, tip } = useMemo(() => {
    const acc = Math.round((stats.correctNotes / lesson.tablature.length) * 100);
    const clean = Math.round(
      ((lesson.tablature.length - stats.bleedCount) / lesson.tablature.length) * 100
    );
    const dur = Math.round((Date.now() - stats.startTime) / 1000);
    const st = calculateStars(acc);
    const xp = calculateXP(st, true);
    const display = "★".repeat(st) + "☆".repeat(3 - st);
    const randomTip = lesson.tips.length > 0
      ? lesson.tips[Math.floor(Math.random() * lesson.tips.length)]
      : null;
    return { accuracy: acc, cleanPercent: clean, duration: dur, stars: st, xpEarned: xp, starDisplay: display, tip: randomTip };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally computed once when modal opens
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center">
        {/* Stars */}
        <div className="text-5xl mb-4 text-close">{starDisplay}</div>
        <div className="text-xl font-semibold mb-2">
          {stars === 3 ? "Perfect!" : stars === 2 ? "Great Job!" : "Good Effort!"}
        </div>
        <div className="text-muted-foreground mb-6">{lesson.title}</div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{cleanPercent}%</div>
            <div className="text-xs text-muted-foreground">Clean</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{duration}s</div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
        </div>

        {/* XP */}
        <div className="text-lg mb-6 text-primary">+{xpEarned} XP earned!</div>

        {/* Tips */}
        {tip && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-6 text-left">
            💡 <strong>Tip:</strong> {tip}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-muted/80"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
