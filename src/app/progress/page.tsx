"use client";

import Link from "next/link";
import { ArrowLeft, Flame, Trophy, Star, Clock, Target } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { CURRICULUM } from "@/lib/lessons";

const ACHIEVEMENTS = [
  { id: "first-note", name: "First Note", icon: "🎵", description: "Play any correct note" },
  { id: "clean-player", name: "Clean Player", icon: "🎯", description: "90%+ clean on a lesson" },
  { id: "on-fire", name: "On Fire", icon: "🔥", description: "7-day streak" },
  { id: "first-bend", name: "First Bend", icon: "🌊", description: "Bend any note" },
  { id: "perfectionist", name: "Perfectionist", icon: "⭐", description: "3 stars on any lesson" },
  { id: "fundamentals", name: "Fundamentals Master", icon: "🏆", description: "Complete all Fundamentals" },
];

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

  // Count songs mastered (3 stars on melodies)
  const songsMastered = Object.entries(lessonProgress).filter(
    ([id, p]) => id.startsWith("melody-") && p.stars === 3
  ).length;
  const totalSongs = CURRICULUM.filter((l) => l.branch === "melodies").length;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Your Progress</h1>
        </div>

        {/* Level & XP */}
        <section className="p-6 bg-card rounded-lg border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">Level {level}</div>
              <div className="text-muted-foreground">{levelTitle}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono">{xp} XP</div>
              <div className="text-sm text-muted-foreground">{xpToNext} XP to next level</div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${xpToNext > 0 ? 100 - (xpToNext / (xp + xpToNext)) * 100 : 100}%`,
              }}
            />
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Flame className={streak > 0 ? "text-orange-500" : "text-muted-foreground"} />}
            value={streak}
            label="Day Streak"
          />
          <StatCard
            icon={<Star className="text-close" />}
            value={`${lessonsCompleted}/${totalLessons}`}
            label="Lessons"
          />
          <StatCard
            icon={<Trophy className="text-primary" />}
            value={`${songsMastered}/${totalSongs}`}
            label="Songs Mastered"
          />
          <StatCard
            icon={<Target className="text-correct" />}
            value={`${averageAccuracy}%`}
            label="Avg Accuracy"
          />
        </div>

        {/* Practice Time */}
        <section className="p-6 bg-card rounded-lg border border-border mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold">Practice Summary</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-mono">
                {Math.floor(estimatedMinutes / 60)}h {estimatedMinutes % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Estimated time</div>
            </div>
            <div>
              <div className="text-3xl font-mono">{totalAttempts}</div>
              <div className="text-sm text-muted-foreground">Total attempts</div>
            </div>
            <div>
              <div className="text-3xl font-mono">{completedProgressEntries.length}</div>
              <div className="text-sm text-muted-foreground">Lessons completed</div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">
            Achievements ({achievements.size}/{ACHIEVEMENTS.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = achievements.has(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    unlocked
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/50 border-border opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  {unlocked && (
                    <div className="text-xs text-primary mt-2 font-medium">✓ Unlocked</div>
                  )}
                </div>
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
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
