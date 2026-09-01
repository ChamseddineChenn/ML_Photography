export type JournalEntry = {
  slug: string;
  meta: string;
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  paragraphs: string[];
};

export const JOURNAL = {
  kicker: "Journal",
  title: "Notes from the waiting",
  lede: "Most of the job is standing still in the dark. These are the nights that were worth it.",
};

/** Full journal index. Landing preview shows the first entry only. */
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: "one-strike",
    meta: "JOURNAL 01 / SHOT FROM A BALCONY",
    title: "Twelve minutes of nothing, then one strike",
    src: "/assets/night/one-strike-poster.jpg",
    alt: "A dark city skyline at night with lightning showing inside cloud beside a balcony railing.",
    width: 720,
    height: 1280,
    paragraphs: [
      "The camera sat on the balcony rail for a long time before anything happened. Down below the city kept all its lights on like nothing was coming.",
      "The sky went purple twice and gave me nothing both times. Most of what I shot that night is a black rectangle, and that is normal. Lightning does not negotiate. There is no version of this where you get it on the first frame.",
      "Then the cloud opened somewhere behind the building and lit its own edge from the inside. It was finished before I registered that it had started.",
      "That is the whole job. You stand in the dark, you stay ready, and once in a while the light comes to you.",
    ],
  },
  {
    slug: "the-lamp",
    meta: "JOURNAL 02 / BLUE HOUR ON THE COAST",
    title: "Waiting until the lamp is the only warm thing left",
    src: "/assets/night/lamp.jpg",
    alt: "A small white lighthouse at blue hour, its lamp burning orange against a deep blue sky full of cloud.",
    width: 1200,
    height: 1800,
    paragraphs: [
      "Blue hour is short if you are careless and long if you arrive early. I got there while the sky was still undecided.",
      "The lighthouse does not change. You do. You wait until the orange is the only warm colour left in the frame and the blue has gone deep enough to hold it.",
      "Most of the frames from that evening are almost right. The keepers are the ones where the cloud still has weight and the lamp has not blown out.",
      "I do not chase sunsets for the colour. I chase the minute after, when the day has finished arguing and the night has not yet taken over.",
    ],
  },
  {
    slug: "medusa",
    meta: "JOURNAL 03 / DARK WATER",
    title: "It makes its own light",
    src: "/assets/night/medusa.jpg",
    alt: "A jellyfish glowing violet and blue in almost complete darkness.",
    width: 1600,
    height: 1067,
    paragraphs: [
      "You cannot light a jellyfish the way you light a leaf. It brings its own lamp, and your job is not to compete with it.",
      "Dark water is the room. Violet and blue are the subject. Everything else is noise.",
      "I shot until the shape went soft and then I stopped. The frame that stayed is the one where the glow still has an edge.",
    ],
  },
  {
    slug: "last-leaf-note",
    meta: "JOURNAL 04 / AFTER THE WIND",
    title: "One leaf on bright snow",
    src: "/assets/gallery/last-leaf.jpg",
    alt: "A single brown oak leaf lying on bright sunlit snow.",
    width: 1600,
    height: 1600,
    paragraphs: [
      "Close work is not a different practice. It is the same question asked from a shorter distance.",
      "The snow wanted to go white. The leaf wanted to disappear into brown. The photograph is the compromise where both still read.",
      "I walked past it twice before I put the bag down. That is usually the sign.",
    ],
  },
];

/** Landing section preview: first entry only. */
export const JOURNAL_PREVIEW = {
  ...JOURNAL,
  entries: JOURNAL_ENTRIES.slice(0, 1),
};

export function getEntry(slug: string) {
  return JOURNAL_ENTRIES.find((e) => e.slug === slug);
}

export function allEntrySlugs() {
  return JOURNAL_ENTRIES.map((e) => e.slug);
}
