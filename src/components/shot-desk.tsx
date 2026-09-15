import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { ControlsPanel } from "@/components/controls-panel";
import { HistoryDialog } from "@/components/history-dialog";
import { PlateView } from "@/components/plate-view";
import { StandardDialog } from "@/components/standard-dialog";
import { StillStage } from "@/components/still-stage";
import { fetchExampleStill, stillToDataUrl, stillToThumb } from "@/lib/compress-still";
import { generatePrompt } from "@/lib/generate-prompt";
import {
  loadHistory,
  loadStandard,
  newId,
  persistHistory,
  persistStandard,
  type HistoryItem,
} from "@/lib/history";
import { DEFAULT_STANDARD, type SubjectKind } from "@/lib/prompt-standard";

const STAGES = [
  "Reading the still",
  "Locking subject",
  "Writing the plate",
] as const;

export function ShotDesk() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [subject, setSubject] = useState<SubjectKind>("auto");
  const [character, setCharacter] = useState("");
  const [dialogue, setDialogue] = useState("");
  const [delivery, setDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [stageLabel, setStageLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exampleBusy, setExampleBusy] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [standardOpen, setStandardOpen] = useState(false);
  const [standard, setStandard] = useState(DEFAULT_STANDARD);
  const generatingRef = useRef(false);

  useEffect(() => {
    setHistory(loadHistory());
    setStandard(loadStandard() ?? DEFAULT_STANDARD);
  }, []);

  const applyStill = useCallback((dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setPrompt("");
    setError(null);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      try {
        const dataUrl = await stillToDataUrl(file);
        applyStill(dataUrl);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not read that still.";
        toast.error(message);
      }
    },
    [applyStill],
  );

  const handleExample = useCallback(async () => {
    setExampleBusy(true);
    try {
      const dataUrl = await fetchExampleStill();
      applyStill(dataUrl);
      setSubject("man");
      setDialogue("Just to sell.");
      setDelivery("Energetic, slightly exaggerated, direct to camera");
      setNotes(
        "Keep the dilapidated house, rusty SOLD FOR SALE sign, black zip-up jacket, and phone-camera aesthetic. Preserve the JUST TO SELL overlay style.",
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load the example.";
      toast.error(message);
    } finally {
      setExampleBusy(false);
    }
  }, [applyStill]);

  const writePlate = useCallback(async () => {
    if (!imageDataUrl || generatingRef.current) return;
    generatingRef.current = true;
    setGenerating(true);
    setError(null);
    setStageLabel(STAGES[0]);
    const stageTimer = window.setInterval(() => {
      setStageLabel((current) => {
        const i = STAGES.indexOf((current ?? STAGES[0]) as (typeof STAGES)[number]);
        return STAGES[Math.min(i + 1, STAGES.length - 1)] ?? STAGES[2];
      });
    }, 2200);

    try {
      const result = await generatePrompt({
        data: {
          imageDataUrl,
          subject,
          character: character.trim() || undefined,
          dialogue: dialogue.trim() || undefined,
          delivery: delivery.trim() || undefined,
          notes: notes.trim() || undefined,
          standard,
        },
      });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setPrompt(result.prompt);
      const thumbnail = await stillToThumb(imageDataUrl);
      const item: HistoryItem = {
        id: newId(),
        createdAt: Date.now(),
        thumbnail,
        prompt: result.prompt,
        subject,
        dialogue: dialogue.trim(),
      };
      setHistory((prev) => {
        const next = [item, ...prev].slice(0, 24);
        persistHistory(next);
        return next;
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not write the plate.";
      setError(message);
      toast.error(message);
    } finally {
      window.clearInterval(stageTimer);
      setStageLabel(null);
      setGenerating(false);
      generatingRef.current = false;
    }
  }, [
    imageDataUrl,
    subject,
    character,
    dialogue,
    delivery,
    notes,
    standard,
  ]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            void handleFile(file);
          }
          return;
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void writePlate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [writePlate]);

  const restore = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setDialogue(item.dialogue);
    if (
      item.subject === "auto" ||
      item.subject === "man" ||
      item.subject === "woman" ||
      item.subject === "child" ||
      item.subject === "officer"
    ) {
      setSubject(item.subject);
    }
    toast.success("Plate restored");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        onHistory={() => setHistoryOpen(true)}
        onStandard={() => setStandardOpen(true)}
        historyCount={history.length}
      />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 animate-rise lg:col-span-4">
          <StillStage
            imageDataUrl={imageDataUrl}
            onFile={(file) => void handleFile(file)}
            onExample={() => void handleExample()}
            busy={exampleBusy}
          />
          <ControlsPanel
            subject={subject}
            onSubject={setSubject}
            character={character}
            onCharacter={setCharacter}
            dialogue={dialogue}
            onDialogue={setDialogue}
            delivery={delivery}
            onDelivery={setDelivery}
            notes={notes}
            onNotes={setNotes}
            canGenerate={Boolean(imageDataUrl)}
            generating={generating}
            onGenerate={() => void writePlate()}
            stageLabel={stageLabel}
          />
        </div>

        <div className="flex min-h-96 animate-rise stagger-2 lg:col-span-8 lg:min-h-0">
          <PlateView
            prompt={prompt}
            generating={generating}
            error={error}
            onChange={setPrompt}
          />
        </div>
      </main>

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        items={history}
        onRestore={restore}
        onClear={() => {
          persistHistory([]);
          setHistory([]);
        }}
      />
      <StandardDialog
        open={standardOpen}
        onOpenChange={setStandardOpen}
        value={standard}
        onChange={(value) => {
          setStandard(value);
          persistStandard(value);
        }}
        onReset={() => persistStandard(DEFAULT_STANDARD)}
      />
    </div>
  );
}
