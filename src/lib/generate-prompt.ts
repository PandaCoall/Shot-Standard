import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { writePlateFromDataUrl } from "./write-plate";

const InputSchema = z.object({
  imageDataUrl: z.string().min(32).max(4_000_000),
});

type GenerateOk = { ok: true; prompt: string };
type GenerateErr = { ok: false; error: string };
export type GenerateResult = GenerateOk | GenerateErr;

export const generatePrompt = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<GenerateResult> => {
    const result = await writePlateFromDataUrl(data.imageDataUrl.trim());
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, prompt: result.plate };
  });
