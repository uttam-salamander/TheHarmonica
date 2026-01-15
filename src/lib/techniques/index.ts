/**
 * Harmonica Techniques Library
 * Based on research from harmo.com and harmonicalessons.com
 */

export interface Technique {
  id: string;
  name: string;
  description: string;
  category: "breathing" | "embouchure" | "expression" | "rhythm";
  difficulty: 1 | 2 | 3;
  duration: number; // suggested practice time in seconds
  steps: string[];
  tips: string[];
  videoUrl?: string;
}

export const TECHNIQUES: Technique[] = [
  // ============ BREATHING TECHNIQUES ============
  {
    id: "diaphragm-breathing",
    name: "Diaphragm Breathing",
    description: "Breathe from your belly, not your chest - the foundation of good tone",
    category: "breathing",
    difficulty: 1,
    duration: 120,
    steps: [
      "Place hand on belly, other on chest",
      "Breathe in slowly - belly should push out, chest stays still",
      "Breathe out slowly - belly goes in",
      "Now apply to harmonica: blow gently from belly",
      "Draw gently from belly - no chest movement",
    ],
    tips: [
      "If your shoulders rise, you're breathing wrong",
      "Lying down helps feel the correct motion",
      "This single skill transforms your tone",
    ],
  },
  {
    id: "breath-control",
    name: "Breath Control",
    description: "Control your airflow for consistent volume and tone",
    category: "breathing",
    difficulty: 2,
    duration: 180,
    steps: [
      "Play a single blow note (4-blow)",
      "Start soft, crescendo to loud over 4 counts",
      "Hold loud for 2 counts",
      "Decrescendo to soft over 4 counts",
      "Repeat with draw notes",
    ],
    tips: [
      "Don't overblow - gentle is better",
      "The harmonica responds to airflow, not force",
      "Practice long tones daily for control",
    ],
  },

  // ============ EMBOUCHURE TECHNIQUES ============
  {
    id: "puckering",
    name: "Puckering (Lip Pursing)",
    description: "The basic single-note technique for beginners",
    category: "embouchure",
    difficulty: 1,
    duration: 120,
    steps: [
      "Purse your lips like drinking from a straw",
      "Place lips around a single hole",
      "Blow gently - you should hear one clear note",
      "Move to adjacent holes, maintaining pucker",
      "Practice until single notes are consistent",
    ],
    tips: [
      "Start with holes 4-6, they're easiest",
      "If you hear multiple notes, tighten your pucker",
      "Relax your face - tension creates bleed",
    ],
  },
  {
    id: "tongue-blocking",
    name: "Tongue Blocking",
    description: "Block holes with your tongue for richer sound and chord options",
    category: "embouchure",
    difficulty: 2,
    duration: 300,
    steps: [
      "Cover 4 holes with your mouth",
      "Place tongue flat on left 3 holes",
      "Blow - you should hear only the rightmost hole",
      "Lift tongue briefly for chord slap",
      "Practice alternating: blocked - open - blocked",
    ],
    tips: [
      "This is essential for Chicago blues style",
      "Allows for octave splits and chord bursts",
      "Takes weeks to master - be patient",
    ],
  },
  {
    id: "deep-embouchure",
    name: "Deep Embouchure",
    description: "Get more harmonica in your mouth for better bends",
    category: "embouchure",
    difficulty: 2,
    duration: 180,
    steps: [
      "Start with normal puckered position",
      "Slide harmonica deeper into mouth",
      "Your lips should be closer to the comb",
      "This allows more tongue control for bends",
      "Practice draw notes with this position",
    ],
    tips: [
      "Deep embouchure is essential for bending",
      "Don't go so deep you can't control notes",
      "Find your sweet spot through experimentation",
    ],
  },

  // ============ EXPRESSION TECHNIQUES ============
  {
    id: "hand-vibrato",
    name: "Hand Vibrato",
    description: "Create wavering tone by moving your hands",
    category: "expression",
    difficulty: 1,
    duration: 120,
    steps: [
      "Cup your hands around the harmonica",
      "Play a sustained note (try 4-draw)",
      "Open and close your right hand rhythmically",
      "Listen for the 'wah-wah' effect",
      "Vary the speed for different expressions",
    ],
    tips: [
      "The wah-wah effect adds life to long notes",
      "Faster = more intense, slower = more mournful",
      "This is the easiest vibrato to learn",
    ],
  },
  {
    id: "throat-vibrato",
    name: "Throat Vibrato",
    description: "Create vibrato with your throat for a vocal quality",
    category: "expression",
    difficulty: 3,
    duration: 240,
    steps: [
      "Play a sustained note",
      "Think of laughing silently: 'huh-huh-huh'",
      "Apply that pulsing to your breath",
      "The note should waver in intensity",
      "Practice until it's smooth and controlled",
    ],
    tips: [
      "This sounds more natural than hand vibrato",
      "Singers use this same technique",
      "Takes time to develop - be patient",
    ],
  },
  {
    id: "diaphragm-vibrato",
    name: "Diaphragm Vibrato",
    description: "Pulsate your diaphragm for powerful, controlled vibrato",
    category: "expression",
    difficulty: 3,
    duration: 300,
    steps: [
      "Master diaphragm breathing first",
      "Play a sustained note",
      "Pulse your diaphragm gently",
      "Like tiny controlled hiccups",
      "The note should pulse in volume, not pitch",
    ],
    tips: [
      "This is the most professional vibrato",
      "Used by classical and blues players alike",
      "Requires strong breath control foundation",
    ],
  },

  // ============ RHYTHM TECHNIQUES ============
  {
    id: "tongue-articulation",
    name: "Tongue Articulation",
    description: "Use your tongue to create crisp note attacks",
    category: "rhythm",
    difficulty: 1,
    duration: 120,
    steps: [
      "Play a note while saying 'ta-ta-ta'",
      "Your tongue should touch the roof of mouth",
      "This creates clean note separation",
      "Try 'da-da-da' for softer articulation",
      "Try 'ka-ka-ka' for harder attacks",
    ],
    tips: [
      "Essential for playing fast passages cleanly",
      "Different syllables create different textures",
      "Practice scales with articulation",
    ],
  },
  {
    id: "double-tonguing",
    name: "Double Tonguing",
    description: "Alternate tongue positions for very fast passages",
    category: "rhythm",
    difficulty: 3,
    duration: 240,
    steps: [
      "Say 'ta-ka-ta-ka' rapidly without harmonica",
      "Notice the tongue alternating front-back",
      "Apply to a single sustained note",
      "Practice slowly, then increase speed",
      "Use for passages too fast for single tongue",
    ],
    tips: [
      "This is an advanced technique",
      "Used by professionals for lightning-fast runs",
      "Takes months of practice to master",
    ],
  },
];

