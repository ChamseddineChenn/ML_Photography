/** Deterministic PRNG for scatter offsets so SSR and client match. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export type SplitOpts = {
  blur?: boolean;
  charOrdered?: boolean;
  emphasis?: number[];
  spread?: number;
};

export type SplitChar = {
  ch: string;
  th: string;
  jx: string;
  jy: string;
  jr: string;
};

export type SplitWord = {
  chars: SplitChar[];
  th: string;
  em: boolean;
};

export type SplitResult = {
  text: string;
  words: SplitWord[];
  blur: boolean;
};

export function splitHeadline(
  text: string,
  seed: number,
  opts: SplitOpts = {}
): SplitResult {
  const words = text.trim().split(/\s+/);
  const r = rng(seed);
  const spread = opts.spread ?? 0.45;
  const totalChars = text.replace(/\s+/g, "").length;
  let charIndex = 0;

  const out: SplitWord[] = words.map((word, wi) => {
    const em = !!opts.emphasis?.includes(wi);
    const th = ((wi / Math.max(1, words.length - 1)) * spread).toFixed(3);
    const chars: SplitChar[] = [];
    for (let ci = 0; ci < word.length; ci++) {
      const charTh = opts.charOrdered
        ? (charIndex / Math.max(1, totalChars) * spread + r() * 0.06).toFixed(3)
        : (r() * 0.55).toFixed(3);
      chars.push({
        ch: word[ci],
        th: charTh,
        jx: ((r() - 0.5) * 90).toFixed(1) + "px",
        jy: ((r() - 0.5) * 70).toFixed(1) + "px",
        jr: ((r() - 0.5) * 34).toFixed(1) + "deg",
      });
      charIndex++;
    }
    return { chars, th, em };
  });

  return { text, words: out, blur: !!opts.blur };
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

export function smoothstep(p: number, e0: number, e1: number) {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
