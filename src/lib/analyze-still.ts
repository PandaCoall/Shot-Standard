import type { StillMetrics } from "./write-guide-plate";

export async function analyzeStill(dataUrl: string): Promise<StillMetrics | null> {
  if (typeof document === "undefined") return null;
  try {
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    const maxEdge = 96;
    const scale = maxEdge / Math.max(img.width, img.height);
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { width: img.width, height: img.height, brightness: 0.5, warmth: 0, saturation: 0.25, contrast: 0.18 };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let lumaSum = 0;
    let warmSum = 0;
    let satSum = 0;
    const lumas: number[] = [];
    const n = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]! / 255;
      const g = data[i + 1]! / 255;
      const b = data[i + 2]! / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumaSum += luma;
      lumas.push(luma);
      warmSum += r - b;
      satSum += max === 0 ? 0 : (max - min) / max;
    }
    lumas.sort((a, b) => a - b);
    const p10 = lumas[Math.floor(n * 0.1)] ?? 0;
    const p90 = lumas[Math.floor(n * 0.9)] ?? 1;
    return {
      width: img.width,
      height: img.height,
      brightness: lumaSum / n,
      warmth: warmSum / n,
      saturation: satSum / n,
      contrast: Math.max(0, p90 - p10),
    };
  } catch {
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that still."));
    img.src = src;
  });
}