/**
 * 5-Minute Workout routines
 * Inspired by Simply Piano's quick practice sessions
 */
export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  difficulty: 1 | 2 | 3;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  type: "technique" | "riff" | "scale" | "breathing";
  itemId?: string; // reference to technique or riff
  name: string;
  duration: number; // seconds
  instructions: string;
}

export const WORKOUTS: Workout[] = [
  {
    id: "warmup-basic",
    name: "Daily Warm-Up",
    description: "Get your lips and breath ready for practice",
    duration: 300,
    difficulty: 1,
    exercises: [
      {
        type: "breathing",
        name: "Belly Breathing",
        duration: 60,
        instructions: "10 deep belly breaths - no harmonica yet",
      },
      {
        type: "scale",
        name: "Middle Holes",
        duration: 60,
        instructions: "Blow and draw on holes 4, 5, 6 slowly",
      },
      {
        type: "technique",
        itemId: "puckering",
        name: "Single Notes",
        duration: 90,
        instructions: "Play each hole 4-7 individually - clean notes only",
      },
      {
        type: "riff",
        itemId: "simple-shuffle",
        name: "Shuffle Practice",
        duration: 90,
        instructions: "Play the shuffle rhythm on holes 4-5",
      },
    ],
  },
  {
    id: "blues-foundations",
    name: "Blues Foundations",
    description: "Build your blues vocabulary with essential patterns",
    duration: 300,
    difficulty: 2,
    exercises: [
      {
        type: "technique",
        itemId: "diaphragm-breathing",
        name: "Deep Breathing",
        duration: 45,
        instructions: "5 deep breaths from your belly",
      },
      {
        type: "riff",
        itemId: "warble-45",
        name: "-45 Warble",
        duration: 90,
        instructions: "The most important blues riff - practice with emotion!",
      },
      {
        type: "riff",
        itemId: "train-chug",
        name: "Train Chug",
        duration: 75,
        instructions: "Chug-a-chug-a rhythm on low holes",
      },
      {
        type: "riff",
        itemId: "boogie-woogie",
        name: "Boogie Pattern",
        duration: 90,
        instructions: "Driving rhythm: -2, -3, -4, -3 repeated",
      },
    ],
  },
  {
    id: "bend-practice",
    name: "Bending Workout",
    description: "Develop your bending control and accuracy",
    duration: 300,
    difficulty: 3,
    exercises: [
      {
        type: "breathing",
        name: "Throat Opening",
        duration: 45,
        instructions: "Yawn to open your throat, then draw long notes",
      },
      {
        type: "technique",
        itemId: "deep-embouchure",
        name: "Deep Position",
        duration: 45,
        instructions: "Get the harmonica deeper in your mouth",
      },
      {
        type: "scale",
        name: "4-Draw Bends",
        duration: 90,
        instructions: "Bend 4-draw down slowly, then release - repeat",
      },
      {
        type: "riff",
        itemId: "wailing-lick",
        name: "Wailing Practice",
        duration: 120,
        instructions: "Expressive bent licks - make it cry!",
      },
    ],
  },
  {
    id: "expression-session",
    name: "Expression Session",
    description: "Add life and emotion to your playing",
    duration: 300,
    difficulty: 2,
    exercises: [
      {
        type: "technique",
        itemId: "hand-vibrato",
        name: "Hand Vibrato",
        duration: 90,
        instructions: "Long tones with wah-wah hand movement",
      },
      {
        type: "technique",
        itemId: "breath-control",
        name: "Dynamics",
        duration: 90,
        instructions: "Soft to loud to soft on single notes",
      },
      {
        type: "technique",
        itemId: "tongue-articulation",
        name: "Articulation",
        duration: 60,
        instructions: "Ta-ta-ta on scale notes for crisp attacks",
      },
      {
        type: "riff",
        itemId: "warble-45",
        name: "Emotional Warble",
        duration: 60,
        instructions: "-45 warble with all your feeling!",
      },
    ],
  },
];

