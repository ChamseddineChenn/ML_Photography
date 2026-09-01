import type { Metadata } from "next";
import { GALLERY } from "@/content/gallery";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import { ShotWall } from "@/components/gallery/ShotWall";
import styles from "@/components/pages/page.module.css";

export const metadata: Metadata = {
  title: "Gallery",
  description: "The full wall of photographs by Malek Larif.",
};

export default function GalleryPage() {
  return (
    <PageMain wide>
      <PageHero
        kicker="The work"
        title="The full gallery"
        lede="Every frame available as a signed print or a full-resolution file. Open any photograph for the story behind it."
      />
      <div className={styles.gridWall}>
        <ShotWall shots={GALLERY} />
      </div>
    </PageMain>
  );
}
