import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { apiRequest } from "./client";

/** POST /api/Auth/login */
export function login(request: LoginRequest) {
  return apiRequest<AuthResponse>("/Auth/login", { method: "POST", body: request });
}

/** POST /api/Auth/register */
export function register(request: RegisterRequest) {
  return apiRequest<AuthResponse>("/Auth/register", {
    method: "POST",
    body: { ...request, isActive: true },
  });
}

/** POST /api/Auth/revoke */
export function revoke(refreshToken: string) {
  return apiRequest<void>("/Auth/revoke", { method: "POST", body: { refreshToken } });
}
