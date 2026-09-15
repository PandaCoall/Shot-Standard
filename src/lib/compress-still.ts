const MAX_EDGE = 1600;
const MAX_CHARS = 1_400_000;
const ACCEPT = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

export function isSupportedStill(file: File): boolean {
  if (ACCEPT.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".webp")
  );
}

export async function stillToDataUrl(file: File): Promise<string> {
  if (file.size > 18 * 1024 * 1024) {
    throw new Error("That still is too large. Use a JPEG or PNG under 15 MB.");
  }
  if (!isSupportedStill(file)) {
    throw new Error("Use a JPEG, PNG, or WebP still.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not read that still.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.86;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > MAX_CHARS && quality > 0.48) {
    quality -= 0.08;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  if (url.length > MAX_CHARS) {
    throw new Error("Could not compress that still enough. Try a simpler image.");
  }
  return url;
}

export async function stillToThumb(dataUrl: string, size = 160): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = size / Math.max(img.width, img.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.62);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that still."));
    img.src = src;
  });
}

export async function fetchExampleStill(): Promise<string> {
  const res = await fetch("/example-still.png");
  if (!res.ok) throw new Error("Example still is missing.");
  const blob = await res.blob();
  const file = new File([blob], "example-still.png", {
    type: blob.type || "image/png",
  });
  return stillToDataUrl(file);
}
