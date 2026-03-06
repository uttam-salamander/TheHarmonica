import { describe, expect, test } from "bun:test";
import { SONGS, getSongById } from "@/lib/songs";

describe("songs", () => {
  test("song ids are unique", () => {
    const ids = SONGS.map((song) => song.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("each song has a preview pattern", () => {
    for (const song of SONGS) {
      expect(song.previewPattern.length).toBeGreaterThan(0);
    }
  });

  test("preview notes stay within harmonica hole range", () => {
    for (const song of SONGS) {
      for (const note of song.previewPattern) {
        expect(note.hole).toBeGreaterThanOrEqual(1);
        expect(note.hole).toBeLessThanOrEqual(10);
      }
    }
  });

  test("getSongById returns a song for valid ids", () => {
    for (const song of SONGS) {
      expect(getSongById(song.id)?.id).toBe(song.id);
    }
  });

  test("getSongById returns undefined for unknown ids", () => {
    expect(getSongById("does-not-exist")).toBeUndefined();
  });
});
