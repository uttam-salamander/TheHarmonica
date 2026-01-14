"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Play, Pause } from "lucide-react";
import { useState } from "react";

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitMode, setWaitMode] = useState(true);
  const [bpm, setBpm] = useState(80);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1 className="text-lg font-semibold">Lesson: {formatLessonTitle(lessonId)}</h1>
        <button className="p-2 hover:bg-muted rounded-lg">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Scrolling Tab Area */}
        <div className="h-32 bg-card border-b border-border flex items-center justify-center">
          <div className="flex gap-2">
            <TabNote hole={4} direction="blow" active={false} />
            <TabNote hole={5} direction="blow" active={false} />
            <TabNote hole={4} direction="draw" active={true} />
            <TabNote hole={5} direction="draw" active={false} />
            <TabNote hole={6} direction="blow" active={false} />
          </div>
        </div>

        {/* Harmonica Diagram */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hole) => (
              <div
                key={hole}
                className={`w-12 h-16 flex items-center justify-center rounded-lg border-2 text-xl font-bold ${
                  hole === 4
                    ? "bg-draw/20 border-draw text-draw"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {hole}
              </div>
            ))}
          </div>
        </div>

        {/* Control Bar */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Metronome */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">♩</span>
              <button
                onClick={() => setBpm(Math.max(40, bpm - 5))}
                className="w-8 h-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80"
              >
                -
              </button>
              <span className="w-16 text-center font-mono">{bpm} BPM</span>
              <button
                onClick={() => setBpm(Math.min(200, bpm + 5))}
                className="w-8 h-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80"
              >
                +
              </button>
              <div className="flex gap-1 ml-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-muted" />
                <div className="w-2 h-2 rounded-full bg-muted" />
                <div className="w-2 h-2 rounded-full bg-muted" />
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>

            {/* Status */}
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-correct/20 text-correct text-sm">
                CLEAN ✓
              </div>
              <div className="text-lg font-mono">87%</div>
              <button
                onClick={() => setWaitMode(!waitMode)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  waitMode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                Wait: {waitMode ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TabNote({
  hole,
  direction,
  active,
}: {
  hole: number;
  direction: "blow" | "draw";
  active: boolean;
}) {
  const isBlow = direction === "blow";
  return (
    <div
      className={`w-14 h-20 flex flex-col items-center justify-center rounded-lg ${
        active
          ? "ring-2 ring-white animate-pulse"
          : ""
      } ${isBlow ? "bg-blow" : "bg-draw"}`}
    >
      <span className="text-xl font-bold text-white">{hole}</span>
      <span className="text-lg text-white/80">{isBlow ? "↑" : "↓"}</span>
    </div>
  );
}

function formatLessonTitle(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
