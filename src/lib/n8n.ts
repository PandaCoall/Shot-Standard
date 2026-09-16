const KEY = "shot-standard-n8n-webhook-v1";

export function loadWebhookUrl(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY)?.trim() ?? "";
}

export function persistWebhookUrl(value: string): void {
  if (typeof window === "undefined") return;
  const next = value.trim();
  if (!next) {
    localStorage.removeItem(KEY);
    return;
  }
  localStorage.setItem(KEY, next);
}

export function isWebhookUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function postPlateToN8n(input: {
  webhookUrl: string;
  plate: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const webhookUrl = input.webhookUrl.trim();
  if (!isWebhookUrl(webhookUrl)) {
    return { ok: false, error: "Paste an n8n webhook URL first." };
  }
  if (!input.plate.trim()) {
    return { ok: false, error: "Write a plate before sending." };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "shot-standard",
        createdAt: new Date().toISOString(),
        plate: input.plate,
      }),
    });
    if (!res.ok) {
      return {
        ok: false,
        error: `n8n returned ${res.status}. Check the webhook is active.`,
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not reach n8n. Use the Production webhook URL and allow the browser to POST.",
    };
  }
}
