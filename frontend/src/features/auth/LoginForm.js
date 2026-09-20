import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "./useLogin";
const initialState = {
    email: "",
    password: "",
};
export function LoginForm() {
    const [form, setForm] = useState(initialState);
    const { submit, status, error } = useLogin();
    function handleChange(field) {
        return (e) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };
    }
    function handleSubmit(e) {
        e.preventDefault();
        submit(form);
    }
    return (_jsxs("form", { className: "form", onSubmit: handleSubmit, children: [_jsx(Input, { id: "email", label: "E-mail", type: "email", value: form.email, onChange: handleChange("email"), required: true }), _jsx(Input, { id: "password", label: "Senha", type: "password", value: form.password, onChange: handleChange("password"), required: true }), error && _jsx("p", { className: "error-message", children: error }), _jsx(Button, { type: "submit", disabled: status === "loading", children: status === "loading" ? "Entrando..." : "Entrar" })] }));
}
