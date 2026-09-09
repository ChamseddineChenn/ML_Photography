"use client";

import { useEffect, useState } from "react";
import { GALLERY } from "@/content/gallery";
import { Reveal, Rule } from "@/components/ui/Reveal";
import { ShotWall } from "@/components/gallery/ShotWall";

export function Gallery() {
  const [lede, setLede] = useState(
    "Every photograph here sits in the dark until you go looking. Move your cursor across one. Whatever your light finds stays found."
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover:hover) and (pointer:fine)");
    const apply = () => {
      if (!mq.matches) {
        setLede(
          "Every photograph here sits in the dark until you go looking. Hold a picture to light it, drag to move the beam, then tap to open it."
        );
      } else {
        setLede(
          "Every photograph here sits in the dark until you go looking. Move your cursor across one. Whatever your light finds stays found."
        );
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section className="sec gal" id="gallery" aria-labelledby="galH">
      <Rule />
      <div className="wrap wrap-wide">
        <Reveal as="p" className="kicker mono">
          The work
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="galH">Carry the light across it</span>
        </Reveal>
        <Reveal as="p" className="lede">
          {lede}
        </Reveal>
      </div>
      <ShotWall shots={GALLERY} />
    </section>
  );
}
