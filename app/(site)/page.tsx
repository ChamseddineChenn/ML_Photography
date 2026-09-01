import { Hero } from "@/components/hero/Hero";
import { AfterDark } from "@/components/sections/AfterDark";
import { Gallery } from "@/components/sections/Gallery";
import { CloseWork } from "@/components/sections/CloseWork";
import { Prints } from "@/components/sections/Prints";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Journal } from "@/components/sections/Journal";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Spine } from "@/components/ui/Spine";

export default function Home() {
  return (
    <>
      <Spine />
      <main id="main" tabIndex={-1}>
        <Hero />
        <AfterDark />
        <Gallery />
        <CloseWork />
        <Prints />
        <HowItWorks />
        <Journal />
        <About />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
