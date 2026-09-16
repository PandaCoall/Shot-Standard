import { createFileRoute } from "@tanstack/react-router";
import { json, optionsOk } from "@/lib/api-http";

const catalog = {
  name: "Shot Standard",
  version: "1",
  description: "Turn a still into a MiniMax shot plate.",
  auth: {
    type: "optional_header",
    headers: ["x-api-key", "Authorization: Bearer <SHOT_API_KEY>"],
    note: "Required only when SHOT_API_KEY is set on the server.",
  },
  endpoints: [
    {
      method: "GET",
      path: "/api",
      purpose: "Discover this API",
    },
    {
      method: "GET",
      path: "/api/health",
      purpose: "Liveness check for n8n",
    },
    {
      method: "POST",
      path: "/api/generate",
      purpose: "Write a MiniMax plate from one still",
      body: {
        image: "data:image/jpeg;base64,... OR raw base64",
        imageUrl: "https://example.com/still.jpg",
      },
      bodyNote: "Send image or imageUrl, not both required.",
      response: {
        ok: true,
        plate: "[SCENE]\n...",
      },
    },
  ],
};

export const Route = createFileRoute("/api/")({
  server: {
    handlers: {
      OPTIONS: async () => optionsOk(),
      GET: async () => json(catalog),
    },
  },
});
