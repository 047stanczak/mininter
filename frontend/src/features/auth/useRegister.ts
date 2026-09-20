import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/api/token";
import { register } from "./api";
import type { RegisterRequest } from "./types";

type Status = "idle" | "loading" | "error";

export function useRegister() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: RegisterRequest) {
    setStatus("loading");
    setError(null);
    try {
      const response = await register(payload);
      if (!response.data) {
        throw new Error("Token não recebido");
      }
      setToken(response.data);
      navigate("/avatar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setStatus("error");
    }
  }

  return { submit, status, error };
}
