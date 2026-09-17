import { createFileRoute } from "@tanstack/react-router";
import { json, optionsOk } from "@/lib/api-http";

export const Route = createFileRoute("/api/health")({
  ssr: false,
  server: {
    handlers: {
      OPTIONS: async () => optionsOk(),
      GET: async () =>
        json({
          ok: true,
          service: "shot-standard",
          grok: Boolean(process.env.XAI_API_KEY?.trim()),
          authRequired: Boolean(process.env.SHOT_API_KEY?.trim()),
        }),
    },
  },
});
