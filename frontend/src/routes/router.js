import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AvatarPage } from "@/pages/AvatarPage";
export const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(HomePage, {}),
    },
    {
        path: "/login",
        element: _jsx(LoginPage, {}),
    },
    {
        path: "/register",
        element: _jsx(RegisterPage, {}),
    },
    {
        path: "/avatar",
        element: _jsx(AvatarPage, {}),
    },
]);
