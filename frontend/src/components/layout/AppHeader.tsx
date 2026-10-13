import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/api/AuthContext";
import { useAvatar } from "@/features/avatar/useAvatar";
import { UserAvatar } from "@/components/ui/UserAvatar";

export function AppHeader() {
  const { isAuthenticated, username, clearToken } = useAuth();
  const { avatarUrl } = useAvatar();
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/");
  }

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link className="app-brand" to="/">
          Mininter
        </Link>
        <nav className="app-nav" aria-label="Principal">
          {isAuthenticated ? (
            <>
              <Link className="nav-pill nav-user" to="/account">
                <UserAvatar name={username} src={avatarUrl} size={28} />
                <span className="nav-user-name">{username ?? "Conta"}</span>
              </Link>
              <Link className="nav-pill" to="/avatar">
                Foto de perfil
              </Link>
              <button type="button" className="nav-pill" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className="nav-pill" to="/login">
                Entrar
              </Link>
              <Link className="nav-pill nav-pill-primary" to="/register">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
