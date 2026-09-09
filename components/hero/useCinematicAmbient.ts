"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AMBIENT_MASTER_GAIN,
  AMBIENT_MUTE_KEY,
  BEAT_AMBIENT,
  BEAT_AMBIENT_GAIN,
} from "@/content/ambient";
import { beatCrossfadeMids, XFADE } from "@/content/beats";

function smoothstep(t: number, a: number, b: number) {
  if (b <= a) return t >= b ? 1 : 0;
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function beatGains(progress: number): number[] {
  const mids = beatCrossfadeMids();
  const n = BEAT_AMBIENT.length;
  const enter = Array.from({ length: n }, (_, i) =>
    i === 0 ? 1 : smoothstep(progress, mids[i] - XFADE, mids[i] + XFADE)
  );
  return enter.map((e, i) => {
    const next = i === n - 1 ? 0 : enter[i + 1];
    return e * (1 - next);
  });
}

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(AMBIENT_MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean) {
  try {
    window.localStorage.setItem(AMBIENT_MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

type Api = {
  muted: boolean;
  toggleMute: () => void;
  setProgress: (p: number) => void;
};

/**
 * Soft-crossfaded ambient beds locked to cinematic progress.
 * Starts when `active` becomes true (Start click unlocks audio).
 */
export function useCinematicAmbient(active: boolean): Api {
  const [muted, setMuted] = useState(false);
  const audiosRef = useRef<(HTMLAudioElement | null)[]>([]);
  const masterRef = useRef(AMBIENT_MASTER_GAIN);
  const mutedRef = useRef(false);
  const progressRef = useRef(0);
  const startedRef = useRef(false);
  const fadeMasterRef = useRef(0);

  useEffect(() => {
    const initial = readMuted();
    setMuted(initial);
    mutedRef.current = initial;
  }, []);

  useEffect(() => {
    const audios = BEAT_AMBIENT.map((src) => {
      const a = new Audio(src);
      a.preload = "auto";
      a.loop = true;
      a.volume = 0;
      return a;
    });
    audiosRef.current = audios;

    return () => {
      audios.forEach((a) => {
        a.pause();
        a.src = "";
      });
      audiosRef.current = [];
    };
  }, []);

  const applyVolumes = useCallback(() => {
    const gains = beatGains(progressRef.current);
    const master = masterRef.current * fadeMasterRef.current;
    const silent = mutedRef.current;
    audiosRef.current.forEach((a, i) => {
      if (!a) return;
      const g = gains[i] * BEAT_AMBIENT_GAIN[i] * master;
      a.volume = silent ? 0 : Math.min(1, Math.max(0, g));
    });
  }, []);

  const ensurePlaying = useCallback(async () => {
    const gains = beatGains(progressRef.current);
    await Promise.all(
      audiosRef.current.map(async (a, i) => {
        if (!a) return;
        if (gains[i] > 0.02) {
          if (a.paused) {
            try {
              a.currentTime = 0;
              await a.play();
            } catch {
              /* autoplay blocked — Start should have unlocked */
            }
          }
        }
      })
    );
  }, []);

  useEffect(() => {
    if (!active) {
      startedRef.current = false;
      // Soft master fade out then pause
      const start = performance.now();
      const from = fadeMasterRef.current;
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 450);
        fadeMasterRef.current = from * (1 - t);
        applyVolumes();
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          audiosRef.current.forEach((a) => {
            if (!a) return;
            a.pause();
            try {
              a.currentTime = 0;
            } catch {
              /* ignore */
            }
            a.volume = 0;
          });
          fadeMasterRef.current = 0;
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    // Activate: unlock + fade master in
    startedRef.current = true;
    progressRef.current = 0;
    fadeMasterRef.current = 0;
    void (async () => {
      await ensurePlaying();
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        if (!startedRef.current) return;
        const t = Math.min(1, (now - start) / 600);
        fadeMasterRef.current = t;
        applyVolumes();
        void ensurePlaying();
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();
  }, [active, applyVolumes, ensurePlaying]);

  const setProgress = useCallback(
    (p: number) => {
      progressRef.current = p;
      // Soften end: ramp master down in last ~4% of timeline
      if (p > 0.96) {
        const endFade = 1 - (p - 0.96) / 0.04;
        fadeMasterRef.current = Math.min(fadeMasterRef.current, Math.max(0, endFade));
      }
      applyVolumes();
      if (startedRef.current) void ensurePlaying();
    },
    [applyVolumes, ensurePlaying]
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      writeMuted(next);
      applyVolumes();
      return next;
    });
  }, [applyVolumes]);

  return { muted, toggleMute, setProgress };
}
