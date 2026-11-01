import Link from "next/link";
import { GuestGuard } from "@/components/auth/guest-guard";
import { BoxesIcon, CheckIcon } from "@/components/ui/icons";

const HIGHLIGHTS = [
  "Real-time stock levels across every warehouse",
  "Full audit trail of inbound and outbound movements",
  "Role-based access for your whole team",
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.45),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.35),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <Link href="/" className="relative z-10 flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <BoxesIcon className="size-5" />
          </span>
          Warehouse Hub
        </Link>

        <div className="relative z-10 mt-auto max-w-md space-y-8">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Inventory clarity,
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              from dock to door.
            </span>
          </h2>
          <ul className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-zinc-300">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
                  <CheckIcon className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["24/7", "Visibility"],
              ["99.9%", "Stock accuracy"],
              ["<1s", "Lookups"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 mt-12 text-xs text-zinc-500">
          © {new Date().getFullYear()} Warehouse Hub. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2.5 font-semibold text-zinc-900 dark:text-white lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <BoxesIcon className="size-5" />
            </span>
            Warehouse Hub
          </Link>
          <GuestGuard>{children}</GuestGuard>
        </div>
      </main>
    </div>
  );
}
