"use client";

import Link from "next/link";
import { ArrowLeft, Search, Star, Play, Clock, Music } from "lucide-react";
import { useState } from "react";
import { SONGS, type Song } from "@/lib/songs";

type Difficulty = "all" | 1 | 2 | 3;
type Genre = "all" | Song["genre"];

export default function SongsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all");
  const [genreFilter, setGenreFilter] = useState<Genre>("all");

  const filteredSongs = SONGS.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || song.difficulty === difficultyFilter;
    const matchesGenre = genreFilter === "all" || song.genre === genreFilter;
    return matchesSearch && matchesDifficulty && matchesGenre;
  });

  return (
    <main className="min-h-screen p-6 md:p-8 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </header>

        {/* Page Title & Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl mb-2">
                Song <span className="text-gradient">Library</span>
              </h1>
              <p className="text-muted-foreground">Play your favorite tunes</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full md:w-64 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Difficulty filters */}
            <div className="flex gap-2">
              <FilterButton
                active={difficultyFilter === "all"}
                onClick={() => setDifficultyFilter("all")}
              >
                All
              </FilterButton>
              <FilterButton
                active={difficultyFilter === 1}
                onClick={() => setDifficultyFilter(1)}
                color="correct"
              >
                Easy
              </FilterButton>
              <FilterButton
                active={difficultyFilter === 2}
                onClick={() => setDifficultyFilter(2)}
                color="amber"
              >
                Medium
              </FilterButton>
              <FilterButton
                active={difficultyFilter === 3}
                onClick={() => setDifficultyFilter(3)}
                color="wrong"
              >
                Hard
              </FilterButton>
            </div>

            <div className="hidden md:block w-px h-8 bg-border self-center" />

            {/* Genre filters */}
            <div className="flex gap-2">
              <FilterButton
                active={genreFilter === "Folk"}
                onClick={() => setGenreFilter(genreFilter === "Folk" ? "all" : "Folk")}
                color="blow"
              >
                Folk
              </FilterButton>
              <FilterButton
                active={genreFilter === "Blues"}
                onClick={() => setGenreFilter(genreFilter === "Blues" ? "all" : "Blues")}
                color="draw"
              >
                Blues
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Song Grid */}
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal-stagger">
            {filteredSongs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl mb-2">No songs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Song count */}
        {filteredSongs.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            Showing {filteredSongs.length} of {SONGS.length} songs
          </div>
        )}
      </div>
    </main>
  );
}

function FilterButton({
  children,
  active,
  onClick,
  color = "amber",
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color?: "amber" | "blow" | "draw" | "correct" | "wrong";
}) {
  const colorStyles = {
    amber: active ? "bg-amber/20 text-amber border-amber/50" : "",
    blow: active ? "bg-blow/20 text-blow border-blow/50" : "",
    draw: active ? "bg-draw/20 text-draw border-draw/50" : "",
    correct: active ? "bg-correct/20 text-correct border-correct/50" : "",
    wrong: active ? "bg-wrong/20 text-wrong border-wrong/50" : "",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
        active
          ? colorStyles[color]
          : "bg-secondary border-transparent hover:bg-secondary/80"
      }`}
    >
      {children}
    </button>
  );
}

function SongCard({
  song,
  index,
}: {
  song: Song;
  index: number;
}) {
  const difficultyColors = {
    1: "text-correct",
    2: "text-amber",
    3: "text-wrong",
  };

  return (
    <Link
      href={`/songs/${song.id}`}
      className="glass-card p-5 rounded-xl border border-border card-lift hover:border-amber/30 hover:shadow-lg group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg mb-2 truncate group-hover:text-amber transition-colors">
            {song.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {/* Difficulty stars */}
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i <= song.difficulty
                      ? `${difficultyColors[song.difficulty as 1 | 2 | 3]} fill-current`
                      : "text-secondary"
                  }
                />
              ))}
            </div>

            <span className="text-border">•</span>

            {/* Key */}
            <span className="flex items-center gap-1">
              <Music size={12} />
              Key: {song.key}
            </span>

            <span className="text-border">•</span>

            {/* Duration */}
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {song.duration}
            </span>
          </div>

          {/* Genre tag */}
          <div className="mt-3">
            <span className={`text-xs px-2 py-1 rounded-md ${
              song.genre === "Blues"
                ? "bg-draw/20 text-draw"
                : "bg-blow/20 text-blow"
            }`}>
              {song.genre}
            </span>
          </div>
        </div>

        {/* Play button */}
        <button className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber to-amber-dark text-background flex items-center justify-center shadow-lg shadow-amber/20 group-hover:scale-105 group-hover:shadow-amber/40 transition-all">
          <Play size={20} className="ml-0.5" />
        </button>
      </div>
    </Link>
  );
}
