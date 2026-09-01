import { Suspense } from "react";
import { CONTACT_PAGE } from "@/content/site";
import { PageHero, PageMain } from "@/components/pages/PageShell";
import { ContactForm } from "@/components/pages/ContactForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Write to me",
  description: CONTACT_PAGE.lede,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageMain>
      <PageHero
        kicker={CONTACT_PAGE.kicker}
        title={CONTACT_PAGE.title}
        lede={CONTACT_PAGE.lede}
      />
      <div className="wrap" style={{ maxWidth: 560, margin: "0 auto" }}>
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </PageMain>
  );
}
