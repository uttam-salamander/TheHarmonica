"use client";

import Link from "next/link";
import { ArrowLeft, Flame, Trophy, Star, Clock, Target, Music, Award, Zap } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { CURRICULUM } from "@/lib/lessons";

const ACHIEVEMENTS = [
  { id: "first-note", name: "First Note", icon: <Music className="w-6 h-6" />, description: "Play any correct note", color: "blow" },
  { id: "clean-player", name: "Clean Player", icon: <Target className="w-6 h-6" />, description: "90%+ clean on a lesson", color: "correct" },
  { id: "on-fire", name: "On Fire", icon: <Flame className="w-6 h-6" />, description: "7-day streak", color: "amber" },
  { id: "first-bend", name: "First Bend", icon: <Zap className="w-6 h-6" />, description: "Bend any note", color: "draw" },
  { id: "perfectionist", name: "Perfectionist", icon: <Star className="w-6 h-6" />, description: "3 stars on any lesson", color: "gold" },
  { id: "fundamentals", name: "Master", icon: <Award className="w-6 h-6" />, description: "Complete all Fundamentals", color: "amber" },
] as const;

export default function ProgressPage() {
  const {
    level,
    xp,
    streak,
    lessonProgress,
    achievements,
    completedLessons,
    getXPToNextLevel,
    getLevelTitle,
  } = useProgressStore();

  // Calculate stats
  const totalLessons = CURRICULUM.length;
  const lessonsCompleted = completedLessons.size;

  // Calculate average accuracy from completed lessons
  const completedProgressEntries = Object.values(lessonProgress).filter((p) => p.completed);
  const averageAccuracy =
    completedProgressEntries.length > 0
      ? Math.round(
          completedProgressEntries.reduce((sum, p) => sum + p.bestAccuracy, 0) /
            completedProgressEntries.length
        )
      : 0;

  // Calculate total practice time (estimated from attempts)
  const totalAttempts = Object.values(lessonProgress).reduce((sum, p) => sum + p.attempts, 0);
  const estimatedMinutes = totalAttempts * 3; // Assume ~3 min per attempt

  const xpToNext = getXPToNextLevel();
  const levelTitle = getLevelTitle();
  const progressPercent = xpToNext > 0 ? 100 - (xpToNext / (xp + xpToNext)) * 100 : 100;

  // Count songs mastered (3 stars on melodies)
  const songsMastered = Object.entries(lessonProgress).filter(
    ([id, p]) => id.startsWith("melody-") && p.stars === 3
  ).length;
  const totalSongs = CURRICULUM.filter((l) => l.branch === "melodies").length;

  return (
    <main className="min-h-screen p-6 md:p-8 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-10">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            Your <span className="text-gradient">Progress</span>
          </h1>
          <p className="text-muted-foreground">Track your harmonica journey</p>
        </div>

        {/* Level Card - Hero */}
        <section className="glass-card rounded-2xl p-8 mb-8 border-accent relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber/5 rounded-full blur-2xl" />
          <div className="absolute -left-5 -bottom-5 w-32 h-32 bg-draw/5 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              {/* Level badge */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center shadow-lg shadow-amber/30">
                  <span className="font-display text-4xl text-background">{level}</span>
                </div>
                <div>
                  <div className="font-display text-3xl">{levelTitle}</div>
                  <div className="text-muted-foreground">Level {level}</div>
                </div>
              </div>

              {/* XP display */}
              <div className="text-center md:text-right">
                <div className="font-display text-4xl text-amber">{xp}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Level {level + 1}</span>
                <span className="text-amber font-medium">{xpToNext} XP needed</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 reveal-stagger">
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            value={streak}
            label="Day Streak"
            color={streak > 0 ? "amber" : "muted"}
            highlight={streak >= 7}
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            value={`${lessonsCompleted}/${totalLessons}`}
            label="Lessons"
            color="gold"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            value={`${songsMastered}/${totalSongs}`}
            label="Songs Mastered"
            color="draw"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            value={`${averageAccuracy}%`}
            label="Avg Accuracy"
            color="correct"
          />
        </div>

        {/* Practice Summary */}
        <section className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blow/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blow" />
            </div>
            <div>
              <h2 className="font-display text-xl">Practice Summary</h2>
              <p className="text-xs text-muted-foreground">Your practice statistics</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl text-foreground">
                {Math.floor(estimatedMinutes / 60)}h {estimatedMinutes % 60}m
              </div>
              <div className="text-sm text-muted-foreground mt-1">Estimated time</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="font-display text-3xl md:text-4xl text-foreground">
                {totalAttempts}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total attempts</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl text-foreground">
                {completedProgressEntries.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Completed</div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-xl">Achievements</h2>
                <p className="text-xs text-muted-foreground">Unlock badges as you progress</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium">
              {achievements.size}/{ACHIEVEMENTS.length}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = achievements.has(achievement.id);
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlocked}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: "amber" | "gold" | "blow" | "draw" | "correct" | "muted";
  highlight?: boolean;
}) {
  const colorStyles = {
    amber: "text-amber bg-amber/10",
    gold: "text-gold bg-gold/10",
    blow: "text-blow bg-blow/10",
    draw: "text-draw bg-draw/10",
    correct: "text-correct bg-correct/10",
    muted: "text-muted-foreground bg-muted/50",
  };

  return (
    <div className={`glass-card p-4 rounded-xl transition-all ${highlight ? "ring-2 ring-amber/50" : ""}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorStyles[color]}`}>
        {icon}
      </div>
      <div className="font-display text-2xl">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: (typeof ACHIEVEMENTS)[number];
  unlocked: boolean;
}) {
  const colorStyles = {
    blow: { bg: "bg-blow/20", text: "text-blow", border: "border-blow/30" },
    draw: { bg: "bg-draw/20", text: "text-draw", border: "border-draw/30" },
    correct: { bg: "bg-correct/20", text: "text-correct", border: "border-correct/30" },
    amber: { bg: "bg-amber/20", text: "text-amber", border: "border-amber/30" },
    gold: { bg: "bg-gold/20", text: "text-gold", border: "border-gold/30" },
  };

  const style = colorStyles[achievement.color];

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        unlocked
          ? `${style.border} ${style.bg}`
          : "border-border/50 bg-card/30 opacity-40 grayscale"
      }`}
    >
      <div className={`mb-3 ${unlocked ? style.text : "text-muted-foreground"}`}>
        {achievement.icon}
      </div>
      <div className={`font-display text-base mb-1 ${unlocked ? "" : "text-muted-foreground"}`}>
        {achievement.name}
      </div>
      <div className="text-xs text-muted-foreground">{achievement.description}</div>
      {unlocked && (
        <div className={`text-xs mt-3 font-medium ${style.text}`}>
          ✓ Unlocked
        </div>
      )}
    </div>
  );
}
