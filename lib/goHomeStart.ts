export const HOME_RESTART_EVENT = "ml-restart-home";

/** Scroll to the top and remount the cinematic at the gate. */
export function goHomeStart(pathname: string) {
  if (pathname !== "/") {
    window.location.assign("/");
    return;
  }
  window.scrollTo(0, 0);
  window.dispatchEvent(new Event(HOME_RESTART_EVENT));
}
