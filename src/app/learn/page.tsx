"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Star, Flame, Trophy } from "lucide-react";
import { getLessonsByBranch, isLessonAvailable } from "@/lib/lessons";
import { useProgressStore } from "@/stores/progressStore";
import type { Lesson } from "@/lib/lessons";

export default function LearnPage() {
  const { level, xp, streak, completedLessons, lessonProgress, getXPToNextLevel, getLevelTitle } =
    useProgressStore();

  const fundamentals = getLessonsByBranch("fundamentals");
  const melodies = getLessonsByBranch("melodies");
  const bending = getLessonsByBranch("bending");

  const xpToNext = getXPToNextLevel();
  const levelTitle = getLevelTitle();

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
            Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flame className={streak > 0 ? "text-orange-500" : ""} size={20} />
              <span>{streak} day streak</span>
            </div>
            <Link
              href="/progress"
              className="px-4 py-2 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-primary" />
                <span>
                  Level {level} • {xp} XP
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-8 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{levelTitle}</span>
            <span className="text-sm text-muted-foreground">{xpToNext} XP to next level</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${xpToNext > 0 ? ((100 - (xpToNext / (xp + xpToNext)) * 100)) : 100}%`,
              }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Your Learning Path</h1>

        {/* Skill Tree Branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fundamentals Branch */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blow flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blow" />
              Fundamentals
            </h2>
            <div className="space-y-3">
              {fundamentals.map((lesson) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  progress={lessonProgress[lesson.id]}
                  isAvailable={isLessonAvailable(lesson.id, completedLessons)}
                />
              ))}
            </div>
          </div>

          {/* Melodies Branch */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-correct flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-correct" />
              Melodies
            </h2>
            <div className="space-y-3">
              {melodies.map((lesson) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  progress={lessonProgress[lesson.id]}
                  isAvailable={isLessonAvailable(lesson.id, completedLessons)}
                />
              ))}
            </div>
          </div>

          {/* Bending Branch */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-draw flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-draw" />
              Bending
            </h2>
            <div className="space-y-3">
              {bending.map((lesson) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  progress={lessonProgress[lesson.id]}
                  isAvailable={isLessonAvailable(lesson.id, completedLessons)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex gap-4">
          <Link
            href="/practice/free"
            className="flex-1 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <div className="text-2xl mb-2">🎵</div>
            <div className="font-medium">Free Play</div>
            <div className="text-sm text-muted-foreground">Practice without lessons</div>
          </Link>
          <Link
            href="/practice/bending"
            className="flex-1 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Bending Gym</div>
            <div className="text-sm text-muted-foreground">Target practice for bends</div>
          </Link>
          <Link
            href="/songs"
            className="flex-1 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors text-center"
          >
            <div className="text-2xl mb-2">🎶</div>
            <div className="font-medium">Song Library</div>
            <div className="text-sm text-muted-foreground">Play your favorite tunes</div>
          </Link>
        </div>
      </div>
    </main>
  );
}

interface LessonNodeProps {
  lesson: Lesson;
  progress?: {
    completed: boolean;
    stars: 0 | 1 | 2 | 3;
    bestAccuracy: number;
  };
  isAvailable: boolean;
}

function LessonNode({ lesson, progress, isAvailable }: LessonNodeProps) {
  const isCompleted = progress?.completed ?? false;
  const stars = progress?.stars ?? 0;
  const isLocked = !isAvailable && !isCompleted;

  const getStatus = () => {
    if (isCompleted) return "completed";
    if (isAvailable) return "available";
    return "locked";
  };

  const status = getStatus();

  return (
    <Link
      href={isLocked ? "#" : `/learn/${lesson.id}`}
      className={`block p-4 rounded-lg border transition-all ${
        status === "locked"
          ? "bg-muted/50 border-border cursor-not-allowed opacity-60"
          : status === "available"
            ? "bg-card border-primary hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10"
            : "bg-card border-correct"
      }`}
      onClick={(e) => {
        if (isLocked) e.preventDefault();
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className={isLocked ? "text-muted-foreground" : ""}>{lesson.title}</span>
          {progress?.bestAccuracy !== undefined && progress.bestAccuracy > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Best: {Math.round(progress.bestAccuracy)}%
            </div>
          )}
        </div>
        {isLocked ? (
          <Lock size={16} className="text-muted-foreground" />
        ) : (
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={14}
                className={i <= stars ? "text-close fill-close" : "text-muted-foreground"}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
