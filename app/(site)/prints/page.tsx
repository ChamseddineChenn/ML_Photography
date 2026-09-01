import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import { PrintsShop } from "@/components/pages/PrintsShop";

export const metadata: Metadata = {
  title: "Prints",
  description:
    "Signed archival prints and full resolution digital files, straight from Malek Larif.",
};

export default function PrintsPage() {
  return (
    <PageMain>
      <PageHero
        kicker="The shop"
        title="Straight from the person who took it"
        lede="No gallery taking a cut. No print farm you never hear from. Pick the photograph, pick the size, and I make it."
      />
      <Suspense fallback={null}>
        <PrintsShop />
      </Suspense>
    </PageMain>
  );
}
