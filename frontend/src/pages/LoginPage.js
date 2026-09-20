import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/LoginForm";
export function LoginPage() {
    return (_jsx("main", { className: "page", children: _jsxs("div", { className: "card", children: [_jsx("h1", { children: "Entrar" }), _jsx(LoginForm, {}), _jsxs("p", { className: "form-footer", children: ["N\u00E3o tem conta?", " ", _jsx(Link, { className: "text-link", to: "/register", children: "Criar conta" })] })] }) }));
}
