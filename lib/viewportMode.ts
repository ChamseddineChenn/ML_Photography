"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ViewportMode = "desktop" | "mobileLandscape" | "mobilePortrait";

const MOBILE_MAX = 1024;

export const HERO_PORTRAIT_SRC = "/assets/hero/hero-static-portrait.jpg";

export function isCoarseMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches &&
    Math.min(window.innerWidth, window.innerHeight) <= MOBILE_MAX
  );
}

export function isLandscape(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: landscape)").matches;
}

export function getViewportMode(): ViewportMode {
  if (typeof window === "undefined") return "desktop";
  if (!isCoarseMobile()) return "desktop";
  return isLandscape() ? "mobileLandscape" : "mobilePortrait";
}

/** Debounced viewport mode — stable across orientation changes without remounting hero. */
export function useViewportMode(onChange?: (mode: ViewportMode) => void) {
  const [mode, setMode] = useState<ViewportMode>("desktop");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const read = useCallback(() => {
    const next = getViewportMode();
    setMode((prev) => {
      if (prev !== next) onChangeRef.current?.(next);
      return next;
    });
  }, []);

  useEffect(() => {
    read();
    let t: ReturnType<typeof setTimeout> | null = null;
    const debounced = () => {
      if (t) clearTimeout(t);
      t = setTimeout(read, 150);
    };

    window.addEventListener("resize", debounced);
    window.addEventListener("orientationchange", debounced);
    const mqs = [
      window.matchMedia("(orientation: landscape)"),
      window.matchMedia("(orientation: portrait)"),
      window.matchMedia("(pointer: coarse)"),
    ];
    mqs.forEach((mq) => mq.addEventListener("change", debounced));

    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("resize", debounced);
      window.removeEventListener("orientationchange", debounced);
      mqs.forEach((mq) => mq.removeEventListener("change", debounced));
    };
  }, [read]);

  return mode;
}
