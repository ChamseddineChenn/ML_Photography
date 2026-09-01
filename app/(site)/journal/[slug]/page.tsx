import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allEntrySlugs, getEntry } from "@/content/journal";
import { PageMain } from "@/components/pages/PageShell";
import { buildMetadata } from "@/lib/metadata";
import styles from "@/components/pages/page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return buildMetadata({ title: "Journal", path: `/journal/${slug}` });
  return buildMetadata({
    title: entry.title,
    description: entry.paragraphs[0],
    path: `/journal/${slug}`,
    image: {
      url: entry.src,
      width: entry.width,
      height: entry.height,
      alt: entry.alt,
    },
  });
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  return (
    <PageMain>
      <article className="wrap" style={{ maxWidth: 760, margin: "0 auto" }}>
        <p className={`mono ${styles.meta}`}>{entry.meta}</p>
        <h1 className={styles.title} style={{ maxWidth: "20ch" }}>
          {entry.title}
        </h1>
        <div className={styles.detailFrame} style={{ margin: "2rem 0" }}>
          <Image
            src={entry.src}
            alt={entry.alt}
            width={entry.width}
            height={entry.height}
            sizes="(max-width:760px) 100vw, 760px"
            priority
          />
        </div>
        <div className="entry-body">
          {entry.paragraphs.map((p) => (
            <p key={p.slice(0, 28)}>{p}</p>
          ))}
        </div>
        <div className={styles.actions}>
          <Link className="btn btn-accent" href="/prints">
            See the prints
          </Link>
          <Link className="btn btn-text" href="/journal">
            All journal entries
          </Link>
        </div>
      </article>
    </PageMain>
  );
}
