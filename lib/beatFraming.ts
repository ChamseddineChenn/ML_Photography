import type { Beat, KenBurns } from "@/content/beats";
import { BEATS } from "@/content/beats";
import type { ViewportMode } from "@/lib/viewportMode";

/** Scale Ken Burns down for smaller / narrower viewports. */
function softenKb(kb: KenBurns, factor = 0.55): KenBurns {
  const lerp1 = (a: number, b: number) => a + (b - a) * factor;
  const capScale = (s: number) => Math.min(s, 1.08);
  return {
    s0: capScale(lerp1(1, kb.s0)),
    s1: capScale(lerp1(1, kb.s1)),
    x0: kb.x0 * factor,
    x1: kb.x1 * factor,
    y0: kb.y0 * factor,
    y1: kb.y1 * factor,
  };
}

/** Alternating horizontal pan so portrait phones see across each frame. */
function portraitPanKb(beatIndex: number): KenBurns {
  const leftToRight = beatIndex % 2 === 0;
  return {
    s0: 1.14,
    s1: 1.14,
    x0: leftToRight ? -8 : 8,
    x1: leftToRight ? 8 : -8,
    y0: 0,
    y1: 0,
  };
}

export function getBeatObjectPosition(beat: Beat, mode: ViewportMode): string {
  if (mode === "mobilePortrait") {
    return beat.objectPositionPortrait ?? beat.objectPosition ?? "center";
  }
  if (mode === "mobileLandscape") {
    return beat.objectPositionLandscape ?? beat.objectPosition ?? "center";
  }
  return beat.objectPositionLandscape ?? beat.objectPosition ?? "center";
}

export function getBeatKenBurns(
  beat: Beat,
  mode: ViewportMode,
  beatIndex?: number
): KenBurns {
  if (mode === "desktop") return beat.kb;

  const index =
    beatIndex ?? BEATS.findIndex((b) => b.src === beat.src);

  // Portrait play (and mid-play landscape rotate): alternating L↔R pan.
  if (mode === "mobilePortrait" || mode === "mobileLandscape") {
    if (index >= 0) return portraitPanKb(index);
  }

  if (beat.kbMobile) return beat.kbMobile;
  return softenKb(beat.kb, mode === "mobileLandscape" ? 0.7 : 0.5);
}
