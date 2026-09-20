import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "./useRegister";
const initialState = {
    username: "",
    email: "",
    password: "",
    displayName: "",
    bio: "",
    status: "ATIVO",
};
export function RegisterForm() {
    const [form, setForm] = useState(initialState);
    const { submit, status, error } = useRegister();
    function handleChange(field) {
        return (e) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };
    }
    function handleSubmit(e) {
        e.preventDefault();
        submit(form);
    }
    return (_jsxs("form", { className: "form", onSubmit: handleSubmit, children: [_jsx(Input, { id: "username", label: "Usu\u00E1rio", value: form.username, onChange: handleChange("username"), required: true }), _jsx(Input, { id: "email", label: "E-mail", type: "email", value: form.email, onChange: handleChange("email"), required: true }), _jsx(Input, { id: "password", label: "Senha", type: "password", value: form.password, onChange: handleChange("password"), required: true }), _jsx(Input, { id: "displayName", label: "Nome de exibi\u00E7\u00E3o", value: form.displayName, onChange: handleChange("displayName"), required: true }), _jsx(Input, { id: "bio", label: "Bio", value: form.bio, onChange: handleChange("bio") }), error && _jsx("p", { className: "error-message", children: error }), _jsx(Button, { type: "submit", disabled: status === "loading", children: status === "loading" ? "Enviando..." : "Cadastrar" })] }));
}
