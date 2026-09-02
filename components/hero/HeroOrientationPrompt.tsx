"use client";

import { useEffect, useRef } from "react";
import { isLandscape } from "@/lib/viewportMode";
import styles from "./hero.module.css";

type Props = {
  visible: boolean;
  onLandscape: () => void;
  onBack: () => void;
};

export function HeroOrientationPrompt({ visible, onLandscape, onBack }: Props) {
  const firedRef = useRef(false);
  const onLandscapeRef = useRef(onLandscape);
  onLandscapeRef.current = onLandscape;

  useEffect(() => {
    if (!visible) {
      firedRef.current = false;
      return;
    }

    const check = () => {
      if (firedRef.current || !isLandscape()) return;
      firedRef.current = true;
      window.setTimeout(() => onLandscapeRef.current(), 350);
    };

    check();
    const debounced = () => window.setTimeout(check, 100);
    window.addEventListener("orientationchange", debounced);
    window.addEventListener("resize", debounced);
    const mq = window.matchMedia("(orientation: landscape)");
    mq.addEventListener("change", debounced);

    return () => {
      window.removeEventListener("orientationchange", debounced);
      window.removeEventListener("resize", debounced);
      mq.removeEventListener("change", debounced);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.orientPrompt} role="dialog" aria-modal="true" aria-label="Rotate your phone">
      <div className={styles.orientIn}>
        <div className={styles.orientIcon} aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <rect
              x="14"
              y="8"
              width="20"
              height="32"
              rx="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M32 16 C38 20 38 28 32 32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M30 14 L32 16 L34 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={styles.orientTitle}>Turn your phone sideways to begin</p>
        <p className={styles.orientSub}>The cinematic plays in landscape for the full frame.</p>
        <button type="button" className={styles.orientBack} onClick={onBack}>
          Go back
        </button>
      </div>
    </div>
  );
}

/** Slim banner if the user rotates to portrait mid-playback. */
export function HeroOrientationNudge({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className={styles.orientNudge} role="status">
      Keep your phone sideways for the experience
    </div>
  );
}
