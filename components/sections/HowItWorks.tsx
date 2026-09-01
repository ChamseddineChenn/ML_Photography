import Image from "next/image";
import { STEPS } from "@/content/prints";
import { Reveal, Rule } from "@/components/ui/Reveal";

export function HowItWorks() {
  return (
    <section className="sec steps" id="how" aria-labelledby="howH">
      <Rule />
      <div className="wrap">
        <Reveal as="p" className="kicker mono">
          Start to finish
        </Reveal>
        <Reveal as="h2" className="h2">
          <span id="howH">Three steps and it is on your wall</span>
        </Reveal>
      </div>
      <ol className="step-list">
        {STEPS.map((s) => (
          <Reveal as="li" className="step" key={s.no}>
            <div className="step-img">
              <Image src={s.src} alt={s.alt} width={900} height={900} sizes="220px" />
            </div>
            <div className="step-text">
              <p className="step-no mono">{s.no}</p>
              <h3 className="h4">{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
