import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { copyToClipboard } from "@/lib/copy-text";
import { SECTION_ORDER, sectionMarker } from "@/lib/prompt-standard";
import { assemblePlate, parsePlate, type PlateSection } from "@/lib/parse-prompt";
import { cn } from "@/lib/utils";

type PlateViewProps = {
  prompt: string;
  generating: boolean;
  error: string | null;
  onChange: (value: string) => void;
};

function downloadPlate(value: string) {
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shot-standard-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function PlateView({
  prompt,
  generating,
  error,
  onChange,
}: PlateViewProps) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const parsed = useMemo(() => parsePlate(prompt), [prompt]);
  const plateText =
    parsed.sections.length > 0 ? assemblePlate(parsed.sections) : prompt;

  const selectInEditor = () => {
    setEditing(true);
    window.requestAnimationFrame(() => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      el.select();
    });
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(plateText);
    if (ok) {
      toast.success("Plate copied");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
      return;
    }
    selectInEditor();
    toast.message("Plate selected — press ⌘C / Ctrl+C");
  };

  const handleSectionCopy = async (value: string, label: string) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      toast.success(label);
      return;
    }
    selectInEditor();
    toast.message("Selected — press ⌘C / Ctrl+C");
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-xl bg-surface shadow-border">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            Plate
          </p>
          <p className="font-display text-lg font-medium tracking-tight text-fg">
            MiniMax prompt
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={!prompt}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? (
              <>
                <RotateCcw className="size-3.5" />
                Preview
              </>
            ) : (
              <>
                <Pencil className="size-3.5" />
                Edit
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!prompt}
            onClick={() => downloadPlate(plateText)}
          >
            <Download className="size-3.5" />
            .txt
          </Button>
          <Button size="sm" disabled={!prompt} onClick={() => void handleCopy()}>
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            Copy plate
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
        {generating ? (
          <WritingState />
        ) : error ? (
          <p className="rounded-lg bg-elevated px-4 py-3 text-sm text-mark shadow-border">
            {error}
          </p>
        ) : !prompt ? (
          <EmptyPlate />
        ) : editing ? (
          <Textarea
            ref={editorRef}
            id="plate-editor"
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-96 font-mono text-plate leading-relaxed"
          />
        ) : (
          <PlateBody
            sections={parsed.sections}
            fallback={prompt}
            onCopySection={handleSectionCopy}
          />
        )}
      </div>
    </section>
  );
}

function EmptyPlate() {
  return (
    <div className="flex h-full min-h-72 flex-col justify-center gap-6 px-1">
      <div>
        <p className="font-display text-2xl font-medium tracking-tight text-fg">
          The plate is empty
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Drop a still and write a prompt. Grok will fill every marker in the MiniMax standard.
        </p>
      </div>
      <ol className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {SECTION_ORDER.map((name, i) => (
          <li
            key={name}
            className="flex items-baseline gap-2 font-mono text-micro tracking-wide text-subtle"
          >
            <span className="text-subtle/70 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {sectionMarker(name)}
          </li>
        ))}
      </ol>
    </div>
  );
}

function WritingState() {
  return (
    <div className="flex flex-col gap-5">
      <p className="shimmer-text font-display text-xl font-medium tracking-tight">
        Reading the still, writing the plate
      </p>
      <ol className="flex flex-col gap-3">
        {SECTION_ORDER.map((name, i) => (
          <li key={name} className="flex flex-col gap-1.5">
            <span className="font-mono text-micro tracking-wide text-subtle">
              {sectionMarker(name)}
            </span>
            <span
              className="h-2.5 rounded-sm bg-elevated"
              style={{ width: `${58 + ((i * 17) % 32)}%` }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function PlateBody({
  sections,
  fallback,
  onCopySection,
}: {
  sections: PlateSection[];
  fallback: string;
  onCopySection: (value: string, label: string) => void;
}) {
  if (sections.length === 0) {
    return (
      <pre className="whitespace-pre-wrap font-mono text-plate leading-relaxed text-fg">
        {fallback}
      </pre>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => {
        const marker = sectionMarker(section.name);
        return (
          <article key={section.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-micro tracking-widest text-mark">
                {marker}
              </h3>
              <button
                type="button"
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-md text-subtle",
                  "transition-colors hover:bg-elevated hover:text-fg",
                )}
                onClick={() =>
                  onCopySection(
                    `${marker}\n${section.body}`,
                    `${marker} copied`,
                  )
                }
                aria-label={`Copy ${marker}`}
              >
                <Copy className="size-3.5" />
              </button>
            </div>
            <p className="whitespace-pre-wrap font-mono text-plate leading-relaxed text-fg">
              {section.body}
            </p>
          </article>
        );
      })}
    </div>
  );
}
