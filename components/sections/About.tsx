import { ABOUT } from "@/content/site";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Reveal, Rule } from "@/components/ui/Reveal";

export function About() {
  return (
    <section className="sec about" id="about" aria-labelledby="aboutH">
      <Rule />
      <div className="about-grid">
        <div className="portrait reveal in" aria-hidden="true">
          <BrandLogo variant="light" className="about-logo" />
          <span className="mono">PORTRAIT COMING</span>
        </div>
        <div className="about-text">
          <Reveal as="p" className="kicker mono">
            {ABOUT.kicker}
          </Reveal>
          <Reveal as="h2" className="h2">
            <span id="aboutH">{ABOUT.name}</span>
          </Reveal>
          {ABOUT.paragraphs.map((p) => (
            <Reveal as="p" key={p.slice(0, 20)}>
              {p}
            </Reveal>
          ))}
          <Reveal as="p">
            <a className="btn btn-accent" href="/prints">
              See the prints
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
