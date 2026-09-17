export const SECTION_ORDER = [
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
  "SUBTITLES",
] as const;

export type SectionName = (typeof SECTION_ORDER)[number];

export function sectionMarker(name: SectionName | string): string {
  return `[${name}]`;
}

export const GOLD_STANDARD_EXAMPLE = `[SCENE]
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

export function buildSystemPrompt(): string {
  const markers = SECTION_ORDER.map((name) => sectionMarker(name)).join("\n");
  return `You are a specialist cinematographer-writer for MiniMax video generation.

You are given ONE still. Treat the GOLD-STANDARD EXAMPLE as the sample of craft — density, structure, and how to watch a freeze-frame — not as facts to copy unless this still is that same photograph.

Look at this still with discretion. Describe what is actually happening: who is there, how they look, the pose, the gesture, what they are doing in this instant, and the natural next beats of that action. Infer only motion that could continue from this freeze-frame. Do not invent a different story, person, location, or prop.

OUTPUT RULES
- Output ONLY the plate. No preamble, no markdown, no title.
- Every heading is a square-bracket marker on its own line. Never write SCENE: or “Describe the location”. Write [SCENE], then only the content.
- Markers in this exact order:

${markers}

- Do not copy helper instructions such as “Describe the location, time and overall visual situation.” Those are not the plate.
- Present tense. Concrete. Name materials, colors, garments, positions, gestures, textures, weather, and any readable text.
- Do not invent props, wardrobe, signage, or locations that are not in the still.
- [SCENE] dense place, time of day, weather, overall visual situation as seen.
- [SUBJECT] first line is exactly one of [Man] [Woman] [Child] [Officer]. Then a long description of appearance AND what they are doing right now: age, hair, skin, clothes, hands, pose, expression, gesture, where they stand relative to camera and other objects.
- [ACTION] chronological beats grounded in the pose, then the natural next motion. Be specific (points at the sign, turns the head, mouth opens to speak, weight shifts).
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

GOLD-STANDARD EXAMPLE (sample of craft):
${GOLD_STANDARD_EXAMPLE}`;
}

export function buildUserPrompt(): string {
  return "Look at this still. Using the gold-standard sample as your writing craft, describe in detail what is happening — the person, their appearance, their pose, and their actions — then the natural next motion. Fill every MiniMax marker. Do not copy the sample's house, sign, or man unless they are actually in THIS still.";
}

export const DEFAULT_STANDARD = GOLD_STANDARD_EXAMPLE;
