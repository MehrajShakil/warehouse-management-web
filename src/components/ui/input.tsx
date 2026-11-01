"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "./icons";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: ReactNode;
}

export function Input({ label, icon, error, hint, type = "text", className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-400 [&>svg]:size-[18px]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-11 w-full rounded-xl border bg-white text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400",
            "focus:outline-none focus:ring-4",
            "dark:bg-zinc-900 dark:text-zinc-100",
            icon ? "pl-11" : "pl-4",
            isPassword ? "pr-11" : "pr-4",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15 dark:border-red-500/60"
              : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/15 dark:border-zinc-800",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:text-indigo-600 focus-visible:outline-none dark:hover:text-zinc-200"
          >
            {revealed ? <EyeOffIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : (
        hint
      )}
    </div>
  );
}
