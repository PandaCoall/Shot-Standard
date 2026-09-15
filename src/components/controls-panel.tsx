import { Clapperboard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  SUBJECT_KINDS,
  SUBJECT_LABELS,
  type SubjectKind,
} from "@/lib/prompt-standard";

type ControlsPanelProps = {
  subject: SubjectKind;
  onSubject: (value: SubjectKind) => void;
  character: string;
  onCharacter: (value: string) => void;
  dialogue: string;
  onDialogue: (value: string) => void;
  delivery: string;
  onDelivery: (value: string) => void;
  notes: string;
  onNotes: (value: string) => void;
  canGenerate: boolean;
  generating: boolean;
  onGenerate: () => void;
  stageLabel: string | null;
};

export function ControlsPanel({
  subject,
  onSubject,
  character,
  onCharacter,
  dialogue,
  onDialogue,
  delivery,
  onDelivery,
  notes,
  onNotes,
  canGenerate,
  generating,
  onGenerate,
  stageLabel,
}: ControlsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Subject</Label>
        <div className="flex flex-wrap gap-1.5">
          {SUBJECT_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onSubject(kind)}
              className={cn(
                "h-9 rounded-full px-3 text-xs font-medium transition-[background-color,color,box-shadow] duration-150",
                subject === kind
                  ? "bg-accent text-accent-fg"
                  : "bg-elevated text-muted shadow-border hover:text-fg",
              )}
              aria-pressed={subject === kind}
            >
              {kind === "auto" ? "Auto" : `[${SUBJECT_LABELS[kind]}]`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="character">Character name</Label>
          <Input
            id="character"
            placeholder="Optional"
            value={character}
            onChange={(e) => onCharacter(e.target.value)}
            maxLength={80}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="delivery">Delivery</Label>
          <Input
            id="delivery"
            placeholder="quiet, tense, whispered"
            value={delivery}
            onChange={(e) => onDelivery(e.target.value)}
            maxLength={200}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dialogue">Exact dialogue</Label>
        <Input
          id="dialogue"
          placeholder='Leave blank to infer from the still'
          value={dialogue}
          onChange={(e) => onDialogue(e.target.value)}
          maxLength={400}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Extra notes</Label>
        <Textarea
          id="notes"
          placeholder="Phone-video look, keep the sign, no music…"
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          maxLength={800}
          className="min-h-16"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!canGenerate || generating}
        onClick={onGenerate}
      >
        {generating ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            {stageLabel ?? "Writing the plate"}
          </>
        ) : (
          <>
            <Clapperboard className="size-4" strokeWidth={1.75} />
            Write prompt
          </>
        )}
      </Button>
      <p className="text-center text-xs text-subtle">
        ⌘ / Ctrl + Enter
      </p>
    </div>
  );
}
