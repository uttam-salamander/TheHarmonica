export type SongGenre = "Folk" | "Blues";

export interface SongPreviewNote {
  hole: number;
  direction: "blow" | "draw";
}

export interface Song {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3;
  duration: string;
  key: string;
  genre: SongGenre;
  previewPattern: SongPreviewNote[];
}

export const SONGS: Song[] = [
  {
    id: "mary-lamb",
    title: "Mary Had a Little Lamb",
    difficulty: 1,
    duration: "1:20",
    key: "C",
    genre: "Folk",
    previewPattern: [
      { hole: 5, direction: "blow" },
      { hole: 4, direction: "draw" },
      { hole: 4, direction: "blow" },
      { hole: 4, direction: "draw" },
      { hole: 5, direction: "blow" },
      { hole: 5, direction: "blow" },
      { hole: 5, direction: "blow" },
      { hole: 4, direction: "draw" },
    ],
  },
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    difficulty: 1,
    duration: "1:45",
    key: "C",
    genre: "Folk",
    previewPattern: [
      { hole: 4, direction: "blow" },
      { hole: 4, direction: "blow" },
      { hole: 6, direction: "blow" },
      { hole: 6, direction: "blow" },
      { hole: 6, direction: "draw" },
      { hole: 6, direction: "draw" },
      { hole: 6, direction: "blow" },
      { hole: 5, direction: "draw" },
    ],
  },
  {
    id: "oh-susanna",
    title: "Oh Susanna",
    difficulty: 2,
    duration: "2:15",
    key: "C",
    genre: "Folk",
    previewPattern: [
      { hole: 4, direction: "draw" },
      { hole: 5, direction: "blow" },
      { hole: 5, direction: "draw" },
      { hole: 6, direction: "blow" },
      { hole: 6, direction: "draw" },
      { hole: 6, direction: "blow" },
      { hole: 5, direction: "draw" },
      { hole: 4, direction: "draw" },
    ],
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    difficulty: 2,
    duration: "3:00",
    key: "C",
    genre: "Folk",
    previewPattern: [
      { hole: 3, direction: "draw" },
      { hole: 4, direction: "blow" },
      { hole: 5, direction: "blow" },
      { hole: 4, direction: "blow" },
      { hole: 5, direction: "blow" },
      { hole: 4, direction: "draw" },
      { hole: 3, direction: "draw" },
      { hole: 3, direction: "blow" },
    ],
  },
  {
    id: "red-river",
    title: "Red River Valley",
    difficulty: 2,
    duration: "2:30",
    key: "C",
    genre: "Folk",
    previewPattern: [
      { hole: 4, direction: "blow" },
      { hole: 5, direction: "blow" },
      { hole: 6, direction: "draw" },
      { hole: 6, direction: "blow" },
      { hole: 5, direction: "draw" },
      { hole: 5, direction: "blow" },
      { hole: 4, direction: "draw" },
      { hole: 4, direction: "blow" },
    ],
  },
  {
    id: "saints",
    title: "When the Saints Go Marching In",
    difficulty: 2,
    duration: "2:00",
    key: "C",
    genre: "Blues",
    previewPattern: [
      { hole: 4, direction: "blow" },
      { hole: 5, direction: "blow" },
      { hole: 6, direction: "blow" },
      { hole: 6, direction: "draw" },
      { hole: 6, direction: "blow" },
      { hole: 5, direction: "draw" },
      { hole: 4, direction: "blow" },
      { hole: 4, direction: "draw" },
    ],
  },
];

export function getSongById(id: string): Song | undefined {
  return SONGS.find((song) => song.id === id);
}
