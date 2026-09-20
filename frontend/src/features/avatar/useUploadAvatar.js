import { useState } from "react";
import { uploadAvatar } from "./api";
export function useUploadAvatar() {
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    async function submit(file) {
        setStatus("loading");
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await uploadAvatar(file);
            setSuccessMessage(response.message);
            setStatus("success");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            setStatus("error");
        }
    }
    return { submit, status, error, successMessage };
}
