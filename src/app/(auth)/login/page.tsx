import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <>
      <AuthHeader title="Welcome back" description="Sign in to manage your warehouses and inventory." />
      <LoginForm />
    </>
  );
}
