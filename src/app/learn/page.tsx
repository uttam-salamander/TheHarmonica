"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Star, Flame } from "lucide-react";

export default function LearnPage() {
  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flame className="text-orange-500" size={20} />
              <span>0 day streak</span>
            </div>
            <div className="px-4 py-2 bg-card rounded-lg border border-border">
              Level 1 • 0 XP
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Your Learning Path</h1>

        {/* Skill Tree Branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fundamentals Branch */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blow flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blow" />
              Fundamentals
            </h2>
            <div className="space-y-3">
              <LessonNode
                id="welcome"
                title="Welcome to Harmonica"
                status="available"
                stars={0}
              />
              <LessonNode
                id="first-blow"
                title="Your First Blow Notes"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="first-draw"
                title="Your First Draw Notes"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="clean-notes"
                title="Clean Single Notes"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="middle-octave"
                title="The Middle Octave"
                status="locked"
                stars={0}
              />
            </div>
          </div>

          {/* Melodies Branch */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-correct flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-correct" />
              Melodies
            </h2>
            <div className="space-y-3">
              <LessonNode
                id="mary-lamb"
                title="Mary Had a Little Lamb"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="twinkle"
                title="Twinkle Twinkle"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="oh-susanna"
                title="Oh Susanna"
                status="locked"
                stars={0}
              />
            </div>
          </div>

          {/* Bending Branch */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-draw flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-draw" />
              Bending
            </h2>
            <div className="space-y-3">
              <LessonNode
                id="what-is-bending"
                title="What is Bending?"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="first-bend"
                title="Your First Bend (4-Draw)"
                status="locked"
                stars={0}
              />
              <LessonNode
                id="bend-control"
                title="Bend Control"
                status="locked"
                stars={0}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LessonNode({
  id,
  title,
  status,
  stars,
}: {
  id: string;
  title: string;
  status: "locked" | "available" | "completed";
  stars: 0 | 1 | 2 | 3;
}) {
  const isLocked = status === "locked";
  const isAvailable = status === "available";

  return (
    <Link
      href={isLocked ? "#" : `/learn/${id}`}
      className={`block p-4 rounded-lg border transition-all ${
        isLocked
          ? "bg-muted/50 border-border cursor-not-allowed opacity-60"
          : isAvailable
          ? "bg-card border-primary hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10"
          : "bg-card border-correct"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={isLocked ? "text-muted-foreground" : ""}>{title}</span>
        {isLocked ? (
          <Lock size={16} className="text-muted-foreground" />
        ) : (
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                size={14}
                className={i <= stars ? "text-close fill-close" : "text-muted-foreground"}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
