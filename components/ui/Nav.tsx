"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HomeMark } from "./HomeMark";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/after-dark", label: "After dark" },
  { href: "/prints", label: "Prints" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

const MENU = [
  ...LINKS,
  { href: "/close-work", label: "Close work" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "Questions" },
  { href: "/contact", label: "Write to me" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [on, setOn] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => document.body.classList.remove("scroll-locked");
  }, [menuOpen]);

  useEffect(() => {
    if (!isHome) {
      setOn(true);
      return;
    }

    let raf: number | null = null;
    let lastOn: boolean | null = null;
    const measure = () => {
      raf = null;
      const hero = document.querySelector("[data-hero-phase]");
      const phase = hero?.getAttribute("data-hero-phase");
      const threshold =
        phase === "playing" || phase === "gate"
          ? window.innerHeight * 0.15
          : window.innerHeight * 0.35;
      const next = window.scrollY > threshold || phase === "rested";
      if (next !== lastOn) {
        lastOn = next;
        setOn(next);
      }
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    const mo = new MutationObserver(onScroll);
    const hero = document.querySelector("[data-hero-phase]");
    if (hero) mo.observe(hero, { attributes: true, attributeFilter: ["data-hero-phase"] });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className={`nav${on ? " on" : ""}`}>
        <HomeMark className="mark" priority />
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-end">
          <Link className="btn btn-accent btn-sm" href="/prints">
            Shop
          </Link>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu"
            aria-label={menuOpen ? "Close the menu" : "Open the menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`menu${menuOpen ? " on" : ""}`} id="menu" hidden={!menuOpen}>
        <nav aria-label="Menu">
          {MENU.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
