import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoryItem } from "@/lib/history";

type HistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClear: () => void;
};

export function HistoryDialog({
  open,
  onOpenChange,
  items,
  onRestore,
  onClear,
}: HistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88dvh] flex-col">
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
          <DialogDescription>
            Recent plates stay on this device.
          </DialogDescription>
        </DialogHeader>
        {items.length === 0 ? (
          <p className="py-10 text-sm text-muted">No plates yet.</p>
        ) : (
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onRestore(item);
                    onOpenChange(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg bg-elevated p-2 text-left shadow-border transition-[box-shadow] hover:shadow-border-hover"
                >
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="still-outline size-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-xs text-fg">
                      {item.dialogue || item.subject || "Untitled plate"}
                    </span>
                    <span className="mt-0.5 block text-xs text-subtle">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 ? (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear history
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
