import Link from "next/link";
import { Music, Mic2, Waves, BookOpen, Sparkles, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-64 h-64 bg-draw/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-blow/10 rounded-full blur-3xl" />

        {/* Vinyl record decoration - top right */}
        <div className="absolute top-20 right-10 md:right-20 opacity-20">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-amber/30 relative">
            <div className="absolute inset-4 rounded-full border-4 border-amber/20" />
            <div className="absolute inset-8 rounded-full border-2 border-amber/10" />
            <div className="absolute inset-[45%] rounded-full bg-amber/30" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Sound wave animation */}
          <div className="flex justify-center mb-8 reveal-stagger">
            <div className="sound-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center space-y-6 reveal-stagger">
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none">
              <span className="text-gradient">Learn</span>
              <br />
              <span className="text-foreground">Harmonica</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real-time pitch detection meets visual feedback.
              <br className="hidden md:block" />
              <span className="text-amber">No downloads. No accounts. Just play.</span>
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/learn" className="btn-primary inline-flex items-center gap-3 text-lg group">
                <span>Start Learning Free</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber" />
                Works in browser
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-amber" />
                Uses your mic
              </span>
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber" />
                100% free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Why HarpFlow?
            </h2>
            <p className="text-muted-foreground">
              Everything you need to go from zero to blues
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            <FeatureCard
              icon={<Mic2 className="w-8 h-8" />}
              title="Instant Feedback"
              description="Know if you're hitting the right note the moment you play. Our pitch detection responds in real-time."
              accent="blow"
            />
            <FeatureCard
              icon={<Waves className="w-8 h-8" />}
              title="Master Bending"
              description="Visual pitch tracking shows exactly how far you're bending. Hit those blue notes with precision."
              accent="draw"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Guided Path"
              description="From your first note to complex melodies. Structured lessons that build real skills."
              accent="amber"
            />
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section className="relative py-16 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-8 md:p-12 border-accent">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Harmonica visualization preview */}
              <div className="order-2 md:order-1">
                <div className="bg-card/50 rounded-xl p-6">
                  {/* Mini harmonica diagram */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hole) => (
                      <div
                        key={hole}
                        className={`w-8 h-12 rounded-md flex items-center justify-center text-sm font-medium transition-all ${
                          hole === 4
                            ? "bg-blow/30 border-2 border-blow scale-110 shadow-lg shadow-blow/20"
                            : "bg-secondary/50 border border-border"
                        }`}
                      >
                        {hole}
                      </div>
                    ))}
                  </div>

                  {/* Simulated detection display */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-display text-blow">4↑</div>
                    <div className="text-sm text-muted-foreground">
                      D4 • 293.7 Hz • <span className="text-correct">+2¢</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-correct/20 text-correct text-sm">
                      <span className="w-2 h-2 rounded-full bg-correct animate-pulse" />
                      Clean tone
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="order-1 md:order-2 space-y-4">
                <h3 className="font-display text-2xl md:text-3xl">
                  See What You Play
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our real-time visualization shows exactly which hole you&apos;re playing,
                  whether you&apos;re blowing or drawing, and how accurate your pitch is —
                  down to the cent.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blow" />
                    <span className="text-blow">Blue for blow notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-draw" />
                    <span className="text-draw">Purple for draw notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-bleed" />
                    <span className="text-bleed">Orange for bleed detection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 px-6 md:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-4xl md:text-5xl">
            Ready to <span className="text-gradient">Play?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Grab your harmonica and let&apos;s make some music.
          </p>
          <Link href="/learn" className="btn-primary inline-flex items-center gap-3 text-lg group">
            <span>Start Your Journey</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="sound-wave scale-75 opacity-50">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="font-display text-lg text-foreground">HarpFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
            <span>v0.1.0</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: "blow" | "draw" | "amber";
}) {
  const accentStyles = {
    blow: "border-blow/30 hover:border-blow/50 hover:shadow-blow/10",
    draw: "border-draw/30 hover:border-draw/50 hover:shadow-draw/10",
    amber: "border-amber/30 hover:border-amber/50 hover:shadow-amber/10",
  };

  const iconStyles = {
    blow: "text-blow",
    draw: "text-draw",
    amber: "text-amber",
  };

  return (
    <div
      className={`glass-card rounded-xl p-6 border card-lift hover:shadow-2xl ${accentStyles[accent]}`}
    >
      <div className={`mb-4 ${iconStyles[accent]}`}>{icon}</div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
