import type { Metadata } from "next";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import { FaqList } from "@/components/pages/FaqList";

export const metadata: Metadata = {
  title: "Questions",
  description: "Returns, dark prints, files, shipping. Straight answers.",
};

export default function FaqPage() {
  return (
    <PageMain>
      <PageHero
        kicker="Before you buy"
        title="The things people actually ask"
        lede="Returns, dark prints, files, shipping. Straight answers."
      />
      <FaqList />
    </PageMain>
  );
}
