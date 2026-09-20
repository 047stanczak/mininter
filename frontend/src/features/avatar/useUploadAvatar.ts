import { useState } from "react";
import { uploadAvatar } from "./api";

type Status = "idle" | "loading" | "success" | "error";

export function useUploadAvatar() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function submit(file: File) {
    setStatus("loading");
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await uploadAvatar(file);
      setSuccessMessage(response.message);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setStatus("error");
    }
  }

  return { submit, status, error, successMessage };
}
