import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/RegisterForm";
export function RegisterPage() {
    return (_jsx("main", { className: "page", children: _jsxs("div", { className: "card", children: [_jsx("h1", { children: "Criar conta" }), _jsx(RegisterForm, {}), _jsxs("p", { className: "form-footer", children: ["J\u00E1 tem conta?", " ", _jsx(Link, { className: "text-link", to: "/login", children: "Entrar" })] })] }) }));
}
