"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession } from "@/lib/auth/session";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, LockIcon, UserIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";

type Errors = Partial<Record<"userNameOrEmail" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors: Errors = {
      userNameOrEmail: userNameOrEmail.trim() ? undefined : "Enter your username or email.",
      password: password ? undefined : "Enter your password.",
    };
    setErrors(nextErrors);
    if (nextErrors.userNameOrEmail || nextErrors.password) return;

    setSubmitting(true);
    try {
      const session = await login({ userNameOrEmail: userNameOrEmail.trim(), password });
      saveSession(session);
      router.replace("/dashboard");
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && <Alert>{formError}</Alert>}

      <Input
        label="Username or email"
        name="userNameOrEmail"
        autoComplete="username"
        placeholder="jane.doe or jane@company.com"
        icon={<UserIcon />}
        value={userNameOrEmail}
        onChange={(e) => setUserNameOrEmail(e.target.value)}
        error={errors.userNameOrEmail}
        autoFocus
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<LockIcon />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <Button type="submit" loading={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
        {!submitting && <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        New to Warehouse Hub?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Create an account
        </Link>
      </p>
    </form>
  );
}
