import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/api/token";
import { login } from "./api";
import type { LoginRequest } from "./types";

type Status = "idle" | "loading" | "error";

export function useLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: LoginRequest) {
    setStatus("loading");
    setError(null);
    try {
      const response = await login(payload);
      if (!response.data) {
        throw new Error("Token não recebido");
      }
      setToken(response.data);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setStatus("error");
    }
  }

  return { submit, status, error };
}
