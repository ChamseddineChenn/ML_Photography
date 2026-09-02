"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  BANDS,
  BEATS,
  beatCrossfadeMids,
  CINEMATIC_DURATION_MS,
  XFADE,
} from "@/content/beats";
import { getBeatKenBurns, getBeatObjectPosition } from "@/lib/beatFraming";
import { beatImgFromLayer, isBeatImgReady, waitForBeatZero } from "@/lib/heroLoad";
import type { ViewportMode } from "@/lib/viewportMode";
import styles from "./hero.module.css";
import { clamp, smoothstep, splitHeadline, type SplitResult } from "./splitText";

type Props = {
  visible: boolean;
  frozen?: boolean;
  viewportMode: ViewportMode;
  layerRefs: RefObject<(HTMLDivElement | null)[]>;
  onDone: () => void;
  onSkip: () => void;
};

function writeHeroProgress(progress: number) {
  const root = document.querySelector("[data-hero-phase]");
  if (root) root.setAttribute("data-hero-progress", progress.toFixed(3));
}

function VisWords({ split, className }: { split: SplitResult; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {split.words.map((w, wi) => (
        <span key={wi}>
          <span
            className={`${styles.w}${w.em ? ` ${styles.em}` : ""}`}
            style={{ ["--th" as string]: w.th }}
          >
            {w.chars.map((c, ci) => (
              <span
                key={ci}
                className={styles.c}
                style={{
                  ["--th" as string]: c.th,
                  ["--jx" as string]: c.jx,
                  ["--jy" as string]: c.jy,
                  ["--jr" as string]: c.jr,
                }}
              >
                {c.ch}
              </span>
            ))}
          </span>
          {wi < split.words.length - 1 ? (
            <span className={styles.sp} aria-hidden="true" />
          ) : null}
        </span>
      ))}
    </span>
  );
}

function WordSpans({
  text,
  seed,
  blur,
  emphasis,
  spread,
  asName,
}: {
  text: string;
  seed: number;
  blur?: boolean;
  emphasis?: number[];
  spread?: number;
  asName?: boolean;
}) {
  const split = useMemo(
    () => splitHeadline(text, seed, { blur, emphasis, spread, charOrdered: false }),
    [text, seed, blur, emphasis, spread]
  );

  const cls = asName ? `h-name ${styles.hName}` : "h-hero";

  if (blur) {
    return (
      <p className={cls}>
        <span className="sr-only">{text}</span>
        <span className={styles.stack}>
          <VisWords split={split} className={styles.soft} />
          <VisWords split={split} className={styles.sharp} />
        </span>
      </p>
    );
  }

  return (
    <p className={cls}>
      <span className="sr-only">{text}</span>
      <VisWords split={split} />
    </p>
  );
}

function imgReadyAt(
  layerRefs: RefObject<(HTMLDivElement | null)[]>,
  index: number
): boolean {
  return isBeatImgReady(beatImgFromLayer(layerRefs.current?.[index] ?? null));
}

function layerState(
  progress: number,
  viewportMode: ViewportMode,
  layerRefs: RefObject<(HTMLDivElement | null)[]>
) {
  const mids = beatCrossfadeMids();
  let ops = BEATS.map((_, i) =>
    i === 0 ? 1 : smoothstep(progress, mids[i] - XFADE, mids[i] + XFADE)
  );

  for (let i = 0; i < ops.length; i++) {
    if (!imgReadyAt(layerRefs, i) && ops[i] > 0.001) {
      if (i > 0) ops[i - 1] = Math.max(ops[i - 1], ops[i]);
      ops[i] = 0;
    }
  }

  return BEATS.map((beat, i) => {
    const op = ops[i];
    const hidden = op === 0 || (i < BEATS.length - 1 && ops[i + 1] >= 1);
    const lo = i === 0 ? 0 : mids[i] - XFADE;
    const hi = i === BEATS.length - 1 ? 1 : mids[i + 1] + XFADE;
    const t = clamp((progress - lo) / (hi - lo), 0, 1);
    const k = getBeatKenBurns(beat, viewportMode);
    const s = k.s0 + (k.s1 - k.s0) * t;
    const x = k.x0 + (k.x1 - k.x0) * t;
    const y = k.y0 + (k.y1 - k.y0) * t;
    return {
      op,
      hidden,
      objectPosition: getBeatObjectPosition(beat, viewportMode),
      transform: `translateZ(0) translate(${x.toFixed(2)}%,${y.toFixed(2)}%) scale(${s.toFixed(3)})`,
    };
  });
}

