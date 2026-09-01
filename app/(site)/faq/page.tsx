import { PageHero, PageMain } from "@/components/pages/PageShell";
import { FaqList } from "@/components/pages/FaqList";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Questions",
  description: "Returns, dark prints, files, shipping. Straight answers.",
  path: "/faq",
});

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
