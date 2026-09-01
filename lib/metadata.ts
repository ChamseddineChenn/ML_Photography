import type { Metadata } from "next";

export const SITE = {
  name: "ML Photography",
  title: "ML Photography, Malek Larif, prints of the last light",
  shortTitle: "ML Photography, Malek Larif",
  description:
    "Photographs of the last light by Malek Larif. Signed archival prints and full resolution digital files, sent by the person who took them.",
  shortDescription:
    "Photographs of the last light. Signed archival prints and full resolution digital files.",
  locale: "en_CA",
} as const;

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function absoluteUrl(path: string): URL {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteUrl());
}

export type OgImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: OgImage;
};

/** Full Open Graph + Twitter metadata. Omit `image` to use app/opengraph-image.tsx. */
export function buildMetadata(opts: BuildMetadataOptions = {}): Metadata {
  const description = opts.description ?? SITE.description;
  const ogTitle = opts.title ? `${opts.title} · ${SITE.name}` : SITE.title;
  const ogDescription = opts.description ?? SITE.shortDescription;
  const canonical = opts.path ? absoluteUrl(opts.path) : absoluteUrl("/");

  const metadata: Metadata = {
    description,
    alternates: opts.path !== undefined ? { canonical: canonical.href } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url: canonical.href,
      title: ogTitle,
      description: ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };

  if (opts.title) {
    metadata.title = opts.title;
  }

  if (opts.image) {
    const img = {
      url: opts.image.url,
      width: opts.image.width,
      height: opts.image.height,
      alt: opts.image.alt ?? ogTitle,
    };
    metadata.openGraph = { ...metadata.openGraph, images: [img] };
    metadata.twitter = { ...metadata.twitter, images: [opts.image.url] };
  }

  return metadata;
}
