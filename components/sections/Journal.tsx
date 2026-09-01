import Image from "next/image";
import Link from "next/link";
import { JOURNAL_PREVIEW } from "@/content/journal";
import { Reveal, Rule } from "@/components/ui/Reveal";

export function Journal() {
  return (
    <section className="sec journal" id="journal" aria-labelledby="jH">
      <Rule />
      <div className="wrap">
        <Reveal as="p" className="kicker mono">
          {JOURNAL_PREVIEW.kicker}
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="jH">{JOURNAL_PREVIEW.title}</span>
        </Reveal>
        <Reveal as="p" className="lede">
          {JOURNAL_PREVIEW.lede}
        </Reveal>
      </div>

      {JOURNAL_PREVIEW.entries.map((entry) => (
        <Reveal as="article" className="entry" key={entry.title}>
          <p className="entry-meta mono">{entry.meta}</p>
          <h3 className="h3">{entry.title}</h3>
          <div className="entry-img">
            <Image
              src={entry.src}
              alt={entry.alt}
              width={entry.width}
              height={entry.height}
              sizes="(max-width:760px) 100vw, 760px"
            />
          </div>
          <div className="entry-body">
            {entry.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>
      ))}

      <Reveal as="p" className="entry-more mono">
        <Link href="/journal">Read the full journal</Link>
      </Reveal>
    </section>
  );
}
