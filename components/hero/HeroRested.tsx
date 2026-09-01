"use client";

import { BEATS, RESTED_BEAT_INDEX, SETTLE_COPY } from "@/content/beats";
import styles from "./hero.module.css";

type Props = {
  visible: boolean;
  fadingIn?: boolean;
  onReplay: () => void;
};

export function HeroRested({ visible, fadingIn = false, onReplay }: Props) {
  if (!visible) return null;
  const beat = BEATS[RESTED_BEAT_INDEX];

  return (
    <div
      className={`${styles.rested}${fadingIn ? ` ${styles.restedFadeIn}` : ""}`}
    >
      <div
        className={styles.restedPoster}
        aria-hidden="true"
        style={{
          backgroundImage: `url("${beat.src}")`,
          backgroundPosition: beat.objectPosition ?? "center",
          backgroundColor: beat.tint,
        }}
      />
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
