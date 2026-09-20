import { apiPost } from "@/api/client";
export function register(payload) {
    return apiPost("/auth/register", payload);
}
export function login(payload) {
    return apiPost("/auth/login", payload);
}
