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

/** Production apex — working SSL; used for OG/crawler URLs on maleklarif.com. */
export const PRODUCTION_APEX = "https://maleklarif.com";

const DEFAULT_OG_SIZE = { width: 1200, height: 630 } as const;

/** Strip trailing slashes; map maleklarif.com hosts to apex for metadata (reliable SSL for crawlers). */
export function normalizeSiteUrl(raw: string): string {
  const origin = new URL(raw).origin;
  const host = new URL(origin).hostname;
  if (host === "maleklarif.com" || host === "www.maleklarif.com") {
    return PRODUCTION_APEX;
  }
  return origin;
}

export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === "production"
      ? PRODUCTION_APEX
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
  return normalizeSiteUrl(raw);
}

export function absoluteUrl(path: string): URL {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteUrl());
}

export function defaultOgImage() {
  return {
    url: absoluteUrl("/opengraph-image").href,
    width: DEFAULT_OG_SIZE.width,
    height: DEFAULT_OG_SIZE.height,
    alt: SITE.title,
  };
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
  /** When true, skip the default /opengraph-image (rare). */
  skipDefaultImage?: boolean;
};

/** Full Open Graph + Twitter metadata. Uses /opengraph-image unless `image` is set. */
export function buildMetadata(opts: BuildMetadataOptions = {}): Metadata {
  const description = opts.description ?? SITE.description;
  const ogTitle = opts.title ? `${opts.title} · ${SITE.name}` : SITE.title;
  const ogDescription = opts.description ?? SITE.shortDescription;
  const canonical = opts.path ? absoluteUrl(opts.path) : absoluteUrl("/");
  const shareImage = opts.image ?? (opts.skipDefaultImage ? undefined : defaultOgImage());

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

  if (shareImage) {
    const img = {
      url: shareImage.url,
      width: shareImage.width,
      height: shareImage.height,
      alt: shareImage.alt ?? ogTitle,
    };
    metadata.openGraph = { ...metadata.openGraph, images: [img] };
    metadata.twitter = { ...metadata.twitter, images: [shareImage.url] };
  }

  return metadata;
}
