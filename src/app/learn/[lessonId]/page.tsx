"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Mic, MicOff, RotateCcw, Star, Zap, Clock, Target, Lightbulb } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useAudio } from "@/hooks/useAudio";
import { HarmonicaDiagram, TabPlayer } from "@/components";
import { getLessonById, calculateStars, calculateXP } from "@/lib/lessons";
import { useProgressStore } from "@/stores/progressStore";
import { useAudioStore } from "@/stores/audioStore";
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

  // Note labels for diagram
  const { noteMapper } = useAudioStore();
  const holeNotes = useMemo(() => noteMapper?.getHoleNotes(), [noteMapper]);
  const holeBends = useMemo(() => noteMapper?.getHoleBends(), [noteMapper]);

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
        <div className="text-center glass-card p-8 rounded-2xl">
          <h1 className="font-display text-2xl mb-4">Lesson not found</h1>
          <Link href="/learn" className="text-amber hover:text-amber-light transition-colors">
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
    <main className="min-h-screen flex flex-col bg-background page-enter">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border glass-card">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>
        <div className="text-center">
          <h1 className="font-display text-lg">{lesson.title}</h1>
          <p className="text-xs text-muted-foreground">{lesson.description}</p>
        </div>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <Settings size={20} className="text-muted-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tab Player */}
        <div className="p-4 glass-card border-b border-border">
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
          <div className="glass-card p-6 rounded-2xl">
            <HarmonicaDiagram
              activeHole={hole}
              activeDirection={direction}
              isClean={isClean}
              bleedSeverity={bleedSeverity}
              centsOff={centsOff}
              isBend={isBend}
              holeNotes={holeNotes}
              holeBends={holeBends}
              size="lg"
            />
          </div>

          {/* Detected note info */}
          {isActive && hole && direction && (
            <div className="text-center space-y-2">
              <div className="font-display text-4xl">
                <span className="text-foreground">{hole}</span>
                <span className={direction === "blow" ? "text-blow" : "text-draw"}>
                  {direction === "blow" ? "↑" : "↓"}
                </span>
                {isBend && (
                  <span className="ml-2 text-lg px-2 py-1 rounded-md bg-draw/20 text-draw">
                    BEND
                  </span>
                )}
              </div>
              {!isClean && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bleed/10 border border-bleed/30 text-bleed text-sm">
                  <span>⚠</span>
                  <span>Bleed detected</span>
                </div>
              )}
            </div>
          )}

          {!isActive && (
            <div className="text-muted-foreground text-lg font-display">
              Click the microphone to start
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="p-4 border-t border-border glass-card">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {/* BPM Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">BPM</span>
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-medium"
              >
                -
              </button>
              <span className="w-12 text-center font-display text-lg">{bpm}</span>
              <button
                onClick={() => setBpm(Math.min(200, bpm + 5))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-medium"
              >
                +
              </button>
            </div>

            {/* Mic Button */}
            <button
              onClick={toggle}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all ${
                isActive
                  ? "bg-gradient-to-br from-wrong to-red-700 text-white shadow-lg shadow-wrong/30 mic-pulse"
                  : "bg-gradient-to-br from-amber to-amber-dark text-background shadow-lg shadow-amber/30 hover:shadow-amber/50 hover:scale-105"
              }`}
            >
              {isActive ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isClean
                    ? "bg-correct/20 text-correct border border-correct/30"
                    : "bg-bleed/20 text-bleed border border-bleed/30"
                }`}
              >
                {isClean ? "CLEAN ✓" : "BLEED"}
              </div>
              <div className="font-display text-xl w-14 text-right">
                <span className={runningAccuracy >= 80 ? "text-correct" : runningAccuracy >= 60 ? "text-close" : "text-wrong"}>
                  {runningAccuracy}%
                </span>
              </div>
              <button
                onClick={() => setWaitMode(!waitMode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  waitMode
                    ? "bg-gradient-to-r from-amber to-amber-dark text-background shadow-md shadow-amber/20"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                Wait {waitMode ? "ON" : "OFF"}
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
  const { accuracy, cleanPercent, duration, stars, xpEarned, tip } = useMemo(() => {
    const acc = Math.round((stats.correctNotes / lesson.tablature.length) * 100);
    const clean = Math.round(
      ((lesson.tablature.length - stats.bleedCount) / lesson.tablature.length) * 100
    );
    const dur = Math.round((Date.now() - stats.startTime) / 1000);
    const st = calculateStars(acc);
    const xp = calculateXP(st, true);
    const randomTip = lesson.tips.length > 0
      ? lesson.tips[Math.floor(Math.random() * lesson.tips.length)]
      : null;
    return { accuracy: acc, cleanPercent: clean, duration: dur, stars: st, xpEarned: xp, tip: randomTip };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally computed once when modal opens
  }, []);

  const getMessage = () => {
    if (stars === 3) return "Perfect!";
    if (stars === 2) return "Great Job!";
    return "Good Effort!";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center border-accent relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-draw/10 rounded-full blur-3xl" />

        <div className="relative">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={40}
                className={`transition-all ${
                  i <= stars
                    ? "text-gold fill-gold drop-shadow-lg"
                    : "text-secondary"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          <h2 className="font-display text-3xl mb-2">{getMessage()}</h2>
          <p className="text-muted-foreground mb-6">{lesson.title}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-secondary/50">
              <Target size={18} className="mx-auto mb-2 text-blow" />
              <div className="font-display text-2xl">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <Zap size={18} className="mx-auto mb-2 text-correct" />
              <div className="font-display text-2xl">{cleanPercent}%</div>
              <div className="text-xs text-muted-foreground">Clean</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <Clock size={18} className="mx-auto mb-2 text-draw" />
              <div className="font-display text-2xl">{duration}s</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>

          {/* XP */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/20 text-amber font-display text-lg mb-6">
            <Zap size={20} />
            +{xpEarned} XP earned!
          </div>

          {/* Tips */}
          {tip && (
            <div className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl mb-6 text-left flex gap-3">
              <Lightbulb size={18} className="text-amber flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground">Tip:</strong> {tip}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all font-medium"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
            <button
              onClick={onNext}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber to-amber-dark text-background font-medium hover:shadow-lg hover:shadow-amber/30 transition-all"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
