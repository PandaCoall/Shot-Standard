import { assemblePlate } from "./parse-prompt";
import { type SectionName } from "./prompt-standard";

export const SUBJECT_TAGS = ["Man", "Woman", "Child", "Officer"] as const;
export type SubjectTag = (typeof SUBJECT_TAGS)[number];

export type StillMetrics = {
  width: number;
  height: number;
  brightness: number;
  warmth: number;
  saturation: number;
  contrast: number;
};

type Voice = {
  noun: string;
  Noun: string;
  they: string;
  their: string;
  them: string;
  speak: string;
};

const VOICE: Record<SubjectTag, Voice> = {
  Man: { noun: "man", Noun: "Man", they: "he", their: "his", them: "him", speak: "speaks" },
  Woman: { noun: "woman", Noun: "Woman", they: "she", their: "her", them: "her", speak: "speaks" },
  Child: { noun: "child", Noun: "Child", they: "they", their: "their", them: "them", speak: "speak" },
  Officer: {
    noun: "officer",
    Noun: "Officer",
    they: "the officer",
    their: "the officer's",
    them: "the officer",
    speak: "speaks",
  },
};

function timeOfDay(m: StillMetrics | null): string {
  if (!m) return "Match the time of day exactly as frozen in the reference still";
  if (m.brightness < 0.22) return "Night or deep shade. Low overall illumination";
  if (m.brightness < 0.4) return "Late day, dusk, or heavy overcast. Dim outdoor or interior light";
  if (m.brightness > 0.78) return "Bright daylight. High overall exposure";
  return "Daytime. Moderate natural illumination";
}

function colorCast(m: StillMetrics | null): string {
  if (!m) return "Keep the colour temperature of the still";
  if (m.warmth > 0.12) return "Warm colour cast — amber, sun, or tungsten bias";
  if (m.warmth < -0.08) return "Cool colour cast — overcast, open shade, or daylight-blue bias";
  return "Neutral, slightly muted real-world colour";
}

function phoneLook(vertical: boolean): boolean {
  return vertical;
}

