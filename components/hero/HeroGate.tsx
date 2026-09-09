"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import styles from "./hero.module.css";

type Props = {
  ready: boolean;
  loadProgress: number;
  loadFailed?: boolean;
  onStart: () => void;
  onSkip: () => void;
  hidden: boolean;
};

export function HeroGate({
  ready,
  loadProgress,
  loadFailed = false,
  onStart,
  onSkip,
  hidden,
}: Props) {
  const offset = Math.round(126 * (1 - loadProgress));
  const loadingLabel = loadFailed
    ? "Still loading the frames…"
    : "Loading the frames";

  return (
    <div
      className={`${styles.gate} ${hidden ? styles.gateHidden : ""}`}
      {...(hidden ? { inert: true } : {})}
    >
      <div className={styles.gateIn}>
        <div className={styles.gateLogo}>
          <BrandLogo variant="dark" priority />
        </div>
        <p className={styles.gateSub}>
          Photographs of the last light. Start when you are ready, and the day
          will fall on its own.
        </p>
        <div className={styles.gateActions}>
          <button
            type="button"
            className={styles.startBtn}
            onClick={onStart}
            disabled={!ready}
            aria-busy={!ready}
          >
            <span className={styles.ring} aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="126"
                  style={{ strokeDashoffset: ready ? 0 : offset }}
                />
              </svg>
            </span>
            {ready ? "Start the experience" : loadingLabel}
          </button>
          <button type="button" className={styles.skipQuiet} onClick={onSkip}>
            Skip to the work
          </button>
        </div>
      </div>
    </div>
  );
}
