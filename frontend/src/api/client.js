import { getToken } from "./token";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
async function parseResponse(res) {
    const json = (await res.json().catch(() => null));
    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Não foi possível concluir a requisição.");
    }
    return json;
}
export async function apiPost(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}
export async function apiPostForm(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: authHeaders(),
        body,
    });
    return parseResponse(res);
}
