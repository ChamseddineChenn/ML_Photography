import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="foot-in">
        <Link className="mark mark-foot" href="/" aria-label="Back to the top">
          <BrandLogo variant="light" />
        </Link>
        <p className="foot-line">
          All photographs by Malek Larif. Please do not reproduce them without asking.
        </p>
        <nav className="foot-nav" aria-label="Footer">
          <Link href="/gallery">Gallery</Link>
          <Link href="/prints">Prints</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Write to me</Link>
        </nav>
        <p className="foot-year mono">ML PHOTOGRAPHY / {year}</p>
      </div>
    </footer>
  );
}
