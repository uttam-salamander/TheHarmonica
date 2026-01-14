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
 * Convert frequency ratio to cents
 */
function frequencyToCents(detected: number, reference: number): number {
  return 1200 * Math.log2(detected / reference);
}

/**
 * NoteMapper maps detected frequencies to harmonica holes and directions.
 * Supports C harmonica with bend detection.
 */
export class NoteMapper {
  private layout: typeof C_HARMONICA_LAYOUT;
  private allNotes: HarmonicaNote[];

  constructor() {
    this.layout = C_HARMONICA_LAYOUT;
    this.allNotes = this.buildNoteList();
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
        notes.push({
          hole,
          direction: "blow",
          frequency: bentFreq,
          bendSemitones: bend,
          noteName: `${blowData.noteName}${bend === -1 ? "b" : `(${bend})`}`,
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
        notes.push({
          hole,
          direction: "draw",
          frequency: bentFreq,
          bendSemitones: bend,
          noteName: `${drawData.noteName}${bend === -1 ? "b" : `(${bend})`}`,
        });
      }
    }

    return notes;
  }

  /**
   * Map a detected frequency to the closest harmonica note
   */
  mapFrequency(frequency: number): NoteMapResult | null {
    if (frequency <= 0) return null;

    let closestNote: HarmonicaNote | null = null;
    let closestCents = Infinity;

    for (const note of this.allNotes) {
      const cents = Math.abs(frequencyToCents(frequency, note.frequency));
      if (cents < closestCents) {
        closestCents = cents;
        closestNote = note;
      }
    }

    // Only return a match if within 50 cents (half a semitone)
    if (!closestNote || closestCents > 50) {
      return null;
    }

    const actualCents = frequencyToCents(frequency, closestNote.frequency);

    return {
      note: closestNote,
      centsOff: actualCents,
      isBend: closestNote.bendSemitones !== 0,
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
}
