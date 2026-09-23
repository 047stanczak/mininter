import type { ApiResponse } from "@/types/api";
import { clearToken, getToken } from "./token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse<T>(
  res: Response,
  hadAuthorization: boolean
): Promise<ApiResponse<T>> {
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  const status = json?.status ?? res.status;
  const message = json?.message || "Não foi possível concluir a requisição.";

  if (!res.ok || !json?.success) {
    if (status === 401 && hadAuthorization) {
      clearToken();
      window.location.href = "/login";
    }

    throw new ApiError(status, message);
  }

  return json;
}

export async function apiGet<TResponse>(
  path: string
): Promise<ApiResponse<TResponse>> {
  const headers = authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers,
  });

  return parseResponse<TResponse>(res, Boolean(headers.Authorization));
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody
): Promise<ApiResponse<TResponse>> {
  const headers = authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  return parseResponse<TResponse>(res, Boolean(headers.Authorization));
}

export async function apiPostForm<TResponse>(
  path: string,
  body: FormData
): Promise<ApiResponse<TResponse>> {
  const headers = authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body,
  });

  return parseResponse<TResponse>(res, Boolean(headers.Authorization));
}