/**
 * Backing tracks for practice
 * Links to external resources
 */
export interface BackingTrack {
  id: string;
  name: string;
  key: string; // "G", "A", "C", etc.
  style: string;
  bpm: number;
  duration: string; // "4:00"
  source: string;
  url: string;
  harmonicaKey: string; // What key harmonica to use
  position: string; // "2nd position", "1st position"
}

export const BACKING_TRACKS: BackingTrack[] = [
  {
    id: "slow-blues-g",
    name: "Slow Blues in G",
    key: "G",
    style: "Slow Blues",
    bpm: 65,
    duration: "4:00",
    source: "Tomlin Harmonica",
    url: "https://www.tomlinharmonicalessons.com/harmonica-backing-track-slow-blues-g/",
    harmonicaKey: "C",
    position: "2nd position (cross harp)",
  },
  {
    id: "shuffle-blues-g",
    name: "Shuffle Blues in G",
    key: "G",
    style: "Shuffle Blues",
    bpm: 120,
    duration: "4:00",
    source: "LearnTheHarmonica",
    url: "https://www.learntheharmonica.com/post/12-bar-blues-harmonica-backing-track-shuffle-g",
    harmonicaKey: "C",
    position: "2nd position",
  },
  {
    id: "chicago-slow-a",
    name: "Chicago Slow Blues in A",
    key: "A",
    style: "Chicago Blues",
    bpm: 60,
    duration: "4:00",
    source: "Will Tang",
    url: "https://www.harmonicablues.willtang.co.uk/backing-jam-tracks/",
    harmonicaKey: "D",
    position: "2nd position",
  },
  {
    id: "jazz-swing-g",
    name: "Swinging Jazz in G",
    key: "G",
    style: "Jazz Swing",
    bpm: 130,
    duration: "4:00",
    source: "Will Tang",
    url: "https://www.harmonicablues.willtang.co.uk/backing-jam-tracks/",
    harmonicaKey: "C",
    position: "2nd position",
  },
  {
    id: "boogie-e",
    name: "John Lee Hooker Boogie in E",
    key: "E",
    style: "Blues Boogie",
    bpm: 110,
    duration: "4:00",
    source: "Will Tang",
    url: "https://www.harmonicablues.willtang.co.uk/backing-jam-tracks/",
    harmonicaKey: "A",
    position: "2nd position",
  },
  {
    id: "folk-acoustic-c",
    name: "Folk Acoustic in C",
    key: "C",
    style: "Folk/Country",
    bpm: 100,
    duration: "3:30",
    source: "Wildflower Harmonica",
    url: "https://www.wildflowerharmonica.com/resources/jam-tracks/",
    harmonicaKey: "C",
    position: "1st position (straight harp)",
  },
];

export function getTechniquesByCategory(category: Technique["category"]): Technique[] {
  return TECHNIQUES.filter((t) => t.category === category);
}

export function getWorkoutsByDifficulty(difficulty: 1 | 2 | 3): Workout[] {
  return WORKOUTS.filter((w) => w.difficulty === difficulty);
}

export function getBackingTracksByStyle(style: string): BackingTrack[] {
  return BACKING_TRACKS.filter((t) => t.style.toLowerCase().includes(style.toLowerCase()));
}
