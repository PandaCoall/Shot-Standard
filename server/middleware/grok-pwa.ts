/**
 * Deployed-app (Nitro) half of the platform PWA chrome. Auto-registered as
 * global h3 middleware because vite.config.ts sets `serverDir: "./server"` —
 * without that option Nitro v3 never scans this directory.
 *
 * - `?install=1&platform=ios` on a document path → the Home Screen tutorial,
 *   bundled into the server build via `?raw` (the public/ directory is CDN
 *   static output on Vercel and not readable from the function).
 * - `/__grok/manifest.webmanifest` → per-app-named manifest (kept out of
 *   public/ so this dynamic response is the only one).
 * - Other HTML documents → stream-inject PWA + OG head tags at `</head>`.
 *   OG identity is baked via `virtual:grok-og-identity` at `vite build`
 *   (this function cannot read `src/lib/og/site.json` or `public/og.jpg`).
 *   This must be a middleware transforming `next()`: h3 discards the `response`
 *   runtime hook's return value, and `render:html` does not exist in Nitro v3.
 */
import installPageTemplate from "../../scripts/install-page.html?raw";
import { grokOgIdentity } from "virtual:grok-og-identity";
import {
  acceptsHtml,
  createHeadInjector,
  isDocumentPath,
  isInstallQuery,
  renderInstallPageHtml,
  renderWebManifest,
} from "../../scripts/grok-pwa-shared.mjs";

interface GrokPwaEvent {
  url: URL;
  req: { method: string; headers: Headers };
  request?: Request;
  path?: string;
}

function continueNext(next: unknown): unknown | Promise<unknown> {
  return typeof next === "function" ? (next as () => unknown | Promise<unknown>)() : undefined;
}

function normalizeEvent(event: GrokPwaEvent): GrokPwaEvent | null {
  const req = event.req ?? event.request;
  let url = event.url;
  if (!(url instanceof URL)) {
    try {
      const raw =
        (req as Request | undefined)?.url ||
        (typeof event.path === "string" ? event.path : "/") ||
        "/";
      url = new URL(raw, "http://localhost");
    } catch {
      return null;
    }
  }
  if (!req || typeof req.method !== "string") return null;
  return { ...event, req, url };
}

function requestHost(event: GrokPwaEvent): string {
  return (
    event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host
  );
}

function injectHeadStreaming(response: Response, host: string): Response {
  if (!response.body) return response;
  const injector = createHeadInjector({
    host,
    site: grokOgIdentity.site,
  });
  const transformed = response.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        for (const out of injector.push(chunk)) controller.enqueue(out);
      },
      flush(controller) {
        for (const out of injector.flush()) controller.enqueue(out);
      },
    }),
  );
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(transformed, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async function grokPwaMiddleware(
  event: GrokPwaEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  try {
    const normalized = normalizeEvent(event);
    if (!normalized) return continueNext(next);

    const method = (normalized.req.method ?? "GET").toUpperCase();
    if (method !== "GET") return continueNext(next);

    const path = normalized.url.pathname;
    const urlWithQuery = path + normalized.url.search;

    if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") {
      return new Response(renderWebManifest(requestHost(normalized)), {
        headers: {
          "content-type": "application/manifest+json; charset=utf-8",
          "cache-control": "no-cache",
        },
      });
    }

    if (
      isInstallQuery(urlWithQuery) &&
      isDocumentPath(path) &&
      acceptsHtml(normalized.req.headers.get("accept"))
    ) {
      const html = renderInstallPageHtml(installPageTemplate, {
        host: requestHost(normalized),
        url: urlWithQuery,
      });
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache",
        },
      });
    }

    if (!isDocumentPath(path)) return continueNext(next);

    const result = await continueNext(next);
    if (
      result instanceof Response &&
      result.body &&
      String(result.headers.get("content-type") ?? "").includes("text/html") &&
      !result.headers.get("content-encoding")
    ) {
      return injectHeadStreaming(result, requestHost(normalized));
    }
    return result;
  } catch (err) {
    console.error("[grok-pwa] middleware failed; passing through", err);
    return continueNext(next);
  }
}
