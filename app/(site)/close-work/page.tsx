import Image from "next/image";
import Link from "next/link";
import { CLOSE_WORK } from "@/content/gallery";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import { buildMetadata } from "@/lib/metadata";
import styles from "@/components/pages/page.module.css";

export const metadata = buildMetadata({
  title: "Close work",
  description: "Small things, same light. Macro and still life by Malek Larif.",
  path: "/close-work",
});

export default function CloseWorkPage() {
  return (
    <PageMain wide>
      <PageHero
        kicker="Close work"
        title="Small things, same light"
        lede="A canola field and a kiwi under a coloured gel are the same problem: where the light is and what it is doing."
      />
      <div className={styles.closeGrid}>
        {CLOSE_WORK.map((item) => (
          <figure className={styles.closeItem} key={item.title}>
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width:900px) 100vw, 50vw"
            />
            <figcaption>
              <span className="shot-title">{item.title}</span>
              <span className="mono">{item.meta}</span>
            </figcaption>
            {"story" in item && item.story ? <p>{item.story}</p> : null}
          </figure>
        ))}
      </div>
      <div className={`wrap ${styles.actions}`}>
        <Link className="btn btn-accent" href="/prints">
          See the prints
        </Link>
        <Link className="btn btn-text" href="/gallery">
          The full gallery
        </Link>
      </div>
    </PageMain>
  );
}
