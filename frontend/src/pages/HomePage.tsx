import { Link } from "react-router-dom";
import { useAuth } from "@/api/AuthContext";
import { useAvatar } from "@/features/avatar/useAvatar";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const { avatarUrl } = useAvatar();

  return (
    <main className="page">
      <div className="card">
        <h1>Mininter</h1>
        {isAuthenticated ? (
          <>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Foto de perfil"
                width={96}
                height={96}
              />
            )}
            <p className="field-hint">Você está autenticado.</p>
          </>
        ) : (
          <p className="field-hint">Entre ou crie uma conta para continuar.</p>
        )}
        <nav className="home-links">
          {!isAuthenticated && (
            <>
              <Link className="text-link" to="/login">
                Entrar
              </Link>
              <Link className="text-link" to="/register">
                Criar conta
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link className="text-link" to="/avatar">
              Foto de perfil
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
