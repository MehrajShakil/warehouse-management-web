"use client";

import { useSyncExternalStore } from "react";
import { getSession, subscribe, type Session } from "@/lib/auth/session";

/**
 * Returns the current session, `null` when signed out,
 * or `undefined` during server rendering / before hydration.
 */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, getSession, () => undefined);
}
