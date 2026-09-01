"use client";

import { useEffect, useRef } from "react";

const CHAPTERS: [string, string][] = [
  ["#afterdark", "AFTER DARK"],
  ["#gallery", "THE WORK"],
  ["#close-work", "CLOSE WORK"],
  ["#prints", "PRINTS"],
  ["#how", "HOW IT WORKS"],
  ["#journal", "JOURNAL"],
  ["#about", "ABOUT"],
  ["#faq", "QUESTIONS"],
  ["#contact", "WRITE TO ME"],
];

const GOLD = [228, 156, 64];
const EMBER = [221, 125, 59];
const DEEP = [168, 72, 31];

function mix(a: number[], b: number[], t: number) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
}

function sunColor(t: number) {
  const rgb =
    t < 0.5 ? mix(GOLD, EMBER, t * 2) : mix(EMBER, DEEP, (t - 0.5) * 2);
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

function heroChapterLabel(p: number) {
  return p < 0.32 ? "HIGH SUN" : p < 0.64 ? "AFTERNOON" : "LAST LIGHT";
}

/** Scroll progress + chapter label, written to the DOM — no React setState on scroll. */
export function Spine() {
  const rootRef = useRef<HTMLElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number | null = null;
    let lastLabel = "";
    let lastCol = "";
    let lastSy = -1;

    const update = () => {
      const hero = document.querySelector("[data-hero-phase]");
      const phase = hero?.getAttribute("data-hero-phase") ?? "";
      const heroP = parseFloat(hero?.getAttribute("data-hero-progress") ?? "0");

      let sunT: number;
      if (phase === "playing") {
        sunT = heroP;
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        sunT = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      }

      const syR = Math.round(sunT * 500) / 500;
      if (syR !== lastSy) {
        lastSy = syR;
        rootRef.current?.style.setProperty("--sy", String(syR));
      }

      const col = sunColor(syR);
      if (col !== lastCol && sunRef.current) {
        lastCol = col;
        sunRef.current.style.background = col;
      }

      const mid = window.scrollY + window.innerHeight * 0.45;
      let found: string | null = null;
      for (const [sel, name] of CHAPTERS) {
        const el = document.querySelector(sel);
        if (el && (el as HTMLElement).offsetTop <= mid) found = name;
      }

      let next = found;
      if (!next) {
        if (phase === "gate") next = "HIGH SUN";
        else if (phase === "playing") next = heroChapterLabel(heroP);
        else next = "LAST LIGHT";
      }

      if (next && next !== lastLabel && labelRef.current) {
        lastLabel = next;
        labelRef.current.textContent = next;
      }
    };

    const tick = () => {
      update();
      const phase = document
        .querySelector("[data-hero-phase]")
        ?.getAttribute("data-hero-phase");
      if (phase === "playing") {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => schedule();

    const hero = document.querySelector("[data-hero-phase]");
    const mo = hero
      ? new MutationObserver(() => {
          const phase = hero.getAttribute("data-hero-phase");
          if (phase === "playing") schedule();
          else {
            update();
            if (raf !== null) {
              cancelAnimationFrame(raf);
              raf = null;
            }
          }
        })
      : null;
    if (hero) {
      mo?.observe(hero, {
        attributes: true,
        attributeFilter: ["data-hero-phase"],
      });
    }

    update();
    const phase = hero?.getAttribute("data-hero-phase");
    if (phase === "playing") schedule();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mo?.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <aside className="spine" aria-hidden="true" ref={rootRef} style={{ ["--sy" as string]: 0 }}>
      <div className="spine-line" />
      <div className="spine-sun" ref={sunRef} style={{ background: "rgb(228,156,64)" }}>
        <span className="spine-glow" />
      </div>
      <div className="spine-label mono chip" ref={labelRef}>
        HIGH SUN
      </div>
    </aside>
  );
}
