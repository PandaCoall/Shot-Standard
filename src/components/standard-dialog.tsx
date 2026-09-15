import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_STANDARD } from "@/lib/prompt-standard";

type StandardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

export function StandardDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onReset,
}: StandardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88dvh] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>Prompt standard</DialogTitle>
          <DialogDescription>
            Grok follows this template for every still. Edit the markers, keep
            the section names.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-0 flex-1 font-mono text-plate leading-relaxed"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(DEFAULT_STANDARD);
              onReset();
            }}
          >
            Restore default
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Save standard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
