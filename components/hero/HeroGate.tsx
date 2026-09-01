"use client";

import styles from "./hero.module.css";

type Props = {
  ready: boolean;
  loadProgress: number;
  onStart: () => void;
  onSkip: () => void;
  hidden: boolean;
};

export function HeroGate({ ready, loadProgress, onStart, onSkip, hidden }: Props) {
  const offset = Math.round(126 * (1 - loadProgress));

  return (
    <div
      className={`${styles.gate} ${hidden ? styles.gateHidden : ""}`}
      aria-hidden={hidden}
    >
      <div className={styles.gateIn}>
        <div className={styles.gateMark} aria-hidden="true">
          <svg viewBox="0 0 48 32">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 26 L8 8 L14 19 L20 8 L23 26" />
              <path d="M28 8 L28 26 L44 26" />
            </g>
          </svg>
        </div>
        <p className={`mono ${styles.gateKicker}`}>ML Photography</p>
        <h1 className={styles.gateName}>Malek Larif</h1>
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
            {ready ? "Start the experience" : "Loading the frames"}
          </button>
          <button type="button" className={styles.skipQuiet} onClick={onSkip}>
            Skip to the work
          </button>
        </div>
      </div>
    </div>
  );
}
