"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BEATS } from "@/content/beats";

export type HeroPhase = "gate" | "playing" | "rested";

export type CinematicApi = {
  phase: HeroPhase;
  stageFrozen: boolean;
  loadProgress: number;
  ready: boolean;
  reducedMotion: boolean;
  start: () => void;
  skip: () => void;
  complete: () => void;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const STAGE_UNFREEZE_MS = 450;

/**
 * Phase machine only. Playback timing lives in HeroStage and writes the DOM
 * directly — setState every frame was thrashing the whole tree.
 */
export function useCinematic(): CinematicApi {
  const [phase, setPhase] = useState<HeroPhase>("gate");
  const [stageFrozen, setStageFrozen] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const unfreezeRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const on = mq.matches;
      setReducedMotion(on);
      if (on) {
        setStageFrozen(false);
        setPhase((p) => (p === "playing" || p === "gate" ? "rested" : p));
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const total = BEATS.length;

    BEATS.forEach((beat) => {
      const img = new Image();
      const step = () => {
        if (cancelled) return;
        done += 1;
        setLoadProgress(done / total);
        if (done >= total) setReady(true);
      };
      img.onload = step;
      img.onerror = step;
      img.src = beat.src;
    });

    const watchdog = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 20000);

    return () => {
      cancelled = true;
      clearTimeout(watchdog);
    };
  }, []);

  const clearUnfreeze = useCallback(() => {
    if (unfreezeRef.current !== null) {
      window.clearTimeout(unfreezeRef.current);
      unfreezeRef.current = null;
    }
  }, []);

  const skip = useCallback(() => {
    clearUnfreeze();
    setStageFrozen(false);
    setPhase("rested");
  }, [clearUnfreeze]);

  const complete = useCallback(() => {
    clearUnfreeze();
    setPhase("rested");
    setStageFrozen(true);
    unfreezeRef.current = window.setTimeout(() => {
      setStageFrozen(false);
      unfreezeRef.current = null;
    }, STAGE_UNFREEZE_MS);
  }, [clearUnfreeze]);

  const start = useCallback(() => {
    if (prefersReducedMotion()) {
      setStageFrozen(false);
      setPhase("rested");
      return;
    }
    clearUnfreeze();
    setStageFrozen(false);
    setPhase("playing");
  }, [clearUnfreeze]);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  useEffect(() => () => clearUnfreeze(), [clearUnfreeze]);

  return {
    phase,
    stageFrozen,
    loadProgress,
    ready,
    reducedMotion,
    start,
    skip,
    complete,
  };
}
