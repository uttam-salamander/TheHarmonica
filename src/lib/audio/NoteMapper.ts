import type { HarmonicaKey } from "@/stores/settingsStore";

/**
 * Harmonica hole direction
 */
export type Direction = "blow" | "draw";

/**
 * Represents a detected harmonica note
 */
export interface HarmonicaNote {
  hole: number; // 1-10
  direction: Direction;
  frequency: number; // Expected frequency for this note
  bendSemitones: number; // 0 = natural, negative = bent down
  noteName: string; // e.g., "C4", "D4"
}

/**
 * Result of mapping a frequency to a harmonica note
 */
export interface NoteMapResult {
  note: HarmonicaNote;
  centsOff: number; // Deviation from expected pitch in cents
  isBend: boolean; // True if the note is bent
  alternateNote?: HarmonicaNote; // If another note matches at same frequency (e.g., 2-draw/3-blow)
}

/**
 * Note labels for diagram display
 */
export interface HoleNotes {
  blow: string;
  draw: string;
}

/**
 * Bend notes for diagram display
 */
export interface HoleBends {
  blowBends: string[];
  drawBends: string[];
}

/**
 * Standard 10-hole diatonic harmonica note layout
 * Frequencies are for a C harmonica (concert pitch A4 = 440Hz)
 */
const C_HARMONICA_LAYOUT: Record<string, { frequency: number; noteName: string }> = {
  // Blow notes
  "1-blow": { frequency: 261.63, noteName: "C4" },
  "2-blow": { frequency: 329.63, noteName: "E4" },
  "3-blow": { frequency: 392.0, noteName: "G4" },
  "4-blow": { frequency: 523.25, noteName: "C5" },
  "5-blow": { frequency: 659.25, noteName: "E5" },
  "6-blow": { frequency: 783.99, noteName: "G5" },
  "7-blow": { frequency: 1046.5, noteName: "C6" },
  "8-blow": { frequency: 1318.51, noteName: "E6" },
  "9-blow": { frequency: 1567.98, noteName: "G6" },
  "10-blow": { frequency: 2093.0, noteName: "C7" },
  // Draw notes
  "1-draw": { frequency: 293.66, noteName: "D4" },
  "2-draw": { frequency: 392.0, noteName: "G4" },
  "3-draw": { frequency: 493.88, noteName: "B4" },
  "4-draw": { frequency: 587.33, noteName: "D5" },
  "5-draw": { frequency: 739.99, noteName: "F5" },
  "6-draw": { frequency: 880.0, noteName: "A5" },
  "7-draw": { frequency: 987.77, noteName: "B5" },
  "8-draw": { frequency: 1174.66, noteName: "D6" },
  "9-draw": { frequency: 1396.91, noteName: "F6" },
  "10-draw": { frequency: 1760.0, noteName: "A6" },
};

/**
 * Bendable notes and their maximum bend depth in semitones
 * Draw bends: holes 1-6, Blow bends: holes 7-10
 */
const BEND_DEPTHS: Record<string, number> = {
  // Draw bends (negative semitones)
  "1-draw": -1, // D to Db
  "2-draw": -2, // G to Gb to F
  "3-draw": -3, // B to Bb to A to Ab
  "4-draw": -1, // D to Db
  "5-draw": -1, // F to E
  "6-draw": -1, // A to Ab
  // Blow bends (holes 7-10)
  "7-blow": -1,
  "8-blow": -1,
  "9-blow": -1,
  "10-blow": -2,
};

/**
 * Semitone offsets for each harmonica key relative to C
 */
const KEY_SEMITONE_OFFSETS: Record<HarmonicaKey, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  Bb: 10,
  Eb: 3,
  Ab: 8,
};

/**
 * Note names for transposition
 */
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Transpose a note name by a number of semitones
 */
