/** Ambient beds for cinematic beats — paths under /public. */
export const BEAT_AMBIENT = [
  "/assets/hero/ambient/beat-0.mp3", // field
  "/assets/hero/ambient/beat-1.mp3", // falls
  "/assets/hero/ambient/beat-2.mp3", // badlands
  "/assets/hero/ambient/beat-3.mp3", // fog railway
  "/assets/hero/ambient/beat-4.mp3", // forest path
  "/assets/hero/ambient/beat-5.mp3", // macro droplets
  "/assets/hero/ambient/beat-6.mp3", // lake
  "/assets/hero/ambient/beat-7.mp3", // dusk
] as const;

/** Per-beat gain after loudnorm — keep waterfall quieter, droplets a touch up. */
export const BEAT_AMBIENT_GAIN = [1, 0.72, 0.95, 0.9, 1, 1.15, 0.95, 0.85] as const;

/** Overall bed level (~−9 dB vs full HTMLAudio). */
export const AMBIENT_MASTER_GAIN = 0.35;

export const AMBIENT_MUTE_KEY = "ml-ambient-muted";
