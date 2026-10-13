import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="app-layout">
      <AppHeader />
      <Outlet />
    </div>
  );
}
