import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AvatarPage } from "@/pages/AvatarPage";
import { UserSettingsPage } from "@/pages/UserSettingsPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { UserProfilePage } from "@/pages/UserProfilePage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/avatar",
        element: (
          <ProtectedRoute>
            <AvatarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/posts/:postId",
        element: <PostDetailPage />,
      },
      {
        path: "/users/:userId",
        element: <UserProfilePage />,
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <UserSettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
