"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Star, Flame, Trophy, Play, Target, Music, ChevronRight } from "lucide-react";
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
  const progressPercent = xpToNext > 0 ? ((100 - (xpToNext / (xp + xpToNext)) * 100)) : 100;

  return (
    <main className="min-h-screen p-6 md:p-8 page-enter">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Streak indicator */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${streak > 0 ? "bg-amber/10 text-amber" : "bg-card text-muted-foreground"}`}>
              <Flame size={18} className={streak > 0 ? "animate-pulse" : ""} />
              <span className="text-sm font-medium">{streak} day{streak !== 1 ? "s" : ""}</span>
            </div>

            {/* Level badge */}
            <Link
              href="/progress"
              className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg border border-border hover:border-amber/50 transition-all group"
            >
              <Trophy size={18} className="text-amber" />
              <span className="text-sm font-medium">
                Lv.{level} <span className="text-muted-foreground">•</span> {xp} XP
              </span>
              <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </header>

        {/* Progress Card */}
        <div className="glass-card rounded-xl p-5 mb-10 border-accent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center">
                <Trophy size={20} className="text-amber" />
              </div>
              <div>
                <div className="font-display text-lg">{levelTitle}</div>
                <div className="text-sm text-muted-foreground">Level {level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-amber">{xpToNext} XP</div>
              <div className="text-xs text-muted-foreground">to next level</div>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            Your <span className="text-gradient">Learning Path</span>
          </h1>
          <p className="text-muted-foreground">
            Choose a branch and start building your skills
          </p>
        </div>

        {/* Skill Tree Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Fundamentals Branch */}
          <BranchSection
            title="Fundamentals"
            color="blow"
            description="Master the basics"
            lessons={fundamentals}
            lessonProgress={lessonProgress}
            completedLessons={completedLessons}
          />

          {/* Melodies Branch */}
          <BranchSection
            title="Melodies"
            color="correct"
            description="Play real tunes"
            lessons={melodies}
            lessonProgress={lessonProgress}
            completedLessons={completedLessons}
          />

          {/* Bending Branch */}
          <BranchSection
            title="Bending"
            color="draw"
            description="Unlock expressive notes"
            lessons={bending}
            lessonProgress={lessonProgress}
            completedLessons={completedLessons}
          />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-border pt-10">
          <h2 className="font-display text-2xl mb-6">Practice Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              href="/practice/free"
              icon={<Play className="w-6 h-6" />}
              title="Free Play"
              description="Practice without pressure"
              color="amber"
            />
            <QuickActionCard
              href="/practice/bending"
              icon={<Target className="w-6 h-6" />}
              title="Bending Gym"
              description="Target practice for bends"
              color="draw"
            />
            <QuickActionCard
              href="/songs"
              icon={<Music className="w-6 h-6" />}
              title="Song Library"
              description="Play your favorite tunes"
              color="blow"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

interface BranchSectionProps {
  title: string;
  color: "blow" | "draw" | "correct";
  description: string;
  lessons: Lesson[];
  lessonProgress: Record<string, { completed: boolean; stars: 0 | 1 | 2 | 3; bestAccuracy: number }>;
  completedLessons: Set<string>;
}

function BranchSection({ title, color, description, lessons, lessonProgress, completedLessons }: BranchSectionProps) {
  const colorStyles = {
    blow: { dot: "bg-blow", text: "text-blow", glow: "shadow-blow/20" },
    draw: { dot: "bg-draw", text: "text-draw", glow: "shadow-draw/20" },
    correct: { dot: "bg-correct", text: "text-correct", glow: "shadow-correct/20" },
  };

  const completedCount = lessons.filter((l) => lessonProgress[l.id]?.completed).length;

  return (
    <div className="space-y-4">
      {/* Branch header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colorStyles[color].dot}`} />
          <div>
            <h2 className={`font-display text-xl ${colorStyles[color].text}`}>{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{lessons.length}
        </span>
      </div>

      {/* Lessons */}
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            progress={lessonProgress[lesson.id]}
            isAvailable={isLessonAvailable(lesson.id, completedLessons)}
            color={color}
            index={index}
          />
        ))}
      </div>
    </div>
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
  color: "blow" | "draw" | "correct";
  index: number;
}

function LessonNode({ lesson, progress, isAvailable, color, index }: LessonNodeProps) {
  const isCompleted = progress?.completed ?? false;
  const stars = progress?.stars ?? 0;
  const isLocked = !isAvailable && !isCompleted;

  const colorStyles = {
    blow: "hover:border-blow/50 hover:shadow-blow/10",
    draw: "hover:border-draw/50 hover:shadow-draw/10",
    correct: "hover:border-correct/50 hover:shadow-correct/10",
  };

  return (
    <Link
      href={isLocked ? "#" : `/learn/${lesson.id}`}
      className={`block p-4 rounded-xl border transition-all card-lift ${
        isLocked
          ? "bg-card/30 border-border/50 cursor-not-allowed opacity-50"
          : isCompleted
            ? "glass-card border-correct/30"
            : `glass-card border-border ${colorStyles[color]} hover:shadow-lg`
      }`}
      onClick={(e) => {
        if (isLocked) e.preventDefault();
      }}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Status indicator */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            isLocked
              ? "bg-secondary/50"
              : isCompleted
                ? "bg-correct/20"
                : "bg-amber/20"
          }`}>
            {isLocked ? (
              <Lock size={14} className="text-muted-foreground" />
            ) : isCompleted ? (
              <span className="text-correct text-sm">✓</span>
            ) : (
              <Play size={14} className="text-amber" />
            )}
          </div>

          {/* Lesson info */}
          <div className="min-w-0">
            <div className={`font-medium truncate ${isLocked ? "text-muted-foreground" : ""}`}>
              {lesson.title}
            </div>
            {progress?.bestAccuracy !== undefined && progress.bestAccuracy > 0 && (
              <div className="text-xs text-muted-foreground">
                Best: {Math.round(progress.bestAccuracy)}%
              </div>
            )}
          </div>
        </div>

        {/* Stars */}
        {!isLocked && (
          <div className="flex gap-0.5 flex-shrink-0">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={14}
                className={i <= stars ? "star-filled fill-gold" : "star-empty"}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

interface QuickActionCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "amber" | "blow" | "draw";
}

function QuickActionCard({ href, icon, title, description, color }: QuickActionCardProps) {
  const colorStyles = {
    amber: "hover:border-amber/50 group-hover:text-amber",
    blow: "hover:border-blow/50 group-hover:text-blow",
    draw: "hover:border-draw/50 group-hover:text-draw",
  };

  const iconColors = {
    amber: "text-amber",
    blow: "text-blow",
    draw: "text-draw",
  };

  return (
    <Link
      href={href}
      className={`group glass-card p-5 rounded-xl border border-border card-lift hover:shadow-lg ${colorStyles[color]}`}
    >
      <div className={`mb-3 ${iconColors[color]}`}>{icon}</div>
      <div className="font-display text-lg mb-1">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </Link>
  );
}
