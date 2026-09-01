"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NIGHT } from "@/content/gallery";
import { Reveal, Rule } from "@/components/ui/Reveal";

/**
 * Hold-to-adjust writes --adapt on the DOM every frame.
 * Do not put hold progress in React state — that re-renders the whole night grid.
 */
export function AfterDark() {
  const adaptRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const holdRef = useRef(0);
  const holdingRef = useRef(false);
  const doneRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [done, setDone] = useState(false);
  const [label, setLabel] = useState("Press and hold. Let your eyes adjust.");
  const [hint, setHint] = useState("Hold the button until the picture comes up.");
  const [gridLit, setGridLit] = useState(false);
  const [playing, setPlaying] = useState(false);

  const paint = (hold: number) => {
    holdRef.current = hold;
    adaptRef.current?.style.setProperty("--adapt", hold.toFixed(3));
    ringRef.current?.style.setProperty("--hd", String(Math.round(126 * (1 - hold))));
  };

  const complete = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    paint(1);
    setDone(true);
    setLabel("There it is.");
    setHint("Everything below was shot in the same dark.");
    setGridLit(true);
  };

  const stopRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastRef.current = 0;
  };

  const step = (now: number) => {
    if (doneRef.current) {
      stopRaf();
      return;
    }
    const dt = Math.min(60, now - (lastRef.current || now));
    lastRef.current = now;
    let hold = holdRef.current;
    hold = Math.min(1, Math.max(0, hold + (holdingRef.current ? dt / 1600 : -dt / 900)));
    paint(hold);

    if (hold >= 1) {
      stopRaf();
      complete();
      return;
    }
    if ((holdingRef.current && hold < 1) || (!holdingRef.current && hold > 0)) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      stopRaf();
    }
  };

  const kick = () => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doneRef.current = true;
      paint(1);
      setDone(true);
      setLabel("Your eyes are already adjusted.");
      setHint("Everything below was shot in the same dark.");
      setGridLit(true);
    }
    return () => stopRaf();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only reduced-motion gate
  }, []);

  const startHold = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (doneRef.current) return;
    holdingRef.current = true;
    if (e && btnRef.current) {
      try {
        btnRef.current.setPointerCapture(e.pointerId);
      } catch {
        /* older browsers */
      }
    }
    kick();
  };

  const endHold = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (doneRef.current) return;
    holdingRef.current = false;
    if (e && btnRef.current?.hasPointerCapture(e.pointerId)) {
      try {
        btnRef.current.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (holdRef.current > 0) kick();
  };

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.setAttribute("controls", "");
    setPlaying(true);
    v.play()?.catch(() => setPlaying(false));
  };

  return (
    <section className="sec dark" id="afterdark" aria-labelledby="darkH">
      <Rule />
      <div className="wrap">
        <Reveal as="p" className="kicker mono">
          Chapter two
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="darkH">What is left after it goes</span>
        </Reveal>
        <Reveal as="p" className="lede">
          Most people pack up when the light dies. That is when I start. Everything below was
          shot after the sun had already gone.
        </Reveal>
      </div>

      <div className="adapt-wrap">
        <div className="adapt" id="adapt" ref={adaptRef}>
          <Image
            className="adapt-img"
            src={NIGHT.lamp.src}
            alt={NIGHT.lamp.alt}
            width={NIGHT.lamp.width}
            height={NIGHT.lamp.height}
            sizes="(max-width:560px) 100vw, 560px"
          />
          <div className="adapt-veil" aria-hidden="true" />
          <div className="adapt-cap">
            <span className="adapt-title">{NIGHT.lamp.title}</span>
            <span className="mono">{NIGHT.lamp.meta}</span>
          </div>
        </div>
        <button
          ref={btnRef}
          className={`adapt-btn${done ? " done" : ""}`}
          type="button"
          aria-describedby="adaptHint"
          onPointerDown={(e) => {
            e.preventDefault();
            startHold(e);
          }}
          onPointerUp={(e) => endHold(e)}
          onPointerCancel={(e) => endHold(e)}
          onLostPointerCapture={() => {
            holdingRef.current = false;
            if (!doneRef.current && holdRef.current > 0) kick();
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              startHold();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              endHold();
            }
          }}
          onBlur={() => endHold()}
          onClick={(e) => e.preventDefault()}
        >
          <span className="adapt-ring" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle
                ref={ringRef}
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="126"
                style={{ strokeDashoffset: "var(--hd,126)" }}
              />
            </svg>
          </span>
          <span>{label}</span>
        </button>
        <p className="hint mono" id="adaptHint">
          {hint}
        </p>
      </div>

      <div className={`night-grid${gridLit ? " lit done" : ""}`}>
        {NIGHT.items.map((item) => (
          <figure
            key={item.title}
            className={`night-item${item.crimson ? " night-crimson" : ""}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width:720px) 100vw, 33vw"
            />
            <figcaption>
              <span className="night-title">{item.title}</span>
              <span className="mono">{item.meta}</span>
            </figcaption>
          </figure>
        ))}
        <figure className="night-item night-video">
          <div className={`player${playing ? " playing" : ""}`}>
            <video
              ref={videoRef}
              poster={NIGHT.video.poster}
              preload="none"
              playsInline
              muted
              width={720}
              height={1280}
              onEnded={() => setPlaying(false)}
            >
              <source src={NIGHT.video.src} type="video/mp4" />
            </video>
            <button
              className="play"
              type="button"
              aria-label="Play the six second clip, one lightning strike"
              onClick={play}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5 L19 12 L8 19 Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <figcaption>
            <span className="night-title">{NIGHT.video.title}</span>
            <span className="mono">{NIGHT.video.meta}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
