import { apiPost } from "@/api/client";
import type { LoginRequest, RegisterRequest } from "./types";

export function register(payload: RegisterRequest) {
  return apiPost<string, RegisterRequest>("/auth/register", payload);
}

export function login(payload: LoginRequest) {
  return apiPost<string, LoginRequest>("/auth/login", payload);
}
