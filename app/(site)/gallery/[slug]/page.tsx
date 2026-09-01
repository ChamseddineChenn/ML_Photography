import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allShotSlugs, getShot } from "@/content/gallery";
import { PageMain } from "@/components/pages/PageShell";
import styles from "@/components/pages/page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allShotSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shot = getShot(slug);
  if (!shot) return { title: "Photograph" };
  return {
    title: shot.title,
    description: shot.story ?? shot.alt,
    openGraph: { images: [shot.src] },
  };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { slug } = await params;
  const shot = getShot(slug);
  if (!shot) notFound();

  return (
    <PageMain>
      <div className={styles.detail}>
        <div className={styles.detailFrame}>
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="(max-width:900px) 100vw, 60vw"
            priority
          />
        </div>
        <div className={styles.detailCopy}>
          <p className={`mono ${styles.meta}`}>{shot.place ?? "Photograph"}</p>
          <h2>{shot.title}</h2>
          <p className="mono" style={{ color: "var(--text-secondary)", marginBottom: "1.2rem" }}>
            {shot.sizes}
          </p>
          {shot.story ? <p>{shot.story}</p> : null}
          {shot.notes ? <p>{shot.notes}</p> : null}
          <div className={styles.actions}>
            <Link className="btn btn-accent" href={`/prints?photo=${shot.slug}`}>
              Buy a print
            </Link>
            <Link className="btn btn-text" href="/gallery">
              Back to gallery
            </Link>
          </div>
        </div>
      </div>
    </PageMain>
  );
}
