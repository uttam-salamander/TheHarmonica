import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blow to-draw bg-clip-text text-transparent">
          Learn Harmonica with Real-Time Feedback
        </h1>

        <p className="text-xl text-muted-foreground">
          No account needed. No downloads. Just you and your harmonica.
        </p>

        <Link
          href="/learn"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Learning Free
        </Link>
      </div>

      {/* Feature Highlights */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <FeatureCard
          icon="🎯"
          title="Instant Feedback"
          description="Know if you're playing the right note - instantly"
        />
        <FeatureCard
          icon="🌊"
          title="Learn to Bend"
          description="Master note bending with visual pitch tracking"
        />
        <FeatureCard
          icon="📚"
          title="Structured Path"
          description="From zero to blues with guided lessons"
        />
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
