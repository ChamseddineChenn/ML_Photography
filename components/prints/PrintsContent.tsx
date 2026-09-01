"use client";

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Image from "next/image";
import { GALLERY } from "@/content/gallery";
import { PRINTS, PROMISES, type PrintProduct } from "@/content/prints";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./prints.module.css";

type RevealArticleProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

function RevealArticle({ children, className = "", ...rest }: RevealArticleProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </article>
  );
}

function TrustIcon({ i }: { i: number }) {
  if (i === 0)
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="14" width="26" height="12" rx="6" />
          <path d="M13 14 v12 M27 14 v12" />
          <path d="M4 12 l5 3 M36 12 l-5 3" />
        </g>
      </svg>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 32 V10 h16" />
          <path d="M24 10 l8 8 v14 H8" />
          <path d="M24 10 v8 h8" />
          <path d="M15 22 l10 6 M25 22 l-10 6" />
        </g>
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="10" width="26" height="23" rx="3" />
        <path d="M7 17 h26 M14 6 v7 M26 6 v7" />
        <path d="M23 25 h-6 l2.5-2.5 M17 25 l2.5 2.5" />
      </g>
    </svg>
  );
}

type Props = {
  selectedSlug: string;
  onSelectPhoto: (slug: string) => void;
  onBuy: (product: PrintProduct) => void;
};

export function PrintsContent({ selectedSlug, onSelectPhoto, onBuy }: Props) {
  const apertureRef = useRef<HTMLDivElement>(null);
  const [pendingProduct, setPendingProduct] = useState<string | null>(null);
  const selected = GALLERY.find((s) => s.slug === selectedSlug);

  useEffect(() => {
    const el = apertureRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const buy = (product: PrintProduct) => {
    setPendingProduct(product.name);
    onBuy(product);
  };

  return (
    <>
      <div className={styles.photoBlock}>
        <p className={`kicker mono ${styles.photoKicker}`}>Your photograph</p>
        {selected ? (
          <div className={styles.preview}>
            <div className={styles.previewFrame}>
              <Image
                src={selected.src}
                alt={selected.alt}
                width={selected.width}
                height={selected.height}
                sizes="(max-width: 900px) 100vw, min(720px, 70vw)"
                priority
              />
            </div>
            <p className="picked mono">
              SELECTED: <span>{selected.title}</span>
            </p>
          </div>
        ) : (
          <p className={styles.photoHint}>
            Pick one from the grid below, or choose a photograph in the gallery first.
          </p>
        )}

        <div className={styles.thumbs} role="listbox" aria-label="Choose a photograph">
          {GALLERY.map((shot) => {
            const active = selectedSlug === shot.slug;
            return (
              <button
                key={shot.slug}
                type="button"
                role="option"
                aria-selected={active}
                className={`${styles.thumb}${active ? ` ${styles.thumbActive}` : ""}`}
                onClick={() => onSelectPhoto(shot.slug)}
              >
                <Image
                  src={shot.src}
                  alt=""
                  width={shot.width}
                  height={shot.height}
                  sizes="120px"
                />
                <span className={styles.thumbLabel}>{shot.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {pendingProduct ? (
        <p className={`picked mono ${styles.buyLine}`}>
          READY: <span>{pendingProduct}</span>
          {selected ? ` of "${selected.title}"` : ""}
        </p>
      ) : null}

      <div className="aperture" ref={apertureRef} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
            <path d="M100 22 L152 52 L152 112" />
            <path d="M152 52 L100 82 L48 52" />
            <path d="M152 112 L100 142 L48 112" />
            <path d="M48 52 L48 112 L100 142" />
            <path d="M100 82 L100 142" />
            <path d="M48 112 L100 82 L152 112" />
            <circle cx="100" cy="100" r="78" />
            <circle cx="100" cy="100" r="62" />
          </g>
        </svg>
      </div>

      <div className="cards">
        {PRINTS.map((p) => (
          <RevealArticle key={p.name} className={`card${p.lead ? " card-lead" : ""}`}>
            <p className="card-kind mono">{p.kind}</p>
            <h3 className="card-name">{p.name}</h3>
            <p className="card-price">{p.price}</p>
            <p className="card-body">{p.body}</p>
            <ul className="spec mono">
              {p.specs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <button type="button" className="btn btn-accent" onClick={() => buy(p)}>
              {p.cta}
            </button>
          </RevealArticle>
        ))}
      </div>

      <div className="promise">
        <div className="promise-in">
          <Reveal as="p" className="kicker mono">
            About the dark ones
          </Reveal>
          <Reveal as="h3" className="h3">
            Shadows keep their detail
          </Reveal>
          <Reveal as="p" className="promise-body">
            The most common complaint about cheap prints is that dark pictures come back as
            one flat black mass. Half my best photographs are dark. So the blue hour and night
            images go on a paper chosen for shadow depth, and I proof every single one by eye
            before it ships. If there is detail in a shadow, you will see the detail.
          </Reveal>
          <ul className="trust">
            {PROMISES.map((line, i) => (
              <Reveal as="li" key={line}>
                <TrustIcon i={i} />
                <span>{line}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
