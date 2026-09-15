import { Clapperboard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ControlsPanelProps = {
  canGenerate: boolean;
  generating: boolean;
  onGenerate: () => void;
  stageLabel: string | null;
};

export function ControlsPanel({
  canGenerate,
  generating,
  onGenerate,
  stageLabel,
}: ControlsPanelProps) {
  return (
    <div className="flex flex-col gap-2">
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
            Write plate
          </>
        )}
      </Button>
      <p className="text-center text-xs text-subtle">
        Grok reads the still. No fields to fill. ⌘ / Ctrl + Enter
      </p>
    </div>
  );
}
