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

type BeatNode = {
  gain: GainNode;
  source: MediaElementAudioSourceNode;
};

type Graph = {
  ctx: AudioContext;
  master: GainNode;
  beats: (BeatNode | null)[];
};

type Api = {
  muted: boolean;
  toggleMute: () => void;
  setProgress: (p: number) => void;
  unlock: () => void;
};

function AudioCtx(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
    null;
}

/**
 * Soft-crossfaded ambient beds locked to cinematic progress.
 * Gains go through Web Audio — HTMLAudio.volume is a no-op on iOS.
 */
export function useCinematicAmbient(active: boolean): Api {
  const [muted, setMuted] = useState(false);
  const audiosRef = useRef<(HTMLAudioElement | null)[]>([]);
  const graphRef = useRef<Graph | null>(null);
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
      a.crossOrigin = "anonymous";
      try {
        a.volume = 0;
      } catch {
        /* iOS volume is read-only */
      }
      return a;
    });
    audiosRef.current = audios;

    return () => {
      audios.forEach((a) => {
        a.pause();
        a.src = "";
      });
      audiosRef.current = [];
      const graph = graphRef.current;
      graphRef.current = null;
      if (graph) {
        try {
          graph.master.disconnect();
          graph.beats.forEach((b) => {
            try {
              b?.gain.disconnect();
              b?.source.disconnect();
            } catch {
              /* already closed */
            }
          });
          void graph.ctx.close();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  const ensureGraph = useCallback((): Graph | null => {
    if (graphRef.current) {
      if (graphRef.current.ctx.state === "suspended") {
        void graphRef.current.ctx.resume();
      }
      return graphRef.current;
    }
    const Ctor = AudioCtx();
    if (!Ctor || audiosRef.current.length === 0) return null;
    try {
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      const beats = audiosRef.current.map((a) => {
        if (!a) return null;
        try {
          const source = ctx.createMediaElementSource(a);
          const gain = ctx.createGain();
          gain.gain.value = 0;
          source.connect(gain);
          gain.connect(master);
          return { gain, source };
        } catch {
          return null;
        }
      });
      const graph = { ctx, master, beats };
      graphRef.current = graph;
      void ctx.resume();
      return graph;
    } catch {
      return null;
    }
  }, []);

  const applyVolumes = useCallback(() => {
    const gains = beatGains(progressRef.current);
    const masterAmt =
      masterRef.current * fadeMasterRef.current * (mutedRef.current ? 0 : 1);
    const graph = graphRef.current;
    if (graph) {
      graph.master.gain.value = masterAmt;
      graph.beats.forEach((b, i) => {
        if (!b) return;
        b.gain.gain.value = Math.min(1, Math.max(0, gains[i] * BEAT_AMBIENT_GAIN[i]));
      });
    }
    audiosRef.current.forEach((a, i) => {
      if (!a) return;
      a.muted = mutedRef.current;
      if (graph) return;
      try {
        const g = gains[i] * BEAT_AMBIENT_GAIN[i] * masterAmt;
        a.volume = Math.min(1, Math.max(0, g));
      } catch {
        /* iOS */
      }
    });
  }, []);

  const syncPlayback = useCallback(async () => {
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
              /* autoplay blocked — unlock() should have opened the context */
            }
          }
        } else if (!a.paused) {
          a.pause();
          try {
            a.currentTime = 0;
          } catch {
            /* ignore */
          }
        }
      })
    );
  }, []);

  const unlock = useCallback(() => {
    const graph = ensureGraph();
    if (graph?.ctx.state === "suspended") void graph.ctx.resume();
    applyVolumes();
    void syncPlayback();
  }, [applyVolumes, ensureGraph, syncPlayback]);

  useEffect(() => {
    if (!active) {
      startedRef.current = false;
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
          });
          fadeMasterRef.current = 0;
          applyVolumes();
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    startedRef.current = true;
    progressRef.current = 0;
    fadeMasterRef.current = 0;
    ensureGraph();
    void (async () => {
      applyVolumes();
      await syncPlayback();
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        if (!startedRef.current) return;
        const t = Math.min(1, (now - start) / 600);
        fadeMasterRef.current = t;
        applyVolumes();
        void syncPlayback();
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();
  }, [active, applyVolumes, ensureGraph, syncPlayback]);

  const setProgress = useCallback(
    (p: number) => {
      progressRef.current = p;
      if (p > 0.96) {
        const endFade = 1 - (p - 0.96) / 0.04;
        fadeMasterRef.current = Math.min(fadeMasterRef.current, Math.max(0, endFade));
      }
      applyVolumes();
      if (startedRef.current) void syncPlayback();
    },
    [applyVolumes, syncPlayback]
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

  return { muted, toggleMute, setProgress, unlock };
}
