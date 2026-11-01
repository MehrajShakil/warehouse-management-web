import { passwordStrength } from "@/lib/auth/validation";
import { cn } from "@/lib/utils";

const LEVELS = [
  { label: "", color: "" },
  { label: "Weak", color: "bg-red-500" },
  { label: "Fair", color: "bg-amber-500" },
  { label: "Good", color: "bg-lime-500" },
  { label: "Strong", color: "bg-emerald-500" },
];

export function PasswordStrength({ password }: { password: string }) {
  const score = passwordStrength(password);
  if (score === 0) {
    return <p className="text-xs text-zinc-500">Use 8+ characters with a mix of letters, numbers and symbols.</p>;
  }

  const level = LEVELS[score];
  return (
    <div className="flex items-center gap-3 pt-0.5" aria-live="polite">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= score ? level.color : "bg-zinc-200 dark:bg-zinc-800",
            )}
          />
        ))}
      </div>
      <span className="w-12 text-right text-xs font-medium text-zinc-500">{level.label}</span>
    </div>
  );
}
