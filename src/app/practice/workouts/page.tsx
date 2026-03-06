"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Dumbbell, Play, Star, Filter } from "lucide-react";
import { useState } from "react";
import { WORKOUTS, type Workout } from "@/lib/techniques";

export default function WorkoutsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<1 | 2 | 3 | "all">("all");

  const filteredWorkouts = WORKOUTS.filter((workout) => {
    if (difficultyFilter !== "all" && workout.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <main className="min-h-screen pb-24 md:pb-8 page-enter safe-area-top">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4 sm:py-6">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group tap-target"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </header>

        {/* Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-3xl sm:text-4xl mb-2 flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-amber" />
            <span className="text-gradient">5-Minute</span> Workouts
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quick, focused practice sessions to build your skills
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Filter size={16} />
            <span>Filter by difficulty</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              { value: "all" as const, label: "All" },
              { value: 1 as const, label: "Easy" },
              { value: 2 as const, label: "Medium" },
              { value: 3 as const, label: "Hard" },
            ]).map((option) => (
              <button
                key={option.value}
                onClick={() => setDifficultyFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  difficultyFilter === option.value
                    ? option.value === 1
                      ? "bg-correct text-foreground"
                      : option.value === 2
                        ? "bg-amber text-background"
                        : option.value === 3
                          ? "bg-wrong text-foreground"
                          : "bg-blow text-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredWorkouts.length} of {WORKOUTS.length} workouts
        </div>

        {/* Workouts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWorkouts.map((workout, index) => (
            <WorkoutCard key={workout.id} workout={workout} index={index} />
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl mb-2">No workouts found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  );
}

function WorkoutCard({ workout, index }: { workout: Workout; index: number }) {
  const difficultyStyles = {
    1: { color: "text-correct", bg: "bg-correct/20", label: "Easy" },
    2: { color: "text-amber", bg: "bg-amber/20", label: "Medium" },
    3: { color: "text-wrong", bg: "bg-wrong/20", label: "Hard" },
  };

  const style = difficultyStyles[workout.difficulty];
  const totalMinutes = Math.floor(workout.duration / 60);

  return (
    <Link
      href={`/practice/workout/${workout.id}`}
      className="glass-card p-5 sm:p-6 rounded-xl border border-border hover:border-amber/50 card-lift group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center ${style.color}`}>
          <Dumbbell size={24} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${style.bg} ${style.color}`}>
            {style.label}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground flex items-center gap-1">
            <Clock size={12} />
            {totalMinutes} min
          </span>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-xl mb-2 group-hover:text-amber transition-colors">
        {workout.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{workout.description}</p>

      {/* Exercises preview */}
      <div className="space-y-2 mb-4">
        {workout.exercises.slice(0, 3).map((exercise, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={`w-5 h-5 rounded-full ${style.bg} ${style.color} flex items-center justify-center text-xs font-medium`}>
              {i + 1}
            </span>
            <span className="text-muted-foreground truncate">{exercise.name}</span>
            <span className="text-muted-foreground/50 ml-auto">
              {Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, "0")}
            </span>
          </div>
        ))}
        {workout.exercises.length > 3 && (
          <div className="text-xs text-muted-foreground pl-7">
            +{workout.exercises.length - 3} more exercises
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              size={14}
              className={i <= workout.difficulty ? "text-amber fill-amber" : "text-secondary"}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-amber font-medium text-sm">
          <span>Start</span>
          <Play size={16} className="fill-amber" />
        </div>
      </div>
    </Link>
  );
}
