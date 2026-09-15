import { SECTION_ORDER, type SectionName } from "./prompt-standard";

export type PlateSection = {
  name: SectionName;
  body: string;
};

const HEADER_RE = new RegExp(
  `^(${SECTION_ORDER.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):\\s*$`,
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
      const found = SECTION_ORDER.find(
        (s) => s.toLowerCase() === match[1]!.toLowerCase(),
      );
      current = found ?? null;
      continue;
    }
    if (current) buf.push(line);
  }
  flush();

  return { sections, text };
}

export function assemblePlate(sections: PlateSection[]): string {
  return sections
    .map((s) => `${s.name}:\n${s.body}`.trim())
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
