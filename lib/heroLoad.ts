/** Beat image ready: downloaded and decodable. */
export function isBeatImgReady(img: HTMLImageElement | null | undefined): boolean {
  return !!img && img.complete && img.naturalWidth > 0;
}

export async function decodeBeatImg(img: HTMLImageElement): Promise<void> {
  if (!isBeatImgReady(img)) return;
  if (typeof img.decode === "function") {
    try {
      await img.decode();
    } catch {
      /* decode rejected — still painted if complete */
    }
  }
}

export function beatImgFromLayer(layer: HTMLDivElement | null): HTMLImageElement | null {
  const img = layer?.querySelector("img");
  return img instanceof HTMLImageElement ? img : null;
}

/** Poll until beat 0 is decoded or timeout (ms). */
export async function waitForBeatZero(
  getLayer: (i: number) => HTMLDivElement | null,
  timeoutMs = 3000
): Promise<boolean> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    const img = beatImgFromLayer(getLayer(0));
    if (isBeatImgReady(img)) {
      await decodeBeatImg(img!);
      return true;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  return isBeatImgReady(beatImgFromLayer(getLayer(0)));
}
