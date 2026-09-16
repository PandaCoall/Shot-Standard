import { createFileRoute } from "@tanstack/react-router";
import { authorize, json, optionsOk } from "@/lib/api-http";
import { stillToDataUrl, writePlateFromDataUrl } from "@/lib/write-plate";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      OPTIONS: async () => optionsOk(),
      POST: async ({ request }) => {
        const denied = authorize(request);
        if (denied) return denied;

        let payload: { image?: string; imageUrl?: string } = {};
        const contentType = request.headers.get("content-type") ?? "";
        try {
          if (contentType.includes("application/json")) {
            payload = (await request.json()) as typeof payload;
          } else if (contentType.includes("application/x-www-form-urlencoded")) {
            const form = await request.formData();
            payload = {
              image: String(form.get("image") ?? "") || undefined,
              imageUrl: String(form.get("imageUrl") ?? "") || undefined,
            };
          } else if (contentType.includes("multipart/form-data")) {
            const form = await request.formData();
            const file = form.get("image") ?? form.get("file") ?? form.get("data");
            if (file instanceof File) {
              const buf = new Uint8Array(await file.arrayBuffer());
              if (buf.byteLength > 3_000_000) {
                return json(
                  { ok: false, error: "Still is too large. Keep it under 3 MB." },
                  413,
                );
              }
              const mime = file.type.startsWith("image/") ? file.type : "image/jpeg";
              let binary = "";
              const chunk = 0x8000;
              for (let i = 0; i < buf.length; i += chunk) {
                binary += String.fromCharCode(...buf.subarray(i, i + chunk));
              }
              payload = { image: `data:${mime};base64,${btoa(binary)}` };
            } else {
              payload = {
                image: String(form.get("image") ?? "") || undefined,
                imageUrl: String(form.get("imageUrl") ?? form.get("url") ?? "") || undefined,
              };
            }
          } else {
            payload = (await request.json()) as typeof payload;
          }
        } catch {
          return json({ ok: false, error: "Body must be JSON or form data." }, 400);
        }

        const still = await stillToDataUrl({
          image: payload.image,
          imageUrl: payload.imageUrl,
        });
        if (!still.ok) return json({ ok: false, error: still.error }, still.status);

        const result = await writePlateFromDataUrl(still.dataUrl);
        if (!result.ok) return json({ ok: false, error: result.error }, result.status);
        return json({ ok: true, plate: result.plate });
      },
    },
  },
});
