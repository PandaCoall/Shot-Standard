import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-standard";
import { parsePlate, assemblePlate, stripFences } from "./parse-prompt";

const InputSchema = z.object({
  imageDataUrl: z.string().min(32).max(2_000_000),
});

type GenerateOk = { ok: true; prompt: string };
type GenerateErr = { ok: false; error: string };
export type GenerateResult = GenerateOk | GenerateErr;

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

export const generatePrompt = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) {
      return { ok: false, error: "Grok is not available in this environment." };
    }

    const image = data.imageDataUrl.trim();
    if (!image.startsWith("data:image/")) {
      return { ok: false, error: "That still could not be read." };
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
              image_url: { url: image, detail: "high" },
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
        error: timedOut
          ? "Grok took too long. Try again with a smaller still."
          : "Could not reach Grok. Check the connection and retry.",
      };
    }

    if (!res.ok) {
      return { ok: false, error: friendlyStatus(res.status) };
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content || !content.trim()) {
      return { ok: false, error: "Grok returned an empty plate. Try again." };
    }

    const raw = stripInstructionLeak(stripFences(content));
    const parsed = parsePlate(raw);
    const prompt =
      parsed.sections.length > 0
        ? stripInstructionLeak(assemblePlate(parsed.sections))
        : raw;

    return { ok: true, prompt };
  });
