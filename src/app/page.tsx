import { redirect } from "next/navigation";

export default function Home() {
  // The dashboard redirects to /login when there is no session.
  redirect("/dashboard");
}
