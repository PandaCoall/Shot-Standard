import { buildSystemPrompt, buildUserPrompt } from "./prompt-standard";
import { assemblePlate, parsePlate, stripFences } from "./parse-prompt";

export type WritePlateOk = { ok: true; plate: string };
export type WritePlateErr = { ok: false; error: string; status: number };
export type WritePlateResult = WritePlateOk | WritePlateErr;

const INSTRUCTION_LINE =
  /^(describe the |describe exactly |describe shot |describe where |describe source |describe the visual |describe speed |describe dialogue |list the things that must remain)/i;

function stripInstructionLeak(text: string): string {
  return text
    .split("\n")
    .filter((line) => !INSTRUCTION_LINE.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function friendlyStatus(status: number): string {
  if (status === 401 || status === 403) {
    return "Grok is not available in this environment.";
  }
  if (status === 429) return "The desk is busy. Wait a moment and write again.";
  if (status >= 500) return "Grok had a server hitch. Try once more.";
  return `Grok returned ${status}. Try again.`;
}

function guessMime(bytes: Uint8Array): string {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return "image/jpeg";
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function stillToDataUrl(input: {
  image?: string;
  imageUrl?: string;
}): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string; status: number }> {
  const raw = input.image?.trim();
  if (raw) {
    if (raw.startsWith("data:image/")) {
      if (raw.length > 4_000_000) {
        return { ok: false, error: "Still is too large. Keep it under 3 MB.", status: 413 };
      }
      return { ok: true, dataUrl: raw };
    }
    const compact = raw.replace(/\s/g, "");
    if (/^[A-Za-z0-9+/]+=*$/.test(compact) && compact.length > 80) {
      const dataUrl = `data:image/jpeg;base64,${compact}`;
      if (dataUrl.length > 4_000_000) {
        return { ok: false, error: "Still is too large. Keep it under 3 MB.", status: 413 };
      }
      return { ok: true, dataUrl };
    }
    return { ok: false, error: "image must be a data URL or raw base64.", status: 400 };
  }

  const url = input.imageUrl?.trim();
  if (!url) {
    return {
      ok: false,
      error: "Send image (data URL or base64) or imageUrl (https).",
      status: 400,
    };
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "imageUrl is not a valid URL.", status: 400 };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: "imageUrl must be http or https.", status: 400 };
  }

  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  } catch {
    return { ok: false, error: "Could not fetch imageUrl.", status: 400 };
  }
  if (!res.ok) {
    return { ok: false, error: `Could not fetch imageUrl (${res.status}).`, status: 400 };
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength > 3_000_000) {
    return { ok: false, error: "Remote still is too large. Keep it under 3 MB.", status: 413 };
  }
  const mimeHeader = res.headers.get("content-type")?.split(";")[0]?.trim();
  const mime =
    mimeHeader && mimeHeader.startsWith("image/") ? mimeHeader : guessMime(buf);
  return { ok: true, dataUrl: `data:${mime};base64,${toBase64(buf)}` };
}

export async function writePlateFromDataUrl(
  imageDataUrl: string,
): Promise<WritePlateResult> {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: "Grok is not available in this environment.",
      status: 503,
    };
  }
  if (!imageDataUrl.startsWith("data:image/")) {
    return { ok: false, error: "That still could not be read.", status: 400 };
  }

  const body = {
    model: "grok-4.5",
    reasoning_effort: "low",
    max_tokens: 4000,
    temperature: 0.35,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: imageDataUrl, detail: "high" },
          },
          { type: "text", text: buildUserPrompt() },
        ],
      },
    ],
  };

  let res: Response;
  try {
    res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
  } catch (err) {
    const timedOut =
      err instanceof Error &&
      (err.name === "TimeoutError" || err.name === "AbortError");
    return {
      ok: false,
      status: timedOut ? 504 : 502,
      error: timedOut
        ? "Grok took too long. Try again with a smaller still."
        : "Could not reach Grok. Check the connection and retry.",
    };
  }

  if (!res.ok) {
    return { ok: false, error: friendlyStatus(res.status), status: res.status };
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    return { ok: false, error: "Grok returned an empty plate. Try again.", status: 502 };
  }

  const raw = stripInstructionLeak(stripFences(content));
  const parsed = parsePlate(raw);
  const plate =
    parsed.sections.length > 0
      ? stripInstructionLeak(assemblePlate(parsed.sections))
      : raw;

  return { ok: true, plate };
}
