"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GalleryShot } from "@/content/gallery";
import { usePick } from "@/components/ui/PickContext";

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ShotWallProps = {
  shots: GalleryShot[];
  /** When true, show the turn-all-lights-on control and lantern behaviour. */
  lantern?: boolean;
  className?: string;
};

export function ShotWall({ shots, lantern = true, className = "" }: ShotWallProps) {
  const { setPick } = usePick();
  const [allOn, setAllOn] = useState(false);
  const [lanternEpoch, setLanternEpoch] = useState(0);

  const toggleLights = () => {
    setAllOn((v) => {
      if (v) setLanternEpoch((e) => e + 1);
      return !v;
    });
  };

  return (
    <div className={className}>
      {lantern ? (
        <p className="lights-row wrap wrap-wide">
          <button
            className="btn btn-text btn-sm"
            type="button"
            aria-pressed={allOn}
            onClick={toggleLights}
          >
            {allOn ? "Put the lights back down" : "Turn all the lights on"}
          </button>
        </p>
      ) : null}
      <div className={`grid${allOn || !lantern ? " allon" : ""}`} id="grid">
        {shots.map((shot) => (
          <Shot
            key={`${shot.slug}-${lanternEpoch}`}
            shot={shot}
            lantern={lantern}
            onPick={setPick}
          />
        ))}
      </div>
    </div>
  );
}

function Shot({
  shot,
  lantern,
  onPick,
}: {
  shot: GalleryShot;
  lantern: boolean;
  onPick: (t: string) => void;
}) {
  const figRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState(false);
  const [lit, setLit] = useState(false);
  const state = useRef({ px: 0, py: 0, want: 0, have: 0, raf: null as number | null });
  const capturing = useRef(false);
  const dragged = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.style.setProperty("--lit", `url("${shot.src}")`);
  }, [shot.src]);

  useEffect(() => {
    if (reducedMotion()) setFound(true);
  }, []);

  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const block = (e: TouchEvent) => {
      if (capturing.current) e.preventDefault();
    };
    el.addEventListener("touchmove", block, { passive: false });
    return () => el.removeEventListener("touchmove", block);
  }, []);

  const radius = (r: DOMRect) =>
    clamp(Math.min(r.width, r.height) * 0.34, 86, 190);

  const draw = () => {
    const media = mediaRef.current;
    if (!media) return;
    const s = state.current;
    s.have += (s.want - s.have) * 0.24;
    if (Math.abs(s.want - s.have) < 0.5) s.have = s.want;
    media.style.setProperty("--x", s.px.toFixed(1) + "px");
    media.style.setProperty("--y", s.py.toFixed(1) + "px");
    media.style.setProperty("--r", s.have.toFixed(1) + "px");
    if (s.have !== s.want) s.raf = requestAnimationFrame(draw);
    else {
      s.raf = null;
      if (s.want === 0) setLit(false);
    }
  };

  const kick = () => {
    if (state.current.raf === null) state.current.raf = requestAnimationFrame(draw);
  };

  const lanternOk = () => lantern && !reducedMotion();

  const aim = (e: React.PointerEvent) => {
    if (!lanternOk()) return;
    const media = mediaRef.current;
    if (!media) return;
    const r = media.getBoundingClientRect();
    state.current.px = e.clientX - r.left;
    state.current.py = e.clientY - r.top;
    if (state.current.py < -2 || state.current.py > r.height + 2) {
      state.current.want = 0;
      kick();
      return;
    }
    state.current.want = radius(r);
    if (!lit) setLit(true);
    if (!found) setFound(true);
    kick();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!lanternOk()) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType === "mouse") return;
    capturing.current = true;
    dragged.current = false;
    startPt.current = { x: e.clientX, y: e.clientY };
    figRef.current?.classList.add("lantern-hold");
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* older browsers */
    }
    aim(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!lanternOk()) return;
    if (e.pointerType === "mouse") {
      aim(e);
      return;
    }
    if (!capturing.current) return;
    const dx = e.clientX - startPt.current.x;
    const dy = e.clientY - startPt.current.y;
    if (dx * dx + dy * dy > 64) dragged.current = true;
    aim(e);
  };

  const endHold = (e: React.PointerEvent) => {
    if (capturing.current) {
      capturing.current = false;
      figRef.current?.classList.remove("lantern-hold");
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
      state.current.want = 0;
      kick();
    }
  };

  const onPointerLeave = () => {
    if (capturing.current) return;
    state.current.want = 0;
    kick();
  };

  return (
    <figure
      ref={figRef}
      className={`shot${lit ? " lit" : ""}${found ? " found" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endHold}
      onPointerCancel={endHold}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") aim(e);
      }}
      onPointerLeave={onPointerLeave}
    >
      <div className="shot-media" ref={mediaRef}>
        <Image
          className="shot-img"
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes="(max-width:720px) 100vw, (max-width:1080px) 50vw, 33vw"
        />
        <div className="shot-lit" aria-hidden="true" />
        <span className="shot-ring" aria-hidden="true" />
      </div>
      <figcaption>
        <span className="shot-title">{shot.title}</span>
        <span className="mono">{shot.sizes}</span>
      </figcaption>
      <Link
        className="shot-link"
        href={`/gallery/${shot.slug}`}
        onClick={(e) => {
          if (dragged.current) {
            e.preventDefault();
            dragged.current = false;
            return;
          }
          onPick(shot.title);
        }}
        onFocus={() => {
          if (!lanternOk()) return;
          const media = mediaRef.current;
          if (!media) return;
          const r = media.getBoundingClientRect();
          state.current.px = r.width / 2;
          state.current.py = r.height / 2;
          state.current.want = radius(r) * 1.35;
          if (!lit) setLit(true);
          if (!found) setFound(true);
          kick();
        }}
        onBlur={() => {
          state.current.want = 0;
          kick();
        }}
      >
        <span className="sr-only">Open {shot.title}</span>
      </Link>
    </figure>
  );
}
