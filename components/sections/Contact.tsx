"use client";

import { FormEvent, useEffect, useState } from "react";
import { CONTACT } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { usePick } from "@/components/ui/PickContext";

export function Contact() {
  const { pick } = usePick();
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (pick) setPhoto(pick);
  }, [pick]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const photograph = String(fd.get("photograph") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || email.indexOf("@") < 1) {
      setErr("I need a name and an email address I can reply to.");
      return;
    }
    setErr("");

    if (CONTACT.endpoint) {
      try {
        await fetch(CONTACT.endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, photograph, message }),
        });
        setSent(true);
      } catch {
        setErr(`That did not send. Write to me directly at ${CONTACT.mailto}.`);
      }
      return;
    }

    const body = `From: ${name} (${email})\n\nPhotograph: ${photograph || "not sure yet"}\n\n${message}`;
    window.location.href = `mailto:${CONTACT.mailto}?subject=${encodeURIComponent(
      `A print enquiry from ${name}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="sec contact" id="contact" aria-labelledby="cH">
      <div className="contact-bg" aria-hidden="true" />
      <div className="contact-in">
        <Reveal as="p" className="kicker mono">
          Still deciding
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="cH">Tell me the wall</span>
        </Reveal>
        <Reveal as="p" className="lede">
          If you cannot pick a size, or you want a photograph at a size that is not listed,
          write to me. I answer everything myself.
        </Reveal>

        {!sent ? (
          <form className="form reveal in" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="fname">Your name</label>
              <input id="fname" name="name" type="text" placeholder="Malek" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="femail">Your email</label>
              <input
                id="femail"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="fphoto">Which photograph</label>
              <input
                id="fphoto"
                name="photograph"
                type="text"
                placeholder="The lamp, or tell me what you remember of it"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="fmsg">The wall, or anything else</label>
              <textarea
                id="fmsg"
                name="message"
                rows={4}
                placeholder="Above a sofa, about a metre and a half wide, quite dark room"
              />
            </div>
            {err ? (
              <p className="form-err" role="alert">
                {err}
              </p>
            ) : null}
            <button className="btn btn-accent btn-wide" type="submit">
              Send it to Malek
            </button>
            <p className="mono form-note">NO LIST. NO FORWARDING. JUST ME.</p>
          </form>
        ) : (
          <div className="sent" role="status" tabIndex={-1}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="20" />
                <path d="M15 24.5 l6.5 6.5 L33 18" />
              </g>
            </svg>
            <p>That is with me. I answer everything myself, usually inside a day.</p>
          </div>
        )}

        <Reveal as="p" className="last-cta">
          <a className="btn btn-accent" href="/prints">
            Or just buy the print
          </a>
        </Reveal>
      </div>
    </section>
  );
}
