import Link from "next/link";
import { ArrowLeft, Search, Star, Play } from "lucide-react";

const songs = [
  { id: "mary-lamb", title: "Mary Had a Little Lamb", difficulty: 1, duration: "1:20", key: "C" },
  { id: "twinkle", title: "Twinkle Twinkle Little Star", difficulty: 1, duration: "1:45", key: "C" },
  { id: "oh-susanna", title: "Oh Susanna", difficulty: 2, duration: "2:15", key: "C" },
  { id: "amazing-grace", title: "Amazing Grace", difficulty: 2, duration: "3:00", key: "C" },
  { id: "red-river", title: "Red River Valley", difficulty: 2, duration: "2:30", key: "C" },
  { id: "saints", title: "When the Saints Go Marching In", difficulty: 2, duration: "2:00", key: "C" },
];

export default function SongsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/learn" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Song Library</h1>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search songs..."
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">All</button>
          <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80">Easy</button>
          <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80">Medium</button>
          <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80">Hard</button>
          <div className="flex-1" />
          <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80">Folk</button>
          <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80">Blues</button>
        </div>

        {/* Song Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/songs/${song.id}`}
              className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-1">{song.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i <= song.difficulty ? "text-close fill-close" : "text-muted"}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>Key: {song.key}</span>
                    <span>•</span>
                    <span>{song.duration}</span>
                  </div>
                </div>
                <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Play size={16} className="ml-0.5" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
