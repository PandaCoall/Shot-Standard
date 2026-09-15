import { SECTION_ORDER, sectionMarker, type SectionName } from "./prompt-standard";

export type PlateSection = {
  name: SectionName;
  body: string;
};

const NAME_ALT = SECTION_ORDER.map((s) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");

const HEADER_RE = new RegExp(
  `^(?:\\[(${NAME_ALT})\\]|(${NAME_ALT}):)\\s*$`,
  "i",
);

export function stripFences(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:[\w-]+)?\s*/, "").replace(/\s*```$/, "");
  }
  text = text.replace(/^MINI\s*MAX\s*PROMPT\s*STANDARD\s*/i, "");
  return text.trim();
}

function resolveHeader(match: RegExpMatchArray): SectionName | null {
  const raw = match[1] ?? match[2];
  if (!raw) return null;
  return (
    SECTION_ORDER.find((s) => s.toLowerCase() === raw.toLowerCase()) ?? null
  );
}

export function parsePlate(raw: string): { sections: PlateSection[]; text: string } {
  const text = stripFences(raw);
  const lines = text.split(/\r?\n/);
  const sections: PlateSection[] = [];
  let current: SectionName | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (!current) return;
    sections.push({ name: current, body: buf.join("\n").trim() });
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

  return { sections, text };
}

export function assemblePlate(sections: PlateSection[]): string {
  return sections
    .map((s) => `${sectionMarker(s.name)}\n${s.body}`.trim())
    .join("\n\n");
}

export function detectSubjectTag(
  sections: PlateSection[],
): "Man" | "Woman" | "Child" | "Officer" | null {
  const subject = sections.find((s) => s.name === "SUBJECT")?.body ?? "";
  const tag = subject.match(/\[(Man|Woman|Child|Officer)\]/i);
  if (!tag) return null;
  const value = tag[1]!;
  return (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) as
    | "Man"
    | "Woman"
    | "Child"
    | "Officer";
}
