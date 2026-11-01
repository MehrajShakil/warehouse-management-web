import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <>
      <AuthHeader title="Create your account" description="Get started with Warehouse Hub in under a minute." />
      <RegisterForm />
    </>
  );
}
