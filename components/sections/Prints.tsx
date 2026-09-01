"use client";

import { useMemo } from "react";
import { GALLERY } from "@/content/gallery";
import type { PrintProduct } from "@/content/prints";
import { PrintsContent } from "@/components/prints/PrintsContent";
import { Reveal, Rule } from "@/components/ui/Reveal";
import { usePick } from "@/components/ui/PickContext";

export function Prints() {
  const { pick, setPick } = usePick();

  const selectedSlug = useMemo(() => {
    if (!pick) return "";
    return GALLERY.find((s) => s.title === pick)?.slug ?? "";
  }, [pick]);

  const onSelectPhoto = (slug: string) => {
    const shot = GALLERY.find((s) => s.slug === slug);
    if (shot) setPick(shot.title);
  };

  const buy = (product: PrintProduct) => {
    if (product.stripeLink) {
      window.open(product.stripeLink, "_blank", "noopener");
      return;
    }
    const photo = document.getElementById("fphoto") as HTMLInputElement | null;
    const msg = document.getElementById("fmsg") as HTMLTextAreaElement | null;
    if (photo && pick && !photo.value) photo.value = pick;
    if (msg && !msg.value) {
      msg.value =
        "I would like " +
        product.product.replace(/^The /, "the ") +
        (pick ? ` of "${pick}".` : ".") +
        "\n\n";
    }
    window.location.href =
      "/contact" + (pick ? `?photo=${encodeURIComponent(pick)}` : "");
  };

  return (
    <section className="sec prints" id="prints" aria-labelledby="printsH">
      <Rule />
      <div className="wrap">
        <Reveal as="p" className="kicker mono">
          The shop
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="printsH">Straight from the person who took it</span>
        </Reveal>
        <Reveal as="p" className="lede">
          No gallery taking a cut. No print farm you never hear from. I pick the paper, I
          check the proof, I sign it, and I put it in the box.
        </Reveal>
      </div>

      <PrintsContent
        selectedSlug={selectedSlug}
        onSelectPhoto={onSelectPhoto}
        onBuy={buy}
      />
    </section>
  );
}
