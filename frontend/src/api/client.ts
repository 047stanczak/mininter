import type { ApiResponse } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody
): Promise<ApiResponse<TResponse>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as ApiResponse<TResponse>;

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Erro na requisição");
  }

  return json;
}
