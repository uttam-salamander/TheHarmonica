"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Play, Pause, RotateCcw } from "lucide-react";
import { useState } from "react";
import { getSongById } from "@/lib/songs";

export default function SongPlayerPage() {
  const params = useParams();
  const songId = params.songId as string;
  const song = getSongById(songId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitMode, setWaitMode] = useState(true);
  const [tempo, setTempo] = useState(100); // percentage

  if (!song) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl">
          <h1 className="font-display text-2xl mb-4">Song not found</h1>
          <Link href="/songs" className="text-amber hover:text-amber-light transition-colors">
            Back to song library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/songs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1 className="text-lg font-semibold">{song.title}</h1>
        <button className="p-2 hover:bg-muted rounded-lg">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Scrolling Tab Area */}
        <div className="h-40 bg-card border-b border-border flex items-center justify-center overflow-hidden">
          <div className="flex gap-2 animate-scroll">
            {/* Sample tab notes for the song */}
            {song.previewPattern.map((note, i) => (
              <div
                key={i}
                className={`w-12 h-16 flex flex-col items-center justify-center rounded-lg ${
                  i === Math.min(3, song.previewPattern.length - 1) ? "ring-2 ring-foreground" : ""
                } ${note.direction === "blow" ? "bg-blow" : "bg-draw"}`}
              >
                <span className="text-lg font-bold text-foreground">{note.hole}</span>
                <span className="text-sm text-foreground/80">
                  {note.direction === "blow" ? "↑" : "↓"}
                </span>
              </div>
            ))}
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
                    ? "bg-blow/20 border-blow text-blow"
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
            {/* Tempo Control */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Tempo</span>
              <button
                onClick={() => setTempo(Math.max(50, tempo - 10))}
                className="w-8 h-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80"
              >
                -
              </button>
              <span className="w-16 text-center font-mono">{tempo}%</span>
              <button
                onClick={() => setTempo(Math.min(150, tempo + 10))}
                className="w-8 h-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80"
              >
                +
              </button>
            </div>

            {/* Play Controls */}
            <div className="flex items-center gap-4">
              <button className="p-3 hover:bg-muted rounded-lg">
                <RotateCcw size={20} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <div className="text-lg font-mono">0:45 / {song.duration}</div>
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
