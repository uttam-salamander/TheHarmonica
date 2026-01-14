import Link from "next/link";
import { ArrowLeft, Flame, Trophy, Star, Clock, Target } from "lucide-react";

export default function ProgressPage() {
  // Simulated progress data
  const stats = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    lessonsCompleted: 0,
    totalLessons: 21,
    songsMastered: 0,
    totalSongs: 6,
    practiceTime: 0,
    averageAccuracy: 0,
  };

  const achievements = [
    { id: "first-note", name: "First Note", icon: "🎵", description: "Play any correct note", unlocked: false },
    { id: "clean-player", name: "Clean Player", icon: "🎯", description: "90%+ clean on a lesson", unlocked: false },
    { id: "on-fire", name: "On Fire", icon: "🔥", description: "7-day streak", unlocked: false },
    { id: "first-bend", name: "First Bend", icon: "🌊", description: "Bend any note", unlocked: false },
    { id: "perfectionist", name: "Perfectionist", icon: "⭐", description: "3 stars on any lesson", unlocked: false },
    { id: "fundamentals", name: "Fundamentals Master", icon: "🏆", description: "Complete all Fundamentals", unlocked: false },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Your Progress</h1>
        </div>

        {/* Level & XP */}
        <section className="p-6 bg-card rounded-lg border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">Level {stats.level}</div>
              <div className="text-muted-foreground">Beginner</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono">{stats.xp} XP</div>
              <div className="text-sm text-muted-foreground">{stats.xpToNextLevel - stats.xp} XP to next level</div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
            />
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Flame className="text-orange-500" />}
            value={stats.streak}
            label="Day Streak"
          />
          <StatCard
            icon={<Star className="text-close" />}
            value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
            label="Lessons"
          />
          <StatCard
            icon={<Trophy className="text-primary" />}
            value={`${stats.songsMastered}/${stats.totalSongs}`}
            label="Songs"
          />
          <StatCard
            icon={<Target className="text-correct" />}
            value={`${stats.averageAccuracy}%`}
            label="Avg Accuracy"
          />
        </div>

        {/* Practice Time */}
        <section className="p-6 bg-card rounded-lg border border-border mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold">Practice Time</h2>
          </div>
          <div className="text-3xl font-mono">
            {Math.floor(stats.practiceTime / 60)}h {stats.practiceTime % 60}m
          </div>
          <div className="text-sm text-muted-foreground mt-1">Total time practiced</div>
        </section>

        {/* Achievements */}
        <section className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/50 border-border opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-medium">{achievement.name}</div>
                <div className="text-xs text-muted-foreground">{achievement.description}</div>
              </div>
            ))}
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
      <div className="flex items-center gap-2 mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
