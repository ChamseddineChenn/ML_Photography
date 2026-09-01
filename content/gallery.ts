export type GalleryShot = {
  slug: string;
  src: string;
  title: string;
  alt: string;
  sizes: string;
  span: "s2" | "s3" | "s4" | "";
  width: number;
  height: number;
  place?: string;
  story?: string;
  notes?: string;
};

export const GALLERY: GalleryShot[] = [
  {
    slug: "looking-up",
    src: "/assets/gallery/looking-up.jpg",
    title: "Looking up",
    alt: "Three glass office towers photographed from street level, converging into a clear teal sky.",
    sizes: "AVAILABLE 12x18 / 16x24 / 20x30",
    span: "s3",
    width: 1600,
    height: 2020,
    place: "Downtown, looking straight up",
    story:
      "Glass does the work if you stand in the right place. Three towers lean into one teal sky and the street noise disappears the moment you tip the camera.",
    notes: "Late morning. No filter. The colour is the building, not the grade.",
  },
  {
    slug: "the-avenue",
    src: "/assets/gallery/avenue.jpg",
    title: "The avenue",
    alt: "A gravel path running between two rows of old trees, with white grave markers on the grass to the right.",
    sizes: "AVAILABLE 12x18 / 16x24 / 20x30",
    span: "s3",
    width: 1600,
    height: 1067,
    place: "A long path between trees",
    story:
      "The path does the composition for you. Everything else is waiting for the light to sit on the gravel and leave the markers alone.",
    notes: "Soft overcast. The white stones stay quiet if you do not push the exposure.",
  },
  {
    slug: "the-wall",
    src: "/assets/gallery/the-wall.jpg",
    title: "The wall",
    alt: "A large mural of a face on the side of a building, filled with dense blue and black line drawings.",
    sizes: "AVAILABLE 12x18 / 16x24 / 20x30",
    span: "s2",
    width: 1600,
    height: 1404,
    place: "City wall",
    story:
      "Someone else made the face. I made the frame. Street work is often that simple: find the wall that already holds a photograph and stand where the light agrees.",
    notes: "Flat light. The drawing does the contrast.",
  },
  {
    slug: "church-in-tunisia",
    src: "/assets/gallery/church.jpg",
    title: "Church in Tunisia",
    alt: "A stone statue in a hooded robe with hands together, beside a pale church tower under a blue sky.",
    sizes: "AVAILABLE 12x18 / 16x24",
    span: "",
    width: 1373,
    height: 2441,
    place: "Tunisia",
    story:
      "Stone and sky, nothing clever. The hood does the shadow work and the tower keeps the vertical.",
    notes: "Hard noon light. Leave the blacks alone.",
  },
  {
    slug: "going-over",
    src: "/assets/gallery/going-over.jpg",
    title: "Going over",
    alt: "Green water sliding over the curved lip of Niagara Falls into rising mist.",
    sizes: "AVAILABLE 12x18 / 16x24",
    span: "s2",
    width: 1500,
    height: 1000,
    place: "Niagara",
    story:
      "The lip is the only line that matters. Green water, white mist, and the moment the river decides it is finished being a river.",
    notes: "Fast shutter. Protect the green.",
  },
  {
    slug: "one-drop",
    src: "/assets/gallery/one-drop.jpg",
    title: "One drop",
    alt: "A mute swan in profile against dark water, a single drop hanging from the tip of its beak.",
    sizes: "AVAILABLE 12x18 / 16x24",
    span: "s3",
    width: 1600,
    height: 1600,
    place: "Still water",
    story:
      "Most of the frames are almost right. This one kept the drop. That is the whole reason it exists.",
    notes: "Long lens. Dark water as negative space.",
  },
  {
    slug: "turkey-vulture",
    src: "/assets/gallery/vulture.jpg",
    title: "Turkey vulture",
    alt: "A turkey vulture gliding with wings fully spread in front of a tangle of bare winter branches.",
    sizes: "AVAILABLE 12x18 / 16x24",
    span: "s3",
    width: 1600,
    height: 1600,
    place: "Winter branches",
    story:
      "Wings open, branches tangled, one clean silhouette. Wildlife is patience with a shorter fuse than night work.",
    notes: "Overcast. Expose for the bird.",
  },
  {
    slug: "the-whole-column",
    src: "/assets/gallery/the-column.jpg",
    title: "The whole column",
    alt: "Niagara Falls seen from above, with a tall column of white mist rising out of the horseshoe.",
    sizes: "AVAILABLE 12x18 / 16x24",
    span: "s4",
    width: 1500,
    height: 1000,
    place: "Niagara from above",
    story:
      "From above, the falls become weather. The column of mist is the subject; the horseshoe is only the reason it exists.",
    notes: "Aerial angle. Keep the mist from clipping.",
  },
  {
    slug: "last-leaf",
    src: "/assets/gallery/last-leaf.jpg",
    title: "Last leaf",
    alt: "A single brown oak leaf lying on bright sunlit snow.",
    sizes: "AVAILABLE 12x18 / 16x24",
    span: "s2",
    width: 1600,
    height: 1600,
    place: "Snow, after the wind",
    story:
      "One leaf on bright snow. Close work and landscape are the same problem with different distances.",
    notes: "Low sun. Watch the speculars on the snow.",
  },
];

