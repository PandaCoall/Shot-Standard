export type HistoryItem = {
  id: string;
  createdAt: number;
  thumbnail: string;
  prompt: string;
  subject: string;
  dialogue: string;
};

const KEY = "shot-standard-history-v1";
const STANDARD_KEY = "shot-standard-template-v1";
const MAX_ITEMS = 24;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  const items = safeParse<HistoryItem[]>(localStorage.getItem(KEY), []);
  return Array.isArray(items) ? items.slice(0, MAX_ITEMS) : [];
}

export function persistHistory(items: HistoryItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function loadStandard(): string | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STANDARD_KEY);
  return value && value.trim() ? value : null;
}

export function persistStandard(value: string): void {
  localStorage.setItem(STANDARD_KEY, value);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
