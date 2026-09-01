"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQ } from "@/content/faq";
import styles from "@/components/pages/page.module.css";

export function FaqList() {
  const [open, setOpen] = useState<string | null>(FAQ[0]?.id ?? null);

  return (
    <>
      <div className="qa" style={{ marginTop: 0 }}>
        {FAQ.map((item, i) => {
          const isOpen = open === item.id;
          const btnId = `${item.id}b`;
          return (
            <div className={`q${isOpen ? " open" : ""}`} key={item.id}>
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
              <div className="a" id={item.id} role="region" aria-labelledby={btnId}>
                <div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={`wrap ${styles.actions}`}>
        <Link className="btn btn-accent" href="/contact">
          Still unsure? Write to me
        </Link>
        <Link className="btn btn-text" href="/prints">
          See the prints
        </Link>
      </div>
    </>
  );
}