export function getShot(slug: string) {
  return GALLERY.find((s) => s.slug === slug);
}

export function allShotSlugs() {
  return GALLERY.map((s) => s.slug);
}

export const CLOSE_WORK = [
  {
    src: "/assets/close/kiwi.jpg",
    title: "Kiwi",
    meta: "GEL LIGHT / BLACK GROUND",
    alt: "A slice of kiwi fruit lit by pink and green light against a black background.",
    width: 1400,
    height: 2100,
    story:
      "A coloured gel and a black ground. The fruit does not need to look like breakfast. It needs to look like light.",
  },
  {
    src: "/assets/close/bloom.jpg",
    title: "Bloom",
    meta: "ONE LAMP / NOTHING ELSE",
    alt: "A pink water lily photographed close, glowing against near black.",
    width: 1400,
    height: 2100,
    story:
      "One lamp, nothing else. The pink holds if you refuse to fill the shadows.",
  },
  {
    src: "/assets/close/anemone.jpg",
    title: "Anemone",
    meta: "THROUGH GLASS / NO FLASH",
    alt: "A bright orange sea anemone open on dark rock underwater.",
    width: 1400,
    height: 933,
    story:
      "Through glass, no flash. Orange against dark rock is enough.",
  },
  {
    src: "/assets/close/after-rain.jpg",
    title: "After rain",
    meta: "MORNING / HANDHELD / VERY CLOSE",
    alt: "Water droplets sitting on a brown autumn leaf, each one catching gold light.",
    width: 1400,
    height: 933,
    story:
      "Morning, handheld, very close. Each droplet is its own little lens.",
  },
];

export const NIGHT = {
  lamp: {
    src: "/assets/night/lamp.jpg",
    title: "The lamp",
    meta: "BLUE HOUR / F2.8 / A LONG WAIT",
    alt: "A small white lighthouse at blue hour, its lamp burning orange against a deep blue sky full of cloud.",
    width: 1200,
    height: 1800,
    story:
      "Blue hour turns the sky into the subject and the lamp into the accent. Wait until the orange is the only warm thing left.",
  },
  items: [
    {
      src: "/assets/night/medusa.jpg",
      title: "Medusa",
      meta: "DARK WATER / IT MAKES ITS OWN LIGHT",
      alt: "A jellyfish glowing violet and blue in almost complete darkness.",
      width: 1600,
      height: 1067,
      crimson: false,
      story:
        "Dark water, and a subject that brings its own lamp. You do not light a jellyfish. You receive it.",
    },
    {
      src: "/assets/night/starry.jpg",
      title: "Starry night",
      meta: "NO MOON / THE ONLY TIME THIS IS VISIBLE",
      alt: "The Milky Way overhead, a crimson and teal band of stars filling the frame.",
      width: 1400,
      height: 2488,
      crimson: true,
      story:
        "No moon. The band only shows when the sky is honest enough to go black.",
    },
  ],
  video: {
    src: "/assets/night/one-strike.mp4",
    poster: "/assets/night/one-strike-poster.jpg",
    title: "One strike",
    meta: "SIX SECONDS / TWELVE MINUTES OF NOTHING BEFORE IT",
    story:
      "Twelve minutes of nothing, then six seconds. That is the exchange rate for lightning.",
  },
};
