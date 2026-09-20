import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AvatarForm } from "@/features/avatar/AvatarForm";
export function AvatarPage() {
    return (_jsx("main", { className: "page", children: _jsxs("div", { className: "card", children: [_jsx("h1", { children: "Foto de perfil" }), _jsx(AvatarForm, {})] }) }));
}
