"use client";

import { useEffect } from "react";

/** Locks page scroll while the cinematic is playing. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const prev = document.body.style.overflow;
    document.body.classList.add("scroll-locked");
    document.body.style.overflow = "hidden";

    const block = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-allow-scroll]")) return;
      e.preventDefault();
    };

    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    return () => {
      document.body.classList.remove("scroll-locked");
      document.body.style.overflow = prev;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [locked]);
}
