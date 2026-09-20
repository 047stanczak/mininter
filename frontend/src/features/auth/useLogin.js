import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/api/token";
import { login } from "./api";
export function useLogin() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    async function submit(payload) {
        setStatus("loading");
        setError(null);
        try {
            const response = await login(payload);
            if (!response.data) {
                throw new Error("Token não recebido");
            }
            setToken(response.data);
            navigate("/");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            setStatus("error");
        }
    }
    return { submit, status, error };
}
