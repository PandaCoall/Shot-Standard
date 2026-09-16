//#region node_modules/.nitro/vite/services/ssr/assets/write-plate-DaED1JwI.js
var SECTION_ORDER = [
	"SCENE",
	"SUBJECT",
	"ACTION",
	"CAMERA",
	"COMPOSITION",
	"LIGHTING",
	"STYLE",
	"MOTION & PACING",
	"AUDIO",
	"IMPORTANT",
	"DIALOGUE",
	"SUBTITLES"
];
function sectionMarker(name) {
	return `[${name}]`;
}
var GOLD_STANDARD_EXAMPLE = `[SCENE]
Daytime exterior in front of a heavily dilapidated two-story house. The house has peeling paint, broken and boarded-up windows, and an overgrown yard covered in dry leaves. A rusty “SOLD FOR SALE” real-estate sign stands in the foreground.

[SUBJECT]
[Man]
A middle-aged man with short light-brown hair, wearing a black zip-up jacket. He stands close to camera, smiling broadly with teeth showing, and points directly at the “SOLD FOR SALE” sign with his right index finger. His expression is exaggerated and energetic.

[ACTION]
The man looks straight into the camera, smiles widely, then raises his right hand and points firmly at the real-estate sign. He holds the pointing gesture while continuing to speak with animated facial movement. His head nods slightly for emphasis.

[CAMERA]
Natural phone camera aesthetic. It must look as if it was shot on a phone camera, not professionally. Soft focus, visible digital noise, slight compression, uneven outdoor lighting. The background must also be visible, not blurred. Medium close-up with a slow, steady zoom-in. Subtle handheld micro-movement.

[COMPOSITION]
Man occupies the left and center of the frame. The dilapidated house fills the background. The “SOLD FOR SALE” sign sits in the mid-right. On-screen text “JUST TO SELL” is placed in the lower third.

[LIGHTING]
Natural overcast daylight. Soft, flat illumination with no strong highlights or deep shadows. Cool, slightly muted outdoor color.

[STYLE]
Raw vertical social-media / phone-video look. High contrast graphic text overlays. Slightly desaturated real-world colors with visible phone-camera texture and mild compression.

[MOTION & PACING]
Moderate energy. The man’s pointing gesture and head movements are clear but natural. Slow continuous zoom-in throughout the shot. Overall pacing feels direct and punchy.

[AUDIO]
Clear spoken voice with natural outdoor ambience (light wind, distant quiet). No music bed unless specified.

[IMPORTANT]
Keep the man’s face, hair, black jacket, and exaggerated smile consistent.
Keep the dilapidated house and rusty “SOLD FOR SALE” sign exactly as shown.
Maintain the exact phone-camera aesthetic (no cinematic polish, no heavy background blur).
Do not change the on-screen text style.

[DIALOGUE]
Character: Man
Exact dialogue: “Just to sell.”
Delivery: Energetic, slightly exaggerated, direct to camera.

[SUBTITLES]
Display the exact spoken dialogue as subtitles.
Use the same bold, heavy-weight style as the on-screen text “JUST TO SELL” in the reference image: white lettering with strong red highlight on the key word, solid presence, high contrast.
Bottom-center placement.
Synchronize precisely with the spoken words.
Do not alter, paraphrase, or add text.`;
function buildSystemPrompt() {
	return `You are a specialist cinematographer-writer for MiniMax video generation.

Look at ONE still and write a MiniMax plate that a video model can follow to animate that exact freeze-frame. Be very detailed. Lock face, wardrobe, location, props, on-screen text, and camera language to what is actually in the photograph.

OUTPUT RULES
- Output ONLY the plate. No preamble, no markdown, no title.
- Every heading is a square-bracket marker on its own line. Never write SCENE: or “Describe the location”. Write [SCENE], then only the content.
- Markers in this exact order:

${SECTION_ORDER.map((name) => sectionMarker(name)).join("\n")}

- Do not copy helper instructions such as “Describe the location, time and overall visual situation.” Those are not the plate.
- Present tense. Concrete. Name materials, colors, garments, positions, gestures, textures, weather, and any readable text.
- Do not invent props, wardrobe, signage, or locations that are not in the still. Infer only the motion that could continue from this freeze-frame.
- [SCENE] is a dense description of place, time of day, weather, and the overall visual situation.
- [SUBJECT] first line is exactly one of [Man] [Woman] [Child] [Officer]. Then a long description of appearance AND what they are doing: age, hair, skin, clothes, hands, pose, expression, gesture, where they stand relative to camera and other objects.
- [ACTION] chronological beats grounded in the pose, then the natural next motion.
- [CAMERA] match the still. If it looks like a phone / social clip: phone-camera aesthetic, visible noise, mild compression, background NOT blurred, subtle handheld. If cinematic, describe that instead.
- [COMPOSITION] where subject, background, props, and on-screen text sit.
- [LIGHTING] source, direction, quality, color.
- [STYLE] visual language from the still.
- [MOTION & PACING] speed, physical movement, rhythm.
- [AUDIO] voice and ambience. No music unless the still implies it.
- [IMPORTANT] consistency locks from the still only.
- [DIALOGUE] three lines:
  Character:
  Exact dialogue:
  Delivery:
  Infer a short line from mouth shape, on-screen text, or scene energy. If silent with no text: Exact dialogue: none.
- [SUBTITLES] how to show that exact line. Match on-screen text style if present. If none: No spoken dialogue. Do not add subtitles.
- Density must match or exceed the gold-standard example. Never write “the image shows”. Never mention being an AI.

GOLD-STANDARD EXAMPLE:
${GOLD_STANDARD_EXAMPLE}`;
}
function buildUserPrompt() {
	return "Write the MiniMax plate for this still. Describe in detail what is happening. [SUBJECT] must include appearance and the person’s actions. Use [SCENE] style markers only — no instruction sentences under the headings.";
}
var NAME_ALT = SECTION_ORDER.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
var HEADER_RE = new RegExp(`^(?:\\[(${NAME_ALT})\\]|(${NAME_ALT}):)\\s*$`, "i");
function stripFences(raw) {
	let text = raw.trim();
	if (text.startsWith("```")) text = text.replace(/^```(?:[\w-]+)?\s*/, "").replace(/\s*```$/, "");
	text = text.replace(/^MINI\s*MAX\s*PROMPT\s*STANDARD\s*/i, "");
	return text.trim();
}
function resolveHeader(match) {
	const raw = match[1] ?? match[2];
	if (!raw) return null;
	return SECTION_ORDER.find((s) => s.toLowerCase() === raw.toLowerCase()) ?? null;
}
function parsePlate(raw) {
	const text = stripFences(raw);
	const lines = text.split(/\r?\n/);
	const sections = [];
	let current = null;
	let buf = [];
	const flush = () => {
		if (!current) return;
		sections.push({
			name: current,
			body: buf.join("\n").trim()
		});
		buf = [];
	};
	for (const line of lines) {
		const match = line.trim().match(HEADER_RE);
		if (match) {
			flush();
			current = resolveHeader(match);
			continue;
		}
		if (current) buf.push(line);
	}
	flush();
	return {
		sections,
		text
	};
}
function assemblePlate(sections) {
	return sections.map((s) => `${sectionMarker(s.name)}\n${s.body}`.trim()).join("\n\n");
}
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
function guessMime(bytes) {
	if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
	if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return "image/png";
	if (bytes.length >= 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) return "image/webp";
	return "image/jpeg";
}
function toBase64(bytes) {
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
async function stillToDataUrl(input) {
	const raw = input.image?.trim();
	if (raw) {
		if (raw.startsWith("data:image/")) {
			if (raw.length > 4e6) return {
				ok: false,
				error: "Still is too large. Keep it under 3 MB.",
				status: 413
			};
			return {
				ok: true,
				dataUrl: raw
			};
		}
		const compact = raw.replace(/\s/g, "");
		if (/^[A-Za-z0-9+/]+=*$/.test(compact) && compact.length > 80) {
			const dataUrl = `data:image/jpeg;base64,${compact}`;
			if (dataUrl.length > 4e6) return {
				ok: false,
				error: "Still is too large. Keep it under 3 MB.",
				status: 413
			};
			return {
				ok: true,
				dataUrl
			};
		}
		return {
			ok: false,
			error: "image must be a data URL or raw base64.",
			status: 400
		};
	}
	const url = input.imageUrl?.trim();
	if (!url) return {
		ok: false,
		error: "Send image (data URL or base64) or imageUrl (https).",
		status: 400
	};
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return {
			ok: false,
			error: "imageUrl is not a valid URL.",
			status: 400
		};
	}
	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return {
		ok: false,
		error: "imageUrl must be http or https.",
		status: 400
	};
	let res;
	try {
		res = await fetch(url, { signal: AbortSignal.timeout(2e4) });
	} catch {
		return {
			ok: false,
			error: "Could not fetch imageUrl.",
			status: 400
		};
	}
	if (!res.ok) return {
		ok: false,
		error: `Could not fetch imageUrl (${res.status}).`,
		status: 400
	};
	const buf = new Uint8Array(await res.arrayBuffer());
	if (buf.byteLength > 3e6) return {
		ok: false,
		error: "Remote still is too large. Keep it under 3 MB.",
		status: 413
	};
	const mimeHeader = res.headers.get("content-type")?.split(";")[0]?.trim();
	return {
		ok: true,
		dataUrl: `data:${mimeHeader && mimeHeader.startsWith("image/") ? mimeHeader : guessMime(buf)};base64,${toBase64(buf)}`
	};
}
async function writePlateFromDataUrl(imageDataUrl) {
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) return {
		ok: false,
		error: "Grok is not available in this environment.",
		status: 503
	};
	if (!imageDataUrl.startsWith("data:image/")) return {
		ok: false,
		error: "That still could not be read.",
		status: 400
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
					url: imageDataUrl,
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
		const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
		return {
			ok: false,
			status: timedOut ? 504 : 502,
			error: timedOut ? "Grok took too long. Try again with a smaller still." : "Could not reach Grok. Check the connection and retry."
		};
	}
	if (!res.ok) return {
		ok: false,
		error: friendlyStatus(res.status),
		status: res.status
	};
	const content = (await res.json()).choices?.[0]?.message?.content;
	if (!content || !content.trim()) return {
		ok: false,
		error: "Grok returned an empty plate. Try again.",
		status: 502
	};
	const raw = stripInstructionLeak(stripFences(content));
	const parsed = parsePlate(raw);
	return {
		ok: true,
		plate: parsed.sections.length > 0 ? stripInstructionLeak(assemblePlate(parsed.sections)) : raw
	};
}
//#endregion
export { stillToDataUrl as a, sectionMarker as i, assemblePlate as n, writePlateFromDataUrl as o, parsePlate as r, SECTION_ORDER as t };
