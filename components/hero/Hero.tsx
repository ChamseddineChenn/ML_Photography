"use client";

import { HeroGate } from "./HeroGate";
import { HeroRested } from "./HeroRested";
import { HeroStage } from "./HeroStage";
import styles from "./hero.module.css";
import { useCinematic } from "./useCinematic";
import { useScrollLock } from "./useScrollLock";

export function Hero() {
  const cinematic = useCinematic();
  useScrollLock(cinematic.phase === "playing");

  const showGate = cinematic.phase === "gate" && !cinematic.reducedMotion;
  const showStage = cinematic.phase === "playing" || cinematic.stageFrozen;
  const showRested =
    cinematic.phase === "rested" ||
    (cinematic.phase === "gate" && cinematic.reducedMotion);

  return (
    <section
      className={styles.root}
      id="top"
      aria-label="The journey from high sun to last light"
      data-hero-phase={cinematic.phase}
      data-hero-progress="0"
    >
      <HeroGate
        ready={cinematic.ready}
        loadProgress={cinematic.loadProgress}
        onStart={cinematic.start}
        onSkip={cinematic.skip}
        hidden={!showGate}
      />
      <HeroStage
        visible={showStage}
        frozen={cinematic.stageFrozen}
        onDone={cinematic.complete}
        onSkip={cinematic.skip}
      />
      <HeroRested
        visible={showRested}
        fadingIn={cinematic.stageFrozen}
        onReplay={cinematic.start}
      />
    </section>
  );
}
