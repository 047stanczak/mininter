import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Input({ label, id, ...props }) {
    return (_jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: id, children: label }), _jsx("input", { id: id, className: "input", ...props })] }));
}
