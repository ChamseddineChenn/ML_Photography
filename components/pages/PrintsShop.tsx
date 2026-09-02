"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GALLERY } from "@/content/gallery";
import type { PrintProduct } from "@/content/prints";
import { PrintsContent } from "@/components/prints/PrintsContent";
import { usePick } from "@/components/ui/PickContext";

export function PrintsShop() {
  const search = useSearchParams();
  const router = useRouter();
  const { pick, setPick } = usePick();
  const photoParam = search.get("photo") || "";

  const [selectedSlug, setSelectedSlug] = useState(photoParam);

  useEffect(() => {
    if (photoParam) {
      setSelectedSlug(photoParam);
      const shot = GALLERY.find((s) => s.slug === photoParam);
      if (shot) setPick(shot.title);
    }
  }, [photoParam, setPick]);

  const onSelectPhoto = (slug: string) => {
    setSelectedSlug(slug);
    const shot = GALLERY.find((s) => s.slug === slug);
    if (shot) setPick(shot.title);
    const q = slug ? `?photo=${slug}` : "";
    router.replace(`/prints${q}`, { scroll: false });
  };

  const selectedTitle =
    GALLERY.find((s) => s.slug === selectedSlug)?.title || pick;

  const buy = (product: PrintProduct) => {
    if (product.stripeLink) {
      window.open(product.stripeLink, "_blank", "noopener");
      return;
    }
    const title = selectedTitle || "";
    const params = new URLSearchParams();
    if (title) params.set("photo", title);
    params.set(
      "intent",
      `I would like ${product.product.replace(/^The /, "the ")}${title ? ` of "${title}".` : "."}`
    );
    window.location.href = `/contact?${params.toString()}`;
  };

  return (
    <section className="prints prints-page" aria-label="Print shop">
      <PrintsContent
        selectedSlug={selectedSlug}
        onSelectPhoto={onSelectPhoto}
        onBuy={buy}
      />
    </section>
  );
}
