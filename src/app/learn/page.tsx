"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Star,
  Flame,
  Trophy,
  Play,
  Target,
  Music,
  ChevronRight,
  Clock,
  Zap,
  Radio,
  Waves,
  Wind,
  Headphones,
  ExternalLink,
  Dumbbell,
  Sparkles,
  BookOpen,
  ArrowDown,
} from "lucide-react";
import { getLessonsByBranch, isLessonAvailable } from "@/lib/lessons";
import { useProgressStore } from "@/stores/progressStore";
import { RIFFS } from "@/lib/riffs";
import { TECHNIQUES, WORKOUTS, BACKING_TRACKS } from "@/lib/techniques";
import type { Lesson } from "@/lib/lessons";

export default function LearnPage() {
  const { level, xp, streak, completedLessons, lessonProgress, getXPToNextLevel, getLevelTitle } =
    useProgressStore();

  const fundamentals = getLessonsByBranch("fundamentals");
  const melodies = getLessonsByBranch("melodies");
  const bending = getLessonsByBranch("bending");

  const xpToNext = getXPToNextLevel();
  const levelTitle = getLevelTitle();
  const progressPercent = xpToNext > 0 ? 100 - (xpToNext / (xp + xpToNext)) * 100 : 100;

  return (
    <main className="min-h-screen pb-24 md:pb-8 page-enter safe-area-top">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group tap-target"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak indicator */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg ${streak > 0 ? "bg-amber/10 text-amber" : "bg-card text-muted-foreground"}`}
            >
              <Flame size={16} className={streak > 0 ? "streak-fire" : ""} />
              <span className="text-xs sm:text-sm font-medium">
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Level badge */}
            <Link
              href="/progress"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 glass-card rounded-lg border border-border hover:border-amber/50 transition-all group"
            >
              <Trophy size={16} className="text-amber" />
              <span className="text-xs sm:text-sm font-medium">
                Lv.{level} <span className="text-muted-foreground hidden sm:inline">•</span>{" "}
                <span className="hidden sm:inline">{xp} XP</span>
              </span>
              <ChevronRight
                size={14}
                className="text-muted-foreground group-hover:translate-x-0.5 transition-transform hidden sm:block"
              />
            </Link>
          </div>
        </header>

        {/* Progress Card - Compact on mobile */}
        <div className="glass-card rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 border-accent">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber/20 flex items-center justify-center">
                <Trophy size={18} className="text-amber" />
              </div>
              <div>
                <div className="font-display text-base sm:text-lg">{levelTitle}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Level {level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm font-medium text-amber">{xpToNext} XP</div>
              <div className="text-xs text-muted-foreground">to next</div>
            </div>
          </div>
          <div className="progress-bar h-2 sm:h-2">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Quick Navigation - Learning Path Shortcut */}
        <a
          href="#learning-path"
          className="flex items-center justify-between glass-card rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 border border-correct/30 hover:border-correct/60 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-correct/20 flex items-center justify-center text-correct">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="font-display text-sm sm:text-base text-correct">Learning Path</div>
              <div className="text-xs text-muted-foreground">
                Structured lessons • {fundamentals.length + melodies.length + bending.length} total
              </div>
            </div>
          </div>
          <ArrowDown size={18} className="text-correct group-hover:translate-y-1 transition-transform" />
        </a>

        {/* ============ PRACTICE MODES (FIRST!) ============ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl mb-1">
                <span className="text-gradient">Practice</span> Now
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Jump right in and start playing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <PracticeCard
              href="/practice/free"
              icon={<Radio className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="Free Play"
              description="No pressure, just play"
              color="amber"
              badge="Anytime"
            />
            <PracticeCard
              href="/practice/bending"
              icon={<Target className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="Bending Gym"
              description="Target practice for bends"
              color="draw"
              badge="Pitch trainer"
            />
            <PracticeCard
              href="/practice/riffs"
              icon={<Zap className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="Riff Lab"
              description="Learn blues licks & patterns"
              color="blow"
              badge={`${RIFFS.length} riffs`}
            />
            <PracticeCard
              href="/songs"
              icon={<Music className="w-6 h-6 sm:w-7 sm:h-7" />}
              title="Song Library"
              description="Play real tunes"
              color="correct"
              badge="6 songs"
            />
          </div>
        </section>

        {/* ============ 5-MINUTE WORKOUTS ============ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl mb-1 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber" />
                5-Minute Workouts
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Quick, focused practice sessions
              </p>
            </div>
            <Link
              href="/practice/workouts"
              className="text-xs sm:text-sm text-amber hover:underline flex items-center gap-1"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {/* Horizontal scroll on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 swipe-card-container">
            {WORKOUTS.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </section>

        {/* ============ RIFFS & LICKS ============ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blow" />
                Riffs & Licks
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Essential patterns every player should know
              </p>
            </div>
            <Link
              href="/practice/riffs"
              className="text-xs sm:text-sm text-blow hover:underline flex items-center gap-1"
            >
              See all {RIFFS.length} <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RIFFS.slice(0, 6).map((riff) => (
              <RiffCard key={riff.id} riff={riff} />
            ))}
          </div>
        </section>

        {/* ============ TECHNIQUES ============ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl mb-1 flex items-center gap-2">
                <Wind className="w-5 h-5 text-correct" />
                Techniques
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Master breathing, embouchure, and expression
              </p>
            </div>
            <Link
              href="/practice/techniques"
              className="text-xs sm:text-sm text-correct hover:underline flex items-center gap-1"
            >
              All techniques <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TECHNIQUES.slice(0, 8).map((technique) => (
              <TechniqueCard key={technique.id} technique={technique} />
            ))}
          </div>
        </section>

        {/* ============ BACKING TRACKS ============ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl mb-1 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-draw" />
                Backing Tracks
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Jam along with professional tracks
              </p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 swipe-card-container">
            {BACKING_TRACKS.map((track) => (
              <BackingTrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>

        {/* ============ LEARNING PATH (AFTER PRACTICE) ============ */}
        <section id="learning-path" className="border-t border-border pt-8 sm:pt-10 scroll-mt-4">
          <div className="mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl mb-2">
              Structured <span className="text-gradient">Learning Path</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Follow the curriculum to build skills progressively
            </p>
          </div>

          {/* Skill Tree Branches */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
        </section>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav flex justify-around items-center md:hidden">
        <NavItem href="/" icon={<ArrowLeft size={20} />} label="Home" />
        <NavItem href="/learn" icon={<Play size={20} />} label="Learn" active />
        <NavItem href="/progress" icon={<Trophy size={20} />} label="Progress" />
        <NavItem href="/settings" icon={<Waves size={20} />} label="Settings" />
      </nav>
    </main>
  );
}

