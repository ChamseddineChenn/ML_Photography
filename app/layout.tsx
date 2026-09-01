import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, Martian_Mono } from "next/font/google";
import { buildMetadata, SITE, siteUrl } from "@/lib/metadata";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument",
  display: "swap",
});

const martian = Martian_Mono({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-martian",
  display: "swap",
});

const social = buildMetadata({ path: "/" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  ...social,
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect width='48' height='32' fill='%230C0A15'/%3E%3Cg fill='none' stroke='%23DD7D3B' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 26 L8 8 L14 19 L20 8 L23 26'/%3E%3Cpath d='M28 8 L28 26 L44 26'/%3E%3C/g%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0A15",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${martian.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
