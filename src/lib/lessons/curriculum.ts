import type { Lesson } from "./types";

/**
 * Complete curriculum for HarpFlow
 * Organized by branches: Fundamentals, Melodies, Bending
 */
export const CURRICULUM: Lesson[] = [
  // ============ FUNDAMENTALS BRANCH ============
  {
    id: "fund-1",
    title: "Your First Blow Notes",
    description: "Learn to play clean blow notes on holes 4, 5, and 6",
    branch: "fundamentals",
    order: 1,
    prerequisites: [],
    bpm: 60,
    timeSignature: [4, 4],
    tablature: [
      { hole: 4, direction: "blow", duration: 2 },
      { hole: 4, direction: "blow", duration: 2 },
      { hole: 5, direction: "blow", duration: 2 },
      { hole: 5, direction: "blow", duration: 2 },
      { hole: 6, direction: "blow", duration: 2 },
      { hole: 6, direction: "blow", duration: 2 },
      { hole: 5, direction: "blow", duration: 2 },
      { hole: 4, direction: "blow", duration: 2 },
    ],
    tips: [
      "Pucker your lips like you're drinking from a straw",
      "Keep your breath steady and relaxed",
      "Focus on one hole at a time",
    ],
  },
  {
    id: "fund-2",
    title: "Your First Draw Notes",
    description: "Learn to play clean draw notes on holes 4, 5, and 6",
    branch: "fundamentals",
    order: 2,
    prerequisites: ["fund-1"],
    bpm: 60,
    timeSignature: [4, 4],
    tablature: [
      { hole: 4, direction: "draw", duration: 2 },
      { hole: 4, direction: "draw", duration: 2 },
      { hole: 5, direction: "draw", duration: 2 },
      { hole: 5, direction: "draw", duration: 2 },
      { hole: 6, direction: "draw", duration: 2 },
      { hole: 6, direction: "draw", duration: 2 },
      { hole: 5, direction: "draw", duration: 2 },
      { hole: 4, direction: "draw", duration: 2 },
    ],
    tips: [
      "Drawing is like breathing in through a straw",
      "Don't suck too hard - gentle is better",
      "Keep the harmonica tilted slightly up",
    ],
  },
  {
    id: "fund-3",
    title: "Blow and Draw Together",
    description: "Alternate between blow and draw on the same hole",
    branch: "fundamentals",
    order: 3,
    prerequisites: ["fund-2"],
    bpm: 70,
    timeSignature: [4, 4],
    tablature: [
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 6, direction: "draw", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 6, direction: "draw", duration: 1 },
    ],
    tips: [
      "Think of it like breathing: in, out, in, out",
      "Keep your mouth position steady",
      "The harmonica does the work - you just breathe",
    ],
  },
  {
    id: "fund-4",
    title: "Moving Between Holes",
    description: "Practice sliding smoothly between adjacent holes",
    branch: "fundamentals",
    order: 4,
    prerequisites: ["fund-3"],
    bpm: 70,
    timeSignature: [4, 4],
    tablature: [
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 6, direction: "draw", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 2 },
      { hole: 6, direction: "blow", duration: 2 },
    ],
    tips: [
      "Slide the harmonica, not your head",
      "Keep your lips relaxed while moving",
      "Go slow at first - speed comes with practice",
    ],
  },
  {
    id: "fund-5",
    title: "The Low Notes",
    description: "Explore holes 1, 2, and 3 - they require more air",
    branch: "fundamentals",
    order: 5,
    prerequisites: ["fund-4"],
    bpm: 60,
    timeSignature: [4, 4],
    tablature: [
      { hole: 3, direction: "blow", duration: 2 },
      { hole: 3, direction: "draw", duration: 2 },
      { hole: 2, direction: "blow", duration: 2 },
      { hole: 2, direction: "draw", duration: 2 },
      { hole: 1, direction: "blow", duration: 2 },
      { hole: 1, direction: "draw", duration: 2 },
      { hole: 2, direction: "blow", duration: 2 },
      { hole: 3, direction: "blow", duration: 2 },
    ],
    tips: [
      "Low notes need more air - breathe from your belly",
      "Holes 1-3 are harder - be patient",
      "If it sounds weak, try opening your throat more",
    ],
  },
  {
    id: "fund-6",
    title: "The High Notes",
    description: "Master holes 7, 8, 9, and 10",
    branch: "fundamentals",
    order: 6,
    prerequisites: ["fund-4"],
    bpm: 60,
    timeSignature: [4, 4],
    tablature: [
      { hole: 7, direction: "blow", duration: 2 },
      { hole: 7, direction: "draw", duration: 2 },
      { hole: 8, direction: "blow", duration: 2 },
      { hole: 8, direction: "draw", duration: 2 },
      { hole: 9, direction: "blow", duration: 2 },
      { hole: 9, direction: "draw", duration: 2 },
      { hole: 10, direction: "blow", duration: 2 },
      { hole: 10, direction: "draw", duration: 2 },
    ],
    tips: [
      "High notes need less air but more focus",
      "Keep your embouchure tight",
      "These holes are great for expression later",
    ],
  },
  {
    id: "fund-7",
    title: "The Train Rhythm",
    description: "Learn the classic 'chug' pattern - foundation of blues",
    branch: "fundamentals",
    order: 7,
    prerequisites: ["fund-3"],
    bpm: 80,
    timeSignature: [4, 4],
    tablature: [
      // Chug pattern: blow-draw-draw-blow on same holes
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
    ],
    tips: [
      "Listen for the 'chug-a-chug-a' train sound",
      "Keep your breathing rhythmic like a steam engine",
      "This pattern is the basis of many blues songs",
    ],
  },

  // ============ MELODIES BRANCH ============
  {
    id: "melody-1",
    title: "Mary Had a Little Lamb",
    description: "Your first complete song using holes 4, 5, and 6",
    branch: "melodies",
    order: 1,
    prerequisites: ["fund-4"],
    bpm: 80,
    timeSignature: [4, 4],
    tablature: [
      // Ma-ry had a lit-tle lamb
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 2 },
      // lit-tle lamb, lit-tle lamb
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "draw", duration: 2 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 6, direction: "blow", duration: 2 },
      // Ma-ry had a lit-tle lamb
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      // fleece was white as snow
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 4 },
    ],
    tips: [
      "Sing the words in your head as you play",
      "Take breaths between phrases",
      "You just played your first song!",
    ],
  },
  {
    id: "melody-2",
    title: "Twinkle Twinkle",
    description: "A classic melody that adds hole 7",
    branch: "melodies",
    order: 2,
    prerequisites: ["melody-1"],
    bpm: 75,
    timeSignature: [4, 4],
    tablature: [
      // Twin-kle twin-kle lit-tle star
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 6, direction: "draw", duration: 1 },
      { hole: 6, direction: "draw", duration: 1 },
      { hole: 6, direction: "blow", duration: 2 },
      // How I won-der what you are
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 2 },
    ],
    tips: [
      "This song uses the same pattern twice",
      "Listen for the 'question and answer' feel",
      "Try playing it slower first, then speed up",
    ],
  },
  {
    id: "melody-3",
    title: "Oh Susanna",
    description: "A fun folk tune with more movement",
    branch: "melodies",
    order: 3,
    prerequisites: ["melody-2"],
    bpm: 90,
    timeSignature: [4, 4],
    tablature: [
      // Oh I come from Al-a-ba-ma
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 6, direction: "blow", duration: 0.5 },
      { hole: 6, direction: "draw", duration: 0.5 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      // with my ban-jo on my knee
      { hole: 4, direction: "draw", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 6, direction: "blow", duration: 1 },
      { hole: 5, direction: "draw", duration: 1 },
      { hole: 5, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 2 },
    ],
    tips: [
      "This song has a swing feel - don't play too rigidly",
      "The fast notes should flow smoothly",
      "Tap your foot to keep the beat",
    ],
  },
  {
    id: "melody-4",
    title: "Amazing Grace",
    description: "A beautiful hymn that spans more holes",
    branch: "melodies",
    order: 4,
    prerequisites: ["melody-2", "fund-5"],
    bpm: 65,
    timeSignature: [3, 4],
    tablature: [
      // A-ma-zing Grace
      { hole: 3, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 2 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 2 },
      { hole: 4, direction: "blow", duration: 1 },
      // How sweet the sound
      { hole: 4, direction: "draw", duration: 2 },
      { hole: 3, direction: "draw", duration: 1 },
      { hole: 3, direction: "draw", duration: 2 },
      { hole: 3, direction: "blow", duration: 1 },
      // That saved a wretch
      { hole: 3, direction: "draw", duration: 1 },
      { hole: 4, direction: "blow", duration: 2 },
      { hole: 5, direction: "blow", duration: 0.5 },
      { hole: 4, direction: "blow", duration: 0.5 },
      { hole: 5, direction: "blow", duration: 2 },
      { hole: 6, direction: "blow", duration: 1 },
      // Like me
      { hole: 5, direction: "draw", duration: 3 },
    ],
    tips: [
      "This is in 3/4 time - count 1-2-3, 1-2-3",
      "Let the long notes ring out fully",
      "This song is about feel, not speed",
    ],
  },

  // ============ BENDING BRANCH ============
  {
    id: "bend-1",
    title: "Feel the Bend",
    description: "Learn what bending feels like on the 4-draw",
    branch: "bending",
    order: 1,
    prerequisites: ["fund-7"],
    bpm: 50,
    timeSignature: [4, 4],
    tablature: [
      { hole: 4, direction: "draw", duration: 2 },
      { hole: 4, direction: "draw", duration: 2, bend: -1 },
      { hole: 4, direction: "draw", duration: 2 },
      { hole: 4, direction: "draw", duration: 2, bend: -1 },
      { hole: 4, direction: "draw", duration: 4 },
      { hole: 4, direction: "draw", duration: 2, bend: -1 },
      { hole: 4, direction: "draw", duration: 2 },
    ],
    tips: [
      "Say 'ee-yow' while drawing - this helps the bend",
      "The bend is about tongue position, not sucking harder",
      "Start with the natural note, then slowly bend down",
    ],
  },
  {
    id: "bend-2",
    title: "1-Draw Bend",
    description: "The deep, soulful 1-draw bend",
    branch: "bending",
    order: 2,
    prerequisites: ["bend-1", "fund-5"],
    bpm: 50,
    timeSignature: [4, 4],
    tablature: [
      { hole: 1, direction: "draw", duration: 2 },
      { hole: 1, direction: "draw", duration: 2, bend: -1 },
      { hole: 1, direction: "draw", duration: 4 },
      { hole: 1, direction: "draw", duration: 2, bend: -1 },
      { hole: 1, direction: "draw", duration: 2 },
      { hole: 1, direction: "draw", duration: 2, bend: -1 },
      { hole: 1, direction: "draw", duration: 2 },
    ],
    tips: [
      "The 1-draw bend is deep and powerful",
      "Open your throat wide for this one",
      "This bend creates the 'wailing' blues sound",
    ],
  },
  {
    id: "bend-3",
    title: "3-Draw Bends",
    description: "The versatile 3-draw has THREE bend depths",
    branch: "bending",
    order: 3,
    prerequisites: ["bend-1"],
    bpm: 45,
    timeSignature: [4, 4],
    tablature: [
      // Natural
      { hole: 3, direction: "draw", duration: 2 },
      // Half step
      { hole: 3, direction: "draw", duration: 2, bend: -1 },
      // Whole step
      { hole: 3, direction: "draw", duration: 2, bend: -2 },
      // 1.5 steps
      { hole: 3, direction: "draw", duration: 2, bend: -3 },
      // Back up
      { hole: 3, direction: "draw", duration: 2, bend: -2 },
      { hole: 3, direction: "draw", duration: 2, bend: -1 },
      { hole: 3, direction: "draw", duration: 2 },
    ],
    tips: [
      "The 3-draw can bend to 3 different notes!",
      "Think 'ee - eh - ah - aw' for the bend depths",
      "This hole is essential for blues playing",
    ],
  },
  {
    id: "bend-4",
    title: "Bluesy Lick",
    description: "Put your bends into a real blues phrase",
    branch: "bending",
    order: 4,
    prerequisites: ["bend-2", "bend-3"],
    bpm: 60,
    timeSignature: [4, 4],
    tablature: [
      // Classic blues lick
      { hole: 2, direction: "draw", duration: 1 },
      { hole: 3, direction: "draw", duration: 1, bend: -2 },
      { hole: 3, direction: "draw", duration: 1, bend: -1 },
      { hole: 4, direction: "blow", duration: 1 },
      { hole: 4, direction: "draw", duration: 1, bend: -1 },
      { hole: 4, direction: "draw", duration: 1 },
      { hole: 3, direction: "draw", duration: 2, bend: -1 },
      // Resolve
      { hole: 2, direction: "draw", duration: 2 },
      { hole: 1, direction: "draw", duration: 2, bend: -1 },
      { hole: 1, direction: "draw", duration: 4 },
    ],
    tips: [
      "This is a classic blues turnaround",
      "Let the bends 'cry' - don't rush them",
      "You're playing real blues now!",
    ],
  },
];

/**
 * Get a lesson by ID
 */
export function getLessonById(id: string): Lesson | undefined {
  return CURRICULUM.find((lesson) => lesson.id === id);
}

/**
 * Get all lessons in a branch
 */
export function getLessonsByBranch(branch: Lesson["branch"]): Lesson[] {
  return CURRICULUM.filter((lesson) => lesson.branch === branch).sort(
    (a, b) => a.order - b.order
  );
}

/**
 * Check if a lesson is available (prerequisites met)
 */
export function isLessonAvailable(
  lessonId: string,
  completedLessons: Set<string>
): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  return lesson.prerequisites.every((prereq) => completedLessons.has(prereq));
}
