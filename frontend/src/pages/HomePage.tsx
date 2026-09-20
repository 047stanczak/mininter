import { Link } from "react-router-dom";
import { getToken } from "@/api/token";

export function HomePage() {
  const isAuthenticated = Boolean(getToken());

  return (
    <main className="page">
      <div className="card">
        <h1>Mininter</h1>
        {isAuthenticated ? (
          <p className="field-hint">Você está autenticado.</p>
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
