import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { getToken } from "@/api/token";
export function HomePage() {
    const isAuthenticated = Boolean(getToken());
    return (_jsx("main", { className: "page", children: _jsxs("div", { className: "card", children: [_jsx("h1", { children: "Mininter" }), isAuthenticated ? (_jsx("p", { className: "field-hint", children: "Voc\u00EA est\u00E1 autenticado." })) : (_jsx("p", { className: "field-hint", children: "Entre ou crie uma conta para continuar." })), _jsxs("nav", { className: "home-links", children: [!isAuthenticated && (_jsxs(_Fragment, { children: [_jsx(Link, { className: "text-link", to: "/login", children: "Entrar" }), _jsx(Link, { className: "text-link", to: "/register", children: "Criar conta" })] })), isAuthenticated && (_jsx(Link, { className: "text-link", to: "/avatar", children: "Foto de perfil" }))] })] }) }));
}
