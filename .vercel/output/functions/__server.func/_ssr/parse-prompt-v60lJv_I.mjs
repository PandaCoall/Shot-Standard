//#region node_modules/.nitro/vite/services/ssr/assets/parse-prompt-v60lJv_I.js
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
var SUBJECT_KINDS = [
	"auto",
	"man",
	"woman",
	"child",
	"officer"
];
var SUBJECT_LABELS = {
	auto: "Auto",
	man: "Man",
	woman: "Woman",
	child: "Child",
	officer: "Officer"
};
var DEFAULT_STANDARD = `MINI MAX PROMPT STANDARD

SCENE:
Describe the location, time and overall visual situation.

SUBJECT:
Describe the main character/object and anything that must remain consistent.
[Man]
[Woman]
[Child]
[Officer]

ACTION:
Describe exactly what happens during the shot, in chronological order.

CAMERA:
Describe shot size, lens perspective, camera position and movement.

COMPOSITION:
Describe where the important elements sit in the frame.

LIGHTING:
Describe source, direction, quality and color.

STYLE:
Describe the visual language, realism, film/photography reference,
color treatment and texture.

MOTION & PACING:
Describe speed, physical movement and rhythm.

AUDIO:
Describe dialogue, ambience, sound effects and/or music.

IMPORTANT:
List the things that must remain consistent or must not change.

DIALOGUE:
Character: Woman
Exact dialogue: "We need to leave before sunrise."
Delivery: quiet, tense, whispered.

SUBTITLES:
Display the exact spoken dialogue as subtitles.
White sans-serif text, subtle black outline.
Bottom-center placement.
Synchronize precisely with the spoken words.
Do not alter, paraphrase, or add text.`;
var GOLD_STANDARD_EXAMPLE = `SCENE:
Daytime exterior in front of a heavily dilapidated two-story house. The house has peeling paint, broken and boarded-up windows, and an overgrown yard covered in dry leaves. A rusty “SOLD FOR SALE” real-estate sign stands in the foreground.

SUBJECT:
[Man]
A middle-aged man with short light-brown hair, wearing a black zip-up jacket. He stands close to camera, smiling broadly with teeth showing, and points directly at the “SOLD FOR SALE” sign with his right index finger. His expression is exaggerated and energetic.

ACTION:
The man looks straight into the camera, smiles widely, then raises his right hand and points firmly at the real-estate sign. He holds the pointing gesture while continuing to speak with animated facial movement. His head nods slightly for emphasis.

CAMERA:
Natural phone camera aesthetic. It must look as if it was shot on a phone camera, not professionally. Soft focus, visible digital noise, slight compression, uneven outdoor lighting. The background must also be visible, not blurred. Medium close-up with a slow, steady zoom-in. Subtle handheld micro-movement.

COMPOSITION:
Man occupies the left and center of the frame. The dilapidated house fills the background. The “SOLD FOR SALE” sign sits in the mid-right. On-screen text “JUST TO SELL” is placed in the lower third.

LIGHTING:
Natural overcast daylight. Soft, flat illumination with no strong highlights or deep shadows. Cool, slightly muted outdoor color.

STYLE:
Raw vertical social-media / phone-video look. High contrast graphic text overlays. Slightly desaturated real-world colors with visible phone-camera texture and mild compression.

MOTION & PACING:
Moderate energy. The man’s pointing gesture and head movements are clear but natural. Slow continuous zoom-in throughout the shot. Overall pacing feels direct and punchy.

AUDIO:
Clear spoken voice with natural outdoor ambience (light wind, distant quiet). No music bed unless specified.

IMPORTANT:
Keep the man’s face, hair, black jacket, and exaggerated smile consistent.
Keep the dilapidated house and rusty “SOLD FOR SALE” sign exactly as shown.
Maintain the exact phone-camera aesthetic (no cinematic polish, no heavy background blur).
Do not change the on-screen text style.

DIALOGUE:
Character: Man
Exact dialogue: “Just to sell.”
Delivery: Energetic, slightly exaggerated, direct to camera.

SUBTITLES:
Display the exact spoken dialogue as subtitles.
Use the same bold, heavy-weight style as the on-screen text “JUST TO SELL” in the reference image: white lettering with strong red highlight on the key word, solid presence, high contrast.
Bottom-center placement.
Synchronize precisely with the spoken words.
Do not alter, paraphrase, or add text.`;
function buildSystemPrompt(standard) {
	return `You are a specialist cinematographer-writer for MiniMax video generation.

Your job: look at ONE still image and write a MiniMax prompt plate that a video model can follow to animate that exact still. The plate must be specific enough that face, wardrobe, location, props, on-screen text, and camera language stay locked to the photograph.

OUTPUT RULES
- Output ONLY the plate. No preamble, no markdown fences, no commentary, no title line such as "MINI MAX PROMPT STANDARD".
- Use these section headers EXACTLY, each on its own line, followed by the body. Keep this order:

SCENE:
SUBJECT:
ACTION:
CAMERA:
COMPOSITION:
LIGHTING:
STYLE:
MOTION & PACING:
AUDIO:
IMPORTANT:
DIALOGUE:
SUBTITLES:

- Write in present tense, concrete visual language. Name materials, colors, garments, positions, gestures, and surface texture.
- Do not invent props, wardrobe, signage, or locations that are not in the still. Infer only the motion that could naturally continue from this freeze-frame.
- CAMERA: if the still looks like a phone selfie / social clip, specify a natural phone-camera aesthetic (visible noise, mild compression, background NOT blurred, subtle handheld). If it clearly looks cinematic or professional, describe that instead — match the still.
- SUBJECT must begin with exactly one tag on its own line: [Man], [Woman], [Child], or [Officer]. Then describe the person/object in enough detail to stay consistent across frames (age, hair, skin, clothes, expression, pose).
- Transcribe any on-screen text, logos, or signage EXACTLY. Describe typography, color, and placement in COMPOSITION and, when relevant, SUBTITLES.
- IMPORTANT must list what must remain identical to the still (face, hair, clothes, location, props, text, camera aesthetic).
- DIALOGUE always uses three labeled lines:
  Character:
  Exact dialogue:
  Delivery:
  If the operator supplied dialogue, use it verbatim — do not paraphrase. If not, infer a short line that matches visible mouth shape, on-screen text, or scene energy. If the still is silent with no text, write Exact dialogue: none.
- SUBTITLES: if dialogue exists, display that exact spoken line. Match any on-screen text style in the still (weight, color highlights, outline). Default: white sans-serif, subtle black outline, bottom-center, synced, no extra text.
- Density and specificity must match the gold-standard example. Short, punchy sentences. No film-school waffle. No "the image shows". Never mention being an AI.

GOLD-STANDARD EXAMPLE (match this voice and granularity):
${GOLD_STANDARD_EXAMPLE}

OPERATOR TEMPLATE (honor this structure and any custom notes in it):
${standard}`;
}
function buildUserPrompt(input) {
	const lines = [
		"Write the MiniMax prompt plate for this still.",
		"",
		`Subject override: ${input.subject === "auto" ? "auto — decide [Man] / [Woman] / [Child] / [Officer] from the still" : `[${SUBJECT_LABELS[input.subject]}]`}`
	];
	if (input.character?.trim()) lines.push(`Character name: ${input.character.trim()}`);
	if (input.dialogue?.trim()) lines.push(`Exact dialogue (use verbatim): "${input.dialogue.trim()}"`);
	if (input.delivery?.trim()) lines.push(`Delivery: ${input.delivery.trim()}`);
	if (input.notes?.trim()) lines.push(`Extra notes from the operator: ${input.notes.trim()}`);
	return lines.join("\n");
}
var HEADER_RE = new RegExp(`^(${SECTION_ORDER.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):\\s*$`, "i");
function stripFences(raw) {
	let text = raw.trim();
	if (text.startsWith("```")) text = text.replace(/^```(?:[\w-]+)?\s*/, "").replace(/\s*```$/, "");
	text = text.replace(/^MINI\s*MAX\s*PROMPT\s*STANDARD\s*/i, "");
	return text.trim();
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
			current = SECTION_ORDER.find((s) => s.toLowerCase() === match[1].toLowerCase()) ?? null;
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
//#endregion
export { buildSystemPrompt as a, stripFences as c, SUBJECT_LABELS as i, SECTION_ORDER as n, buildUserPrompt as o, SUBJECT_KINDS as r, parsePlate as s, DEFAULT_STANDARD as t };
