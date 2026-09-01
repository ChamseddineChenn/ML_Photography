"use client";

import { useState } from "react";
import { FAQ } from "@/content/faq";
import { Reveal, Rule } from "@/components/ui/Reveal";

export function Faq() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="sec faq" id="faq" aria-labelledby="faqH">
      <Rule />
      <div className="wrap">
        <Reveal as="p" className="kicker mono">
          Before you buy
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="faqH">The things people actually ask</span>
        </Reveal>
      </div>
      <div className="qa">
        {FAQ.map((item, i) => {
          const isOpen = open === item.id;
          const btnId = `${item.id}b`;
          return (
            <Reveal key={item.id}>
              <div className={`q${isOpen ? " open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    id={btnId}
                    aria-controls={item.id}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                  >
                    <span className="q-no mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="q-t">{item.question}</span>
                    <span className="q-x" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="a"
                  id={item.id}
                  role="region"
                  aria-labelledby={btnId}
                >
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
