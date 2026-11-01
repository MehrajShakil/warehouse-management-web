"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { revoke } from "@/lib/api/auth";
import { clearSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { BoxesIcon, SpinnerIcon } from "@/components/ui/icons";

/** Placeholder landing page after sign-in. Replace with the real dashboard. */
export function DashboardView() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) router.replace("/login");
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <SpinnerIcon className="size-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  async function handleSignOut() {
    if (!session) return;
    try {
      await revoke(session.refreshToken);
    } catch {
      // The token may already be expired or revoked; sign out locally regardless.
    }
    clearSession();
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5 font-semibold text-zinc-900 dark:text-white">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <BoxesIcon className="size-4" />
            </span>
            Warehouse Hub
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-500 sm:inline">{session.email}</span>
            <Button variant="ghost" onClick={handleSignOut} className="h-9 w-auto">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Hello, {session.userName}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          You are signed in. Warehouses, products and stock pages will live here.
        </p>
      </main>
    </div>
  );
}
