import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { ABOUT_PAGE } from "@/content/site";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import styles from "@/components/pages/page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_PAGE.lede,
};

export default function AboutPage() {
  return (
    <PageMain>
      <PageHero
        kicker={ABOUT_PAGE.kicker}
        title={ABOUT_PAGE.name}
        lede={ABOUT_PAGE.lede}
      />
      <div className="about-grid wrap" style={{ marginTop: 0 }}>
        <div className="portrait" aria-hidden="true">
          <Mark />
          <span className="mono">PORTRAIT COMING</span>
        </div>
        <div className="about-text">
          {ABOUT_PAGE.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p>
            <Link className="btn btn-accent" href="/prints">
              See the prints
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.aboutPractice}>
        {ABOUT_PAGE.practice.map((item) => (
          <div className={styles.practiceCard} key={item.label}>
            <h3>{item.label}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </PageMain>
  );
}