export function writeGuidePlate(input: {
  subject: SubjectTag;
  metrics?: StillMetrics | null;
}): string {
  const tag = input.subject;
  const v = VOICE[tag];
  const m = input.metrics ?? null;
  const vertical = m ? m.height / m.width >= 1.15 : true;
  const landscape = m ? m.width / m.height >= 1.25 : false;
  const phone = phoneLook(vertical);
  const time = timeOfDay(m);
  const cast = colorCast(m);
  const sat =
    !m ? "saturation as in the still" : m.saturation < 0.18
      ? "slightly desaturated real-world colours"
      : m.saturation > 0.42
        ? "punchy, high-saturation colour"
        : "natural, slightly muted colour";
  const contrast =
    !m ? "contrast as in the still" : m.contrast < 0.12
      ? "soft, flat contrast with no deep blacks"
      : m.contrast > 0.28
        ? "harder contrast with visible highlight roll-off"
        : "moderate contrast, no cinematic grade";

  const frame = !m
    ? "the same aspect ratio as the reference still"
    : vertical
      ? "vertical / 9:16 social-media frame"
      : landscape
        ? "horizontal widescreen frame"
        : "near-square frame";

  const camera = phone
    ? `Natural phone-camera aesthetic. It must look as if it was shot on a phone, not professionally. Soft focus, visible digital noise, slight compression, uneven real-world lighting. The background must stay visible — no heavy cinematic blur, no anamorphic polish. ${vertical ? "Vertical phone framing." : "Match the still's framing."} Medium close-up to mid-shot as in the still. Slow, steady zoom-in. Subtle handheld micro-movement.`
    : `Match the lens perspective, shot size, and camera height of the reference still. Do not invent a cinematic camera that is not in the photograph. Background remains readable. Slow continuous zoom-in. Subtle handheld micro-movement only if the still already feels handheld.`;

  const sections: { name: SectionName; body: string }[] = [
    {
      name: "SCENE",
      body: `${time}. ${frame}. The location, architecture, weather, ground, and overall visual situation must remain exactly as frozen in the reference still — every wall, sign, vehicle, plant, sky, and piece of debris. Do not relocate the shot. Do not add buildings, rooms, or landscape that are not in the still. ${cast}.`,
    },
    {
      name: "SUBJECT",
      body: `[${tag}]
The ${v.noun} is the person frozen in the reference still. Keep that exact face, age, hair, skin, facial hair, makeup, and expression. Keep wardrobe identical: every garment, colour, zipper, collar, badge, hat, and accessory. Hands, nails, and any object ${v.they} hold stay the same.
${v.Noun} stands in the same place relative to camera, background, and props, holding the pose and gesture shown. ${v.they.charAt(0).toUpperCase()}${v.they.slice(1)} continues that action — pointing, speaking, looking, walking, or standing — without changing identity. Do not swap in a different ${v.noun}.`,
    },
    {
      name: "ACTION",
      body: `The shot begins on the exact freeze-frame of the still. ${v.Noun} holds the pose for a beat, then continues the motion already implied: the pointing hand, the turn of the head, the mouth moving as ${v.they} ${v.speak}, the weight shift in the stance. Movement stays natural and readable. Nothing else in the location starts a new story. No extra people enter. No props appear or vanish.`,
    },
    {
      name: "CAMERA",
      body: camera,
    },
    {
      name: "COMPOSITION",
      body: `${v.Noun} stays in the same region of the frame as in the still. Background elements, signs, and props keep their original positions. Any on-screen graphic or caption in the still stays in that same third of the frame, same scale, same alignment. Do not re-centre, do not crop to a new shot size.`,
    },
    {
      name: "LIGHTING",
      body: `${time}. ${cast}. ${contrast}. Light direction, hardness, and colour must match the still — no new key light, no rim light, no studio fill. Shadows stay where they already fall on face, clothes, and ground.`,
    },
    {
      name: "STYLE",
      body: phone
        ? `Raw vertical social-media / phone-video look. ${sat}. Visible phone-camera texture and mild compression. High-contrast graphic text overlays only if they already exist in the still. No film emulation, no heavy grade, no beauty filter.`
        : `Match the visual language of the still: realism, texture, and ${sat}. No new film stock, no beauty filter, no cinematic LUT that the photograph does not already have.`,
    },
    {
      name: "MOTION & PACING",
      body: `Moderate energy. ${v.Noun}'s gesture and head movement are clear but natural. Slow continuous zoom-in throughout the shot. Overall pacing feels direct and punchy. No slow-motion, no freeze, no whip-pan.`,
    },
    {
      name: "AUDIO",
      body: `Clear spoken voice if ${v.they} ${v.speak}, with natural ambience that fits the location in the still (outdoor wind, room tone, distant quiet). No music bed unless the still already implies it.`,
    },
    {
      name: "IMPORTANT",
      body: `Keep the ${v.noun}'s face, hair, wardrobe, and expression consistent with the reference still.
Keep the location, props, signs, and any on-screen text exactly as shown.
Maintain the camera aesthetic of the still${phone ? " (phone-camera, no cinematic polish, no heavy background blur)" : ""}.
Do not change on-screen text style.
Do not invent people, logos, or objects.`,
    },
    {
      name: "DIALOGUE",
      body: `Character: ${tag}
Exact dialogue: none unless readable on-screen text or a clearly spoken line is already in the still — then use that exact wording, no paraphrase.
Delivery: natural to the pose; if the still is energetic and direct-to-camera, keep that energy; if quiet, keep it quiet.`,
    },
    {
      name: "SUBTITLES",
      body: `If there is spoken dialogue, display that exact line as subtitles.
White sans-serif or match any on-screen text style already in the still, including colour highlights.
Bottom-center placement.
Synchronize precisely with the spoken words.
Do not alter, paraphrase, or add text.
If Exact dialogue is none: no subtitles.`,
    },
  ];

  return assemblePlate(
    sections.map((s) => ({
      name: s.name,
      body: s.body.trim(),
    })),
  );
}
