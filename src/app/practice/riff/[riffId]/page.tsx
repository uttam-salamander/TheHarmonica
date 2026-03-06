"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Star,
  Zap,
  Waves,
  Sparkles,
  Music,
  ChevronLeft,
  ChevronRight,
  X,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { RIFFS, type Riff, type RiffNote } from "@/lib/riffs";

export default function RiffPlayerPage() {
  const params = useParams();
  const riffId = params.riffId as string;

  const riff = useMemo(() => RIFFS.find((r) => r.id === riffId), [riffId]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(80); // BPM
  const [loopCount, setLoopCount] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Calculate note duration in ms based on tempo
  const getNoteDurationMs = useCallback(
    (duration: number) => {
      const beatMs = 60000 / tempo;
      return duration * beatMs;
    },
    [tempo]
  );

  // Playback logic
  useEffect(() => {
    if (!isPlaying || !riff) return;

    const currentNote = riff.pattern[currentNoteIndex];
    const durationMs = getNoteDurationMs(currentNote.duration);

    const timer = setTimeout(() => {
      if (currentNoteIndex < riff.pattern.length - 1) {
        setCurrentNoteIndex((prev) => prev + 1);
      } else {
        // Loop back to start
        setCurrentNoteIndex(0);
        setLoopCount((prev) => prev + 1);
      }
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentNoteIndex, riff, getNoteDurationMs]);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
    setLoopCount(0);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  if (!riff) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl">
          <h1 className="font-display text-2xl mb-4">Riff not found</h1>
          <Link href="/practice/riffs" className="text-amber hover:text-amber-light transition-colors">
            Browse all riffs
          </Link>
        </div>
      </main>
    );
  }

  const categoryStyles = {
    blues: { color: "text-blow", bg: "bg-blow/20", icon: <Waves size={20} /> },
    rhythm: { color: "text-draw", bg: "bg-draw/20", icon: <Zap size={20} /> },
    expression: { color: "text-correct", bg: "bg-correct/20", icon: <Sparkles size={20} /> },
    folk: { color: "text-amber", bg: "bg-amber/20", icon: <Music size={20} /> },
  };

  const style = categoryStyles[riff.category];

  return (
    <main className="practice-immersive min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-area-top">
        <Link
          href="/practice/riffs"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target"
        >
          <X size={24} />
        </Link>

        <div className="text-center">
          <h1 className="font-display text-lg">{riff.name}</h1>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className={`flex items-center gap-1 ${style.color}`}>
              {style.icon}
              {riff.category}
            </span>
            <span>•</span>
            <span>{riff.pattern.length} notes</span>
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

      {/* Tips Panel */}
      {showTips && (
        <div className="mx-4 mb-4 glass-card p-4 rounded-xl border border-amber/30 animate-in slide-in-from-top-2">
          <h3 className="font-display text-sm text-amber mb-2 flex items-center gap-2">
            <Lightbulb size={16} />
            Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {riff.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 gap-6">
        {/* Loop Counter */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
            <RotateCcw size={14} className="text-muted-foreground" />
            <span>
              Loop <span className="text-amber font-medium">{loopCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={16}
                className={i <= riff.difficulty ? "text-amber fill-amber" : "text-secondary"}
              />
            ))}
          </div>
        </div>

        {/* Pattern Display - The visual tablature */}
        <div className="w-full max-w-3xl">
          <div className="overflow-x-auto tab-scroll-container">
            <div className="flex gap-2 sm:gap-3 p-4 min-w-max justify-center">
              {riff.pattern.map((note, index) => (
                <NoteCard
                  key={index}
                  note={note}
                  isActive={index === currentNoteIndex && isPlaying}
                  isPast={index < currentNoteIndex}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Current Note Highlight */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${
              isPlaying ? "bg-amber/20 border border-amber/50" : "bg-secondary"
            }`}
          >
            <div
              className={`text-4xl sm:text-5xl font-display ${
                riff.pattern[currentNoteIndex].direction === "blow" ? "text-blow" : "text-draw"
              }`}
            >
              {riff.pattern[currentNoteIndex].hole}
              {riff.pattern[currentNoteIndex].bend && (
                <span className="text-2xl text-wrong">
                  {"'".repeat(Math.abs(riff.pattern[currentNoteIndex].bend || 0))}
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="font-display text-lg uppercase">
                {riff.pattern[currentNoteIndex].direction}
              </div>
              <div className="text-xs text-muted-foreground">
                {riff.pattern[currentNoteIndex].bend
                  ? `${Math.abs(riff.pattern[currentNoteIndex].bend || 0)} semitone bend`
                  : "No bend"}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-muted-foreground max-w-md">{riff.description}</p>
      </div>

      {/* Control Bar */}
      <div className="p-4 sm:p-6 safe-area-bottom">
        {/* Tempo Control */}
        <div className="max-w-md mx-auto mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tempo</span>
            <span className="font-medium text-amber">{tempo} BPM</span>
          </div>
          <input
            type="range"
            min={40}
            max={160}
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-amber"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          <button
            onClick={resetPlayback}
            className="tap-target p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={togglePlay}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl transition-all ${
              isPlaying
                ? "bg-amber text-background shadow-lg shadow-amber/30"
                : "bg-gradient-to-br from-amber to-amber-dark text-background shadow-lg shadow-amber/30 hover:scale-105"
            }`}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`tap-target p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors ${
              isMuted ? "text-wrong" : "text-muted-foreground"
            }`}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-4 pb-4 safe-area-bottom">
        <div className="max-w-md mx-auto flex justify-between">
          <NavigationButton riff={riff} direction="prev" />
          <NavigationButton riff={riff} direction="next" />
        </div>
      </div>
    </main>
  );
}

function NoteCard({
  note,
  isActive,
  isPast,
  index,
}: {
  note: RiffNote;
  isActive: boolean;
  isPast: boolean;
  index: number;
}) {
  const isBlow = note.direction === "blow";
  const hasBend = note.bend && note.bend !== 0;

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-14 h-20 sm:w-16 sm:h-24 rounded-xl transition-all duration-200 ${
        isActive
          ? "scale-110 bg-amber text-background shadow-lg shadow-amber/50 ring-2 ring-amber ring-offset-2 ring-offset-background"
          : isPast
            ? "opacity-40 bg-secondary"
            : isBlow
              ? "bg-blow/20 text-blow"
              : "bg-draw/20 text-draw"
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <span className="font-display text-2xl sm:text-3xl">{note.hole}</span>
      <span className="text-xs uppercase opacity-80">{note.direction.slice(0, 1)}</span>
      {hasBend && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-wrong text-foreground text-xs flex items-center justify-center font-bold">
          {Math.abs(note.bend || 0)}
        </div>
      )}
      {/* Duration indicator */}
      <div className="absolute bottom-1 flex gap-0.5">
        {Array.from({ length: Math.ceil(note.duration * 2) }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-current opacity-60" />
        ))}
      </div>
    </div>
  );
}

function NavigationButton({
  riff,
  direction,
}: {
  riff: Riff;
  direction: "prev" | "next";
}) {
  const currentIndex = RIFFS.findIndex((r) => r.id === riff.id);
  const targetIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
  const targetRiff = RIFFS[targetIndex];

  if (!targetRiff) {
    return <div className="w-32" />;
  }

  return (
    <Link
      href={`/practice/riff/${targetRiff.id}`}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm"
    >
      {direction === "prev" && <ChevronLeft size={16} />}
      <span className="truncate max-w-[100px]">{targetRiff.name}</span>
      {direction === "next" && <ChevronRight size={16} />}
    </Link>
  );
}