function bandState(progress: number) {
  return BANDS.map((b) => {
    const f = Math.min(0.014, (b.b - b.a) / 3);
    let op: number;
    if (b.first) op = 1 - smoothstep(progress, b.b - f, b.b);
    else if (b.last) op = smoothstep(progress, b.a, b.a + f);
    else
      op =
        smoothstep(progress, b.a, b.a + f) *
        (1 - smoothstep(progress, b.b - f, b.b));

    const ramp = Math.min(0.02, (b.b - b.a) * 0.35);
    const k = clamp((progress - b.a) / ramp, 0, 1);
    return { op, k };
  });
}

export function HeroStage({
  visible,
  frozen = false,
  viewportMode,
  layerRefs,
  onDone,
  onSkip,
}: Props) {
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const onDoneRef = useRef(onDone);
  const viewportRef = useRef(viewportMode);
  const startTimeRef = useRef<number | null>(null);
  const progressCacheRef = useRef(0);
  const [preparing, setPreparing] = useState(false);
  onDoneRef.current = onDone;
  viewportRef.current = viewportMode;

  const paint = (progress: number) => {
    progressCacheRef.current = progress;
    const mode = viewportRef.current;
    const layers = layerState(progress, mode, layerRefs);
    const bands = bandState(progress);
    layers.forEach((L, i) => {
      const el = layerRefs.current?.[i];
      if (!el) return;
      el.style.opacity = String(L.op);
      el.classList.toggle(styles.layerOff, L.hidden);
      const img = el.querySelector("img");
      if (img instanceof HTMLImageElement) {
        img.style.transform = L.transform;
        img.style.objectPosition = L.objectPosition;
      }
    });
    bands.forEach((B, i) => {
      const el = bandRefs.current[i];
      if (!el) return;
      el.style.opacity = String(B.op);
      el.style.setProperty("--k", B.k.toFixed(3));
    });
    if (progressRef.current) {
      progressRef.current.style.setProperty("--p", String(progress));
    }
    writeHeroProgress(progress);
  };

  useEffect(() => {
    paint(progressCacheRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportMode]);

  useEffect(() => {
    if (!visible || frozen) return;

    let cancelled = false;
    let raf = 0;

    const run = async () => {
      setPreparing(true);
      await waitForBeatZero((i) => layerRefs.current?.[i] ?? null, 3000);
      if (cancelled) return;
      setPreparing(false);
      skipRef.current?.focus({ preventScroll: true });
      startTimeRef.current = performance.now();
      paint(0);

      const tick = (now: number) => {
        if (cancelled) return;
        const start = startTimeRef.current ?? now;
        const p = Math.min(1, (now - start) / CINEMATIC_DURATION_MS);
        paint(p);
        if (p >= 1) {
          paint(1);
          onDoneRef.current();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    void run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      setPreparing(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, frozen]);

  useEffect(() => {
    if (visible && frozen) paint(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, frozen]);

  if (!visible) return null;

  return (
    <div className={`${styles.stage}${frozen ? ` ${styles.stageFrozen}` : ""}`}>
      {preparing ? (
        <div className={styles.preparing} role="status">
          Preparing frames…
        </div>
      ) : null}

      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.bands}>
        {BANDS.map((b, i) => {
          const isSettle = !!b.last;
          const align = b.side === "left"
            ? styles.bandLeft
            : isSettle
              ? styles.bandBottom
              : styles.bandTop;
          return (
            <div
              key={i}
              ref={(el) => {
                bandRefs.current[i] = el;
              }}
              className={`${styles.band}${isSettle ? ` ${styles.bandSettle}` : ""}`}
              data-anim={b.anim}
              data-side={b.side}
              style={{
                opacity: b.first ? 1 : 0,
                ["--k" as string]: b.first ? "1" : "0",
                ["--sa" as string]: String(b.scrim),
              }}
            >
              <div className={`${styles.bandIn} ${align}`}>
                {b.kicker ? <p className="kicker mono">{b.kicker}</p> : null}
                <WordSpans
                  text={b.headline}
                  seed={1337 + i * 977}
                  blur={b.anim === "blur"}
                  emphasis={b.anim === "punch" ? [5] : undefined}
                  spread={b.spread ?? (b.anim === "rise" ? 0.5 : 0.45)}
                  asName={isSettle}
                />
                {b.sub ? <p className={styles.sub}>{b.sub}</p> : null}
                {isSettle ? (
                  <p className={`${styles.cta}`}>
                    <a className="btn btn-accent" href="/prints">
                      See the prints
                    </a>
                    <a className="btn btn-text" href="/gallery">
                      The full gallery
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.playSkip}
        ref={skipRef}
        onClick={onSkip}
      >
        Skip
      </button>

      <div className={styles.progress} aria-hidden="true" ref={progressRef} style={{ ["--p" as string]: 0 }}>
        <div className={styles.progressFill} />
      </div>
    </div>
  );
}
