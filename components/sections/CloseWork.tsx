"use client";

import Image from "next/image";
import { useRef } from "react";
import { CLOSE_WORK } from "@/content/gallery";
import { Reveal, Rule } from "@/components/ui/Reveal";

export function CloseWork() {
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <section className="sec closework" id="close-work" aria-labelledby="closeH">
      <Rule />
      <div className="wrap">
        <Reveal as="p" className="kicker mono">
          Chapter three
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="closeH">Small things, same light</span>
        </Reveal>
        <Reveal as="p" className="lede">
          I am not loyal to a subject. A canola field and a kiwi under a coloured gel are the
          same problem, which is where the light is and what it is doing.
        </Reveal>
      </div>
      <div
        className="strip"
        ref={stripRef}
        tabIndex={0}
        role="region"
        aria-label="Close work, scroll sideways"
        onKeyDown={(e) => {
          const el = stripRef.current;
          if (!el) return;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            el.scrollBy({ left: 320, behavior: "smooth" });
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            el.scrollBy({ left: -320, behavior: "smooth" });
          }
        }}
      >
        {CLOSE_WORK.map((item) => (
          <figure className="strip-item" key={item.title}>
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="380px"
            />
            <figcaption>
              <span>{item.title}</span>
              <span className="mono">{item.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="strip-hint mono">Scroll sideways, or use the arrow keys</p>
    </section>
  );
}
