export type KenBurns = {
  s0: number;
  s1: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

export type Beat = {
  src: string;
  tint: string;
  kb: KenBurns;
  /** Default / desktop landscape object-position. */
  objectPosition?: string;
  objectPositionLandscape?: string;
  objectPositionPortrait?: string;
  /** Reduced Ken Burns for mobile landscape cinematic. */
  kbMobile?: KenBurns;
};

export type BandAnim = "blur" | "drift" | "punch" | "depth" | "scatter" | "rise";

export type Band = {
  a: number;
  b: number;
  anim: BandAnim;
  scrim: number;
  side?: "left";
  first?: boolean;
  last?: boolean;
  spread?: number;
  headline: string;
  sub?: string;
  kicker?: string;
  /** Dwell weight; used to build a non-uniform time map. Longer for two-line bands. */
  dwellMs: number;
};

/** Total cinematic length. Tuned so each band is readable without rushing. */
export const CINEMATIC_DURATION_MS = 38000;

export const BEATS: Beat[] = [
  {
    src: "/assets/hero/hero-1-field.jpg",
    tint: "#97a070",
    kb: { s0: 1.04, s1: 1.12, x0: 0, x1: 0, y0: 0, y1: 0 },
    objectPosition: "center 40%",
    objectPositionLandscape: "center 38%",
    kbMobile: { s0: 1.03, s1: 1.07, x0: 0, x1: 0, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-2-falls.jpg",
    tint: "#8c857c",
    kb: { s0: 1.1, s1: 1.1, x0: 0, x1: 0, y0: -2, y1: 2 },
    objectPositionLandscape: "center 45%",
    kbMobile: { s0: 1.05, s1: 1.05, x0: 0, x1: 0, y0: -1, y1: 1 },
  },
  {
    src: "/assets/hero/hero-3-badlands.jpg",
    tint: "#66602a",
    kb: { s0: 1.08, s1: 1.08, x0: 0, x1: 0, y0: -2, y1: 2 },
    objectPositionLandscape: "center 42%",
    kbMobile: { s0: 1.04, s1: 1.04, x0: 0, x1: 0, y0: -1, y1: 1 },
  },
  {
    src: "/assets/hero/hero-6-fog.jpg",
    tint: "#9b7874",
    kb: { s0: 1.04, s1: 1.16, x0: 0, x1: 0, y0: 0, y1: 0 },
    objectPositionLandscape: "center 46%",
    kbMobile: { s0: 1.03, s1: 1.08, x0: 0, x1: 0, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-4-path.jpg",
    tint: "#3c3c0e",
    kb: { s0: 1.04, s1: 1.14, x0: 0, x1: 0, y0: 0, y1: 0 },
    objectPositionLandscape: "center 50%",
    kbMobile: { s0: 1.03, s1: 1.08, x0: 0, x1: 0, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-5-macro.jpg",
    tint: "#674d24",
    kb: { s0: 1.1, s1: 1.1, x0: 2, x1: -2, y0: 0, y1: 0 },
    objectPositionLandscape: "center 48%",
    kbMobile: { s0: 1.05, s1: 1.05, x0: 1, x1: -1, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-7-lake.jpg",
    tint: "#64675e",
    kb: { s0: 1.08, s1: 1.08, x0: 0, x1: 0, y0: -2, y1: 2 },
    objectPositionLandscape: "center 44%",
    kbMobile: { s0: 1.04, s1: 1.04, x0: 0, x1: 0, y0: -1, y1: 1 },
  },
  {
    src: "/assets/hero/hero-8-dusk.jpg",
    tint: "#3d302f",
    kb: { s0: 1.08, s1: 1.02, x0: 0, x1: 0, y0: 1, y1: 0 },
    objectPosition: "center 55%",
    objectPositionLandscape: "center 52%",
    objectPositionPortrait: "center 58%",
    kbMobile: { s0: 1.05, s1: 1.02, x0: 0, x1: 0, y0: 0.5, y1: 0 },
  },
];

/** Beat centres on the 0 to 1 progress axis. Crossfade width matches the static build. */
export const BEAT_CENTRES = [0.06, 0.2, 0.34, 0.48, 0.6, 0.72, 0.85, 0.96];
export const XFADE = 0.035;

/** Crossfade midpoints between beats — shared by layers and band timing. */
export function beatCrossfadeMids(): number[] {
  return BEAT_CENTRES.map((_, i) =>
    i === 0 ? 0 : (BEAT_CENTRES[i - 1] + BEAT_CENTRES[i]) / 2
  );
}

export const BANDS: Band[] = [
  {
    a: 0,
    b: 0.27,
    anim: "blur",
    scrim: 0.62,
    first: true,
    dwellMs: 9000,
    headline: "Light never waits for you.",
  },
  {
    a: 0.27,
    b: 0.54,
    anim: "depth",
    scrim: 0.88,
    side: "left",
    dwellMs: 9000,
    headline: "Some of it journeys across great wilds to reach you.",
  },
  {
    a: 0.54,
    b: 0.785,
    anim: "depth",
    scrim: 0.72,
    side: "left",
    dwellMs: 8500,
    headline: "And some of it you have to walk into.",
  },
  {
    a: 0.785,
    b: 0.93,
    anim: "drift",
    scrim: 0.68,
    dwellMs: 5500,
    headline: "But when the evening falls, it fades from view.",
  },
  {
    a: 0.93,
    b: 1,
    anim: "rise",
    scrim: 0.76,
    last: true,
    dwellMs: 2500,
    kicker: "ML Photography",
    headline: "Malek Larif",
    sub: "I photograph the last light. Prints and digital files, sent by the person who took them.",
  },
];

/** Resting poster: last beat (dusk silhouettes) — the frame the cinematic ends on. */
export const RESTED_BEAT_INDEX = 7;

export const SETTLE_COPY = {
  kicker: "ML Photography",
  name: "Malek Larif",
  sub: "I photograph the last light. Prints and digital files, sent by the person who took them.",
};
