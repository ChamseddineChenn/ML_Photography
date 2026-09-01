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
  /** Optional object-position for the resting poster crop. */
  objectPosition?: string;
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
export const CINEMATIC_DURATION_MS = 35000;

export const BEATS: Beat[] = [
  {
    src: "/assets/hero/hero-1-field.jpg",
    tint: "#97a070",
    kb: { s0: 1.04, s1: 1.12, x0: 0, x1: 0, y0: 0, y1: 0 },
    objectPosition: "center 40%",
  },
  {
    src: "/assets/hero/hero-2-falls.jpg",
    tint: "#8c857c",
    kb: { s0: 1.1, s1: 1.1, x0: 0, x1: 0, y0: -2, y1: 2 },
  },
  {
    src: "/assets/hero/hero-3-badlands.jpg",
    tint: "#66602a",
    kb: { s0: 1.08, s1: 1.08, x0: 0, x1: 0, y0: -2, y1: 2 },
  },
  {
    src: "/assets/hero/hero-4-path.jpg",
    tint: "#3c3c0e",
    kb: { s0: 1.04, s1: 1.14, x0: 0, x1: 0, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-5-macro.jpg",
    tint: "#674d24",
    kb: { s0: 1.1, s1: 1.1, x0: 2, x1: -2, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-6-fog.jpg",
    tint: "#9b7874",
    kb: { s0: 1.04, s1: 1.16, x0: 0, x1: 0, y0: 0, y1: 0 },
  },
  {
    src: "/assets/hero/hero-7-lake.jpg",
    tint: "#64675e",
    kb: { s0: 1.08, s1: 1.08, x0: 0, x1: 0, y0: -2, y1: 2 },
  },
  {
    src: "/assets/hero/hero-8-dusk.jpg",
    tint: "#3d302f",
    kb: { s0: 1.08, s1: 1.02, x0: 0, x1: 0, y0: 1, y1: 0 },
    objectPosition: "center 55%",
  },
];

/** Beat centres on the 0 to 1 progress axis. Crossfade width matches the static build. */
export const BEAT_CENTRES = [0.06, 0.2, 0.34, 0.48, 0.6, 0.72, 0.85, 0.96];
export const XFADE = 0.035;

export const BANDS: Band[] = [
  {
    a: 0,
    b: 0.12,
    anim: "blur",
    scrim: 0.62,
    first: true,
    dwellMs: 6500,
    headline: "Light never waits for you.",
    sub: "So I wait for it.",
  },
  {
    a: 0.15,
    b: 0.285,
    anim: "drift",
    scrim: 0.7,
    dwellMs: 5000,
    headline: "Some of it arrives loud.",
  },
  {
    a: 0.31,
    b: 0.44,
    anim: "punch",
    scrim: 0.72,
    side: "left",
    dwellMs: 5000,
    headline: "Some of it arrives as weather.",
  },
  {
    a: 0.465,
    b: 0.585,
    anim: "depth",
    scrim: 0.93,
    side: "left",
    dwellMs: 5000,
    headline: "And some of it you have to walk into.",
  },
  {
    a: 0.665,
    b: 0.79,
    anim: "scatter",
    scrim: 0.66,
    spread: 0.55,
    dwellMs: 6500,
    headline: "Then it starts to leave.",
    sub: "The last hour is the honest one.",
  },
  {
    a: 0.88,
    b: 1,
    anim: "rise",
    scrim: 0.76,
    last: true,
    dwellMs: 7000,
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
