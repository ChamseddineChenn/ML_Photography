"use client";

import type { RefObject } from "react";
import { BEATS } from "@/content/beats";
import { getBeatObjectPosition } from "@/lib/beatFraming";
import type { ViewportMode } from "@/lib/viewportMode";
import styles from "./hero.module.css";

type Props = {
  layerRefs: RefObject<(HTMLDivElement | null)[]>;
  viewportMode: ViewportMode;
};

/** Persistent beat stack — mounted during gate so imgs load before playback. */
export function HeroLayers({ layerRefs, viewportMode }: Props) {
  return (
    <div className={styles.layersStack} aria-hidden="true">
      {BEATS.map((beat, i) => (
        <div
          key={beat.src}
          ref={(el) => {
            if (layerRefs.current) layerRefs.current[i] = el;
          }}
          className={styles.layer}
          data-beat-index={i}
          style={{
            ["--tint" as string]: beat.tint,
            opacity: 0,
          }}
        >
          <img
            className={styles.layerImg}
            src={beat.src}
            alt=""
            decoding="async"
            draggable={false}
            fetchPriority={i < 2 ? "high" : "auto"}
            style={{
              objectPosition: getBeatObjectPosition(beat, viewportMode),
            }}
          />
        </div>
      ))}
    </div>
  );
}