function transposeNoteName(noteName: string, semitones: number): string {
  // Parse note like "C4", "D#5", etc.
  const match = noteName.match(/^([A-G]#?)(\d+)$/);
  if (!match) return noteName;

  const [, note, octaveStr] = match;
  const octave = parseInt(octaveStr);
  const noteIndex = NOTE_NAMES.indexOf(note);
  if (noteIndex === -1) return noteName;

  let newIndex = noteIndex + semitones;
  let octaveShift = 0;

  while (newIndex < 0) {
    newIndex += 12;
    octaveShift--;
  }
  while (newIndex >= 12) {
    newIndex -= 12;
    octaveShift++;
  }

  return `${NOTE_NAMES[newIndex]}${octave + octaveShift}`;
}

/**
 * Convert frequency ratio to cents
 */
function frequencyToCents(detected: number, reference: number): number {
  return 1200 * Math.log2(detected / reference);
}

/**
 * NoteMapper maps detected frequencies to harmonica holes and directions.
 * Supports multiple harmonica keys with bend detection.
 */
export class NoteMapper {
  private layout: typeof C_HARMONICA_LAYOUT;
  private allNotes: HarmonicaNote[];
  private key: HarmonicaKey;

  constructor(key: HarmonicaKey = "C") {
    this.key = key;
    this.layout = this.buildTransposedLayout(key);
    this.allNotes = this.buildNoteList();
  }

  /**
   * Get the current harmonica key
   */
  getKey(): HarmonicaKey {
    return this.key;
  }

  /**
   * Build a transposed layout for the given key
   */
  private buildTransposedLayout(key: HarmonicaKey): typeof C_HARMONICA_LAYOUT {
    const semitoneOffset = KEY_SEMITONE_OFFSETS[key];
    const transposed: typeof C_HARMONICA_LAYOUT = {};

    for (const [noteKey, data] of Object.entries(C_HARMONICA_LAYOUT)) {
      const transposedFrequency = data.frequency * Math.pow(2, semitoneOffset / 12);
      const transposedNoteName = transposeNoteName(data.noteName, semitoneOffset);
      transposed[noteKey] = { frequency: transposedFrequency, noteName: transposedNoteName };
    }

    return transposed;
  }

  /**
   * Build a flat list of all possible notes including bends
   */
  private buildNoteList(): HarmonicaNote[] {
    const notes: HarmonicaNote[] = [];

    for (let hole = 1; hole <= 10; hole++) {
      // Add blow note
      const blowKey = `${hole}-blow`;
      const blowData = this.layout[blowKey];
      notes.push({
        hole,
        direction: "blow",
        frequency: blowData.frequency,
        bendSemitones: 0,
        noteName: blowData.noteName,
      });

      // Add blow bends if applicable
      const blowBendDepth = BEND_DEPTHS[blowKey] ?? 0;
      for (let bend = -1; bend >= blowBendDepth; bend--) {
        const bentFreq = blowData.frequency * Math.pow(2, bend / 12);
        const bentNoteName = transposeNoteName(blowData.noteName, bend);
        notes.push({
          hole,
          direction: "blow",
          frequency: bentFreq,
          bendSemitones: bend,
          noteName: bentNoteName,
        });
      }

      // Add draw note
      const drawKey = `${hole}-draw`;
      const drawData = this.layout[drawKey];
      notes.push({
        hole,
        direction: "draw",
        frequency: drawData.frequency,
        bendSemitones: 0,
        noteName: drawData.noteName,
      });

      // Add draw bends if applicable
      const drawBendDepth = BEND_DEPTHS[drawKey] ?? 0;
      for (let bend = -1; bend >= drawBendDepth; bend--) {
        const bentFreq = drawData.frequency * Math.pow(2, bend / 12);
        const bentNoteName = transposeNoteName(drawData.noteName, bend);
        notes.push({
          hole,
          direction: "draw",
          frequency: bentFreq,
          bendSemitones: bend,
          noteName: bentNoteName,
        });
      }
    }

    return notes;
  }

  /**
   * Map a detected frequency to the closest harmonica note.
   * @param frequency - Detected frequency in Hz
   * @param preferDirection - Optional hint to prefer blow or draw when ambiguous (e.g., 2-draw vs 3-blow)
   */
  mapFrequency(frequency: number, preferDirection?: Direction): NoteMapResult | null {
    if (frequency <= 0) return null;

    // Find all notes within threshold
    const matches: { note: HarmonicaNote; cents: number }[] = [];

    for (const note of this.allNotes) {
      const cents = Math.abs(frequencyToCents(frequency, note.frequency));
      if (cents <= 50) {
        matches.push({ note, cents });
      }
    }

    if (matches.length === 0) return null;

    // Sort by cents (closest first)
    matches.sort((a, b) => a.cents - b.cents);

    // If multiple notes match at nearly the same cents (within 5 cents), disambiguate
    const closestCents = matches[0].cents;
    const tiedMatches = matches.filter((m) => Math.abs(m.cents - closestCents) < 5);

    let bestMatch = tiedMatches[0];
    let alternateNote: HarmonicaNote | undefined;

    if (tiedMatches.length > 1) {
      // Multiple notes at same frequency (e.g., 2-draw G4 and 3-blow G4)
      // Use preference hint or default to draw for lower holes, blow for upper
      const drawMatch = tiedMatches.find((m) => m.note.direction === "draw");
      const blowMatch = tiedMatches.find((m) => m.note.direction === "blow");

      if (preferDirection === "draw" && drawMatch) {
        bestMatch = drawMatch;
        alternateNote = blowMatch?.note;
      } else if (preferDirection === "blow" && blowMatch) {
        bestMatch = blowMatch;
        alternateNote = drawMatch?.note;
      } else {
        // Default: prefer draw for holes 1-6, blow for holes 7-10
        const avgHole = tiedMatches.reduce((sum, m) => sum + m.note.hole, 0) / tiedMatches.length;
        if (avgHole <= 6 && drawMatch) {
          bestMatch = drawMatch;
          alternateNote = blowMatch?.note;
        } else if (blowMatch) {
          bestMatch = blowMatch;
          alternateNote = drawMatch?.note;
        }
      }
    }

    const actualCents = frequencyToCents(frequency, bestMatch.note.frequency);

    return {
      note: bestMatch.note,
      centsOff: actualCents,
      isBend: bestMatch.note.bendSemitones !== 0,
      alternateNote,
    };
  }

  /**
   * Get the natural (unbent) note for a given hole and direction
   */
  getNaturalNote(hole: number, direction: Direction): HarmonicaNote | null {
    const key = `${hole}-${direction}`;
    const data = this.layout[key];
    if (!data) return null;

    return {
      hole,
      direction,
      frequency: data.frequency,
      bendSemitones: 0,
      noteName: data.noteName,
    };
  }

  /**
   * Get the maximum bend depth for a given hole and direction
   */
  getMaxBendDepth(hole: number, direction: Direction): number {
    const key = `${hole}-${direction}`;
    return BEND_DEPTHS[key] ?? 0;
  }

  /**
   * Check if a note can be bent
   */
  canBend(hole: number, direction: Direction): boolean {
    return this.getMaxBendDepth(hole, direction) < 0;
  }

  /**
   * Get all natural note names for each hole (for diagram display)
   */
  getHoleNotes(): Record<number, HoleNotes> {
    const result: Record<number, HoleNotes> = {};
    for (let hole = 1; hole <= 10; hole++) {
      result[hole] = {
        blow: this.layout[`${hole}-blow`].noteName,
        draw: this.layout[`${hole}-draw`].noteName,
      };
    }
    return result;
  }

  /**
   * Get all available bend note names for each hole (for diagram display)
   */
  getHoleBends(): Record<number, HoleBends> {
    const result: Record<number, HoleBends> = {};

    for (let hole = 1; hole <= 10; hole++) {
      const blowData = this.layout[`${hole}-blow`];
      const drawData = this.layout[`${hole}-draw`];
      const blowDepth = BEND_DEPTHS[`${hole}-blow`] ?? 0;
      const drawDepth = BEND_DEPTHS[`${hole}-draw`] ?? 0;

      result[hole] = {
        blowBends: this.generateBendNames(blowData.noteName, blowDepth),
        drawBends: this.generateBendNames(drawData.noteName, drawDepth),
      };
    }
    return result;
  }

  /**
   * Generate bent note names for a given base note and bend depth
   */
  private generateBendNames(baseNote: string, bendDepth: number): string[] {
    if (bendDepth >= 0) return [];
    const bends: string[] = [];
    for (let bend = -1; bend >= bendDepth; bend--) {
      const bentNote = transposeNoteName(baseNote, bend);
      bends.push(bentNote);
    }
    return bends;
  }
}
