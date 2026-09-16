import { Clapperboard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ControlsPanelProps = {
  canGenerate: boolean;
  generating: boolean;
  onGenerate: () => void;
  stageLabel: string | null;
  webhookUrl: string;
  onWebhookUrl: (value: string) => void;
};

export function ControlsPanel({
  canGenerate,
  generating,
  onGenerate,
  stageLabel,
  webhookUrl,
  onWebhookUrl,
}: ControlsPanelProps) {
  return (
    <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="n8n-webhook">n8n webhook</Label>
        <Input
          id="n8n-webhook"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://your-n8n.host/webhook/..."
          value={webhookUrl}
          onChange={(e) => onWebhookUrl(e.target.value)}
        />
        <p className="text-xs text-subtle">
          Saved on this device. Used by Send to n8n.
        </p>
      </div>
    </div>
  );
}
