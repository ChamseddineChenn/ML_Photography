import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STEPS } from "@/content/prints";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import styles from "@/components/pages/page.module.css";

export const metadata: Metadata = {
  title: "How it works",
  description: "Three steps from photograph to wall.",
};

export default function HowItWorksPage() {
  return (
    <PageMain>
      <PageHero
        kicker="Start to finish"
        title="Three steps and it is on your wall"
        lede="Pick the photograph. Pick the size. I make it and send it."
      />
      <ol className={styles.stepsExpanded}>
        {STEPS.map((s) => (
          <li className={styles.stepExpanded} key={s.no}>
            <div className={styles.stepMedia}>
              <Image src={s.src} alt={s.alt} width={900} height={900} sizes="280px" />
            </div>
            <div>
              <p className="step-no mono">{s.no}</p>
              <h2 className="h3" style={{ margin: "0 0 0.8rem" }}>
                {s.title}
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "42ch" }}>
                {s.detail ?? s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className={`wrap ${styles.actions}`}>
        <Link className="btn btn-accent" href="/gallery">
          Browse the gallery
        </Link>
        <Link className="btn btn-text" href="/prints">
          Go to the shop
        </Link>
      </div>
    </PageMain>
  );
}
