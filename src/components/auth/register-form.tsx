"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession } from "@/lib/auth/session";
import { validateEmail, validatePassword, validateUserName } from "@/lib/auth/validation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, LockIcon, MailIcon, UserIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "./password-strength";

type Field = "userName" | "email" | "password" | "confirmPassword";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

function validate(values: Values): Errors {
  let confirmPassword: string | undefined;
  if (!values.confirmPassword) confirmPassword = "Please confirm your password.";
  else if (values.confirmPassword !== values.password) confirmPassword = "Passwords do not match.";

  return {
    userName: validateUserName(values.userName),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword,
  };
}

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>({ userName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Show errors only for fields the user has already visited.
  const visibleErrors = (all: Errors, visited: typeof touched): Errors =>
    Object.fromEntries(Object.entries(all).filter(([field]) => visited[field as Field]));

  const update = (field: Field) => (event: ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    setErrors(visibleErrors(validate(next), touched));
  };

  const blur = (field: Field) => () => {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(visibleErrors(validate(values), nextTouched));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ userName: true, email: true, password: true, confirmPassword: true });
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const session = await register({
        userName: values.userName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      saveSession(session);
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
        const { userName, email, password } = error.fieldErrors;
        setErrors({ userName: userName?.[0], email: email?.[0], password: password?.[0] });
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <Alert>{formError}</Alert>}

      <Input
        label="Username"
        name="userName"
        autoComplete="username"
        placeholder="jane.doe"
        icon={<UserIcon />}
        value={values.userName}
        onChange={update("userName")}
        onBlur={blur("userName")}
        error={errors.userName}
        autoFocus
      />

      <Input
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="jane@company.com"
        icon={<MailIcon />}
        value={values.email}
        onChange={update("email")}
        onBlur={blur("email")}
        error={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        icon={<LockIcon />}
        value={values.password}
        onChange={update("password")}
        onBlur={blur("password")}
        error={errors.password}
        hint={<PasswordStrength password={values.password} />}
      />

      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        icon={<LockIcon />}
        value={values.confirmPassword}
        onChange={update("confirmPassword")}
        onBlur={blur("confirmPassword")}
        error={errors.confirmPassword}
      />

      <Button type="submit" loading={submitting} className="mt-2">
        {submitting ? "Creating account…" : "Create account"}
        {!submitting && <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Sign in
        </Link>
      </p>
    </form>
  );
}
