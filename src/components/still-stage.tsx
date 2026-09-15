import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StillStageProps = {
  imageDataUrl: string | null;
  onFile: (file: File) => void;
  onExample: () => void;
  busy?: boolean;
};

export function StillStage({
  imageDataUrl,
  onFile,
  onExample,
  busy,
}: StillStageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const take = (list: FileList | null) => {
    const file = list?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Still
        </p>
        {imageDataUrl ? (
          <button
            type="button"
            className="text-xs text-muted transition-colors hover:text-fg"
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          take(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          take(e.dataTransfer.files);
        }}
        className={cn(
          "group relative flex min-h-56 w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-surface p-2 text-left shadow-border transition-[box-shadow] duration-150",
          dragOver && "shadow-border-hover",
          !imageDataUrl && "min-h-64",
        )}
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="Uploaded still"
            className="still-outline max-h-72 w-full rounded-lg object-contain"
          />
        ) : (
          <div className="flex w-full flex-col items-center gap-4 px-6 py-8">
            <span className="flex size-12 items-center justify-center rounded-md bg-elevated text-muted shadow-border">
              <ImagePlus className="size-5" strokeWidth={1.75} />
            </span>
            <div className="text-center">
              <p className="font-display text-2xl font-medium tracking-tight text-fg">
                Drop a still
              </p>
              <p className="mt-1 text-sm text-muted">
                Click, paste, or drag a JPEG / PNG
              </p>
            </div>
          </div>
        )}
      </button>

      {!imageDataUrl ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-subtle">Clipboard paste works too</p>
          <button
            type="button"
            onClick={onExample}
            disabled={busy}
            className="text-xs font-medium text-accent transition-colors hover:text-fg disabled:opacity-40"
          >
            {busy ? (
              <span className="inline-flex items-center gap-1.5">
                <LoaderCircle className="size-3 animate-spin" />
                Loading
              </span>
            ) : (
              "Load example still"
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
