import styles from "./page.module.css";

type Props = {
  kicker: string;
  title: string;
  lede?: string;
};

export function PageHero({ kicker, title, lede }: Props) {
  return (
    <header className={styles.hero}>
      <p className={`mono ${styles.kicker}`}>{kicker}</p>
      <h1 className={styles.title}>{title}</h1>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}

export function PageMain({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <main id="main" tabIndex={-1} className={`${styles.main}${wide ? ` ${styles.wide}` : ""}`}>
      {children}
    </main>
  );
}
