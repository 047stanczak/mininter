import { apiPost } from "@/api/client";
import type { RegisterRequest } from "./types";

export function register(payload: RegisterRequest) {
  return apiPost<void, RegisterRequest>("/auth/register", payload);
}