/* ============ COMPONENT DEFINITIONS ============ */

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 tap-target ${
        active ? "text-amber" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

function PracticeCard({
  href,
  icon,
  title,
  description,
  color,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "amber" | "blow" | "draw" | "correct";
  badge?: string;
}) {
  const colorStyles = {
    amber: {
      iconBg: "bg-amber/20",
      iconColor: "text-amber",
      hoverBorder: "hover:border-amber/50",
      badgeBg: "bg-amber/10 text-amber",
    },
    blow: {
      iconBg: "bg-blow/20",
      iconColor: "text-blow",
      hoverBorder: "hover:border-blow/50",
      badgeBg: "bg-blow/10 text-blow",
    },
    draw: {
      iconBg: "bg-draw/20",
      iconColor: "text-draw",
      hoverBorder: "hover:border-draw/50",
      badgeBg: "bg-draw/10 text-draw",
    },
    correct: {
      iconBg: "bg-correct/20",
      iconColor: "text-correct",
      hoverBorder: "hover:border-correct/50",
      badgeBg: "bg-correct/10 text-correct",
    },
  };

  const styles = colorStyles[color];

  return (
    <Link
      href={href}
      className={`glass-card p-4 sm:p-5 rounded-xl border border-border card-lift hover:shadow-lg ${styles.hoverBorder} group`}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${styles.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${styles.iconColor}`}
      >
        {icon}
      </div>
      <div className="font-display text-base sm:text-lg mb-1">{title}</div>
      <div className="text-xs sm:text-sm text-muted-foreground mb-2">{description}</div>
      {badge && (
        <span className={`text-xs px-2 py-1 rounded-full ${styles.badgeBg}`}>{badge}</span>
      )}
    </Link>
  );
}

function WorkoutCard({ workout }: { workout: (typeof WORKOUTS)[number] }) {
  const difficultyColors = {
    1: "bg-correct/20 text-correct",
    2: "bg-amber/20 text-amber",
    3: "bg-wrong/20 text-wrong",
  };

  return (
    <Link
      href={`/practice/workout/${workout.id}`}
      className="swipe-card glass-card p-4 rounded-xl border border-border hover:border-amber/50 card-lift min-w-[260px] sm:min-w-0"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${difficultyColors[workout.difficulty]}`}
        >
          <Clock size={20} />
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
          {Math.floor(workout.duration / 60)} min
        </span>
      </div>
      <div className="font-display text-base mb-1">{workout.name}</div>
      <div className="text-xs text-muted-foreground mb-3">{workout.description}</div>
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= workout.difficulty ? difficultyColors[workout.difficulty] : "bg-secondary"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {workout.difficulty === 1 ? "Easy" : workout.difficulty === 2 ? "Medium" : "Hard"}
        </span>
      </div>
    </Link>
  );
}

function RiffCard({ riff }: { riff: (typeof RIFFS)[number] }) {
  const categoryStyles = {
    blues: { badge: "badge-blues", icon: <Waves size={14} /> },
    rhythm: { badge: "badge-rhythm", icon: <Zap size={14} /> },
    expression: { badge: "badge-expression", icon: <Sparkles size={14} /> },
    folk: { badge: "badge-folk", icon: <Music size={14} /> },
  };

  const style = categoryStyles[riff.category];

  return (
    <Link
      href={`/practice/riff/${riff.id}`}
      className="glass-card p-4 rounded-xl border border-border hover:border-blow/50 card-lift group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${style.badge}`}>
          {style.icon}
          {riff.category}
        </span>
        {riff.requiresBend && (
          <span className="text-xs px-2 py-1 rounded-full bg-draw/20 text-draw">Bends</span>
        )}
      </div>
      <div className="font-display text-base mb-1 group-hover:text-blow transition-colors">
        {riff.name}
      </div>
      <div className="text-xs text-muted-foreground line-clamp-2">{riff.description}</div>
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            size={12}
            className={i <= riff.difficulty ? "text-amber fill-amber" : "text-secondary"}
          />
        ))}
      </div>
    </Link>
  );
}

