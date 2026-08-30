import { useState } from "react";
import { register } from "./api";
import type { RegisterRequest } from "./types";

type Status = "idle" | "loading" | "success" | "error";

export function useRegister() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: RegisterRequest) {
    setStatus("loading");
    setError(null);
    try {
      await register(payload);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setStatus("error");
    }
  }

  return { submit, status, error };
}
