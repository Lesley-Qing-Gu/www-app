import type { Practice } from "@/types";
import { Emotion } from "@/universal/Emotion";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
// DEBUG: print the base from .env
console.log("[API] VITE_API_BASE =", import.meta.env.VITE_API_BASE);

function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  // Reject if the HTTP request hangs for too long
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

async function getJson(url: string) {
  console.log("[API] GET", url);
  const r = await withTimeout(fetch(url));
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
  return r.json();
}

/** List practices by difficulty; will throw on non-200 */
export async function practicesByDifficulty(
  d: Practice["difficulty"]
): Promise<Practice[]> {
  return getJson(`${BASE}/api/practices/difficulty/${d}`);
}

/** Backend tuner: FindNextPractice(practice, emotion) -> Practice */
export async function FindNextPractice(
  practice: Practice,
  emotion: Emotion
): Promise<Practice> {
  const url = `${BASE}/api/practices/FindNextPractice`;
  console.log("[API] POST", url, { practice, emotion });
  const r = await withTimeout(fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ practice, emotion }),
  }));
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
  return r.json();
}
