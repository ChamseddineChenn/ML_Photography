export type PrintProduct = {
  kind: string;
  name: string;
  price: string;
  body: string;
  specs: string[];
  cta: string;
  product: string;
  stripeLink: string;
  lead?: boolean;
};

export const PRINTS: PrintProduct[] = [
  {
    kind: "01 / INSTANT",
    name: "The digital file",
    price: "$60 CAD",
    body: "The full resolution file, in your inbox the moment you pay. Print it as often as you like, at home or at any lab, for your own walls.",
    specs: [
      "UP TO 6000 x 4000 PX",
      "SHARP TO 20 x 13 IN AT 300 DPI",
      "JPEG, QUALITY 100, NO SECOND SAVE",
      "sRGB AND ADOBE RGB BOTH INCLUDED",
    ],
    cta: "Buy the file",
    product: "The digital file",
    stripeLink: "",
  },
  {
    kind: "02 / SIGNED",
    name: "The signed print",
    price: "from $295 CAD",
    body: "Printed on cotton rag, signed and numbered on the back in my own hand, rolled in a rigid tube with corner guards.",
    specs: [
      "12 x 18 IN  $295",
      "16 x 24 IN  $450",
      "20 x 30 IN  $680",
      "ARCHIVAL PIGMENT ON COTTON RAG",
    ],
    cta: "Buy a print",
    product: "The signed print",
    stripeLink: "",
    lead: true,
  },
  {
    kind: "03 / EDITION OF 25",
    name: "The large edition",
    price: "$1,250 CAD",
    body: "One of twenty five, at thirty by forty five inches. Signed, numbered, and sent with a certificate written by hand. When the twenty five are gone the edition closes.",
    specs: ["30 x 45 IN", "EDITION OF 25", "CERTIFICATE INCLUDED"],
    cta: "Reserve one",
    product: "The large edition",
    stripeLink: "",
  },
];

export const PROMISES = [
  "It ships insured, in a rigid tube, with corner guards.",
  "If it arrives damaged, send me a photo and I make it again.",
  "Thirty days. If it is wrong for the room, send it back and I refund it.",
];

export const STEPS = [
  {
    no: "01",
    title: "Pick the photograph.",
    body: "Anything in the gallery, or anything in the journey at the top. If you want something you saw and cannot find, ask me.",
    detail:
      "Browse the full gallery, the night work, or the close studies. Click any photograph to see it large, then bring it through to the shop. If you cannot find a frame you remember from the landing journey, write to me with what you remember.",
    src: "/assets/steps/step-1.jpg",
    alt: "A boardwalk path curving away between tall trees.",
  },
  {
    no: "02",
    title: "Pick the size.",
    body: "Three print sizes, one large edition, or just the file. If you are unsure, tell me the wall and I will tell you which one fits it.",
    detail:
      "The digital file is instant. The signed print starts at twelve by eighteen. The large edition is thirty by forty five, twenty five only. Unsure? Measure the wall, or send a phone photo of the room.",
    src: "/assets/steps/step-2.jpg",
    alt: "A single oak leaf resting on sunlit snow.",
  },
  {
    no: "03",
    title: "I make it and send it.",
    body: "Files arrive instantly. Prints take five to seven days to make and proof, then they post from Canada with tracking.",
    detail:
      "I pick the paper, I check the proof, I sign it, and I put it in the box. Dark photographs get a paper chosen for shadow depth. Everything ships insured.",
    src: "/assets/steps/step-3.jpg",
    alt: "Water droplets on a leaf, each catching the light.",
  },
];
