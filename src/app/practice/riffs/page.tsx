"use client";

import Link from "next/link";
import { ArrowLeft, Star, Waves, Zap, Sparkles, Music, Filter } from "lucide-react";
import { useState } from "react";
import { RIFFS, type Riff } from "@/lib/riffs";

export default function RiffsPage() {
  const [categoryFilter, setCategoryFilter] = useState<Riff["category"] | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<1 | 2 | 3 | "all">("all");
  const [showBendsOnly, setShowBendsOnly] = useState(false);

  const filteredRiffs = RIFFS.filter((riff) => {
    if (categoryFilter !== "all" && riff.category !== categoryFilter) return false;
    if (difficultyFilter !== "all" && riff.difficulty !== difficultyFilter) return false;
    if (showBendsOnly && !riff.requiresBend) return false;
    return true;
  });

  const categories: { value: Riff["category"] | "all"; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All", icon: null },
    { value: "blues", label: "Blues", icon: <Waves size={14} /> },
    { value: "rhythm", label: "Rhythm", icon: <Zap size={14} /> },
    { value: "expression", label: "Expression", icon: <Sparkles size={14} /> },
    { value: "folk", label: "Folk", icon: <Music size={14} /> },
  ];

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
            <Zap className="w-8 h-8 text-blow" />
            Riff <span className="text-gradient">Lab</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Master essential blues licks, rhythms, and expressive patterns
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter size={16} />
            <span>Filter riffs</span>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  categoryFilter === cat.value
                    ? "bg-blow text-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-2">Difficulty:</span>
            {(["all", 1, 2, 3] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  difficultyFilter === diff
                    ? diff === 1
                      ? "bg-correct text-foreground"
                      : diff === 2
                        ? "bg-amber text-background"
                        : diff === 3
                          ? "bg-wrong text-foreground"
                          : "bg-blow text-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {diff === "all" ? "All" : diff === 1 ? "Easy" : diff === 2 ? "Medium" : "Hard"}
              </button>
            ))}
          </div>

          {/* Bends toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBendsOnly(!showBendsOnly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showBendsOnly ? "bg-draw" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${
                  showBendsOnly ? "left-7" : "left-1"
                }`}
              />
            </button>
            <span className="text-sm">Only show riffs with bends</span>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredRiffs.length} of {RIFFS.length} riffs
        </div>

        {/* Riffs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredRiffs.map((riff, index) => (
            <RiffCard key={riff.id} riff={riff} index={index} />
          ))}
        </div>

        {filteredRiffs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl mb-2">No riffs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  );
}

function RiffCard({ riff, index }: { riff: Riff; index: number }) {
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
      className="glass-card p-4 sm:p-5 rounded-xl border border-border hover:border-blow/50 card-lift group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${style.badge}`}>
          {style.icon}
          {riff.category}
        </span>
        <div className="flex items-center gap-2">
          {riff.requiresBend && (
            <span className="text-xs px-2 py-1 rounded-full bg-draw/20 text-draw">Bends</span>
          )}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={12}
                className={i <= riff.difficulty ? "text-amber fill-amber" : "text-secondary"}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="font-display text-lg sm:text-xl mb-2 group-hover:text-blow transition-colors">
        {riff.name}
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{riff.description}</p>

      {/* Pattern preview */}
      <div className="flex gap-1 overflow-hidden">
        {riff.pattern.slice(0, 8).map((note, i) => (
          <div
            key={i}
            className={`w-6 h-8 rounded text-xs flex items-center justify-center font-mono ${
              note.direction === "blow" ? "bg-blow/20 text-blow" : "bg-draw/20 text-draw"
            }`}
          >
            {note.hole}
            {note.bend && "'"}
          </div>
        ))}
        {riff.pattern.length > 8 && (
          <div className="w-6 h-8 rounded text-xs flex items-center justify-center bg-secondary text-muted-foreground">
            ...
          </div>
        )}
      </div>
    </Link>
  );
}
