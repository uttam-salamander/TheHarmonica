"use client";

import Link from "next/link";
import { ArrowLeft, Wind, Target, Sparkles, Zap, Clock, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TECHNIQUES, type Technique } from "@/lib/techniques";

export default function TechniquesPage() {
  const [categoryFilter, setCategoryFilter] = useState<Technique["category"] | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<1 | 2 | 3 | "all">("all");

  const filteredTechniques = TECHNIQUES.filter((technique) => {
    if (categoryFilter !== "all" && technique.category !== categoryFilter) return false;
    if (difficultyFilter !== "all" && technique.difficulty !== difficultyFilter) return false;
    return true;
  });

  const categories: { value: Technique["category"] | "all"; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All", icon: null },
    { value: "breathing", label: "Breathing", icon: <Wind size={14} /> },
    { value: "embouchure", label: "Embouchure", icon: <Target size={14} /> },
    { value: "expression", label: "Expression", icon: <Sparkles size={14} /> },
    { value: "rhythm", label: "Rhythm", icon: <Zap size={14} /> },
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
            <Wind className="w-8 h-8 text-correct" />
            Techniques
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Master breathing, embouchure, and expression techniques
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter size={16} />
            <span>Filter techniques</span>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  categoryFilter === cat.value
                    ? cat.value === "breathing"
                      ? "bg-blow text-foreground"
                      : cat.value === "embouchure"
                        ? "bg-amber text-background"
                        : cat.value === "expression"
                          ? "bg-correct text-foreground"
                          : cat.value === "rhythm"
                            ? "bg-draw text-foreground"
                            : "bg-muted-foreground text-foreground"
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
            {([
              { value: "all" as const, label: "All" },
              { value: 1 as const, label: "Easy" },
              { value: 2 as const, label: "Medium" },
              { value: 3 as const, label: "Hard" },
            ]).map((option) => (
              <button
                key={option.value}
                onClick={() => setDifficultyFilter(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  difficultyFilter === option.value
                    ? option.value === 1
                      ? "bg-correct text-foreground"
                      : option.value === 2
                        ? "bg-amber text-background"
                        : option.value === 3
                          ? "bg-wrong text-foreground"
                          : "bg-muted-foreground text-foreground"
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
          Showing {filteredTechniques.length} of {TECHNIQUES.length} techniques
        </div>

        {/* Techniques Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTechniques.map((technique, index) => (
            <TechniqueCard key={technique.id} technique={technique} index={index} />
          ))}
        </div>

        {filteredTechniques.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Wind className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl mb-2">No techniques found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  );
}

function TechniqueCard({ technique, index }: { technique: Technique; index: number }) {
  const categoryStyles = {
    breathing: {
      icon: <Wind size={24} />,
      color: "text-blow",
      bg: "bg-blow/20",
      hoverBorder: "hover:border-blow/50",
      hoverText: "group-hover:text-blow",
    },
    embouchure: {
      icon: <Target size={24} />,
      color: "text-amber",
      bg: "bg-amber/20",
      hoverBorder: "hover:border-amber/50",
      hoverText: "group-hover:text-amber",
    },
    expression: {
      icon: <Sparkles size={24} />,
      color: "text-correct",
      bg: "bg-correct/20",
      hoverBorder: "hover:border-correct/50",
      hoverText: "group-hover:text-correct",
    },
    rhythm: {
      icon: <Zap size={24} />,
      color: "text-draw",
      bg: "bg-draw/20",
      hoverBorder: "hover:border-draw/50",
      hoverText: "group-hover:text-draw",
    },
  };

  const difficultyStyles = {
    1: { label: "Easy", color: "text-correct", bg: "bg-correct/20" },
    2: { label: "Medium", color: "text-amber", bg: "bg-amber/20" },
    3: { label: "Hard", color: "text-wrong", bg: "bg-wrong/20" },
  };

  const style = categoryStyles[technique.category];
  const diffStyle = difficultyStyles[technique.difficulty];

  return (
    <Link
      href={`/practice/technique/${technique.id}`}
      className={`glass-card p-5 rounded-xl border border-border ${style.hoverBorder} card-lift group`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center ${style.color}`}>
          {style.icon}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${diffStyle.bg} ${diffStyle.color}`}>
            {diffStyle.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <span className={`text-xs uppercase tracking-wide ${style.color}`}>
          {technique.category}
        </span>
      </div>
      <h3 className={`font-display text-xl mb-2 transition-colors ${style.hoverText}`}>
        {technique.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{technique.description}</p>

      {/* Steps preview */}
      <div className="space-y-1.5 mb-4">
        {technique.steps.slice(0, 2).map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className={`w-4 h-4 rounded-full ${style.bg} ${style.color} flex-shrink-0 flex items-center justify-center text-[10px] font-medium mt-0.5`}>
              {i + 1}
            </span>
            <span className="text-muted-foreground line-clamp-1">{step}</span>
          </div>
        ))}
        {technique.steps.length > 2 && (
          <div className="text-xs text-muted-foreground pl-6">
            +{technique.steps.length - 2} more steps
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} />
          <span>{Math.floor(technique.duration / 60)} min</span>
        </div>
        <div className={`flex items-center gap-1 ${style.color} text-sm font-medium`}>
          <span>Practice</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}