function TechniqueCard({ technique }: { technique: (typeof TECHNIQUES)[number] }) {
  const categoryIcons = {
    breathing: <Wind size={18} />,
    embouchure: <Target size={18} />,
    expression: <Sparkles size={18} />,
    rhythm: <Zap size={18} />,
  };

  const categoryColors = {
    breathing: "text-blow bg-blow/20",
    embouchure: "text-amber bg-amber/20",
    expression: "text-correct bg-correct/20",
    rhythm: "text-draw bg-draw/20",
  };

  return (
    <Link
      href={`/practice/technique/${technique.id}`}
      className="glass-card p-3 sm:p-4 rounded-xl border border-border hover:border-correct/50 card-lift group text-center"
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${categoryColors[technique.category]}`}
      >
        {categoryIcons[technique.category]}
      </div>
      <div className="font-display text-sm sm:text-base mb-1 group-hover:text-correct transition-colors line-clamp-1">
        {technique.name}
      </div>
      <div className="text-xs text-muted-foreground">{Math.floor(technique.duration / 60)} min</div>
    </Link>
  );
}

function BackingTrackCard({ track }: { track: (typeof BACKING_TRACKS)[number] }) {
  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="swipe-card glass-card p-4 rounded-xl border border-border hover:border-draw/50 card-lift min-w-[280px] sm:min-w-0"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-draw/20 flex items-center justify-center text-draw">
          <Headphones size={20} />
        </div>
        <ExternalLink size={14} className="text-muted-foreground" />
      </div>
      <div className="font-display text-base mb-1">{track.name}</div>
      <div className="text-xs text-muted-foreground mb-2">
        {track.style} • {track.bpm} BPM • {track.duration}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-secondary">Key: {track.key}</span>
        <span className="px-2 py-1 rounded bg-blow/20 text-blow">Use {track.harmonicaKey} harp</span>
      </div>
      <div className="text-xs text-muted-foreground mt-2">{track.position}</div>
    </a>
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

function BranchSection({
  title,
  color,
  description,
  lessons,
  lessonProgress,
  completedLessons,
}: BranchSectionProps) {
  const colorStyles = {
    blow: { dot: "bg-blow", text: "text-blow" },
    draw: { dot: "bg-draw", text: "text-draw" },
    correct: { dot: "bg-correct", text: "text-correct" },
  };

  const completedCount = lessons.filter((l) => lessonProgress[l.id]?.completed).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Branch header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${colorStyles[color].dot}`} />
          <div>
            <h3 className={`font-display text-lg sm:text-xl ${colorStyles[color].text}`}>{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">
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
      className={`block p-3 sm:p-4 rounded-xl border transition-all card-lift ${
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
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Status indicator */}
          <div
            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
              isLocked
                ? "bg-secondary/50"
                : isCompleted
                  ? "bg-correct/20"
                  : "bg-amber/20"
            }`}
          >
            {isLocked ? (
              <Lock size={12} className="text-muted-foreground" />
            ) : isCompleted ? (
              <span className="text-correct text-xs sm:text-sm">✓</span>
            ) : (
              <Play size={12} className="text-amber" />
            )}
          </div>

          {/* Lesson info */}
          <div className="min-w-0">
            <div
              className={`font-medium text-sm sm:text-base truncate ${isLocked ? "text-muted-foreground" : ""}`}
            >
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
                size={12}
                className={i <= stars ? "star-filled fill-gold" : "star-empty"}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
