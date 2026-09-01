import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JOURNAL, JOURNAL_ENTRIES } from "@/content/journal";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import styles from "@/components/pages/page.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description: JOURNAL.lede,
};

export default function JournalIndexPage() {
  return (
    <PageMain>
      <PageHero kicker={JOURNAL.kicker} title={JOURNAL.title} lede={JOURNAL.lede} />
      <div className={styles.indexList}>
        {JOURNAL_ENTRIES.map((entry) => (
          <Link
            key={entry.slug}
            href={`/journal/${entry.slug}`}
            className={styles.indexCard}
          >
            <div className={styles.indexMedia}>
              <Image
                src={entry.src}
                alt={entry.alt}
                width={entry.width}
                height={entry.height}
                sizes="(max-width:900px) 100vw, 40vw"
              />
            </div>
            <div>
              <p className={`mono ${styles.meta}`}>{entry.meta}</p>
              <h2 className={styles.indexTitle}>{entry.title}</h2>
              <p style={{ color: "var(--text-secondary)", margin: 0, maxWidth: "40ch" }}>
                {entry.paragraphs[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PageMain>
  );
}
