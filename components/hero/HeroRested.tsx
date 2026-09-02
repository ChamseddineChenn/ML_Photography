"use client";

import { BEATS, RESTED_BEAT_INDEX, SETTLE_COPY } from "@/content/beats";
import { getBeatObjectPosition } from "@/lib/beatFraming";
import { HERO_PORTRAIT_SRC, isCoarseMobile, type ViewportMode } from "@/lib/viewportMode";
import styles from "./hero.module.css";

type Props = {
  visible: boolean;
  fadingIn?: boolean;
  viewportMode: ViewportMode;
  onReplay: () => void;
};

export function HeroRested({ visible, fadingIn = false, viewportMode, onReplay }: Props) {
  if (!visible) return null;
  const beat = BEATS[RESTED_BEAT_INDEX];
  const usePortrait = isCoarseMobile();
  const posterSrc = usePortrait ? HERO_PORTRAIT_SRC : beat.src;
  const posterPosition = usePortrait
    ? "center 55%"
    : getBeatObjectPosition(beat, viewportMode);

  return (
    <div
      className={`${styles.rested}${fadingIn ? ` ${styles.restedFadeIn}` : ""}`}
    >
      <div className={styles.restedPoster} aria-hidden="true" style={{ backgroundColor: beat.tint }}>
        <img
          className={styles.restedPosterImg}
          src={posterSrc}
          alt=""
          decoding="async"
          draggable={false}
          style={{ objectPosition: posterPosition }}
        />
      </div>
      <div className={styles.restedScrim} aria-hidden="true" />
      <div className={styles.restedTextVeil} aria-hidden="true" />
      <div className={styles.restedIn}>
        <p className={`kicker mono ${styles.restedKicker}`}>{SETTLE_COPY.kicker}</p>
        <h1 className="h-name">{SETTLE_COPY.name}</h1>
        <p className="sub">{SETTLE_COPY.sub}</p>
        <p className={`cta ${styles.cta}`}>
          <a className="btn btn-accent" href="/prints">
            See the prints
          </a>
          <a className="btn btn-text" href="/gallery">
            The full gallery
          </a>
        </p>
        <p className={styles.restedReplay}>
          <button type="button" className="btn btn-text btn-sm" onClick={onReplay}>
            Start the experience
          </button>
        </p>
      </div>
    </div>
  );
}
