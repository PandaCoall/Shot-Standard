import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as parsePlate, i as buildUserPrompt, n as assemblePlate, r as buildSystemPrompt, s as stripFences } from "./parse-prompt-DctMrUnl.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-prompt-CTRoNZPg.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var InputSchema = object({ imageDataUrl: string().min(32).max(2e6) });
var INSTRUCTION_LINE = /^(describe the |describe exactly |describe shot |describe where |describe source |describe the visual |describe speed |describe dialogue |list the things that must remain)/i;
function stripInstructionLeak(text) {
	return text.split("\n").filter((line) => !INSTRUCTION_LINE.test(line.trim())).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
function friendlyStatus(status) {
	if (status === 401 || status === 403) return "Grok is not available in this environment.";
	if (status === 429) return "The desk is busy. Wait a moment and write again.";
	if (status >= 500) return "Grok had a server hitch. Try once more.";
	return `Grok returned ${status}. Try again.`;
}
var generatePrompt_createServerFn_handler = createServerRpc({
	id: "ae0b66bc00cda576a80e03abb5ceaab9ac189b8280d56d030ca6f8306bf252f0",
	name: "generatePrompt",
	filename: "src/lib/generate-prompt.ts"
}, (opts) => generatePrompt.__executeServer(opts));
var generatePrompt = createServerFn({ method: "POST" }).validator((input) => InputSchema.parse(input)).handler(generatePrompt_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) return {
		ok: false,
		error: "Grok is not available in this environment."
	};
	const image = data.imageDataUrl.trim();
	if (!image.startsWith("data:image/")) return {
		ok: false,
		error: "That still could not be read."
	};
	const body = {
		model: "grok-4.5",
		reasoning_effort: "low",
		max_tokens: 4e3,
		temperature: .35,
		messages: [{
			role: "system",
			content: buildSystemPrompt()
		}, {
			role: "user",
			content: [{
				type: "image_url",
				image_url: {
					url: image,
					detail: "high"
				}
			}, {
				type: "text",
				text: buildUserPrompt()
			}]
		}]
	};
	let res;
	try {
		res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(9e4)
		});
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError") ? "Grok took too long. Try again with a smaller still." : "Could not reach Grok. Check the connection and retry."
		};
	}
	if (!res.ok) return {
		ok: false,
		error: friendlyStatus(res.status)
	};
	const content = (await res.json()).choices?.[0]?.message?.content;
	if (!content || !content.trim()) return {
		ok: false,
		error: "Grok returned an empty plate. Try again."
	};
	const raw = stripInstructionLeak(stripFences(content));
	const parsed = parsePlate(raw);
	return {
		ok: true,
		prompt: parsed.sections.length > 0 ? stripInstructionLeak(assemblePlate(parsed.sections)) : raw
	};
});
//#endregion
export { generatePrompt_createServerFn_handler };
