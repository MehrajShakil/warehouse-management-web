import type { AuthResponse } from "@/types/auth";

/**
 * Client-side session store backed by localStorage.
 *
 * Exposes a subscribe/getSnapshot pair so React components can read it
 * through useSyncExternalStore (see hooks/use-session.ts).
 */

const STORAGE_KEY = "wm.session";

export type Session = AuthResponse;

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedSession: Session | null = null;

function notify() {
  listeners.forEach((listener) => listener());
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSession = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      cachedSession = null;
    }
  }

  if (cachedSession && new Date(cachedSession.refreshTokenExpires) <= new Date()) {
    return null;
  }

  return cachedSession;
}

export function saveSession(session: Session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  notify();
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
