import { defineErrorHandler } from "nitro";

/** Surface the real crash on Vercel instead of `{ unhandled: true }`. */
export default defineErrorHandler((error) => {
  const cause = error && typeof error === "object" ? error.cause : undefined;
  const status = Number(error?.status) || 500;
  const body = {
    error: true,
    status,
    message: error instanceof Error ? error.message : String(error ?? "unhandled"),
    cause:
      cause instanceof Error
        ? cause.message
        : cause != null
          ? String(cause)
          : undefined,
    stack:
      error instanceof Error && error.stack
        ? error.stack.split("\n").slice(0, 16)
        : undefined,
  };
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
});
