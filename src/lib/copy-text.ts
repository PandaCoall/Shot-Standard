/**
 * Copy text while a click is still a user gesture.
 * `navigator.clipboard` is often blocked in cross-origin preview iframes;
 * execCommand must run *before* any await or the gesture is spent.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  if (copyWithExecCommand(text)) return true;

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

function copyWithExecCommand(text: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.setAttribute("aria-hidden", "true");
  el.tabIndex = -1;
  el.style.cssText =
    "position:fixed;top:0;left:0;width:2px;height:2px;padding:0;margin:0;border:none;outline:none;box-shadow:none;background:transparent;opacity:0.01;z-index:-1;";
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(el);
  return ok;
}
