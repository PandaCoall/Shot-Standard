export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  "Access-Control-Max-Age": "86400",
};

export function json(
  body: unknown,
  status = 200,
  extra?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...extra,
    },
  });
}

export function optionsOk(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function readApiKey(request: Request): string {
  const header = request.headers.get("x-api-key")?.trim() ?? "";
  if (header) return header;
  const auth = request.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? "";
}

export function authorize(request: Request): Response | null {
  const expected = process.env.SHOT_API_KEY?.trim();
  if (!expected) return null;
  if (readApiKey(request) === expected) return null;
  return json({ ok: false, error: "Invalid or missing API key." }, 401);
}
