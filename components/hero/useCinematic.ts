"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BEATS } from "@/content/beats";
import { HOME_RESTART_EVENT } from "@/lib/goHomeStart";
import { beatImgFromLayer, decodeBeatImg, isBeatImgReady } from "@/lib/heroLoad";

export type HeroPhase = "gate" | "playing" | "rested";

export type CinematicApi = {
  phase: HeroPhase;
  stageFrozen: boolean;
  loadProgress: number;
  ready: boolean;
  loadFailed: boolean;
  start: () => void;
  skip: () => void;
  complete: () => void;
};

const STAGE_UNFREEZE_MS = 450;
const RETURN_HOLD_MS = 200;
const RETRY_MS = 4000;

/**
 * Phase machine. Beat load progress tracks DOM imgs in HeroLayers (strict decode).
 */
export function useCinematic(
  layerRefs: RefObject<(HTMLDivElement | null)[]>
): CinematicApi {
  const [phase, setPhase] = useState<HeroPhase>("gate");
  const [stageFrozen, setStageFrozen] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const unfreezeRef = useRef<number | null>(null);
  const returnRef = useRef<number | null>(null);
  const decodedRef = useRef<boolean[]>(BEATS.map(() => false));

  useEffect(() => {
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    const updateProgress = () => {
      if (cancelled) return;
      const decoded = decodedRef.current.filter(Boolean).length;
      setLoadProgress(decoded / BEATS.length);
      setReady(decoded >= BEATS.length);
      setLoadFailed(false);
    };

    const markDecoded = async (index: number, img: HTMLImageElement) => {
      if (cancelled || decodedRef.current[index]) return;
      if (!isBeatImgReady(img)) return;
      await decodeBeatImg(img);
      if (cancelled) return;
      decodedRef.current[index] = true;
      updateProgress();
    };

    const onError = (index: number, img: HTMLImageElement) => {
      if (cancelled) return;
      if (!decodedRef.current.every(Boolean)) setLoadFailed(true);
      const retry = () => {
        if (cancelled || decodedRef.current[index]) return;
        const sep = img.src.includes("?") ? "&" : "?";
        img.src = `${BEATS[index].src}${sep}retry=${Date.now()}`;
      };
      window.setTimeout(retry, RETRY_MS);
    };

    const wire = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;

      for (let i = 0; i < BEATS.length; i++) {
        const img = beatImgFromLayer(layerRefs.current?.[i] ?? null);
        if (!img) continue;

        if (decodedRef.current[i] || isBeatImgReady(img)) {
          void markDecoded(i, img);
        }

        const onLoad = () => void markDecoded(i, img);
        const onErr = () => onError(i, img);
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onErr);
        cleanups.push(() => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onErr);
        });
      }

      updateProgress();
    };

    wire();
    const poll = window.setInterval(() => {
      if (cancelled || ready) return;
      const haveAll = BEATS.every((_, i) => beatImgFromLayer(layerRefs.current?.[i] ?? null));
      if (haveAll) wire();
      else updateProgress();
    }, 200);

    return () => {
      cancelled = true;
      clearInterval(poll);
      cleanups.forEach((fn) => fn());
    };
  }, [layerRefs, ready]);

  const clearUnfreeze = useCallback(() => {
    if (unfreezeRef.current !== null) {
      window.clearTimeout(unfreezeRef.current);
      unfreezeRef.current = null;
    }
  }, []);

  const clearReturn = useCallback(() => {
    if (returnRef.current !== null) {
      window.clearTimeout(returnRef.current);
      returnRef.current = null;
    }
  }, []);

  const goRested = useCallback(() => {
    clearUnfreeze();
    clearReturn();
    setStageFrozen(false);
    setPhase("rested");
  }, [clearReturn, clearUnfreeze]);

  const skip = useCallback(() => {
    goRested();
  }, [goRested]);

  const complete = useCallback(() => {
    clearUnfreeze();
    clearReturn();
    setPhase("rested");
    setStageFrozen(true);
    returnRef.current = window.setTimeout(() => {
      setStageFrozen(false);
      returnRef.current = null;
    }, STAGE_UNFREEZE_MS + RETURN_HOLD_MS);
  }, [clearReturn, clearUnfreeze]);

  const start = useCallback(() => {
    if (!ready) return;
    clearUnfreeze();
    setStageFrozen(false);
    setPhase("playing");
  }, [clearUnfreeze, ready]);

  useEffect(() => {
    const onRestart = () => {
      clearUnfreeze();
      clearReturn();
      setStageFrozen(false);
      setPhase("gate");
    };
    window.addEventListener(HOME_RESTART_EVENT, onRestart);
    return () => window.removeEventListener(HOME_RESTART_EVENT, onRestart);
  }, [clearReturn, clearUnfreeze]);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  useEffect(
    () => () => {
      clearUnfreeze();
      clearReturn();
    },
    [clearReturn, clearUnfreeze]
  );

  return {
    phase,
    stageFrozen,
    loadProgress,
    ready,
    loadFailed,
    start,
    skip,
    complete,
  };
}
