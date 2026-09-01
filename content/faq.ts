export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ: FaqItem[] = [
  {
    id: "q1",
    question: "I have not seen it in person. What if it is not what I expected?",
    answer:
      "Fair. You are buying something you will look at every day, so guessing is not good enough. Every photograph on this site is shown large and uncompressed, so what you see is what the file is. And there is a thirty day return, so if it lands on the wall and it is wrong, it goes back and you get your money.",
  },
  {
    id: "q2",
    question: "Will the dark photographs come back as one black mass?",
    answer:
      "That is the right thing to worry about, and it is why cheap print shops get bad reviews. Dark work needs a paper with shadow depth and a proof checked by eye. Both happen here on every dark print, one at a time.",
  },
  {
    id: "q3",
    question: "What exactly do I get if I buy the digital file?",
    answer:
      "One JPEG at the largest size that photograph exists in, up to 6000 by 4000 pixels, saved at full quality once and never resaved. You get it in sRGB for screens and Adobe RGB for labs. It arrives by email straight after payment.",
  },
  {
    id: "q4",
    question: "How big can I print the file before it goes soft?",
    answer:
      "A 6000 pixel wide file is sharp to about 20 inches on the long edge at 300 dots per inch, which is the standard for close viewing. Go bigger and it still works, because a large print gets looked at from further away. If you want a specific size, tell me and I will tell you honestly whether that photograph can carry it.",
  },
  {
    id: "q5",
    question: "What if it arrives damaged?",
    answer:
      "It ships insured, in a rigid tube, with guards on the corners. If it turns up hurt anyway, send me a photo and I make you another one. You do not pay twice.",
  },
  {
    id: "q6",
    question: "How do I know you actually took these?",
    answer:
      "Because they are all one person's eye and you can see it. Same light, same patience, thirty odd frames across landscape, wildlife, macro and night. Prints are signed and numbered by hand. Ask me about any photograph here and I will tell you where I was standing.",
  },
  {
    id: "q7",
    question: "How long does a print take?",
    answer:
      "Files arrive instantly. Signed prints take five to seven days to make and proof, then they post from Canada with tracking. The large edition takes a little longer because it is checked twice.",
  },
  {
    id: "q8",
    question: "Can I order a size that is not listed?",
    answer:
      "Often yes. Tell me the wall and the photograph. I will tell you whether that file can carry the size and what it costs. If it cannot, I will say so.",
  },
  {
    id: "q9",
    question: "Do you ship outside Canada?",
    answer:
      "Yes. International orders ship insured. Duties and taxes, if any, are the buyer's responsibility and depend on where you live.",
  },
];
