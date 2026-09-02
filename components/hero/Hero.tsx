"use client";

import { useEffect, useRef } from "react";
import { HeroGate } from "./HeroGate";
import { HeroLayers } from "./HeroLayers";
import {
  HeroOrientationNudge,
  HeroOrientationPrompt,
} from "./HeroOrientationPrompt";
import { HeroRested } from "./HeroRested";
import { HeroStage } from "./HeroStage";
import styles from "./hero.module.css";
import { useCinematic } from "./useCinematic";
import { useScrollLock } from "./useScrollLock";
import { useViewportMode } from "@/lib/viewportMode";

export function Hero() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gateRef = useRef<HTMLDivElement | null>(null);
  const cinematic = useCinematic(layerRefs);
  const viewportMode = useViewportMode();
  const prevPhaseRef = useRef(cinematic.phase);

  const lockScroll =
    cinematic.phase === "playing" || cinematic.phase === "awaitingLandscape";
  useScrollLock(lockScroll);

  const showGate =
    (cinematic.phase === "gate" || cinematic.phase === "awaitingLandscape") &&
    !cinematic.reducedMotion;
  const showStage = cinematic.phase === "playing" || cinematic.stageFrozen;
  const showRested =
    cinematic.phase === "rested" ||
    (cinematic.phase === "gate" && cinematic.reducedMotion);
  const showOrientPrompt = cinematic.phase === "awaitingLandscape";
  const showOrientNudge =
    cinematic.phase === "playing" && viewportMode === "mobilePortrait";

  useEffect(() => {
    const prev = prevPhaseRef.current;
    const next = cinematic.phase;
    prevPhaseRef.current = next;

    const leftGate =
      (prev === "gate" || prev === "awaitingLandscape") &&
      next !== "gate" &&
      next !== "awaitingLandscape";

    if (!leftGate) return;

    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      gateRef.current?.contains(active)
    ) {
      active.blur();
    }
  }, [cinematic.phase]);

  return (
    <section
      className={styles.root}
      id="top"
      aria-label="The journey from high sun to last light"
      data-hero-phase={cinematic.phase}
      data-hero-progress="0"
    >
      <HeroLayers layerRefs={layerRefs} viewportMode={viewportMode} />

      <div ref={gateRef}>
        <HeroGate
          ready={cinematic.ready}
          loadProgress={cinematic.loadProgress}
          loadFailed={cinematic.loadFailed}
          onStart={cinematic.start}
          onSkip={cinematic.skip}
          hidden={!showGate}
        />
      </div>

      <HeroOrientationPrompt
        visible={showOrientPrompt}
        onLandscape={cinematic.enterPlaying}
        onBack={cinematic.cancelLandscape}
      />
      <HeroStage
        visible={showStage}
        frozen={cinematic.stageFrozen}
        viewportMode={viewportMode}
        layerRefs={layerRefs}
        onDone={cinematic.complete}
        onSkip={cinematic.skip}
      />
      <HeroOrientationNudge visible={showOrientNudge} />
      <HeroRested
        visible={showRested}
        fadingIn={cinematic.stageFrozen}
        viewportMode={viewportMode}
        onReplay={cinematic.start}
      />
    </section>
  );
}
