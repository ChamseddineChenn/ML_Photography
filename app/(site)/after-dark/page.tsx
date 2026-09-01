import Link from "next/link";
import { AfterDark } from "@/components/sections/AfterDark";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import styles from "@/components/pages/page.module.css";
import { NIGHT } from "@/content/gallery";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "After dark",
  description:
    "Blue hour, night, lightning. What is left after the light goes, by Malek Larif.",
  path: "/after-dark",
});

export default function AfterDarkPage() {
  return (
    <PageMain wide>
      <PageHero
        kicker="After dark"
        title="What is left after it goes"
        lede="Most people pack up when the light dies. That is when I start. Hold to adjust, then stay with the frames that only exist in the dark."
      />
      <div className={styles.nightLead}>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          {NIGHT.lamp.story} {NIGHT.video.story}
        </p>
      </div>
      <AfterDark />
      <div className={`wrap ${styles.actions}`}>
        <Link className="btn btn-accent" href="/prints">
          Buy a night print
        </Link>
        <Link className="btn btn-text" href="/journal">
          Notes from the waiting
        </Link>
      </div>
    </PageMain>
  );
}
