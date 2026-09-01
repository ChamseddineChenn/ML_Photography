"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GalleryShot } from "@/content/gallery";
import { usePick } from "@/components/ui/PickContext";

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
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
  const [fineHover, setFineHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover:hover) and (pointer:fine)");
    const apply = () => {
      const fine = mq.matches;
      setFineHover(fine);
      if (!fine) setAllOn(true);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className={className}>
      {lantern && fineHover ? (
        <p className="lights-row wrap wrap-wide">
          <button
            className="btn btn-text btn-sm"
            type="button"
            aria-pressed={allOn}
            onClick={() => setAllOn((v) => !v)}
          >
            {allOn ? "Put the lights back down" : "Turn all the lights on"}
          </button>
        </p>
      ) : null}
      <div className={`grid${allOn || !lantern ? " allon" : ""}`} id="grid">
        {shots.map((shot) => (
          <Shot
            key={shot.slug}
            shot={shot}
            fineHover={fineHover && lantern}
            onPick={setPick}
          />
        ))}
      </div>
    </div>
  );
}

function Shot({
  shot,
  fineHover,
  onPick,
}: {
  shot: GalleryShot;
  fineHover: boolean;
  onPick: (t: string) => void;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState(false);
  const [lit, setLit] = useState(false);
  const state = useRef({ px: 0, py: 0, want: 0, have: 0, raf: null as number | null });

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.style.setProperty("--lit", `url("${shot.src}")`);
  }, [shot.src]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFound(true);
    }
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

  const move = (e: React.PointerEvent) => {
    if (!fineHover || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
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

  return (
    <figure
      className={`shot${lit ? " lit" : ""}${found ? " found" : ""}`}
      onPointerMove={move}
      onPointerEnter={move}
      onPointerLeave={() => {
        state.current.want = 0;
        kick();
      }}
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
        onClick={() => onPick(shot.title)}
        onFocus={() => {
          if (!fineHover || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
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
