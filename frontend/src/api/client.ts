import type { ApiResponse } from "@/types/api";
import { getToken } from "./token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "Não foi possível concluir a requisição.");
  }

  return json;
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody
): Promise<ApiResponse<TResponse>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  return parseResponse<TResponse>(res);
}

export async function apiPostForm<TResponse>(
  path: string,
  body: FormData
): Promise<ApiResponse<TResponse>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body,
  });

  return parseResponse<TResponse>(res);
}
