import { History, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  onHistory: () => void;
  onStandard: () => void;
  historyCount: number;
};

export function AppHeader({
  onHistory,
  onStandard,
  historyCount,
}: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="font-display text-2xl leading-none font-medium tracking-tight text-fg sm:text-3xl">
          Shot <span className="text-mark">Standard</span>
        </p>
        <p className="mt-1 text-xs tracking-wide text-muted">
          MiniMax prompt desk
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={onHistory}>
          <History className="size-3.5" />
          History
          {historyCount > 0 ? (
            <span className="tabular-nums text-subtle">{historyCount}</span>
          ) : null}
        </Button>
        <Button variant="outline" size="sm" onClick={onStandard}>
          <SlidersHorizontal className="size-3.5" />
          Standard
        </Button>
      </div>
    </header>
  );
}
